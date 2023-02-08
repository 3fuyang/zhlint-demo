import type { Change } from 'diff'
import { diffChars } from 'diff'
import { memo } from 'react'

import { LineNumber } from './LineNumber'

interface DVProps {
  changes: Change[]
}

export const DiffView = memo(function DiffView({ changes }: DVProps) {
  return (
    <div className="grid grid-cols-2 items-center overflow-auto rounded border p-4 text-slate-600 dark:border-gray-500 dark:text-slate-300">
      {changes.length ? (
        <>
          <h2 key="title-before" className="font-semibold">
            Before
          </h2>
          <h2 key="title-after" className="font-semibold">
            After
          </h2>
          {generateDiffView(changes)}
        </>
      ) : (
        <h2 key="title-diff-view" className="col-span-2 mx-auto tracking-wide">
          Diff View
        </h2>
      )}
    </div>
  )
})

/**
 * An abstraction of text elements emitted by diffing.
 */
interface Token {
  type: 'added' | 'removed' | 'ignored' | 'normal'
  value: string
}

/**
 * Parse line diffs and generate diff views.
 * @param diffs Line diffs.
 * @returns `JSX.Element`s
 */
function generateDiffView(diffs: Change[]) {
  const diffsCpy = [...diffs]
  const result = []

  /** Line Number */
  let count = 1
  while (diffsCpy.length) {
    const firstChange = diffsCpy.shift() as Change
    if (firstChange.removed) {
      const secondChange = diffsCpy.shift() as Change
      const [leftPre, rightPre] = parseLineDiff(firstChange, secondChange)

      result.push(
        parsePres(leftPre, 'left', count),
        parsePres(rightPre, 'right', count)
      )
      count++
    } else if (!firstChange.added) {
      const normalCellLeft = (
        <div
          key={`${count}-normal-left`}
          className="flex rounded-sm bg-white p-1 dark:bg-black"
        >
          <LineNumber no={count} />
          <div className="flex-1 whitespace-pre-wrap">
            {escapeHTMLTags(firstChange.value)}
          </div>
        </div>
      )
      const normalCellRight = (
        <div
          key={`${count}-normal-right`}
          className="flex rounded-sm bg-white p-1 dark:bg-black"
        >
          <LineNumber no={count} />
          <div className="flex-1 whitespace-pre-wrap">
            {escapeHTMLTags(firstChange.value)}
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

  const leftPre: Token[] = diffs
    .filter(({ added }) => !added)
    .map(({ removed, value }) => {
      return {
        type: removed ? 'removed' : 'normal',
        value,
      }
    })

  const rightPre: Token[] = diffs
    .filter(({ removed }) => !removed)
    .map(({ added, value }) => {
      return {
        type: added ? 'added' : 'normal',
        value,
      }
    })

  return [leftPre, rightPre] as const
}

/**
 * Parse a list of `Token`s to `JSX.Element`s.
 * @param pres A list of `Token`s.
 * @param side Left or right.
 * @param lineNumber The line number of the code.
 */
function parsePres(pres: Token[], side: 'left' | 'right', lineNumber: number) {
  return (
    <div
      key={`${lineNumber}-${side}-pre`}
      className={[
        side === 'left'
          ? 'bg-red-100 dark:bg-red-900'
          : 'bg-green-100 dark:bg-green-900',
        'flex rounded-sm p-1',
      ]
        .join(' ')
        .trim()}
    >
      <LineNumber no={lineNumber} />
      <div className="flex-1">
        {pres.map(({ type, value }, i) => {
          return (
            <span
              key={`${i + 1}-token-${type}`}
              className={[
                type === 'added' ? 'bg-green-300 dark:bg-green-700' : '',
                type === 'removed' ? 'bg-red-300 dark:bg-red-700' : '',
                'whitespace-pre-wrap rounded-sm',
              ]
                .join(' ')
                .trim()}
            >
              {escapeHTMLTags(value)}
            </span>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Escape html specific tages
 * @param str The value of an instance of `Token`.
 */
function escapeHTMLTags(str: string) {
  const result: Array<JSX.Element | string> = []
  const segs = str.split('\n')
  result.unshift(
    ...segs
      .reduce<typeof result>((prev, curr, index) => {
        curr
          ? prev.push(curr, <br key={`${index + 1}-br`} />)
          : prev.push(<br key={`${index + 1}-br`} />)
        return prev
      }, [])
      // Remove the trailing line break.
      .slice(0, -1)
  )
  return result
}
