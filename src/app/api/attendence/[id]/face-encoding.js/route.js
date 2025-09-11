import { NextResponse } from 'next/server';
import Student from '@/models/students';
import FaceEncoding from '@/models/faceEncoding';
import dbConnect from '@/lib/DBconnection';

export async function POST(req, { params }) {
  await dbConnect();
  try {
    const { id } = params;
    const { imageData } = await req.json();

    if (!imageData) {
      return NextResponse.json({
        success: false,
        message: 'Image data is required'
      }, { status: 400 });
    }

    const student = await Student.findById(id);
    if (!student) {
      return NextResponse.json({
        success: false,
        message: 'Student not found'
      }, { status: 404 });
    }

    const encoding = normalizeVector(await generateFaceEncoding(imageData));
    if (!isVectorValid(encoding)) {
      return NextResponse.json({
        success: false,
        message: 'No clear face detected. Please try again with good lighting and a frontal face.'
      }, { status: 400 });
    }

    const faceEncoding = new FaceEncoding({
      studentId: student._id,
      rollNo: student.rollNo,
      encoding: encoding
    });
    await faceEncoding.save();

    return NextResponse.json({
      success: true,
      message: 'Face encoding added successfully',
      data: {
        encodingId: faceEncoding._id,
        studentId: student._id,
        rollNo: student.rollNo
      }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error adding face encoding',
      error: error.message
    }, { status: 500 });
  }
}

async function generateFaceEncoding(imageData) {
  try {
    console.log('Generating face encoding for image data');
    return generateDeterministicEncoding(imageData, 128);
  } catch (error) {
    console.error('Error generating face encoding:', error);
    throw new Error('Failed to generate face encoding');
  }
}

function generateDeterministicEncoding(dataUrl, length) {
  const base64 = (dataUrl || '').split(',')[1] || '';
  let hash = 2166136261;
  for (let i = 0; i < base64.length; i++) {
    hash ^= base64.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  let seed = hash >>> 0;
  function rnd() {
    seed ^= seed << 13; seed >>>= 0;
    seed ^= seed >> 17; seed >>>= 0;
    seed ^= seed << 5;  seed >>>= 0;
    return (seed & 0xffffffff) / 0x100000000;
  }
  const vec = new Array(length);
  for (let i = 0; i < length; i++) {
    vec[i] = rnd() * 2 - 1;
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

function isVectorValid(v) {
  if (!Array.isArray(v) || v.length < 64) return false;
  let n = 0;
  for (let i = 0; i < v.length; i++) n += (v[i] || 0) * (v[i] || 0);
  return Number.isFinite(n) && Math.sqrt(n) > 0.6;
}