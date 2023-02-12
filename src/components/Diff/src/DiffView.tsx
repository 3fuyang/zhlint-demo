import type { JSX } from 'solid-js'
import { For, createMemo, Show } from 'solid-js'
import type { Change } from 'diff'
import { diffChars } from 'diff'

import { LineNumber } from './LineNumber'
import { merge } from '../../../utils/merge'

interface DVProps {
  changes: Change[]
}

export function DiffView(props: DVProps) {
  const diffViews = createMemo(() => {
    return generateDiffView(props.changes)
  })
  return (
    <div class="grid grid-cols-2 items-center overflow-auto rounded border p-4 text-slate-600 dark:border-gray-500 dark:text-slate-300">
      <Show
        when={props.changes.length}
        fallback={<h2 class="col-span-2 mx-auto tracking-wide">Diff View</h2>}
      >
        <h2 class="font-semibold">Before</h2>
        <h2 class="font-semibold">After</h2>
        {diffViews()}
      </Show>
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
      const [leftPre, rightPre] = parseLineDiff(firstChange, secondChange)

      result.push(
        parsePres(leftPre, 'left', count),
        parsePres(rightPre, 'right', count)
      )
      count++
    } else if (!firstChange.added) {
      const normalCellLeft = (
        <div class="flex rounded-sm bg-white p-1 dark:bg-black">
          <LineNumber no={count} />
          <div class="flex-1 whitespace-pre-wrap">
            <For each={escapeHTMLTags(firstChange.value)}>
              {(tag) => <>{tag}</>}
            </For>
          </div>
        </div>
      )
      const normalCellRight = (
        <div class="flex rounded-sm bg-white p-1 dark:bg-black">
          <LineNumber no={count} />
          <div class="flex-1 whitespace-pre-wrap">
            <For each={escapeHTMLTags(firstChange.value)}>
              {(tag) => <>{tag}</>}
            </For>
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
      class={[
        side === 'left'
          ? 'bg-red-100 dark:bg-red-900'
          : 'bg-green-100 dark:bg-green-900',
        'flex rounded-sm p-1',
      ]
        .join(' ')
        .trim()}
    >
      <LineNumber no={lineNumber} />
      <div class="flex-1">
        <For each={pres}>
          {({ type, value }) => {
            return (
              <span
                class={merge([
                  type === 'added' ? 'bg-green-300 dark:bg-green-700' : '',
                  type === 'removed' ? 'bg-red-300 dark:bg-red-700' : '',
                  'whitespace-pre-wrap rounded-sm',
                ])}
              >
                <For each={escapeHTMLTags(value)}>{(tag) => <>{tag}</>}</For>
              </span>
            )
          }}
        </For>
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
      .reduce<typeof result>((prev, curr) => {
        if (curr) {
          prev.push(curr)
        }
        prev.push(<br />)
        return prev
      }, [])
      // Remove the trailing line break.
      .slice(0, -1)
  )
  return result
}
