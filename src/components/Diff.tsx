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
      const normalCellLeft = (
        <div key={'normal-left' + count} className='p-1 rounded-sm bg-white dark:bg-black flex'>
          <div className='text-gray-400 dark:text-gray-500 w-5 tracking-tight mr-1'>{count}</div>
          <div className='flex-1'>
            {dealLineBreak(firstChange.value)}
          </div>
        </div>
      )
      const normalCellRight = (
        <div key={'normal-right' + count} className='p-1 rounded-sm bg-white dark:bg-black flex'>
          <div className='text-gray-400 dark:text-gray-500 w-5 tracking-tight mr-1'>{count}</div>
          <div className='flex-1'>
            {dealLineBreak(firstChange.value)}
          </div>
        </div>
      )
      count++
      result.push(normalCellLeft, normalCellRight)
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
    <div key={`${side}-${lineNumber}`} className={[side === 'left' ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900', 'p-1 rounded-sm flex'].join(' ')}>
      <div className='text-gray-400 dark:text-gray-500 w-5 tracking-tight mr-1'>{lineNumber}</div>
      <div className='flex-1'>
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
    </div>
  )
}

function dealLineBreak(str: string) {
  let trimedStr = str
    .replace(/^(\n)*/, '')
    .replace(/\n$/, '')
  const result: Array<JSX.Element | string> = []
  if (trimedStr.endsWith('\n')) {
    trimedStr = trimedStr.replace(/(\n)*$/, '')
    result.push(
      <>
        <br />
        <br />
      </>
    )
  }
  const segs = trimedStr.split('\n')
  result.unshift(...segs.reduce<typeof result>((prev, curr) => {
    prev.push(<span dangerouslySetInnerHTML={{ __html: curr.replace(' ', '&nbsp;') }}></span>, <br key={curr} />)
    return prev
  }, []).slice(0, -1))
  return result
}

const contentPresets = [
  `# Overview

半角逗号加空格结尾, "半角括号包裹"，半角冒号结尾:

+ 全角句号结尾。
+ 全半角内容之间no空格`
]

export default function Diff() {
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const inputRef = useRef('')
  const [changes, setChanges] = useState<Change[]>()

  const triggerLint = useCallback(() => {
    if (!inputRef.current) {
      alert('Invalid input.')
      return
    }
    const lintRes = run(inputRef.current, { rules: { preset: 'default' } })
    const result = lintRes.result
    const lineDiffs = diffLines(
      inputRef.current,
      result,
      { ignoreWhitespace: false }
    )
    if (import.meta.env.DEV) {
      console.log(lineDiffs)
    }
    setChanges(lineDiffs)
  }, [])

  return (
    <div>
      {/* Btn Box */}
      <div className='flex gap-4 overflow-auto'>
        <button
          id="lint-btn"
          type="button"
          className="rounded-sm px-6 py-1 mb-4 transition-colors bg-green-600 hover:bg-green-500 focus:bg-green-500 dark:bg-green-800 dark:hover:bg-green-700 dark:focus:bg-green-700 text-white tracking-wide"
          onClick={() => triggerLint()}
        >
          Lint
        </button>
        {contentPresets.map((preset, i) => (
          <button
            id={`preset-btn-${i + 1}`}
            type="button"
            key={i}
            className="rounded-sm px-6 py-1 mb-4 transition-colors bg-green-600 hover:bg-green-500 focus:bg-green-500 dark:bg-green-800 dark:hover:bg-green-700 dark:focus:bg-green-700 text-white tracking-wide"
            onClick={() => {
              inputRef.current = preset
              if (editorRef.current) {
                editorRef.current.value = preset
                triggerLint()
              }
            }}
          >
            Preset {i + 1}
          </button>
        ))}
        <div className='flex-1 flex flex-row-reverse'>
            <button
              id="clr-btn"
              type="button"
              className="rounded-sm px-6 py-1 mb-4 transition-colors bg-red-600 hover:bg-red-500 focus:bg-red-500 dark:bg-red-800 dark:hover:bg-red-700 dark:focus:bg-red-700 text-white tracking-wide"
              onClick={() => {
                inputRef.current = ''
                if (editorRef.current) {
                  editorRef.current.value = ''
                  setChanges(undefined)
                }
              }}
            >
              Clear
            </button>
        </div>
      </div>
      {/* Editor */}
      <textarea
        ref={editorRef}
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