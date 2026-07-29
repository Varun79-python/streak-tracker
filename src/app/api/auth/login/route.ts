import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // Check content type
    const contentType = request.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    // Get raw body first
    const rawBody = await request.text();
    console.log('Raw body:', rawBody);
    
    if (!rawBody) {
      return NextResponse.json(
        { error: 'Empty request body' },
        { status: 400 }
      );
    }
    
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (e) {
      console.error('JSON parse error:', e);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
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
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}