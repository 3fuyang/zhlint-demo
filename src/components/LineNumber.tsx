import { memo } from "react"

interface LNProps {
  no: number
}

export const LineNumber = memo(function LineNumber({ no }: LNProps) {
  return (
    <div className='text-gray-400 dark:text-gray-500 w-5 tracking-tight mr-1'>{no}</div>
  )
})
