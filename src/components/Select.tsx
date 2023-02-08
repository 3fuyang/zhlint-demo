import { useCallback, useRef, useState } from 'react'

import { Input } from './Input'
import { Button } from './Button'
import { Tag } from './Tag'

interface SProps {
  tags?: string[]
  handleDelete: (index: number) => void
  handleAdd: (newAbbr: string) => void
}

export function Select({ tags = [], handleDelete, handleAdd }: SProps) {
  const [visibility, setVisibility] = useState(false)
  const newAbbrInputRef = useRef<HTMLInputElement>(null)
  const newAbbrRef = useRef('')

  const handleClickAdd = useCallback(() => {
    if (!newAbbrRef.current) {
      alert('Please type a new abbreviation.')
    }
    if (tags.includes(newAbbrRef.current)) {
      alert('No duplicate abbreviation.')
    }
    handleAdd(newAbbrRef.current)
    if (newAbbrInputRef.current) {
      newAbbrInputRef.current.value = ''
    }
  }, [handleAdd, tags])

  return (
    <div className="relative flex items-center rounded-sm border bg-white px-2 py-1 text-xs tracking-wide outline-0 transition-colors hover:border-green-600 focus:border-green-600 dark:border-gray-500 dark:bg-gray-800 dark:hover:border-emerald-400 dark:focus:border-emerald-400">
      <div className="hide-scrollbar max-w-xs overflow-auto">
        <div className="flex gap-1">
          {tags.map((tag, i) => (
            <Tag key={`${tag}-${i}`}>{tag}</Tag>
          ))}
        </div>
      </div>
      <button
        className={[
          'transition-transform duration-150',
          visibility ? '-rotate-180' : '',
        ].join(' ')}
        type="button"
        aria-label="Expand Button"
        onClick={() => setVisibility((prevState) => !prevState)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      {/* Dropdown Items */}
      <div
        className={[
          'absolute left-0 right-0 top-8 rounded-md border px-4 py-2 transition-all dark:border-gray-500',
          'bg-white dark:bg-black',
          visibility
            ? 'visible opacity-100'
            : 'pointer-events-none invisible -translate-y-2 opacity-0',
        ].join(' ')}
      >
        <ul className="mb-2 flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <li key={tag} className="inline-block">
              <Tag closable onClose={() => handleDelete(i)}>
                {tag}
              </Tag>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Input
            ref={newAbbrInputRef}
            id="new-abbr-input"
            placeholder="New abbreviation"
            name="New Abbr Input"
            onChange={(e) => {
              newAbbrRef.current = e.target.value
            }}
          />
          <Button
            id="add-abbreviation"
            type="primary"
            size="sm"
            onClick={handleClickAdd}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}
