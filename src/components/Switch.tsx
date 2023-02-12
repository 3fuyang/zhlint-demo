import { For } from 'solid-js'

import { merge } from '../utils/merge'

interface SProps {
  label: string
  value: boolean
  onChange: (newVal: boolean) => void
}

const options = [false, true] as const

export function Switch(props: SProps) {
  return (
    <button
      type="button"
      aria-label={props.label}
      class={merge([
        'flex w-10 items-center justify-between rounded-xl border p-[1px] transition-colors dark:border-gray-500',
        props.value
          ? 'bg-green-500 dark:bg-emerald-600'
          : 'bg-gray-200 dark:bg-gray-600',
      ])}
      onClick={() => props.onChange(!props.value)}
    >
      <For each={options}>
        {(option) => (
          <span
            class={merge([
              'h-4 w-4 rounded-full border bg-white transition-all dark:border-gray-500',
              props.value === option
                ? 'visible opacity-100'
                : `invisible opacity-0 ${
                    option ? '-translate-x-4' : 'translate-x-4'
                  }`,
            ])}
          />
        )}
      </For>
    </button>
  )
}
