import { EVMResult, getActivePrecompiles } from "@ethereumjs/evm";
import { EVMOpts } from "@ethereumjs/evm/dist/evm";
import { CustomPrecompile } from "@ethereumjs/evm/dist/precompiles";
import { Opcode } from "@ethereumjs/evm/src/opcodes";
import {AsyncEventEmitter} from "@ethereumjs/util"
import { EVMEvents } from "@ethereumjs/evm/src/types";
import { Bloom, RunTxResult } from "@ethereumjs/vm";
import { Stack} from 'util/stack'

export type OpcodeList = Map<number, Opcode>
type OpcodeEntry = { [key: number]: { name: string; isAsync: boolean; dynamicGas: boolean } }
type OpcodeEntryFee = OpcodeEntry & { [key: number]: { fee: number } }

export class EVM {

  // state & storage
  memory: number[] = []
  storage: number[] = []
  counter: number = 0
  balance: number = 0
  stack: Stack<number>
  instructions: any[] = []
  caller: number = 0
  value: number = 0
  calldata: number[] = []
  block: number = 0

  protected readonly _customPrecompiles?: CustomPrecompile[]

  public readonly _emit: (topic: string, data: any) => Promise<void>
  
  public eei: any
  public readonly events: AsyncEventEmitter<EVMEvents>
  opcodes: OpcodeEntry = {
    // 0x0 range - arithmetic ops
    // name, async
    0x00: { name: 'RETURN', isAsync: false, dynamicGas: false },
    0x01: { name: 'ADD', isAsync: false, dynamicGas: false },
    0x02: { name: 'SUB', isAsync: false, dynamicGas: false },
    0x03: { name: 'MUL', isAsync: false, dynamicGas: false },
    0x04: { name: 'DIV', isAsync: false, dynamicGas: false },
    0x05: { name: 'MOD', isAsync: false, dynamicGas: false },
    // bit ops
    0x06: { name: 'LT', isAsync: false, dynamicGas: false },
    0x07: { name: 'GT', isAsync: false, dynamicGas: false },
    0x08: { name: 'EQ', isAsync: false, dynamicGas: false },
    0x09: { name: 'ISZERO', isAsync: false, dynamicGas: false },
    0x0a: { name: 'AND', isAsync: false, dynamicGas: false },
    0x0b: { name: 'OR', isAsync: false, dynamicGas: false },
    0x0c: { name: 'XOR', isAsync: false, dynamicGas: false },
    0x0d: { name: 'NOT', isAsync: false, dynamicGas: false },
    // closure state
    0x0e: { name: 'BALANCE', isAsync: true, dynamicGas: false },
    0x0f: { name: 'CALLER', isAsync: true, dynamicGas: false },
    0x10: { name: 'CALLVALUE', isAsync: true, dynamicGas: false },
    0x11: { name: 'CALLDATALOAD', isAsync: true, dynamicGas: false },
    // block operation
    0x12: { name: 'BLOCKNUM', isAsync: true, dynamicGas: false },
    // storage
    0x13: { name: 'POP', isAsync: false, dynamicGas: false },
    0x14: { name: 'MLOAD', isAsync: false, dynamicGas: false },
    0x15: { name: 'MSTORE', isAsync: false, dynamicGas: false },
    0x16: { name: 'SLOAD', isAsync: true, dynamicGas: false },
    0x17: { name: 'SSTORE', isAsync: true, dynamicGas: false },
    0x18: { name: 'JUMP', isAsync: false, dynamicGas: false },
    0x19: { name: 'JUMPI', isAsync: false, dynamicGas: false },
    // range
    0x1a: { name: 'PUSH', isAsync: false, dynamicGas: false },
    0x1b: { name: 'DUP', isAsync: false, dynamicGas: false },
    0x1c: { name: 'SWAP', isAsync: false, dynamicGas: false },
    0x1d: { name: 'REVERT', isAsync: false, dynamicGas: false }
  }

  async runCall(instructions: any[], caller: number, value:number = 0, calldata: number[] = [], block = 0): Promise<RunTxResult> {
    // load opcodes
    // this.instructions = instructions
    this.caller = caller
    this.value = value
    this.calldata = calldata
    this.block = block
    // dummy result
    const result: RunTxResult = {
      bloom: new Bloom(),
      amountSpent: 0n,
      receipt: {
        status: 1,
        logs: [],
        bitvector: Buffer.from(''),
        cumulativeBlockGasUsed: 0n
      },
      totalGasSpent: 0n,
      gasRefund: 0n,
      minerValue: 0n,
      execResult: {
        executionGasUsed: 0n,
        returnValue: Buffer.from(''),
      }
    }
    return result
  }

  public async runStep() {
    // implement stack machine here
    const opcode = this.instructions[this.counter]
    console.log(opcode)
    if (opcode?.name == 'RETURN') {

    } else if (opcode?.name == 'ADD') {
      const v1 = this.stack.pop()
      const v2 = this.stack.pop()
      const v3 = v1 + v2
      this.stack.push(v3)
    } else if (opcode?.name == 'SUB') {
      const v1 = this.stack.pop()
      const v2 = this.stack.pop()
      const v3 = v1 - v2
      this.stack.push(v3)
    } else if (opcode?.name == 'MUL') {
      const v1 = this.stack.pop()
      const v2 = this.stack.pop()
      const v3 = v1 * v2
      this.stack.push(v3)
    } else if (opcode?.name == 'DIV') {
      const v1 = this.stack.pop()
      const v2 = this.stack.pop()
      const v3 = v1 / v2
      this.stack.push(v3)
    } else if (opcode?.name == 'MOD') {
      const v1 = this.stack.pop()
      const v2 = this.stack.pop()
      const v3 = v1 % v2
      this.stack.push(v3)
    } else if (opcode?.name == 'LT') {
      const v1 = this.stack.pop()
      const v2 = this.stack.pop()
      const v3 = v1 < v2 ? 1 : 0
      this.stack.push(v3)
    } else if (opcode?.name == 'GT') {
      const v1 = this.stack.pop()
      const v2 = this.stack.pop()
      const v3 = v1 > v2 ? 1 : 0
      this.stack.push(v3)
    } else if (opcode?.name == 'EQ') {
      const v1 = this.stack.pop()
      const v2 = this.stack.pop()
      const v3 = v1 == v2 ? 1 : 0
      this.stack.push(v3)
    } else if (opcode?.name == 'ISZERO') {
      const v1 = this.stack.pop()
      const v3 = v1 == 0 ? 1 : 0
      this.stack.push(v3)
    } else if (opcode?.name == 'AND') {
      const v1 = this.stack.pop()
      const v2 = this.stack.pop()
      const v3 = v1 & v2
      this.stack.push(v3)
    } else if (opcode?.name == 'OR') {
      const v1 = this.stack.pop()
      const v2 = this.stack.pop()
      const v3 = v1 | v2
      this.stack.push(v3)
    } else if (opcode?.name == 'XOR') {
      const v1 = this.stack.pop()
      const v2 = this.stack.pop()
      const v3 = v1 ^ v2
      this.stack.push(v3)
    } else if (opcode?.name == 'NOT') {
      const v1 = this.stack.pop()
      const v3 = ~v1
      this.stack.push(v3)
    } else if (opcode?.name == 'BALANCE') {
      this.stack.push(this.balance)
    } else if (opcode?.name == 'CALLER') {
      this.stack.push(this.caller)
    } else if (opcode?.name == 'CALLVALUE') {
      this.stack.push(this.value)
    } else if (opcode?.name == 'CALLDATALOAD') {
      const idx = this.stack.pop()
      this.stack.push(this.calldata[idx])
    } else if (opcode?.name == 'BLOCKNUM') {
      this.stack.push(this.block)
    } else if (opcode?.name == 'POP') {
      this.stack.pop()
    } else if (opcode?.name == 'MLOAD') {
      const idx = this.stack.pop()
      const mem = this.memory[parseInt(idx.toString())]
      this.stack.push(mem)
    } else if (opcode?.name == 'MSTORE') {
      const idx = this.stack.pop()
      const val = this.stack.pop()
      this.memory[parseInt(idx.toString())] = val
    } else if (opcode?.name == 'SLOAD') {
      const idx = this.stack.pop()
      const val = this.storage[parseInt(idx.toString())]
      this.stack.push(val)
    } else if (opcode?.name == 'SSTORE') {
      const idx = this.stack.pop()
      const val = this.stack.pop()
      this.storage[parseInt(idx.toString())] = val
    } else if (opcode?.name == 'JUMP') {
      const idx = this.stack.pop()
      this.counter = idx
    } else if (opcode?.name == 'JUMPI') {
      const idx = this.stack.pop()
      const val = this.stack.pop()
      if (val != 0) {
        this.counter = idx
      }
    } else if (opcode?.name == 'PUSH') {
      this.stack.push(opcode.value)
    } else if (opcode?.name == 'DUP') {
      const val = this.stack.peek()
      this.stack.push(val)
    } else if (opcode?.name == 'SWAP') {
      const v1 = this.stack.pop()
      const v2 = this.stack.pop()
      this.stack.push(v2)
      this.stack.push(v1)
    } else if (opcode?.name == 'REVERT') {
      // should halt
    } 
    this.counter += 1
    // hook
    await this._emit('step', { stack: this.stack, memory: this.memory, pc: this.counter, storage: this.storage })
  }

  getActiveOpcodes(): OpcodeList {
    const opcodeList: OpcodeList = new Map<number, Opcode>()
    for (const key of Object.keys(this.opcodes)) {
      const opcode = this.opcodes[parseInt(key)]
      opcodeList.set(parseInt(key), new Opcode({
        ...opcode,
        fullName: opcode.name,
        fee: 1,
        code: parseInt(key)
      }))
    }
    return opcodeList
  }

  public get precompiles() {
    const _precompiles: Map<string,any> = new Map<string,any>()
    return _precompiles
  }

  public resetState() {
    this.stack = new Stack<number>()
    this.memory = new Array<number>(32)
    this.storage = new Array<number>(32)
    this.counter = 0
    this.balance = 0
    this.calldata = []
    this.value = 0
  }

  constructor() {
    this.events = new AsyncEventEmitter()
    this._emit = async (topic: string, data: any): Promise<void> => {
      return new Promise((resolve) => this.events.emit(topic as keyof EVMEvents, data, resolve))
    }
    this.stack = new Stack<number>()
    this.storage = new Array<number>(32)
    this.memory = new Array<number>(32)
    this.counter = 0
  }

  
}