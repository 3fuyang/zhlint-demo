import type { SetStoreFunction } from 'solid-js/store'

import { Input } from '../../Input'
import { Button } from '../../Button'
import { initDefaultRules, type Rules } from './util'
import { Radio } from '../../Radio'
import { Switch as SwitchComp } from '../../Switch'
import { Select } from '../../Select'

interface CProps {
  rules: Rules
  setRules: SetStoreFunction<Rules>
}

/** TODO: Refactor with components */
export function Config(props: CProps) {
  return (
    <details class="mb-4">
      <summary class="flex w-min cursor-pointer items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="right-arrow h-4 w-4 transition-transform duration-200"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
        <h2>Configuration</h2>
      </summary>
      <ul class="grid grid-cols-1 gap-y-2 pl-6 pt-2 lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-[repeat(12,_minmax(0,_1fr))]">
        <li class="flex items-center">
          <label for="noSinglePair" class="mr-4">
            <code>noSinglePair</code>
          </label>
          <div id="noSinglePair">
            <SwitchComp
              label={`noSinglePairSwitcher`}
              value={props.rules.noSinglePair}
              onChange={(newVal) => props.setRules('noSinglePair', newVal)}
            />
          </div>
        </li>
        <li class="flex items-center">
          <label for="halfWidthPunctuation" class="mr-4">
            <code>halfWidthPunctuation</code>
          </label>
          <div id="halfWidthPunctuation">
            <Input
              name="halfWidthPunctuation"
              id="halfWidthPunctuation"
              value={props.rules.halfWidthPunctuation}
              onChange={(e) =>
                props.setRules('halfWidthPunctuation', e.currentTarget.value)
              }
            />
          </div>
        </li>
        <li class="flex items-center">
          <label for="fullWidthPunctuation" class="mr-4">
            <code>fullWidthPunctuation</code>
          </label>
          <div id="fullWidthPunctuation">
            <Input
              name="fullWidthPunctuation"
              id="fullWidthPunctuation"
              value={props.rules.fullWidthPunctuation}
              onChange={(e) =>
                props.setRules('fullWidthPunctuation', e.currentTarget.value)
              }
            />
          </div>
        </li>
        <li class="flex items-center">
          <label for="adjustedFullWidthPunctuation" class="mr-4">
            <code>adjustedFullWidthPunctuation</code>
          </label>
          <div id="adjustedFullWidthPunctuation">
            <Input
              name="adjustedFullWidthPunctuation"
              id="adjustedFullWidthPunctuation"
              value={props.rules.adjustedFullWidthPunctuation}
              onChange={(e) =>
                props.setRules(
                  'adjustedFullWidthPunctuation',
                  e.currentTarget.value
                )
              }
            />
          </div>
        </li>
        <li class="flex items-center">
          <label for="unifiedPunctuation" class="mr-4">
            <code>unifiedPunctuation</code>
          </label>
          <div id="unifiedPunctuation" class="flex items-center gap-3">
            <Radio
              name="unifiedPunctuation"
              id="unifiedPunctuation-traditional"
              checked={props.rules.unifiedPunctuation === 'traditional'}
              value="traditional"
              onChange={() =>
                props.setRules('unifiedPunctuation', 'traditional')
              }
            />

            <Radio
              name="unifiedPunctuation"
              id="unifiedPunctuation-simplified"
              checked={props.rules.unifiedPunctuation === 'simplified'}
              value="simplified"
              onChange={() =>
                props.setRules('unifiedPunctuation', 'simplified')
              }
            />
          </div>
        </li>
        <li class="flex items-center">
          <label for="skipAbbrs" class="mr-4">
            <code>skipAbbrs</code>
          </label>
          <div id="skipAbbrs">
            <Select
              tags={props.rules.skipAbbrs}
              handleDelete={(index) => {
                props.setRules('skipAbbrs', (prev) => {
                  const cpy = [...prev]
                  cpy.splice(index, 1)
                  return cpy
                })
              }}
              handleAdd={(newAbbr) => {
                props.setRules(
                  'skipAbbrs',
                  props.rules.skipAbbrs.length,
                  newAbbr
                )
              }}
            />
          </div>
        </li>
        <li class="flex items-center">
          <label for="spaceBetweenHalfWidthLetters" class="mr-4">
            <code>spaceBetweenHalfWidthLetters</code>
          </label>
          <div id="spaceBetweenHalfWidthLetters">
            <SwitchComp
              label={`spaceBetweenHalfWidthLetters`}
              value={props.rules.spaceBetweenHalfWidthLetters}
              onChange={(newVal) =>
                props.setRules('spaceBetweenHalfWidthLetters', newVal)
              }
            />
          </div>
        </li>
        <li class="flex items-center">
          <label for="noSpaceBetweenFullWidthLetters" class="mr-4">
            <code>noSpaceBetweenFullWidthLetters</code>
          </label>
          <div id="noSpaceBetweenFullWidthLetters">
            <SwitchComp
              label={`noSpaceBetweenFullWidthLetters`}
              value={props.rules.noSpaceBetweenFullWidthLetters}
              onChange={(newVal) =>
                props.setRules('noSpaceBetweenFullWidthLetters', newVal)
              }
            />
          </div>
        </li>
        <li class="flex items-center">
          <label for="spaceBetweenMixedWidthLetters" class="mr-4">
            <code>spaceBetweenMixedWidthLetters</code>
          </label>
          <div id="spaceBetweenMixedWidthLetters">
            <SwitchComp
              label={`spaceBetweenMixedWidthLetters`}
              value={props.rules.spaceBetweenMixedWidthLetters}
              onChange={(newVal) =>
                props.setRules('spaceBetweenMixedWidthLetters', newVal)
              }
            />
          </div>
        </li>
        <li class="flex items-center">
          <label for="noSpaceBeforePunctuation" class="mr-4">
            <code>noSpaceBeforePunctuation</code>
          </label>
          <div id="noSpaceBeforePunctuation">
            <SwitchComp
              label={`noSpaceBeforePunctuation`}
              value={props.rules.noSpaceBeforePunctuation}
              onChange={(newVal) =>
                props.setRules('noSpaceBeforePunctuation', newVal)
              }
            />
          </div>
        </li>
        <li class="flex items-center">
          <label for="spaceAfterHalfWidthPunctuation" class="mr-4">
            <code>spaceAfterHalfWidthPunctuation</code>
          </label>
          <div id="spaceAfterHalfWidthPunctuation">
            <SwitchComp
              label={`spaceAfterHalfWidthPunctuation`}
              value={props.rules.spaceAfterHalfWidthPunctuation}
              onChange={(newVal) =>
                props.setRules('spaceAfterHalfWidthPunctuation', newVal)
              }
            />
          </div>
        </li>
        <li class="flex items-center">
          <label for="noSpaceAfterFullWidthPunctuation" class="mr-4">
            <code>noSpaceAfterFullWidthPunctuation</code>
          </label>
          <div id="noSpaceAfterFullWidthPunctuation">
            <SwitchComp
              label={`noSpaceAfterFullWidthPunctuation`}
              value={props.rules.noSpaceAfterFullWidthPunctuation}
              onChange={(newVal) =>
                props.setRules('noSpaceAfterFullWidthPunctuation', newVal)
              }
            />
          </div>
        </li>
        <li class="flex items-center">
          <label for="spaceOutsideHalfQuote" class="mr-4">
            <code>spaceOutsideHalfQuote</code>
          </label>
          <div id="spaceOutsideHalfQuote">
            <SwitchComp
              label={`spaceOutsideHalfQuote`}
              value={props.rules.spaceOutsideHalfQuote}
              onChange={(newVal) =>
                props.setRules('spaceOutsideHalfQuote', newVal)
              }
            />
          </div>
        </li>
        <li class="flex items-center">
          <label for="noSpaceOutsideFullQuote" class="mr-4">
            <code>spaceOutsideHalfQuote</code>
          </label>
          <div id="noSpaceOutsideFullQuote">
            <SwitchComp
              label={`noSpaceOutsideFullQuote`}
              value={props.rules.noSpaceOutsideFullQuote}
              onChange={(newVal) =>
                props.setRules('noSpaceOutsideFullQuote', newVal)
              }
            />
          </div>
        </li>
        <li class="flex items-center">
          <label for="noSpaceInsideQuote" class="mr-4">
            <code>noSpaceInsideQuote</code>
          </label>
          <div id="noSpaceInsideQuote">
            <SwitchComp
              label={`noSpaceInsideQuote`}
              value={props.rules.noSpaceInsideQuote}
              onChange={(newVal) =>
                props.setRules('noSpaceInsideQuote', newVal)
              }
            />
          </div>
        </li>
        <li class="flex items-center">
          <label for="spaceOutsideHalfBracket" class="mr-4">
            <code>spaceOutsideHalfBracket</code>
          </label>
          <div id="spaceOutsideHalfBracket">
            <SwitchComp
              label={`spaceOutsideHalfBracket`}
              value={props.rules.spaceOutsideHalfBracket}
              onChange={(newVal) =>
                props.setRules('spaceOutsideHalfBracket', newVal)
              }
            />
          </div>
        </li>
        <li class="flex items-center">
          <label for="noSpaceOutsideFullBracket" class="mr-4">
            <code>noSpaceOutsideFullBracket</code>
          </label>
          <div id="noSpaceOutsideFullBracket">
            <SwitchComp
              label={`noSpaceOutsideFullBracket`}
              value={props.rules.noSpaceOutsideFullBracket}
              onChange={(newVal) =>
                props.setRules('noSpaceOutsideFullBracket', newVal)
              }
            />
          </div>
        </li>
        <li class="flex items-center">
          <label for="noSpaceInsideBracket" class="mr-4">
            <code>noSpaceInsideBracket</code>
          </label>
          <div id="noSpaceInsideBracket">
            <SwitchComp
              label={`noSpaceInsideBracket`}
              value={props.rules.noSpaceInsideBracket}
              onChange={(newVal) =>
                props.setRules('noSpaceInsideBracket', newVal)
              }
            />
          </div>
        </li>
        <li class="flex items-center">
          <label for="spaceOutsideCode" class="mr-4">
            <code>spaceOutsideCode</code>
          </label>
          <div id="spaceOutsideCode">
            <SwitchComp
              label={`spaceOutsideCode`}
              value={props.rules.spaceOutsideCode}
              onChange={(newVal) => props.setRules('spaceOutsideCode', newVal)}
            />
          </div>
        </li>
        <li class="flex items-center">
          <label for="noSpaceInsideWrapper" class="mr-4">
            <code>noSpaceInsideWrapper</code>
          </label>
          <div id="noSpaceInsideWrapper">
            <SwitchComp
              label={`noSpaceInsideWrapper`}
              value={props.rules.noSpaceInsideWrapper}
              onChange={(newVal) =>
                props.setRules('noSpaceInsideWrapper', newVal)
              }
            />
          </div>
        </li>
        <li class="flex items-center">
          <label for="trimSpace" class="mr-4">
            <code>trimSpace</code>
          </label>
          <div id="trimSpace">
            <SwitchComp
              label={`trimSpace`}
              value={props.rules.trimSpace}
              onChange={(newVal) => props.setRules('trimSpace', newVal)}
            />
          </div>
        </li>
        <li class="flex items-center">
          <label for="skipZhUnits" class="mr-4">
            <code>skipZhUnits</code>
          </label>
          <div id="skipZhUnits">
            <Input
              name="skipZhUnits"
              id="skipZhUnits"
              value={props.rules.skipZhUnits}
              onChange={(e) =>
                props.setRules('skipZhUnits', e.currentTarget.value)
              }
            />
          </div>
        </li>
        <li>
          <Button
            id="reset-config-btn"
            type="danger"
            onClick={() => {
              props.setRules(initDefaultRules)
            }}
          >
            Reset
          </Button>
        </li>
      </ul>
    </details>
  )
}
