import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface BaseAccountFields {
  gmCount: BN
  gmList: Array<types.GmMessageFields>
}

export interface BaseAccountJSON {
  gmCount: string
  gmList: Array<types.GmMessageJSON>
}

export class BaseAccount {
  readonly gmCount: BN
  readonly gmList: Array<types.GmMessage>

  static readonly discriminator = Buffer.from([
    16, 90, 130, 242, 159, 10, 232, 133,
  ])

  static readonly layout = borsh.struct([
    borsh.u64("gmCount"),
    borsh.vec(types.GmMessage.layout(), "gmList"),
  ])

  constructor(fields: BaseAccountFields) {
    this.gmCount = fields.gmCount
    this.gmList = fields.gmList.map((item) => new types.GmMessage({ ...item }))
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<BaseAccount | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[]
  ): Promise<Array<BaseAccount | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): BaseAccount {
    if (!data.slice(0, 8).equals(BaseAccount.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = BaseAccount.layout.decode(data.slice(8))

    return new BaseAccount({
      gmCount: dec.gmCount,
      gmList: dec.gmList.map(
        (
          item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        ) => types.GmMessage.fromDecoded(item)
      ),
    })
  }

  toJSON(): BaseAccountJSON {
    return {
      gmCount: this.gmCount.toString(),
      gmList: this.gmList.map((item) => item.toJSON()),
    }
  }

  static fromJSON(obj: BaseAccountJSON): BaseAccount {
    return new BaseAccount({
      gmCount: new BN(obj.gmCount),
      gmList: obj.gmList.map((item) => types.GmMessage.fromJSON(item)),
    })
  }
}
