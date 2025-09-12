import { NextResponse } from 'next/server';
import dbConnect from '@/lib/DBconnection';
import FaceEncoding from '@/models/faceEncoding';
import Student from '@/models/students';

// NOTE: Placeholder recognition with deterministic mock encoding and nearest-neighbor match.
export async function POST(req) {
  await dbConnect();
  try {
    const { imageData } = await req.json();
    if (!imageData) {
      return NextResponse.json({ success: false, message: 'imageData is required' }, { status: 400 });
    }

    const encodings = await FaceEncoding.find({});
    if (!encodings || encodings.length === 0) {
      return NextResponse.json({ success: false, detectedFace: null, message: 'No face encodings in database. Please upload at least one face.' });
    }

    // Create deterministic mock encoding from imageData (demo-only)
    const probe = normalizeVector(generateDeterministicEncoding(imageData, 128));
    if (!isVectorValid(probe)) {
      return NextResponse.json({ success: false, detectedFace: false, message: 'No face detected. Please align your face in the frame.' }, { status: 422 });
    }

    // Build per-student centroid (mean embedding) and compute similarity to probe
    const studentIdToSimilarity = new Map();
    const studentIdToCount = new Map();
    for (const item of encingsByStudent(encodings)) {
      const { studentId, vectors } = item;
      const cleaned = vectors
        .map(v => normalizeVector(v || []))
        .filter(isVectorValid);
      if (cleaned.length === 0) continue;
      const centroid = normalizeVector(meanVector(cleaned));
      const similarity = cosineSimilarity(probe, centroid);
      studentIdToSimilarity.set(String(studentId), similarity);
      studentIdToCount.set(String(studentId), cleaned.length);
    }

    // Rank students by similarity
    const ranked = Array.from(studentIdToSimilarity.entries())
      .map(([studentId, similarity]) => ({ studentId, similarity }))
      .sort((a, b) => b.similarity - a.similarity);

    const top1 = ranked[0];
    const top2 = ranked[1];

    // Tuned thresholds to balance FP/FN using mock embeddings
    const BASE_SIMILARITY_THRESHOLD = 0.78; // slightly relaxed to reduce false negatives
    const MARGIN_THRESHOLD = 0.10;   // slightly relaxed margin
    const MIN_VECTOR_NORM = 0.7;     // reject low-energy vectors (indicates noise)

    // Reject if probe looks like noise
    if (vectorNorm(probe) < MIN_VECTOR_NORM) {
      return NextResponse.json({ success: false, detectedFace: false, message: 'No face detected. Please get closer and ensure good lighting.' }, { status: 422 });
    }

    if (!top1) {
      return NextResponse.json({ success: false, detectedFace: true, message: 'Student not recognized. If you are a student, please register your face.' });
    }

    // If a student has very few samples, require a slightly higher similarity
    const samplesForTop1 = studentIdToCount.get(String(top1.studentId)) || 0;
    const requiredThreshold = samplesForTop1 >= 3 ? BASE_SIMILARITY_THRESHOLD - 0.02 : BASE_SIMILARITY_THRESHOLD + 0.02; // small adjustment based on sample size

    if (top1.similarity < requiredThreshold || (top2 && (top1.similarity - top2.similarity) < MARGIN_THRESHOLD)) {
      return NextResponse.json({ success: false, detectedFace: true, confidence: Number(top1.similarity?.toFixed(3) || 0), message: 'Student not recognized. If you are a student, please register your face.' });
    }

    const student = await Student.findById(top1.studentId).select('-password');
    if (!student) {
      return NextResponse.json({ success: false, message: 'Student not found for encoding' });
    }

    return NextResponse.json({ success: true, detectedFace: true, student, confidence: Number(top1.similarity.toFixed(3)) });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Recognition failed', error: error.message }, { status: 500 });
  }
}

function generateDeterministicEncoding(dataUrl, length) {
  // Simple FNV-1a hash over the base64 string for seeding
  const base64 = (dataUrl || '').split(',')[1] || '';
  let hash = 2166136261;
  for (let i = 0; i < base64.length; i++) {
    hash ^= base64.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  // Xorshift32 PRNG
  let seed = hash >>> 0;
  function rnd() {
    seed ^= seed << 13; seed >>>= 0;
    seed ^= seed >> 17; seed >>>= 0;
    seed ^= seed << 5;  seed >>>= 0;
    return (seed & 0xffffffff) / 0x100000000;
  }
  const vec = new Array(length);
  for (let i = 0; i < length; i++) {
    vec[i] = rnd() * 2 - 1; // [-1, 1]
  }
  return vec;
}

function normalizeVector(vec) {
  const n = vec.length;
  if (n === 0) return vec;
  let norm = 0;
  for (let i = 0; i < n; i++) norm += (vec[i] || 0) * (vec[i] || 0);
  norm = Math.sqrt(norm) || 1;
  const out = new Array(n);
  for (let i = 0; i < n; i++) out[i] = (vec[i] || 0) / norm;
  return out;
}

function cosineSimilarity(a, b) {
  const n = Math.min(a.length, b.length);
  let dot = 0;
  for (let i = 0; i < n; i++) {
    dot += (a[i] || 0) * (b[i] || 0);
  }
  return dot;
}


// Helper to group encodings per student
function encingsByStudent(encodings) {
  const byStudent = new Map();
  for (const item of encodings) {
    const key = String(item.studentId);
    if (!byStudent.has(key)) byStudent.set(key, []);
    byStudent.get(key).push(item.encoding || []);
  }
  return Array.from(byStudent.entries()).map(([studentId, vectors]) => ({ studentId, vectors }));
}


// Compute mean vector
function meanVector(vectors) {
  if (!vectors || vectors.length === 0) return [];
  const length = vectors[0].length || 0;
  const sum = new Array(length).fill(0);
  let count = 0;
  for (const v of vectors) {
    if (!v || v.length !== length) continue;
    for (let i = 0; i < length; i++) sum[i] += v[i] || 0;
    count++;
  }
  if (count === 0) return [];
  for (let i = 0; i < length; i++) sum[i] /= count;
  return sum;
}

function isVectorValid(v) {
  return Array.isArray(v) && v.length >= 64 && Number.isFinite(v[0] ?? 0);
}

function vectorNorm(v) {
  let n = 0;
  for (let i = 0; i < v.length; i++) n += (v[i] || 0) * (v[i] || 0);
  return Math.sqrt(n);
}

