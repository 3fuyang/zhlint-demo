import type { JSX } from 'solid-js'

interface EProps {
  content: string
  onChange: JSX.EventHandler<HTMLTextAreaElement, Event>
}

export const Editor = function Editor(props: EProps) {
  return (
    <textarea
      placeholder="Type content which needs linting here."
      class="w-full overflow-auto rounded-sm border bg-gray-100/95 p-4 outline-none dark:border-gray-500 dark:bg-gray-900"
      rows={6}
      value={props.content}
      onChange={props.onChange}
    />
  )
}
