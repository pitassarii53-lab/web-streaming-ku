import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = "109446t4h65dr9m44eajs8"; // API Key kamu
  try {
    const response = await fetch(`https://doodapi.com/api/file/list?key=${API_KEY}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ status: 500, msg: error.message });
  }
}
