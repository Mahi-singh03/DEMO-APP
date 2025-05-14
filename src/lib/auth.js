import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function protect(request) {
  let token;
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return NextResponse.json({ error: 'Not authorized, no token provided' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = decoded;
    return null; // Proceed to next handler
  } catch (error) {
    return NextResponse.json({ error: 'Not authorized, token invalid' }, { status: 401 });
  }
}