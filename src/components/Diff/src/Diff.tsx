import { run } from 'zhlint'
import { type Change, diffLines } from 'diff'
import { useCallback, useRef, useMemo, useTransition, useReducer } from 'react'

import { Button } from '../../Button'
import { PRESETS, initDefaultRules, type Rules } from './util'
import { Config, type RULES_ACTION_TYPE } from './Config'
import { Editor } from './Editor'
import { DiffView } from './DiffView'

const initialChanges: Change[] = []

type CHANGES_ACTION_TYPE =
  | {
      type: 'reset'
    }
  | {
      type: 'lint'
      payload: Change[]
    }

function changesReducer(
  _prevState: typeof initialChanges,
  action: CHANGES_ACTION_TYPE
) {
  switch (action.type) {
    case 'lint':
      return [...action.payload]
    case 'reset':
      return []
    default:
      throw new Error(`Unexpected action type detected!`)
  }
}

const initialRules: Rules = initDefaultRules()

function rulesReducer(prevState: Rules, action: RULES_ACTION_TYPE) {
  if (action.type === 'reset') {
    return initialRules
  }
  return {
    ...prevState,
    [action.type]: action.payload,
  }
}

export function Diff() {
  const [_isPending, startTransition] = useTransition()
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const inputRef = useRef('')
  const [changes, dispatchChanges] = useReducer(changesReducer, initialChanges)
  const [rules, dispatchRules] = useReducer(rulesReducer, initialRules)

  const triggerLint = useCallback(() => {
    if (!inputRef.current) {
      alert('Invalid input.')
      return
    }
    const result = run(inputRef.current, {
      rules: {
        ...rules,
        preset: '',
      },
    }).result
    const lineDiffs = diffLines(inputRef.current, result, {
      ignoreWhitespace: false,
    })
    // Trigger a state transition.
    startTransition(() => {
      dispatchChanges({ type: 'lint', payload: lineDiffs })
    })
  }, [rules])

  const ButtonBox = useMemo(
    function ButtonBox() {
      return (
        <div className="flex gap-4 overflow-auto mb-4">
          <Button id="lint-btn" type="primary" onClick={() => triggerLint()}>
            Lint
          </Button>
          {PRESETS.map((preset, i) => (
            <Button
              key={i}
              id={`preset-btn-${i + 1}`}
              type="primary"
              onClick={() => {
                inputRef.current = preset
                if (editorRef.current) {
                  editorRef.current.value = preset
                  triggerLint()
                }
              }}
            >
              Preset {i + 1}
            </Button>
          ))}
          <div className="flex flex-1 flex-row-reverse">
            <Button
              id="clr-btn"
              type="danger"
              onClick={() => {
                inputRef.current = ''
                if (editorRef.current) {
                  editorRef.current.value = ''
                  dispatchChanges({ type: 'reset' })
                }
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      )
    },
    [triggerLint]
  )

  return (
    <div>
      {/* Config Form */}
      <Config {...{ rules, dispatchRules }} />
      {/* Btn Box */}
      {ButtonBox}
      {/* Editor */}
      <Editor
        ref={editorRef}
        onChange={(e) => (inputRef.current = e.target.value)}
      />
      {/* Diff View */}
      <DiffView {...{ changes }} />
    </div>
  )
}
