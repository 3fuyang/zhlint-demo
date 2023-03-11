import { useCallback, useEffect, useRef } from 'react'

import { sql, MySQL } from '@codemirror/lang-sql'
import CodeMirror, { getStatistics } from '@uiw/react-codemirror'
import type {
  ReactCodeMirrorProps,
  ReactCodeMirrorRef,
} from '@uiw/react-codemirror'

import MySQLParser, { SqlMode } from '@fwio/ts-mysql-parser'

const parser = new MySQLParser({
  version: '5.7.7',
  mode: SqlMode.AnsiQuotes,
})

//const extensions = [StreamLanguage.define(mySQL)]
const extensions = [sql({ dialect: MySQL })]

const value = `SELECT id
FROM users;SELECT name

FROM admins;SELECT age FROM
customers;
`

export function SQLEditor() {
  const editorRef = useRef<ReactCodeMirrorRef>(null)
  const codeRef = useRef<string>(value)
  const anchorRef = useRef<number>(-1)
  
  const onChange = useCallback<NonNullable<ReactCodeMirrorProps['onChange']>>(
    (value) => {
      codeRef.current = value
      //console.log('onChange - ', viewUpdate)
    },
    []
  )

  const onUpdate = useCallback<NonNullable<ReactCodeMirrorProps['onUpdate']>>(
    (viewUpdate) => {
      const statstics = getStatistics(viewUpdate)
      console.log('Stastics: ', statstics)
      anchorRef.current = statstics.selectionAsSingle.anchor
      //console.log('onUpdate - ', viewUpdate)
    },
    []
  )

  const onClick = useCallback(() => {
    const [start, stop] = filterStatement(codeRef.current, anchorRef.current)
    if (stop === 0) {
      return
    }
    editorRef.current?.view?.dispatch({
      selection: {
        anchor: start,
        head: stop,
      },
    })
    // console.log('Selected text: ', text)
    // console.log('Splitted statements: ', statements)
  }, [])

  useEffect(() => {
    const editorDOMNode = editorRef.current
    editorDOMNode?.editor?.addEventListener('click', onClick)
    return () => {
      editorDOMNode?.editor?.removeEventListener('click', onClick)
    }
  }, [onClick])

  return (
    <>
      <CodeMirror
        ref={editorRef}
        height="20rem"
        {...{ value, extensions, onUpdate, onChange }}
      />
    </>
  )
}

/**
 * Extract the SQL statement which user points at.
 * @param code Text input of the editor.
 * @param anchor The position of the pointer.
 * @returns A tuple as `[start, stop]`.
 */
function filterStatement(code: string, anchor: number) {
  try {
    /**
     * @example
     * ``` js
     * [
     *   {
     *     start: 0,
     *     stop: 20,
     *     text: 'SELECT id FROM users'
     *   },
     *   // ...
     * ]
     * ```
     */
    const statements = parser.splitStatements(code)

    for (const { start, stop } of statements) {
      if (anchor > start && anchor <= stop) {
        return [start, stop] as const
      }
    }

    return [0, 0] as const
  } catch(err) {
    import.meta.env.DEV && console.log(err)
    return [0, 0] as const
  }
}
