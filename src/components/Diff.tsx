import { run } from 'zhlint'
import { type Change, diffChars, diffLines } from 'diff'
import { useCallback, useState, useRef } from 'react'

interface Token {
  type: 'added' | 'removed' | 'ignored' | 'normal'
  value: string
}

/**
 * Generate JSX elements.
 * @param diffs Line diffs.
 */
function generateDiffView(diffs: Change[]) {
  const diffsCpy = [...diffs]
  const result = []

  let count = 1
  while (diffsCpy.length) {
    const firstChange = diffsCpy.shift() as Change
    if (firstChange.removed) {
      const secondChange = diffsCpy.shift() as Change
      const { leftPre, rightPre } = parseLineDiff(firstChange, secondChange)

      result.push(parsePres(leftPre, 'left', count), parsePres(rightPre, 'right', count))
      count++
    } else if (!firstChange.added) {
      const normalCell = (
        <div className='p-1 rounded-sm bg-white dark:bg-black'>
          <span className='text-sm pr-2 text-gray-500'>{count++}</span>{dealLineBreak(firstChange.value)}
        </div>
      )
      result.push(normalCell, normalCell)
    }
  }

  return result
}

/**
 * Diff in chars.
 * @param removed The removed change returned by `diffLines()`.
 * @param added The added change returned by `diffLines()`.
 * @returns Token lists.
 */
function parseLineDiff(removed: Change, added: Change) {
  const diffs = diffChars(removed.value, added.value)

  const leftPre: Token[] = diffs.map(({ added, removed, value }) => {
    return {
      type: removed ? 'removed' : added ? 'ignored' : 'normal',
      value
    }
  })

  const rightPre: Token[] = diffs.map(({ added, removed, value }) => {
    return {
      type: added ? 'added' : removed ? 'ignored' : 'normal',
      value
    }
  })

  return {
    leftPre,
    rightPre
  }
}

function parsePres(pres: Token[], side: 'left' | 'right', lineNumber: number) {
  return (
    <div className={[side === 'left' ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900', 'p-1 rounded-sm'].join(' ')}>
      <span className='text-sm pr-2 text-gray-500'>{lineNumber}</span>
      {pres.map(({ type, value }, i) => {
        return (
          <span
            key={i}
            className={[
              type === 'added' ? 'bg-green-300 dark:bg-green-700' : '',
              type === 'removed' ? 'bg-red-300 dark:bg-red-700' : '',
              'rounded-sm'
            ].join(' ')}
          >
            {type === 'ignored' ? '' : dealLineBreak(value)}
          </span>
        )
      })}
    </div>
  )
}

function dealLineBreak(str: string) {
  if (str.endsWith('\n\n')) {
    return (<>
      {str.replace(/^(\n)*/, '')}
      <br />
      <br />
    </>)
  }
  return str.replace(/^(\n)*/, '')
}

export default function Diff() {
  /*
# Overview

半角逗号加空格结尾, "半角括号包裹"，半角冒号结尾:

+ 全角句号结尾。
+ 全半角内容之间no空格
  */
  const inputRef = useRef('')
  const [changes, setChanges] = useState<Change[]>()

  const handleClick = useCallback(() => {
    if (!inputRef.current) {
      alert('Invalid input.')
      return
    }
    const result = run(inputRef.current, { rules: { preset: 'default' } }).result
    setChanges(diffLines(
      inputRef.current,
      result,
      { ignoreWhitespace: false }
    ))
  }, [])

  return (
    <div>
      <div>
        <button
          id="lint-btn"
          type="button"
          className="rounded-sm px-6 py-1 mb-4 transition-colors bg-green-600 hover:bg-green-500 focus:bg-green-500 dark:bg-green-800 dark:hover:bg-green-700 dark:focus:bg-green-700 text-white tracking-wide"
          onClick={() => handleClick()}
        >
          Lint
        </button>
      </div>
      {/* Editor */}
      <textarea
        placeholder='Type content which needs linting here.'
        className='dark:bg-gray-900 dark:border-gray-500 rounded-sm overflow-auto border p-4 w-full bg-gray-100/95 outline-none'
        rows={6}
        onChange={(e) => inputRef.current = e.target.value}
      />
      {/* Diff View */}
      <div className='overflow-auto text-slate-600 dark:text-slate-300 dark:border-gray-500 rounded border p-4 grid grid-cols-2 items-center'>
        {changes
          ? (
            <>
              <h2 className='font-semibold'>Before</h2>
              <h2 className='font-semibold'>After</h2>
              {generateDiffView(changes)}
            </>
          )
          : (
            <h2 className='col-span-2 mx-auto tracking-wide'>Diff View</h2>
          )}
      </div>
    </div>
  )
}