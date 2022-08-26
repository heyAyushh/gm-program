import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface SayGmArgs {
  message: string
}

export interface SayGmAccounts {
  baseAccount: PublicKey
  user: PublicKey
}

export const layout = borsh.struct([borsh.str("message")])

export function sayGm(args: SayGmArgs, accounts: SayGmAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.baseAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.user, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([106, 71, 224, 176, 7, 35, 37, 116])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      message: args.message,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
