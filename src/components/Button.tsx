import type { ParentProps, JSX } from 'solid-js'
import { mergeProps } from 'solid-js'

import { merge } from '../utils/merge'

interface BProps {
  id?: string
  type?: 'primary' | 'info' | 'danger'
  size?: 'base' | 'sm'
  onClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>
}

export function Button(_props: ParentProps<BProps>) {
  const props = mergeProps({ id: 'btn', type: 'primary', size: 'base' }, _props)

  return (
    <button
      id={props.id}
      type="button"
      class={merge([
        'rounded-sm px-6 py-1 tracking-wide text-white transition-colors',
        props.size === 'base' ? 'px-6' : 'px-4',
        props.type === 'primary'
          ? 'bg-green-600 hover:bg-green-500 focus:bg-green-500 dark:bg-green-800 dark:hover:bg-green-700 dark:focus:bg-green-700'
          : '',
        props.type === 'info'
          ? 'bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 dark:bg-blue-800 dark:hover:bg-blue-700 dark:focus:bg-blue-700'
          : '',
        props.type === 'danger'
          ? 'bg-red-600 hover:bg-red-500 focus:bg-red-500 dark:bg-red-800 dark:hover:bg-red-700 dark:focus:bg-red-700'
          : '',
      ])}
      onClick={(e) => props.onClick?.(e)}
    >
      {props.children}
    </button>
  )
}
