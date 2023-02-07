import type { Change } from 'diff'
import { diffChars } from 'diff'

import { LineNumber } from './LineNumber'

interface DVProps {
  changes: Change[] | undefined
}

export const DiffView = function DiffView({ changes }: DVProps) {
  return (
    <div className='overflow-auto text-slate-600 dark:text-slate-300 dark:border-gray-500 rounded border p-4 grid grid-cols-2 items-center'>
      {changes ? (
        <>
          <h2 key='title-before' className='font-semibold'>Before</h2>
          <h2 key='title-after' className='font-semibold'>After</h2>
          {generateDiffView(changes)}
        </>
      ) : (
        <h2 key='title-diff-view' className='col-span-2 mx-auto tracking-wide'>Diff View</h2>
      )}
    </div>
  )
}

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
      const [ leftPre, rightPre ] = parseLineDiff(firstChange, secondChange)

      result.push(
        parsePres(leftPre, 'left', count),
        parsePres(rightPre, 'right', count)
      )
      count++
    } else if (!firstChange.added) {
      const normalCellLeft = (
        <div
          key={'normal-left' + count}
          className='p-1 rounded-sm bg-white dark:bg-black flex'>
          <LineNumber no={count} />
          <div className='flex-1'>{escapeHTMLTags(firstChange.value)}</div>
        </div>
      )
      const normalCellRight = (
        <div
          key={'normal-right' + count}
          className='p-1 rounded-sm bg-white dark:bg-black flex'>
          <LineNumber no={count} />
          <div className='flex-1'>{escapeHTMLTags(firstChange.value)}</div>
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

  const leftPre: Token[] = diffs.filter(({ added }) => !added).map(({ removed, value }) => {
    return {
      type: removed ? 'removed' : 'normal',
      value
    }
  })

  const rightPre: Token[] = diffs.filter(({ removed }) => !removed).map(({ added, value }) => {
    return {
      type: added ? 'added' : 'normal',
      value
    }
  })

  return [
    leftPre,
    rightPre
  ] as const
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
      key={`${side}-${lineNumber}`}
      className={[
        side === 'left'
          ? 'bg-red-100 dark:bg-red-900'
          : 'bg-green-100 dark:bg-green-900',
        'p-1 rounded-sm flex'
      ].join(' ')}>
      <LineNumber no={lineNumber} />
      <div className='flex-1'>
        {pres.map(({ type, value }, i) => {
          return (
            <span
              key={i}
              className={[
                type === 'added' ? 'bg-green-300 dark:bg-green-700' : '',
                type === 'removed' ? 'bg-red-300 dark:bg-red-700' : '',
                'rounded-sm'
              ].join(' ')}>
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
  let trimedStr = str
    .replace(/^(\n)*/, '')
    .replace(/\n$/, '')
    .replace(' ', '&nbsp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

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
  result.unshift(
    ...segs
      .reduce<typeof result>((prev, curr, index) => {
        prev.push(
          <span key={curr + '-' + index} dangerouslySetInnerHTML={{ __html: curr }}></span>,
          <br key={curr + 'br-' + index} />
        )
        return prev
      }, [])
      // Remove the trailing line break.
      .slice(0, -1)
  )
  return result
}
