import type { JSX } from 'solid-js'
import { mergeProps } from 'solid-js'

interface IProps {
  placeholder?: string
  id: string
  name: string
  value?: string
  readonly?: boolean
  onChange?: JSX.EventHandler<HTMLInputElement, Event>
}

export function Input(_props: IProps) {
  const props = mergeProps({ value: '', readonly: false }, _props)

  return (
    <input
      placeholder={props.placeholder ?? 'Please input'}
      class="rounded-sm border bg-white px-2 py-1 text-xs tracking-wide outline-0 transition-colors hover:border-green-600 focus:border-green-600 dark:border-gray-500 dark:bg-gray-800 dark:hover:border-emerald-400 dark:focus:border-emerald-400"
      type="text"
      name={props.name}
      id={props.id}
      value={props.value}
      readOnly={props.readonly}
      onChange={(e) => props.onChange?.(e)}
    />
  )
}
