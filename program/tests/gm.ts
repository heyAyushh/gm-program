import * as anchor from "@project-serum/anchor";
import { Gm } from "../target/types/gm";
import assert from "assert";

// we need to access SystemProgram so that we can create the base_account
const { SystemProgram } = anchor.web3;

describe("gm", () => {
  // configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Gm as anchor.Program<Gm>;

  let _baseAccount: anchor.web3.Keypair;

  it("creates a base account for gm's", async () => {
    const baseAccount = anchor.web3.Keypair.generate();
    // call the initialize function via RPC
    const tx = await program
    .methods
    .initialize()
    .accounts({
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey
    })
    .signers([baseAccount])
    .rpc();

    // fetch the base account
    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );

    // gmCount is a "big number" type, so we need to convert it to a string
    assert.equal(account.gmCount.toString(), "0");

    _baseAccount = baseAccount;
  });

  it("receives and saves a gm message", async () => {
    const message = "gm wagmi";
    const user = provider.wallet.publicKey;

    // fetch the base account and cache how many messages are there
    const accountBefore = await program.account.baseAccount.fetch(
      _baseAccount.publicKey
    );
    const gmCountBefore = accountBefore.gmCount;

    // call the sayGm function with message
    const tx = await program
      .methods
      .sayGm(message)
      .accounts({
        baseAccount: _baseAccount.publicKey,
        user: provider.wallet.publicKey,
      })
      .rpc();

    // fetch the base account again and check that the gmCount has increased
    const accountAfter = await program.account.baseAccount.fetch(
      _baseAccount.publicKey
    );
    const gmCountAfter = accountAfter.gmCount;
    assert.equal(gmCountAfter.sub(gmCountBefore).toString(), "1");

    // fetch the gmList and check the value of the first message
    const gmList = accountAfter.gmList;
    assert.equal(gmList[0].message, message);
    assert.equal(gmList[0].user.equals(user), true); // user is an object, we can't just compare objects in JS
    assert.equal(gmList[0].timestamp.gt(new anchor.BN(0)), true); // just a loose check to see if the timestamp is greater than 0
  });
});