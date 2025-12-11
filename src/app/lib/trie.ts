import TrieSearch from 'trie-search'
import addresses from '@/data/adresses.json'
import { Address } from '@/app/types'

type TrieNode = Address & { matchKey: string }
export const trie = new TrieSearch<TrieNode>(['matchKey'], { min: 3 })
trie.addAll(
  (addresses as Address[]).map((obj) => {
    return { ...obj, matchKey: normalizeString(obj.street) }
  })
)

export default trie

export function normalizeString(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(
      /[\u0300-\u036f]|[æÆøØåÅ]/g,
      (c) =>
        ({
          æ: 'ae',
          Æ: 'Ae',
          ø: 'o',
          Ø: 'O',
          å: 'a',
          Å: 'A'
        }[c] || '')
    )
}
