import { VMOpts } from "@ethereumjs/vm";
import { EVM } from "util/evm";

export class VM {

  readonly stateManager: any
  readonly events: any
  readonly evm: any

  static async create(opts: VMOpts): Promise<VM> {
    const vm = new this(opts)
    return vm
  }

  protected constructor(opts: VMOpts = {}) {
    this.evm = new EVM()
  }
}