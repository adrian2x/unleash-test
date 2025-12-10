import { NextRequest, NextResponse } from 'next/server'
import TrieSearch from 'trie-search'
import addresses from '@/data/adresses.json'
import { Address } from '@/app/types'

const trie = new TrieSearch<Address>(['street'], { min: 3 })
trie.addAll(addresses as Address[])

export async function GET(req: NextRequest, context: { params: Promise<{ value: string }> }) {
  const { value } = await context.params

  // Validate the request parameters
  if (!value || value.length < 3)
    return NextResponse.json(
      {
        error: 'Search must be at least 3 characters'
      },
      { status: 400 }
    )

  const results = trie.search(value, undefined, 20)
  return NextResponse.json({ results })
}
