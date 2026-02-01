import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderName, recipientName, message } = body;

    if (!senderName || !recipientName || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const slug = nanoid(10);

    const { data, error } = await supabase
      .from('cards')
      .insert({
        slug,
        sender_name: senderName,
        recipient_name: recipientName,
        message,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create card', details: error.message, code: error.code },
        { status: 500 }
      );
    }

    return NextResponse.json({ slug: data.slug });
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
