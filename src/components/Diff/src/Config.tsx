import { memo } from 'react'
import type { Dispatch } from 'react'

import { Button } from '../../Button'
import type { Rules } from './util'
import { Radio } from '../../Radio'
import { Switch } from '../../Switch'

export type RULES_ACTION_TYPE =
  | {
      [P in keyof Rules]: {
        type: P
        payload: Rules[P]
      }
    }[keyof Rules]
  | {
      type: 'reset'
      payload: null
    }

interface CProps {
  rules: Rules
  dispatchRules: Dispatch<RULES_ACTION_TYPE>
}

export const Config = memo(function Config({ rules, dispatchRules }: CProps) {
  const rulesEntries = Object.entries(rules)

  return (
    <details className="mb-4">
      <summary className="flex w-min cursor-pointer items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="right-arrow h-4 w-4 transition-transform duration-200"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
        <h2>Configuration</h2>
      </summary>
      <ul className="grid grid-cols-1 gap-y-2 pl-6 pt-2 lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-[repeat(12,_minmax(0,_1fr))]">
        {rulesEntries.map(([key, val]) => (
          <li className="flex items-center" key={key}>
            <label htmlFor={key} className="mr-4">
              <code>{key}</code>
            </label>
            {(key as keyof Rules) === 'unifiedPunctuation' ? (
              <div id={key} className="flex items-center gap-3">
                {/* Simplified Radio */}
                <Radio
                  name={key}
                  id={`${key}-simplified`}
                  checked={val === 'simplified'}
                  value="simplified"
                  onChange={() =>
                    dispatchRules({
                      type: key as keyof Rules,
                      payload: 'simplified' as any,
                    })
                  }
                />

                {/* Traditional Radio */}
                <Radio
                  name={key}
                  id={`${key}-traditional`}
                  checked={val === 'traditional'}
                  value="traditional"
                  onChange={() =>
                    dispatchRules({
                      type: key as keyof Rules,
                      payload: 'traditional' as any,
                    })
                  }
                />
              </div>
            ) : typeof val === 'boolean' ? (
              <div id={key} className="flex items-center gap-3">
                <Switch
                  label={`${key}Switcher`}
                  value={val}
                  onChange={(newVal) =>
                    dispatchRules({
                      type: key as keyof Rules,
                      payload: newVal as any,
                    })
                  }
                />
              </div>
            ) : typeof val === 'string' ? (
              <div className="flex items-center">
                {/* Text Input */}
                <input
                  placeholder="Please input"
                  className="rounded-sm border bg-white px-2 py-1 text-xs tracking-wide outline-0 transition-colors hover:border-green-600 focus:border-green-600 dark:border-gray-500 dark:bg-gray-800 dark:hover:border-emerald-400 dark:focus:border-emerald-400"
                  type="text"
                  name={key}
                  id={key}
                  value={val}
                  onChange={(e) =>
                    dispatchRules({
                      type: key as keyof Rules,
                      payload: e.target.value as any,
                    })
                  }
                />
              </div>
            ) : (
              // Abbrs
              <div></div>
            )}
          </li>
        ))}
        <li>
          <Button
            id="reset-config-btn"
            type="danger"
            onClick={() => dispatchRules({ type: 'reset', payload: null })}
          >
            Reset
          </Button>
        </li>
      </ul>
    </details>
  )
})
