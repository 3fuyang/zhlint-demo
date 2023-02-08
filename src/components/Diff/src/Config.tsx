import { memo } from 'react'
import type { Dispatch } from 'react'

import { Input } from '../../Input'
import { Button } from '../../Button'
import type { Rules } from './util'
import { Radio } from '../../Radio'
import { Switch } from '../../Switch'
import { Select } from '../../Select'

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
                      type: 'unifiedPunctuation',
                      payload: 'simplified',
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
                      type: 'unifiedPunctuation',
                      payload: 'traditional',
                    })
                  }
                />
              </div>
            ) : typeof val === 'boolean' ? (
              <div id={key}>
                <Switch
                  label={`${key}Switcher`}
                  value={val}
                  onChange={(newVal) =>
                    dispatchRules({
                      type: key as 'noSinglePair',
                      payload: newVal,
                    })
                  }
                />
              </div>
            ) : typeof val === 'string' ? (
              <div className="flex items-center">
                {/* Text Input */}
                <Input
                  name={key}
                  id={key}
                  value={val}
                  onChange={(e) =>
                    dispatchRules({
                      type: key as 'halfWidthPunctuation',
                      payload: e.target.value,
                    })
                  }
                />
              </div>
            ) : (
              // Abbrs
              <div>
                <Select
                  tags={val}
                  handleDelete={(index) => {
                    const abbrsCpy = [...val]
                    abbrsCpy.splice(index, 1)
                    dispatchRules({
                      type: 'skipAbbrs',
                      payload: abbrsCpy,
                    })
                  }}
                  handleAdd={(newAbbr) => {
                    dispatchRules({
                      type: 'skipAbbrs',
                      payload: [...val, newAbbr],
                    })
                  }}
                />
              </div>
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
