import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "." // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface GmMessageFields {
  message: string
  user: PublicKey
  timestamp: BN
}

export interface GmMessageJSON {
  message: string
  user: string
  timestamp: string
}

export class GmMessage {
  readonly message: string
  readonly user: PublicKey
  readonly timestamp: BN

  constructor(fields: GmMessageFields) {
    this.message = fields.message
    this.user = fields.user
    this.timestamp = fields.timestamp
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.str("message"), borsh.publicKey("user"), borsh.i64("timestamp")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new GmMessage({
      message: obj.message,
      user: obj.user,
      timestamp: obj.timestamp,
    })
  }

  static toEncodable(fields: GmMessageFields) {
    return {
      message: fields.message,
      user: fields.user,
      timestamp: fields.timestamp,
    }
  }

  toJSON(): GmMessageJSON {
    return {
      message: this.message,
      user: this.user.toString(),
      timestamp: this.timestamp.toString(),
    }
  }

  static fromJSON(obj: GmMessageJSON): GmMessage {
    return new GmMessage({
      message: obj.message,
      user: new PublicKey(obj.user),
      timestamp: new BN(obj.timestamp),
    })
  }

  toEncodable() {
    return GmMessage.toEncodable(this)
  }
}
