import { SearchBar } from './client/SearchBar'

export default function Home() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <main className='flex min-h-screen w-full max-w-3xl flex-col items-center py-10 px-16 bg-white dark:bg-black sm:items-start'>
        <h1 className='text-xl md:text-3xl mb-8 font-bold'>🇳🇴 Norway Address Search</h1>
        <SearchBar />
      </main>
    </div>
  )
}
