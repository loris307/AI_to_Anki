/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  deckName: string;
  textInput: string;
}

interface AnkiCard {
  front: string;
  back: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the session from the Authorization header
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Parse request body
    const { deckName, textInput }: RequestBody = await req.json()

    if (!deckName || !textInput) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: deckName, textInput' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Create prompt for OpenAI
    const prompt = `Analysiere den folgenden Text und erstelle daraus eine Liste von Frage-Antwort-Paaren für Anki-Karteikarten. Jedes Paar sollte ein klares, präzises Konzept abfragen. Die Vorderseite soll die Frage enthalten und die Rückseite die Antwort. Gib das Ergebnis ausschließlich als JSON-Array von Objekten zurück, wobei jedes Objekt die Schlüssel 'front' und 'back' hat.

Text: ${textInput}`

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error('OpenAI API Error:', errorText)
      return new Response(
        JSON.stringify({ error: 'Failed to generate flashcards' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const openaiData = await openaiResponse.json()
    const generatedContent = openaiData.choices[0]?.message?.content

    if (!generatedContent) {
      return new Response(
        JSON.stringify({ error: 'No content generated from AI' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Parse the JSON response from OpenAI
    let flashcards: AnkiCard[]
    try {
      // Extract JSON from the response (remove any markdown formatting)
      const jsonMatch = generatedContent.match(/\[[\s\S]*\]/)
      const jsonString = jsonMatch ? jsonMatch[0] : generatedContent
      flashcards = JSON.parse(jsonString)
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Convert to CSV format for Anki import
    const csvContent = flashcards
      .map(card => `"${card.front.replace(/"/g, '""')}";"${card.back.replace(/"/g, '""')}"`)
      .join('\n')

    // Generate unique filename
    const deckId = crypto.randomUUID()
    const fileName = `${user.id}/${deckId}.csv`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseClient.storage
      .from('ankidecks')
      .upload(fileName, csvContent, {
        contentType: 'text/csv',
        upsert: false
      })

    if (uploadError) {
      console.error('Storage Upload Error:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Failed to save deck file' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Save deck metadata to database
    const { data: deckData, error: dbError } = await supabaseClient
      .from('decks')
      .insert({
        user_id: user.id,
        deck_name: deckName,
        file_path: fileName,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database Insert Error:', dbError)
      // Try to cleanup the uploaded file
      await supabaseClient.storage.from('ankidecks').remove([fileName])
      
      return new Response(
        JSON.stringify({ error: 'Failed to save deck metadata' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        deck: deckData,
        cardCount: flashcards.length
      }),
      {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Unexpected Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})