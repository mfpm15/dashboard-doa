import { NextResponse } from 'next/server';

export async function GET() {
  // Only allow in development or if explicitly enabled
  if (process.env.NODE_ENV === 'production' && !process.env.ENABLE_DEBUG) {
    return NextResponse.json({ error: 'Debug endpoint disabled' }, { status: 403 });
  }

  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY ?
      `${process.env.OPENROUTER_API_KEY.substring(0, 10)}...` : 'NOT SET',
    OPENROUTER_SITE_URL: process.env.OPENROUTER_SITE_URL || 'NOT SET',
    OPENROUTER_SITE_NAME: process.env.OPENROUTER_SITE_NAME || 'NOT SET',
    PRIMARY_MODEL: process.env.PRIMARY_MODEL || 'NOT SET',
    FALLBACK_MODEL: process.env.FALLBACK_MODEL || 'NOT SET',
    timestamp: new Date().toISOString()
  };

  return NextResponse.json(envVars);
}