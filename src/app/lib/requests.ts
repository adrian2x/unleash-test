import { Address } from '../types'

export async function getSearchResults(searchValue: string): Promise<Address[]> {
  const response = await fetch(`/search/${searchValue}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }
  const results = await response.json()
  return results as Address[]
}
