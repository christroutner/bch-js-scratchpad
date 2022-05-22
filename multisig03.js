/*
  Scratchpad to send 1000 satoshis from Alice's address to a 1-of-2 P2MS address
  that requires either Alice or Bob's signature to spend.
*/

const BCHJS = require('@psf/bch-js')
const bchjs = new BCHJS()

// bitcoincash:qqstkr2f03te8kpcr2dlxcfhhz25uum28slvdvyn4j
const aliceMnemonic = 'weekend exchange salute rocket despair cube improve work train fox degree evolve'

// bitcoincash:qq2z8psqlvfw55ttc3uqqejjsykn3qvf2ykd48vh0u
const bobMnemonic = 'cool elite air budget trial turn west midnight verify minor olive execute'

// bitcoincash:qr2jhqtnvtj8yd5gws5uexhdh6270vraaur20ate86
const samMnemonic = 'two sell word immense dignity face glove merry hen wool erupt drop'

async function runTest() {
  try {
    // Create public key for Alice
    const aliceSeed = await bchjs.Mnemonic.toSeed(aliceMnemonic)
    const aliceHDNode = bchjs.HDNode.fromSeed(aliceSeed)
    const aliceNode = bchjs.HDNode.derivePath(aliceHDNode, "m/44'/145'/0'/0/0")
    const alicePubKey = bchjs.HDNode.toPublicKey(aliceNode)

    // Create public key for Bob
    const bobSeed = await bchjs.Mnemonic.toSeed(bobMnemonic)
    const bobHDNode = bchjs.HDNode.fromSeed(bobSeed)
    const bobNode = bchjs.HDNode.derivePath(bobHDNode, "m/44'/145'/0'/0/0")
    const bobPubKey = bchjs.HDNode.toPublicKey(bobNode)

    // Create public key for Sam
    // const samSeed = await bchjs.Mnemonic.toSeed(samMnemonic)
    // const samHDNode = bchjs.HDNode.fromSeed(samSeed)
    // const samNode = bchjs.HDNode.derivePath(samHDNode, "m/44'/145'/0'/0/0")
    // const samPubKey = bchjs.HDNode.toPublicKey(samNode)

    const transactionBuilder = new bchjs.TransactionBuilder()

    const pubKey1 = bchjs.HDNode.toPublicKey(node1)
    const pubKey2 = bchjs.HDNode.toPublicKey(node2)
    const buf1 = bchjs.Script.multisig.output.encode(1, [
      alicePubKey,
      bobPubKey
    ])


    const publicKeys = [
      alicePubKey,
      bobPubKey,
      samPubKey
    ]
    const requiredSignatures = 2

    // Generate a P2SH multisig address.
    const address = new bitcore.Address(publicKeys, requiredSignatures)
    console.log(`P2SH multisig address: ${address}`)

    // Note: address is actually a Class Object. There is much more to it
    // than just the string output.
    // In a normal spend, no one signer would have all the information to
    // recreate the address object. This object would need to be serialized
    // and then deserialized by the spending app.
    // console.log('address object: ', address)

  } catch(err) {
    console.error(err)
  }
}
runTest()
