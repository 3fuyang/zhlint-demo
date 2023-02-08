interface LNProps {
  no: number
}

export function LineNumber({ no }: LNProps) {
  return (
    <div className="mr-1 w-5 tracking-tight text-gray-400 dark:text-gray-500">
      {no}
    </div>
  )
}
