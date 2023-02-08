interface RProps {
  id: string
  name: string
  value: string
  checked: boolean
  onChange: (...args: any[]) => any
}

export function Radio({ id, name, value, checked, onChange }: RProps) {
  return (
    <div className="flex items-center gap-1">
      <input
        type="radio"
        name={name}
        id={id}
        value={value}
        checked={checked}
        className={[
          'mr-1 h-3 w-3 cursor-pointer appearance-none rounded-full border-2 bg-clip-content outline outline-1',
          'outline-gray-200 transition-colors hover:outline-green-500 dark:outline-gray-500 dark:hover:outline-emerald-400',
          'focus:outline-green-500 dark:focus:outline-emerald-400',
          'checked:outline-green-500 dark:checked:outline-emerald-400',
          'border-white dark:border-black',
          checked
            ? 'bg-green-500 outline-green-500 dark:bg-emerald-400 dark:outline-emerald-400'
            : 'bg-white dark:bg-black dark:outline-gray-500',
        ].join(' ')}
        onChange={onChange}
      />
      <label htmlFor={id}>
        <code>{value}</code>
      </label>
    </div>
  )
}
