import { Memory } from '@ethereumjs/evm/src/memory'
import { Stack } from '@ethereumjs/evm/src/stack'
import { Bloom, RunTxResult, VMEvents, VMOpts } from '@ethereumjs/vm'

import { EVM } from 'util/evm'

export class VM {
  readonly stateManager: any
  readonly events: any
  readonly evm: any

  static async create(opts: VMOpts): Promise<VM> {
    const vm = new this()
    return vm
  }

  public async runTx(
    instructions: any[],
    caller = 69,
    value = 12,
    calldata = '',
  ): Promise<RunTxResult> {
    // execute with dummy result
    const result = await this.evm.runCall(instructions, caller, value, calldata)
    return result
  }

  public loadInstructions(instructions: any[]) {
    this.evm.instructions = instructions
  }

  public resetState() {
    this.evm.resetState()
  }

  protected constructor(opts: VMOpts = {}) {
    this.evm = new EVM()
  }
}
