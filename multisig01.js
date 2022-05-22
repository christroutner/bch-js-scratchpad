/*
  Scratchpad trying to generate a 2-of-3 multisig address.

  Following this example:
  https://github.com/bitpay/bitcore/blob/master/packages/bitcore-lib-cash/docs/examples.md#create-a-2-of-3-multisig-p2sh-address
*/

const BCHJS = require('@psf/bch-js')
const bchjs = new BCHJS()

const bitcore = require('bitcore-lib-cash')

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
    const alicePrivKey = bchjs.HDNode.toWIF(aliceNode)
    const alicePubKey = new bitcore.PrivateKey(alicePrivKey).toPublicKey()

    // Create public key for Bob
    const bobSeed = await bchjs.Mnemonic.toSeed(bobMnemonic)
    const bobHDNode = bchjs.HDNode.fromSeed(bobSeed)
    const bobNode = bchjs.HDNode.derivePath(bobHDNode, "m/44'/145'/0'/0/0")
    const bobPrivKey = bchjs.HDNode.toWIF(bobNode)
    const bobPubKey = new bitcore.PrivateKey(bobPrivKey).toPublicKey()

    // Create public key for Sam
    const samSeed = await bchjs.Mnemonic.toSeed(samMnemonic)
    const samHDNode = bchjs.HDNode.fromSeed(samSeed)
    const samNode = bchjs.HDNode.derivePath(samHDNode, "m/44'/145'/0'/0/0")
    const samPrivKey = bchjs.HDNode.toWIF(samNode)
    const samPubKey = new bitcore.PrivateKey(samPrivKey).toPublicKey()

    const tempPubKey = samPubKey.toString()
    console.log('tempPubKey: ', tempPubKey)

    let temp2PubKey = bitcore.PublicKey(tempPubKey)
    temp2PubKey = temp2PubKey.toString()
    console.log('temp2PubKey: ', temp2PubKey)

    const publicKeys = [
      alicePubKey,
      bobPubKey,
      samPubKey,
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
