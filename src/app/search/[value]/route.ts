import { NextRequest, NextResponse } from 'next/server'
import { getTrie, normalizeString } from '@/app/lib/trie'

export async function GET(req: NextRequest, context: { params: Promise<{ value: string }> }) {
  const { value } = await context.params

  // Validate the request parameters
  if (!value || value.length < 3) {
    console.error(`Error: Malformed query: ${value}`)
    return NextResponse.json(
      {
        error: 'Search must be at least 3 characters'
      },
      { status: 400 }
    )
  }

  const normalizedSearch = normalizeString(value)
  const results = getTrie().search(normalizedSearch, (accumulator, phrase, matches) => {
    return matches
      .filter((x) => x.matchKey.startsWith(normalizedSearch))
      .sort((a, b) => {
        return a.street.localeCompare(b.street, 'no-NO')
      })
  })

  return NextResponse.json(results.slice(0, 20))
}
