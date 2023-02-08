import { memo } from 'react'

interface SProps {
  label: string
  value: boolean
  onChange: (newVal: boolean) => void
}

const options = [false, true] as const

export const Switch = memo(function Switch({ label, value, onChange }: SProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={[
        'flex w-10 items-center justify-between rounded-xl border p-[1px] transition-colors dark:border-gray-500',
        value
          ? 'bg-green-500 dark:bg-emerald-600'
          : 'bg-gray-200 dark:bg-gray-600',
      ].join(' ')}
      onClick={() => onChange(!value)}
    >
      {options.map((option) => (
        <span
          key={String(option)}
          className={[
            'h-4 w-4 rounded-full border bg-white transition-all dark:border-gray-500',
            value === option
              ? 'visible opacity-100'
              : `invisible opacity-0 ${
                  option ? '-translate-x-4' : 'translate-x-4'
                }`,
          ].join(' ')}
        />
      ))}
    </button>
  )
})
