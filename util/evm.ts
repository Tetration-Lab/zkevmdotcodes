import { EVMResult, getActivePrecompiles } from "@ethereumjs/evm";
import { EVMOpts } from "@ethereumjs/evm/dist/evm";
import { CustomPrecompile } from "@ethereumjs/evm/dist/precompiles";
import { Opcode } from "@ethereumjs/evm/src/opcodes";
import { EVMInterface, EVMRunCallOpts } from "@ethereumjs/evm/src/types";

export type OpcodeList = Map<number, Opcode>
type OpcodeEntry = { [key: number]: { name: string; isAsync: boolean; dynamicGas: boolean } }
type OpcodeEntryFee = OpcodeEntry & { [key: number]: { fee: number } }

export class EVM {
  protected readonly _customPrecompiles?: CustomPrecompile[]
  
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

  async runCall(): Promise<EVMResult> {
    return {
      execResult: {
        executionGasUsed: 0n,
        returnValue: Buffer.from([])
      }
    }
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

  constructor() {

  }
}