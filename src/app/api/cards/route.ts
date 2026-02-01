import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let senderName: string;
    let recipientName: string;
    let message: string;
    let imageUrl: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      senderName = formData.get('senderName') as string;
      recipientName = formData.get('recipientName') as string;
      message = formData.get('message') as string;
      const imageFile = formData.get('image') as File | null;

      if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${nanoid(10)}.${fileExt}`;
        const filePath = `cards/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, imageFile, {
            contentType: imageFile.type,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
        } else {
          const { data: urlData } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);
          imageUrl = urlData.publicUrl;
        }
      }
    } else {
      const body = await request.json();
      senderName = body.senderName;
      recipientName = body.recipientName;
      message = body.message;
    }

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
        image_url: imageUrl,
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
