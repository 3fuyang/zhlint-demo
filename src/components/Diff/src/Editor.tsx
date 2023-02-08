import { type ChangeEventHandler, forwardRef } from 'react'

interface EProps {
  onChange: ChangeEventHandler<HTMLTextAreaElement>
}

export const Editor = forwardRef<HTMLTextAreaElement, EProps>(function Editor(
  { onChange },
  ref
) {
  return (
    <textarea
      ref={ref}
      placeholder="Type content which needs linting here."
      className="w-full overflow-auto rounded-sm border bg-gray-100/95 p-4 outline-none dark:border-gray-500 dark:bg-gray-900"
      rows={6}
      {...{ onChange }}
    />
  )
})
