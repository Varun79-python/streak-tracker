import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    // Find user by email (username in our schema)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('username', email.toLowerCase().trim())
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid credentials. Access restricted to provisioned accounts.' },
        { status: 401 }
      );
    }

    if (user.status === 'suspended') {
      return NextResponse.json(
        { error: 'Account is suspended by Admin.' },
        { status: 403 }
      );
    }

    // Verify password using bcrypt
    const bcrypt = require('bcryptjs');
    const valid = await bcrypt.compare(password.trim(), user.password_hash);

    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid credentials. Access restricted to provisioned accounts.' },
        { status: 401 }
      );
    }

    // Get profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.display_name || user.username,
        email: user.username,
        role: user.role,
        profile: profile || null,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Malformed request payload' }, { status: 400 });
  }
}