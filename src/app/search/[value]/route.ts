import { NextRequest, NextResponse } from 'next/server'
import { trie, normalizeString } from '@/app/lib/trie'

export async function GET(req: NextRequest, context: { params: Promise<{ value: string }> }) {
  const { value } = await context.params

  // Validate the request parameters
  if (value.length > 100) {
    console.error(`Error: Query too long`)
    return NextResponse.json(
      {
        error: 'Search query is too long (max 100)'
      },
      { status: 400 }
    )
  }

  if (!value.trim() || value.trim().length < 3) {
    console.error(`Error: Malformed query: ${value}`)
    return NextResponse.json(
      {
        error: 'Search must be at least 3 characters'
      },
      { status: 400 }
    )
  }

  const normalizedSearch = normalizeString(value)
  const results = trie.search(normalizedSearch, (accumulator, phrase, matches) => {
    return matches
      .filter((x) => x.matchKey.startsWith(normalizedSearch))
      .sort((a, b) => {
        return a.street.localeCompare(b.street, 'no-NO')
      })
  })

  return NextResponse.json(results.slice(0, 20), {
    headers: {
      'Cache-Control': 'public, max-age=86400' // 1 day
    }
  })
}
