import type { ParentProps } from 'solid-js'

interface TProps {
  closable?: boolean
  onClose?: () => void
}

export function Tag(props: ParentProps<TProps>) {
  return (
    <span class="flex items-center gap-2 rounded-sm border bg-gray-100 px-2 text-xs dark:border-gray-500 dark:bg-gray-700">
      {props.children}
      {props.closable ? (
        <button
          type="button"
          aria-label="Remove Tag"
          onClick={props.onClose ?? (() => ({}))}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="h-3 w-3 cursor-pointer text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
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
