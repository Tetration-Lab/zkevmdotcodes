import { ExampleCode } from './types'

const examples: ExampleCode = {
  Mnemonic: [
    `CALLER
PUSH 0x00
SSTORE
CALLVALUE
PUSH 0x01
SSTORE
RETURN`,
  ],
}

export default examples
