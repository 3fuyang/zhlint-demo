import type { PropsWithChildren } from 'react'

interface BProps {
  id?: string
  type?: 'primary' | 'info' | 'danger'
  size?: 'base' | 'sm'
  onClick?: () => void
}

export function Button({
  id = 'btn',
  type = 'primary',
  size = 'base',
  onClick = () => ({}),
  children,
}: PropsWithChildren<BProps>) {
  return (
    <button
      id={id}
      type="button"
      className={[
        'rounded-sm px-6 py-1 tracking-wide text-white transition-colors',
        size === 'base' ? 'px-6' : 'px-4',
        type === 'primary'
          ? 'bg-green-600 hover:bg-green-500 focus:bg-green-500 dark:bg-green-800 dark:hover:bg-green-700 dark:focus:bg-green-700'
          : '',
        type === 'info'
          ? 'bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 dark:bg-blue-800 dark:hover:bg-blue-700 dark:focus:bg-blue-700'
          : '',
        type === 'danger'
          ? 'bg-red-600 hover:bg-red-500 focus:bg-red-500 dark:bg-red-800 dark:hover:bg-red-700 dark:focus:bg-red-700'
          : '',
      ].join(' ')}
      onClick={() => onClick()}
    >
      {children}
    </button>
  )
}
