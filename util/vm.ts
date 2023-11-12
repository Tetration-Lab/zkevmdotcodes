import { Memory } from "@ethereumjs/evm/src/memory";
import { Stack } from "@ethereumjs/evm/src/stack";
import { Bloom, RunTxResult, VMEvents, VMOpts } from "@ethereumjs/vm";
import { EVM } from "util/evm";

export class VM {

  readonly stateManager: any
  readonly events: any
  readonly evm: any

  static async create(opts: VMOpts): Promise<VM> {
    const vm = new this()
    return vm
  }

  public async runTx(instructions: any[], caller: number = 69): Promise<RunTxResult> {
    // execute with dummy result
    const result = await this.evm.runCall(instructions, caller)
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