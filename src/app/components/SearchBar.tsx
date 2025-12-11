'use client'
import { useEffect, useRef, useState } from 'react'
import { Address } from '@/app/types'
import { useDebounce } from '../hooks/useDebounce'
import { getSearchResults } from '../lib/requests'

export function SearchBar() {
  const [addressSearch, setAddressSearch] = useState('')
  const [autocompletedValue, setAutocompletedValue] = useState('')
  const [results, setResults] = useState<Address[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const debouncedSearch = useDebounce(addressSearch, 40)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentSearch = debouncedSearch.trim()

  useEffect(() => {
    async function displayResults() {
      try {
        setErrorMessage('')
        const data = await getSearchResults(currentSearch)
        setResults(data)
        console.log(`GET search/${currentSearch} returned`, data)
      } catch (error) {
        console.error('API error', error)
        setResults([])
        setErrorMessage('Oops, we encountered an error.')
      }
    }

    if (currentSearch.length >= 3) {
      displayResults()
    }
  }, [currentSearch])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleSelectOption(address: Address) {
    console.log('Autocompleted value:', address)
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
        className={`border-b-2 text-xl md:text-2xl w-full px-2 ${
          autocompletedValue ? 'border-b-green-400' : 'border-b-gray-400'
        }`}
        value={autocompletedValue || addressSearch}
        onChange={(e) => {
          setAutocompletedValue('')
          setAddressSearch(e.target.value)
        }}
      />
      <p className='text-xs text-red-400 mt-2'>{errorMessage}</p>
      <section className='mt-4'>
        <ul
          className={`origin-top transition-transform duration-300 ${
            currentSearch.length >= 3 ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
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
          {!autocompletedValue &&
            !errorMessage &&
            currentSearch.length >= 3 &&
            results.length == 0 && <li>No results</li>}
        </ul>
      </section>
    </div>
  )
}
