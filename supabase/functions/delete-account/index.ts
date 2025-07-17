/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log(`Starting account deletion for user: ${user.id}`)

    // 1. Get all user's decks to delete associated files
    const { data: userDecks, error: decksError } = await supabaseClient
      .from('decks')
      .select('file_path')
      .eq('user_id', user.id)

    if (decksError) {
      console.error('Error fetching user decks:', decksError)
      return new Response(
        JSON.stringify({ error: 'Fehler beim Abrufen der Benutzerdaten' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // 2. Delete all files from storage
    if (userDecks && userDecks.length > 0) {
      const filePaths = userDecks.map(deck => deck.file_path)
      const { error: storageError } = await supabaseAdmin.storage
        .from('ankidecks')
        .remove(filePaths)

      if (storageError) {
        console.error('Error deleting files from storage:', storageError)
      } else {
        console.log(`Deleted ${filePaths.length} files from storage`)
      }
    }

    // 3. Delete user's decks from database
    const { error: deleteDecksError } = await supabaseClient
      .from('decks')
      .delete()
      .eq('user_id', user.id)

    if (deleteDecksError) {
      console.error('Error deleting user decks:', deleteDecksError)
      return new Response(
        JSON.stringify({ error: 'Fehler beim Löschen der Deck-Daten' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // 4. Delete user record from users table
    const { error: deleteUserError } = await supabaseClient
      .from('users')
      .delete()
      .eq('id', user.id)

    if (deleteUserError) {
      console.error('Error deleting user record:', deleteUserError)
      return new Response(
        JSON.stringify({ error: 'Fehler beim Löschen des Benutzerprofils' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // 5. Delete user from auth.users using admin client
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

    if (deleteAuthError) {
      console.error('Error deleting auth user:', deleteAuthError)
      return new Response(
        JSON.stringify({ error: 'Fehler beim Löschen des Benutzerkontos' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log(`Successfully deleted account for user: ${user.id}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Account wurde erfolgreich gelöscht'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Unexpected error during account deletion:', error)
    return new Response(
      JSON.stringify({ error: 'Ein unerwarteter Fehler ist aufgetreten' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})