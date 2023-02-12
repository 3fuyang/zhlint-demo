import { run } from 'zhlint'
import type { Change } from 'diff'
import { diffLines } from 'diff'
import { createSignal, For } from 'solid-js'
import { createStore } from 'solid-js/store'

import { Button } from '../../Button'
import { PRESETS, initDefaultRules } from './util'
import type { Rules } from './util'
import { Config } from './Config'
import { Editor } from './Editor'
import { DiffView } from './DiffView'

export function Diff() {
  const [rules, setRules] = createStore<Rules>(initDefaultRules())
  const [content, setContent] = createSignal('')
  const [changes, setChanges] = createSignal<Change[]>([])

  const triggerLint = () => {
    if (!content()) {
      alert('Invalid input.')
      return
    }
    const result = run(content(), {
      rules,
    }).result
    const lineDiffs = diffLines(content(), result, {
      ignoreWhitespace: false,
    })
    setChanges(lineDiffs)
  }

  function ButtonBox() {
    return (
      <div class="mb-4 flex gap-4 overflow-auto">
        <Button id="lint-btn" type="primary" onClick={triggerLint}>
          Lint
        </Button>
        <For each={PRESETS}>
          {(preset, i) => (
            <Button
              id={`preset-btn-${i() + 1}`}
              type="primary"
              onClick={() => {
                setContent(preset)
              }}
            >
              Preset {i() + 1}
            </Button>
          )}
        </For>
        <div class="flex flex-1 flex-row-reverse">
          <Button
            id="clr-btn"
            type="danger"
            onClick={() => {
              setContent('')
              setChanges([])
            }}
          >
            Clear
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Config Form */}
      <Config {...{ rules, setRules }} />
      {/* Btn Box */}
      {ButtonBox}
      {/* Editor */}
      <Editor
        content={content()}
        onChange={(e) => setContent(e.currentTarget.value)}
      />
      {/* Diff View */}
      <DiffView changes={changes()} />
    </div>
  )
}
