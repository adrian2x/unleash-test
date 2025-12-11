import TrieSearch from 'trie-search'
import addresses from '@/data/adresses.json'
import { Address } from '@/app/types'

let trie: TrieSearch<Address> | null = null;

export function getTrie() {
  if (!trie) {
    trie = new TrieSearch<Address>(['street'], { min: 3 })
    trie.addAll(addresses as Address[])
  }
  return trie;
}
