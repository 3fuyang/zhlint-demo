import { type ChangeEventHandler, forwardRef } from 'react'

interface EProps {
  onChange: ChangeEventHandler<HTMLTextAreaElement>
}

export const Editor = forwardRef<HTMLTextAreaElement, EProps>(function Editor({ onChange }, ref) {
  return (
    <textarea
      ref={ref}
      placeholder='Type content which needs linting here.'
      className='dark:bg-gray-900 dark:border-gray-500 rounded-sm overflow-auto border p-4 w-full bg-gray-100/95 outline-none'
      rows={6}
      {...{ onChange }}
    />
  )
})
