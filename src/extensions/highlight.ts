import { StateEffect, StateField } from '@codemirror/state'
import { Decoration, EditorView } from '@codemirror/view'
// import type { Range } from '@codemirror/state';

/** The highlight effect. */
export const highlighEffect = StateEffect.define<any>()

/**
 * A new field to be attached to `editorView.state` as an extension,
 * `update` will be called at each editor's change.
 */
export const highlightExtension = StateField.define({
  create() {
    return Decoration.none
  },
  update(value, transaction) {
    console.log(`update() - value: `, value)
    console.log(`update() - transaction: `, transaction)
    value = Decoration.none
    value = value.map(transaction.changes)

    for (const effect of transaction.effects) {
      if (effect.is(highlighEffect)) {
        value = value.update({
          add: effect.value,
          sort: true,
        })
      }
    }

    return value
  },
  provide: (f) => EditorView.decorations.from(f),
})

/** The decoration to define the change: a css class or directly css attributes. */
export const highlightDecoration = Decoration.mark({
  class: 'sql-highlight',
  tagName: 'span',
})
