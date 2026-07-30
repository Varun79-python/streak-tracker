import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // Try with user_id filter first
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Habits GET error:', error.message, error.code);
      // Fallback: try without user_id filter
      const { data: allData, error: allError } = await supabase
        .from('questions')
        .select('*')
        .order('sort_order', { ascending: true });
      if (allError) throw new Error(allError.message);
      return NextResponse.json(allData || []);
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Habits GET failed:', error?.message);
    return NextResponse.json({ error: 'Failed to fetch habits', details: error?.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, title, name, description, icon, is_required, required, is_active, active } = body;

    const habitTitle = title || name;
    if (!userId || !habitTitle) {
      return NextResponse.json({ error: 'userId and title required', got: { userId, habitTitle } }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // Get max sort_order for this user
    let nextOrder = 0;
    try {
      const { data: maxOrder, error: maxErr } = await supabase
        .from('questions')
        .select('sort_order')
        .eq('user_id', userId)
        .order('sort_order', { ascending: false })
        .limit(1)
        .single();
      if (!maxErr && maxOrder) {
        nextOrder = (maxOrder.sort_order ?? -1) + 1;
      } else {
        // Fallback without user_id filter
        const { data: anyMax } = await supabase
          .from('questions')
          .select('sort_order')
          .order('sort_order', { ascending: false })
          .limit(1)
          .single();
        nextOrder = (anyMax?.sort_order ?? -1) + 1;
      }
    } catch {
      const { data: anyMax } = await supabase
        .from('questions')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
        .single();
      nextOrder = (anyMax?.sort_order ?? -1) + 1;
    }

    const insertData: Record<string, any> = {
      title: habitTitle,
      description: description || '',
      icon: icon || 'circle',
      is_required: is_required ?? required ?? true,
      is_active: is_active ?? active ?? true,
      sort_order: nextOrder,
      user_id: userId,
    };

    const { data, error } = await supabase
      .from('questions')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Habit insert error:', error.message, error.code);
      // Retry without user_id column
      delete insertData.user_id;
      const { data: retryData, error: retryError } = await supabase
        .from('questions')
        .insert(insertData)
        .select()
        .single();
      if (retryError) {
        console.error('Habit insert retry error:', retryError.message);
        throw new Error(retryError.message);
      }
      return NextResponse.json(retryData, { status: 201 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Habits POST failed:', error?.message);
    return NextResponse.json({ error: 'Failed to create habit', details: error?.message }, { status: 500 });
  }
}
