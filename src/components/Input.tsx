import type { ChangeEventHandler } from 'react'
import { forwardRef } from 'react'

interface IProps {
  placeholder?: string
  id: string
  name: string
  value?: string
  readonly?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
}

export const Input = forwardRef<HTMLInputElement, IProps>(function Input(
  {
    placeholder = 'Please input',
    id,
    name,
    value,
    readonly = false,
    onChange = () => ({}),
  }: IProps,
  ref?
) {
  return value ? (
    <input
      ref={ref}
      placeholder={placeholder}
      className="rounded-sm border bg-white px-2 py-1 text-xs tracking-wide outline-0 transition-colors hover:border-green-600 focus:border-green-600 dark:border-gray-500 dark:bg-gray-800 dark:hover:border-emerald-400 dark:focus:border-emerald-400"
      type="text"
      name={name}
      id={id}
      value={value}
      readOnly={readonly}
      onChange={onChange}
    />
  ) : (
    <input
      ref={ref}
      placeholder={placeholder}
      className="rounded-sm border bg-white px-2 py-1 text-xs tracking-wide outline-0 transition-colors hover:border-green-600 focus:border-green-600 dark:border-gray-500 dark:bg-gray-800 dark:hover:border-emerald-400 dark:focus:border-emerald-400"
      type="text"
      name={name}
      id={id}
      readOnly={readonly}
      onChange={onChange}
    />
  )
})
