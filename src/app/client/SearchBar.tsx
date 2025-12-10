'use client'
import { useEffect, useRef, useState } from 'react'
import { Address } from '@/app/types'
import { useDebounce } from '../hooks/useDebounce'

export function SearchBar() {
  const [addressSearch, setAddressSearch] = useState('')
  const [autocompletedValue, setAutocompletedValue] = useState('')
  const [results, setResults] = useState<Address[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const debouncedSearch = useDebounce(addressSearch, 40)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function displayResults() {
      try {
        setErrorMessage('')
        const data = await getSearchResults(debouncedSearch)
        setResults(data)
        console.log(`GET search/${debouncedSearch} returned`, data)
      } catch (error) {
        console.error('API error', error)
        setResults([])
        setErrorMessage('Oops, we encountered an error.')
      }
    }

    if (debouncedSearch.length >= 3) {
      displayResults()
    }
  }, [debouncedSearch])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleSelectOption(address: Address) {
    console.log('Autocompleted:', debouncedSearch, address)
    setAutocompletedValue(`${address.street} ${address.postNumber} ${address.city}`)
    setAddressSearch('')
    setResults([])
  }

  return (
    <div className='w-full'>
      <input
        ref={inputRef}
        autoFocus
        type='search'
        placeholder='Enter address...'
        className='border-b-1 border-b-gray-400 text-xl md:text-2xl w-full px-2'
        value={autocompletedValue || addressSearch}
        onChange={(e) => {
          setAutocompletedValue('')
          setAddressSearch(e.target.value.trim())
        }}
      />
      <p className='text-xs text-red-400 mt-2'>{errorMessage}</p>
      <section className='mt-4'>
        <ul
          className={`origin-top transition-transform duration-300 max-h-[calc(100vh-13rem)] overflow-y-auto ${
            addressSearch.length >= 3 ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
          }`}>
          {results.map((address, i) => (
            <li
              key={i}
              tabIndex={0}
              className='text-sm py-2 px-2 transition-all duration-100 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer opacity-70 hover:opacity-100 hover:font-bold '
              onClick={() => handleSelectOption(address)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSelectOption(address)
                }
              }}>
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

async function getSearchResults(searchValue: string): Promise<Address[]> {
  const response = await fetch(`/search/${searchValue}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }
  const results = await response.json()
  return results as Address[]
}
