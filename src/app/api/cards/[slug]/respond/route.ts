import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { response } = body;

    if (response !== 'yes' && response !== 'no') {
      return NextResponse.json(
        { error: 'Invalid response' },
        { status: 400 }
      );
    }

    // Check if card exists and hasn't been responded to
    const { data: existingCard } = await supabase
      .from('cards')
      .select('*')
      .eq('slug', slug)
      .single();

    if (!existingCard) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    if (existingCard.response) {
      return NextResponse.json(
        { error: 'Card has already been responded to' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('cards')
      .update({
        response,
        responded_at: new Date().toISOString(),
      })
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save response' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, response: data.response });
  } catch (error) {
    console.error('Error saving response:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
