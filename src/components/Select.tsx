import { createSignal, For } from 'solid-js'

import { merge } from '../utils/merge'
import { Input } from './Input'
import { Button } from './Button'
import { Tag } from './Tag'

interface SProps {
  tags: string[]
  handleDelete: (index: number) => void
  handleAdd: (newAbbr: string) => void
}

export function Select(props: SProps) {
  const [visibility, setVisibility] = createSignal(false)
  const [newAbbr, setNewAbbr] = createSignal('')

  return (
    <div class="relative flex items-center rounded-sm border bg-white px-2 py-1 text-xs tracking-wide outline-0 transition-colors hover:border-green-600 focus:border-green-600 dark:border-gray-500 dark:bg-gray-800 dark:hover:border-emerald-400 dark:focus:border-emerald-400">
      <div class="hide-scrollbar max-w-xs overflow-auto">
        <div class="flex gap-1">
          <For each={props.tags}>{(tag) => <Tag>{tag}</Tag>}</For>
        </div>
      </div>
      <button
        class={merge([
          'transition-transform duration-150',
          visibility() ? '-rotate-180' : '',
        ])}
        type="button"
        aria-label="Expand Button"
        onClick={() => setVisibility((prevState) => !prevState)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-4 w-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      {/* Dropdown Items */}
      <div
        class={merge([
          'absolute left-0 right-0 top-8 rounded-md border px-4 py-2 transition-all dark:border-gray-500',
          'bg-white dark:bg-black',
          visibility()
            ? 'visible opacity-100'
            : 'pointer-events-none invisible -translate-y-2 opacity-0',
        ])}
      >
        <ul class="mb-2 flex flex-wrap gap-2">
          <For each={props.tags}>
            {(tag, i) => (
              <li class="inline-block">
                <Tag
                  closable
                  onClose={() => {
                    props.handleDelete(i())
                  }}
                >
                  {tag}
                </Tag>
              </li>
            )}
          </For>
        </ul>
        <div class="flex items-center gap-2">
          <Input
            id="new-abbr-input"
            placeholder="New abbreviation"
            name="New Abbr Input"
            value={newAbbr()}
            onChange={(e) => {
              setNewAbbr(e.currentTarget.value)
            }}
          />
          <Button
            id="add-abbreviation"
            type="primary"
            size="sm"
            onClick={() => {
              if (!newAbbr()) {
                alert('Please type a new abbreviation.')
                return
              }
              if (props.tags.includes(newAbbr())) {
                alert('No duplicate abbreviation.')
                return
              }
              props.handleAdd(newAbbr())
              setNewAbbr('')
            }}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}
