import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { adminKey } = body;
    
    const EXPECTED_KEY = process.env.ADMIN_SECRET_KEY || '123456789987654321741852963369258147';
    if (adminKey !== EXPECTED_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    // Step 1: Check if user_id column exists by querying information_schema
    // We use a trick: try to select user_id from questions
    const { error: testError } = await supabase
      .from('questions')
      .select('user_id')
      .limit(1);

    if (!testError) {
      return NextResponse.json({ 
        success: true, 
        message: 'user_id column already exists in questions table',
        columnExists: true 
      });
    }

    // Step 2: The column doesn't exist. We need to add it.
    // Supabase JS client doesn't support DDL, so we return instructions
    const projectRef = 'mfwvqfatfgaonlpuqalo';
    
    return NextResponse.json({
      success: false,
      message: 'user_id column is missing from questions table. Please run this SQL in your Supabase SQL Editor.',
      columnExists: false,
      sqlUrl: `https://supabase.com/dashboard/project/${projectRef}/sql/new`,
      sql: `
-- Add user_id column to questions table for multi-user habit tracking
ALTER TABLE questions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- Create index for fast per-user queries
CREATE INDEX IF NOT EXISTS idx_questions_user_id ON questions(user_id);

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'questions' AND column_name = 'user_id';
      `.trim(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Migration check failed' }, { status: 500 });
  }
}
