import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { SearchBar } from '../SearchBar'

vi.mock('../hooks/useDebounce', () => ({
  useDebounce: (v: string) => v
}))

beforeEach(() => {
  global.fetch = vi.fn()
})

test('renders search bar and loads results on successful API call', async () => {
  const mockResults = {
    results: [
      {
        postNumber: 175,
        city: 'OSLO',
        street: 'Alexander Kiellands plass',
        typeCode: 6,
        type: 'Gate-/veg-adresse',
        district: 'Grünerløkka',
        municipalityNumber: 301,
        municipality: 'Oslo',
        county: 'Oslo'
      },
      {
        postNumber: 501,
        city: 'OSLO',
        street: 'Rodeløkka Postboks 6500-6599',
        typeCode: 4,
        type: 'Postboksadresse',
        district: 'Grünerløkka',
        municipalityNumber: 301,
        municipality: 'Oslo',
        county: 'Oslo'
      }
    ]
  }

  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockResults
  })

  render(<SearchBar />)

  // Type into the input
  const input = screen.getByPlaceholderText('Enter address...')
  fireEvent.change(input, { target: { value: 'rode' } })

  // Wait for one of the results to appear
  expect(await screen.findByText('Rodeløkka Postboks 6500-6599')).toBeInTheDocument()

  // Should not show error message
  expect(screen.queryByText('Oops, we encountered an error.')).not.toBeInTheDocument()
})


test('shows error message when API call fails', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: false,
    json: async () => ({ error: 'Bad request' })
  })

  render(<SearchBar />)

  const input = screen.getByPlaceholderText('Enter address...')
  fireEvent.change(input, { target: { value: 'mai' } })

  // Wait for the error message to appear
  expect(await screen.findByText('Oops, we encountered an error.')).toBeInTheDocument()

  // List should be empty
  expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
})
