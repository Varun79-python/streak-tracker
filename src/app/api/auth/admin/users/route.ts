import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const expectedKey = process.env.ADMIN_SECRET_KEY || '123456789987654321741852963369258147';
    
    if (authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('users')
      .select('id, username, display_name, role, status, created_at')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return NextResponse.json({ users: data || [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const expectedKey = process.env.ADMIN_SECRET_KEY || '123456789987654321741852963369258147';
    
    if (authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, updates } = body;

    if (!id || !updates) {
      return NextResponse.json({ error: 'id and updates required' }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const updateData: any = {};

    if (updates.name) updateData.display_name = updates.name;
    if (updates.email) updateData.username = updates.email.toLowerCase().trim();
    if (updates.password) {
      const bcrypt = require('bcryptjs');
      updateData.password_hash = await bcrypt.hash(updates.password, 10);
    }
    if (updates.status) updateData.status = updates.status;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Also update profile if name/email changed
    if (updates.name || updates.email) {
      const profileUpdate: any = {};
      if (updates.name) profileUpdate.display_name = updates.name;
      if (updates.email) profileUpdate.username = updates.email.toLowerCase().trim();
      
      await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', id);
    }

    return NextResponse.json({ success: true, user: data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const expectedKey = process.env.ADMIN_SECRET_KEY || '123456789987654321741852963369258147';
    
    if (authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // Check if admin
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', id)
      .single();

    if (user?.role === 'admin') {
      return NextResponse.json({ error: 'Cannot delete admin user' }, { status: 403 });
    }

    // Delete user (cascades to profiles, questions, etc.)
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}