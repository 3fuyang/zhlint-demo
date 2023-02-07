import { run } from 'zhlint'
import { type Change, diffLines } from 'diff'
import { useCallback, useState, useRef, useMemo } from 'react'

import { Editor } from './Editor'
import { DiffView } from './DiffView'

const contentPresets = [
  `# Overview

半角逗号加空格结尾, "半角括号包裹"，半角冒号结尾:

+ 全角句号结尾。
+ 全半角内容之间no空格`,
  `- 当注释用来描述代码时，应该保证使用 **描述性语句** 而非 **祈使句**

    - Opens the file   (正确)
    - Open the file    (错误)

- 使用 "this" 而非"the"来指代当前事物

    - Gets the toolkit for this component   (推荐)
    - Gets the toolkit for the component    (不推荐)`,
]

export function Diff() {
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const inputRef = useRef('')
  const [changes, setChanges] = useState<Change[]>()

  const ButtonBox = useMemo(function ButtonBox() {
    return (
      <div className='flex gap-4 overflow-auto'>
        <button
          id='lint-btn'
          type='button'
          className='rounded-sm px-6 py-1 mb-4 transition-colors bg-green-600 hover:bg-green-500 focus:bg-green-500 dark:bg-green-800 dark:hover:bg-green-700 dark:focus:bg-green-700 text-white tracking-wide'
          onClick={() => triggerLint()}>
          Lint
        </button>
        {contentPresets.map((preset, i) => (
          <button
            id={`preset-btn-${i + 1}`}
            type='button'
            key={i}
            className='rounded-sm px-6 py-1 mb-4 transition-colors bg-green-600 hover:bg-green-500 focus:bg-green-500 dark:bg-green-800 dark:hover:bg-green-700 dark:focus:bg-green-700 text-white tracking-wide'
            onClick={() => {
              inputRef.current = preset
              if (editorRef.current) {
                editorRef.current.value = preset
                triggerLint()
              }
            }}>
            Preset {i + 1}
          </button>
        ))}
        <div className='flex-1 flex flex-row-reverse'>
          <button
            id='clr-btn'
            type='button'
            className='rounded-sm px-6 py-1 mb-4 transition-colors bg-red-600 hover:bg-red-500 focus:bg-red-500 dark:bg-red-800 dark:hover:bg-red-700 dark:focus:bg-red-700 text-white tracking-wide'
            onClick={() => {
              inputRef.current = ''
              if (editorRef.current) {
                editorRef.current.value = ''
                setChanges(undefined)
              }
            }}>
            Clear
          </button>
        </div>
      </div>
    )
  }, [])

  const triggerLint = useCallback(() => {
    if (!inputRef.current) {
      alert('Invalid input.')
      return
    }
    const result = run(inputRef.current, { rules: { preset: 'default' } }).result
    const lineDiffs = diffLines(inputRef.current, result, {
      ignoreWhitespace: false
    })

    if (import.meta.env.DEV) {
      console.log(`diffLines(): `, lineDiffs)
    }

    setChanges(lineDiffs)
  }, [])

  return (
    <div>
      {/* Btn Box */}
      {ButtonBox}
      {/* Editor */}
      <Editor ref={editorRef} onChange={(e) => inputRef.current = e.target.value} />
      {/* Diff View */}
      <DiffView {...{ changes }} />
    </div>
  )
}
