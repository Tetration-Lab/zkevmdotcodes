import { useContext } from 'react'

import cn from 'classnames'

import { EthereumContext } from 'context/ethereumContext'

import { toKeyIndex } from 'util/string'

import { StackBox } from 'components/ui'

type RowProps = {
  label: string
  value: string[] | string | undefined
}

const ExecutionStateRow = ({ label, value }: RowProps) => {
  const values =
    !value || value.length === 0
      ? ['']
      : Array.isArray(value)
      ? value
      : ([value] as string[])

  return (
    <>
      <dt className="mb-1 text-gray-500 dark:text-gray-400 font-medium uppercase">
        {label}
      </dt>
      <dd className="font-mono mb-2">
        {values.map((value: string, index: number) => (
          <StackBox
            key={toKeyIndex(label, index)}
            isFullWidth
            showEmpty
            value={value ? value.toString() : ''}
            className={cn(
              'break-all text-tiny border-gray-600 dark:border-gray-700 text-gray-300',
            )}
          />
        ))}
      </dd>
    </>
  )
}

const ExecutionState = () => {
  const { executionState } = useContext(EthereumContext)
  console.log('from executionstate component', executionState)
  const { memory, stack, storage } = executionState

  return (
    <div>
      <dl className="text-2xs">
        <dt className="mb-1 text-gray-500 dark:text-gray-400 font-medium uppercase">
          Memory
        </dt>
        <dd className="mb-2">
          <div
            className="inline-block border border-gray-600 dark:border-gray-700 px-2 py-1 mb-1 w-full"
            style={{ minHeight: 26 }}
          >
            <dl>
              {memory.map((value, index) => (
                <div key={`memory-${index}`}>
                  <ExecutionStateRow label="Slot" value={index.toString()} />
                  <ExecutionStateRow label="Value" value={value.toString()} />
                </div>
              ))}
            </dl>
          </div>
        </dd>
        <ExecutionStateRow label="Stack" value={stack} />

        <dt className="mb-1 text-gray-500 dark:text-gray-400 font-medium uppercase">
          Storage
        </dt>
        <dd className="mb-2">
          <div
            className="inline-block border border-gray-600 dark:border-gray-700 px-2 py-1 mb-1 w-full"
            style={{ minHeight: 26 }}
          >
            <dl>
              {storage.map((value, index) => (
                <div key={`storage-${index}`}>
                  <ExecutionStateRow label="Slot" value={index.toString()} />
                  <ExecutionStateRow label="Value" value={value.toString()} />
                </div>
              ))}
            </dl>
          </div>
        </dd>
      </dl>
    </div>
  )
}

export default ExecutionState
