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

    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order', { ascending: true });

    if (error) throw new Error(error.message);

    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch habits' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, title, name, description, icon, is_required, required, is_active, active } = body;

    const habitTitle = title || name;
    if (!userId || !habitTitle) {
      return NextResponse.json({ error: 'userId and title required' }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // Get max sort_order
    const { data: maxOrder } = await supabase
      .from('questions')
      .select('sort_order')
      .eq('user_id', userId)
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (maxOrder?.sort_order ?? -1) + 1;

    const { data, error } = await supabase
      .from('questions')
      .insert({
        user_id: userId,
        title: habitTitle,
        description,
        icon: icon || 'circle',
        is_required: is_required ?? required ?? true,
        is_active: is_active ?? active ?? true,
        sort_order: nextOrder,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create habit' }, { status: 500 });
  }
}