import type { PropsWithChildren } from 'react'

interface TProps {
  closable?: boolean
  onClose?: () => void
}

export function Tag({
  closable = false,
  onClose = () => ({}),
  children,
}: PropsWithChildren<TProps>) {
  return (
    <span className="flex items-center gap-2 rounded-sm border bg-gray-100 px-2 text-xs dark:border-gray-500 dark:bg-gray-700">
      {children}
      {closable ? (
        <button type="button" aria-label="Remove Tag" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="transition-colors h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      ) : (
        ''
      )}
    </span>
  )
}
