'use client'
import { useEffect, useState } from 'react'
import { Address } from '@/app/types'
import { useDebounce } from '../hooks/useDebounce'

async function getSearchResults(searchValue: string): Promise<Address[]> {
  const response = await fetch(`/api/search/${searchValue}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }
  const results = await response.json()
  return results as Address[]
}

export function SearchBar() {
  const [addressSearch, setAddressSearch] = useState('')
  const debouncedSearch = useDebounce(addressSearch, 100)
  const [results, setResults] = useState<Address[]>([])
  const [errorMessage, setErrorMessage] = useState('')

  async function displayResults(searchValue: string) {
    try {
      const data = await getSearchResults(searchValue)
      setResults(data)
      setErrorMessage('')
    } catch (error) {
      setResults([])
      setErrorMessage('Oops, we encountered an error.')
    }
  }

  useEffect(() => {
    if (debouncedSearch.length >= 3) {
      displayResults(debouncedSearch)
    }
  }, [debouncedSearch])

  return (
    <div className='w-full'>
      <input
        type='search'
        placeholder='Enter address...'
        className='border-b-1 border-b-gray-400 text-xl md:text-3xl w-full px-2'
        value={addressSearch}
        onChange={(e) => setAddressSearch(e.target.value)}
      />
      <p className='text-xs text-red-400'>{errorMessage}</p>
      <section className='mt-4'>
        <ul
          className={`origin-top transition-transform duration-300 max-h-[calc(100vh-13rem)] overflow-y-auto ${
            addressSearch.length >= 3 ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
          }`}>
          {results.map((address, i) => (
            <li
              key={i}
              className='text-sm py-2 px-2 transition-all duration-100 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer opacity-70 hover:opacity-100 hover:font-bold '
              onClick={() =>
                setAddressSearch(`${address.street} ${address.postNumber} ${address.city}`)
              }>
              <span className='font-medium'>{address.street}</span>{' '}
              <span className='font-light opacity-60'>
                {address.postNumber} {address.city}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
