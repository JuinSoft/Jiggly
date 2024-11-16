import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const partnerLogoDir = path.join(process.cwd(), 'public/partner-logos');
    const logos = fs.readdirSync(partnerLogoDir);
    return NextResponse.json(logos);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load partner logos' }, { status: 500 });
  }
}