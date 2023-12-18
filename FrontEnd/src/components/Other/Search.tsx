import React, { ReactNode, useState } from 'react'

const options = ['All results', 'Users', 'Posts']

interface SearchProps {
  className?: string
}

const Search = ({ className }: SearchProps) => {
  const [text, settext] = useState('')
  const [option, setoption] = useState('All results')

  const handleChange = (e: any) => {
    e.preventDefault()
    const { id, value } = e.target
    switch (id) {
      case 'search':
        settext(value)
        break
      case 'option':
        setoption(value)
        break
      default:
        // console.log('This should not be logged')
        break
    }
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    // console.log(`Searching for ${text} in ${option}`)
  }

  return (
    <div className="flex items-center justify-center py-5">
      <section
        className={`w-1/2 border min-w-fit border-black  h-10 rounded-full flex flex-row bg-gray-200 items-center overflow-hidden transition focus-within:border-blue-500 focus-within:border-[2px] ${className}`}
      >
        <select
          id="option"
          name="option"
          title="option"
          onChange={handleChange}
          className="mobile:placeholder:hidden min-w-fit text-center bg-gray-50 border w-1/3 border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block  p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500"
        >
          {options.map((item, index) => (
            <option key={index} value={item} className="p-2">
              {item}
            </option>
          ))}
        </select>
        {/* <hr className="w-4 border-gray-500 rotate-90" /> */}
        <form onSubmit={handleSubmit} className="w-full">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only light:text-white"
          >
            Search
          </label>
          <div className="relative">
            <input
              type="search"
              id="search"
              name="search"
              title="search"
              autoComplete="off"
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500"
              placeholder="Search Posts, Users..."
              onChange={handleChange}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 light:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
          </div>
        </form>
      </section>
    </div>
  )
}

export default Search
