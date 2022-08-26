import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitializeAccounts {
  baseAccount: PublicKey
  user: PublicKey
  systemProgram: PublicKey
}

export function initialize(accounts: InitializeAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.baseAccount, isSigner: true, isWritable: true },
    { pubkey: accounts.user, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([175, 175, 109, 31, 13, 152, 155, 237])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
