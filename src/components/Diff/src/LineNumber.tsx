interface LNProps {
  no: number
}

export function LineNumber(props: LNProps) {
  return (
    <div class="mr-1 w-5 tracking-tight text-gray-400 dark:text-gray-500 select-none">
      {props.no}
    </div>
  )
}
