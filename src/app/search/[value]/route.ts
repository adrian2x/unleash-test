import { NextRequest, NextResponse } from 'next/server'
import { getTrie } from '@/app/lib/trie'

export async function GET(req: NextRequest, context: { params: Promise<{ value: string }> }) {
  const { value } = await context.params
  const lowerCaseValue = value.toLowerCase()

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

  const normalizedSearch = normalizeLetters(lowerCaseValue)
  const results = getTrie().search(lowerCaseValue, (accumulator, phrase, matches) => {
    return matches
      .filter((x) => normalizeLetters(x.street.toLowerCase()).startsWith(normalizedSearch))
      .sort((a, b) => {
        return a.street.localeCompare(b.street, 'no-NO')
      })
  })

  return NextResponse.json(results.slice(0, 20))
}

function normalizeLetters(value: string) {
  // First: Remove standard diacritics using NFD
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
