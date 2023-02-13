import type { JSX } from 'solid-js'

import { merge } from '~/utils/merge'

interface RProps {
  id: string
  name: string
  value: string
  checked: boolean
  onChange: JSX.EventHandler<HTMLInputElement, Event>
}

export function Radio(props: RProps) {
  return (
    <div class="flex items-center gap-1">
      <input
        type="radio"
        name={props.name}
        id={props.id}
        value={props.value}
        checked={props.checked}
        class={merge([
          'mr-1 h-3 w-3 cursor-pointer appearance-none rounded-full border-2 bg-clip-content outline outline-1',
          'outline-gray-200 transition-colors hover:outline-green-500 dark:outline-gray-500 dark:hover:outline-emerald-400',
          'focus:outline-green-500 dark:focus:outline-emerald-400',
          'checked:outline-green-500 dark:checked:outline-emerald-400',
          'border-white dark:border-black',
          props.checked
            ? 'bg-green-500 outline-green-500 dark:bg-emerald-400 dark:outline-emerald-400'
            : 'bg-white dark:bg-black dark:outline-gray-500',
        ])}
        onChange={props.onChange}
      />
      <label for={props.id}>
        <code>{props.value}</code>
      </label>
    </div>
  )
}
