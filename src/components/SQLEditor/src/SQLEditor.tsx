import { useCallback, useRef, useState } from 'react'
import { sql, MySQL } from '@codemirror/lang-sql'
import CodeMirror, { getStatistics } from '@uiw/react-codemirror'
import type { ReactCodeMirrorProps } from '@uiw/react-codemirror'
// import MySQLParser, { SqlMode } from 'ts-mysql-parser'

/** SQL parser instance. */
// const parser = new MySQLParser({
//   version: '5.7.7',
//   mode: SqlMode.AnsiQuotes,
// })

/** Supported language modes. */
const extensions = [sql({ dialect: MySQL })]

/** Initial content displayed in the editor. */
const value = `select
  stat_ts,
  sum(value) as value,
  type
from
  (
    select
      concat(
        date_format(collecttime, "%Y-%m-%d %H"),
        ":",
        lpad(1 * floor(minute(collecttime) / 1), 2, 0),
        ":00"
      ) as stat_ts,
      avg(value) as value,
      node,
      type
    from
      sql_statement_total
    where
      mo_log_date(__mo_filepath) between "2023-02-15"
      and "2023-02-15"
      and collecttime >= "2023-02-15 05:27:30"
      and collecttime <= "2023-02-15 05:57:30"
      and type in ("DQL", "DDL", "DML", "DCL", "TCL")
    group by
      node,
      type,
      concat(
        date_format(collecttime, "%Y-%m-%d %H"),
        ":",
        lpad(1 * floor(minute(collecttime) / 1), 2, 0),
        ":00"
      )
    order by
      concat(
        date_format(collecttime, "%Y-%m-%d %H"),
        ":",
        lpad(1 * floor(minute(collecttime) / 1), 2, 0),
        ":00"
      )
    limit
      100
  ) as t
group by
  stat_ts,
  type
` as const

export function SQLEditor() {
  const codeRef = useRef<string>(value)
  const [selection, setSelection] = useState('')

  /** Fired whenever a change occurs to the document. */
  const onChange = useCallback<NonNullable<ReactCodeMirrorProps['onChange']>>(
    (value, viewUpdate) => {
      codeRef.current = value
      console.log('onChange - ', viewUpdate)
    },
    []
  )

  /** Fired whenever any state change occurs within the editor, including non-document changes like lint results. */
  const onUpdate = useCallback<NonNullable<ReactCodeMirrorProps['onUpdate']>>(
    (viewUpdate) => {
      if (viewUpdate.selectionSet) {
        const statstics = getStatistics(viewUpdate)
        setSelection(statstics.selectionCode)
      }
    },
    []
  )

  return (
    <div className="grid grid-cols-2">
      <section className="rounded-sm border p-4">
        <h2 className="border-b font-semibold tracking-wide">Selected Code</h2>
        <article className="overflow-auto py-2">{selection}</article>
      </section>
      <CodeMirror
        height="30rem"
        {...{ value, extensions, onUpdate, onChange }}
      />
    </div>
  )
}

/**
 * Extract the SQL statement which user points at.
 * @param code Text input of the editor.
 * @param anchor The position of the pointer.
 * @returns A tuple as `[start, stop]`.
 */
// function filterStatement(code: string, anchor: number) {
//   /**
//    * @example
//    * ``` js
//    * [
//    *   {
//    *     start: 0,
//    *     stop: 20,
//    *     text: 'SELECT id FROM users'
//    *   },
//    *   // ...
//    * ]
//    * ```
//    */
//   const statements = parser.splitStatements(code)

//   for (const { start, stop } of statements) {
//     if (anchor > start && anchor <= stop) {
//       return [start, stop] as const
//     }
//   }

//   return [0, 0] as const
// }
