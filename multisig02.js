/*
  Scratchpad trying to spend a 2-of-3 multisig wallet.

  Following this example:
  https://github.com/bitpay/bitcore/blob/master/packages/bitcore-lib-cash/docs/examples.md#spend-from-a-2-of-2-multisig-p2sh-address

  Lessons learned:
  Required information to spend:
  - P2SH multisig address holding the coins.
  - The public key of *all* participants.
*/

const BCHJS = require('@psf/bch-js')
const bchjs = new BCHJS()

const bitcore = require('bitcore-lib-cash')

const RECEIVER_ADDR = 'bitcoincash:qp8zyck7u2lqf9ecf93ycz46rh99w8p94ctrqajwyc'

// bitcoincash:qqstkr2f03te8kpcr2dlxcfhhz25uum28slvdvyn4j
const aliceMnemonic = 'weekend exchange salute rocket despair cube improve work train fox degree evolve'

// bitcoincash:qq2z8psqlvfw55ttc3uqqejjsykn3qvf2ykd48vh0u
const bobMnemonic = 'cool elite air budget trial turn west midnight verify minor olive execute'

// bitcoincash:qr2jhqtnvtj8yd5gws5uexhdh6270vraaur20ate86
const samMnemonic = 'two sell word immense dignity face glove merry hen wool erupt drop'

async function runTest() {
  try {
    // Create a private key for Alice
    const aliceSeed = await bchjs.Mnemonic.toSeed(aliceMnemonic)
    const aliceHDNode = bchjs.HDNode.fromSeed(aliceSeed)
    const aliceNode = bchjs.HDNode.derivePath(aliceHDNode, "m/44'/145'/0'/0/0")
    const alicePrivKey = bchjs.HDNode.toWIF(aliceNode)
    const alicePubKey = bchjs.HDNode.toPublicKey(aliceNode)

    // Create HD node for Bob
    const bobSeed = await bchjs.Mnemonic.toSeed(bobMnemonic)
    const bobHDNode = bchjs.HDNode.fromSeed(bobSeed)
    const bobNode = bchjs.HDNode.derivePath(bobHDNode, "m/44'/145'/0'/0/0")
    const bobPrivKey = bchjs.HDNode.toWIF(bobNode)
    const bobPubKey = bchjs.HDNode.toPublicKey(bobNode)

    // Create HD node for Sam
    const samSeed = await bchjs.Mnemonic.toSeed(samMnemonic)
    const samHDNode = bchjs.HDNode.fromSeed(samSeed)
    const samNode = bchjs.HDNode.derivePath(samHDNode, "m/44'/145'/0'/0/0")
    const samPrivKey = bchjs.HDNode.toWIF(samNode)
    const samPubKey = bchjs.HDNode.toPublicKey(samNode)

    const alicePublicKey = new bitcore.PrivateKey(alicePrivKey).toPublicKey()
    console.log('alicePublicKey: ', alicePublicKey)

    // Regnerate the input Script
    const allPublicKeys = [
      new bitcore.PrivateKey(alicePrivKey).toPublicKey(),
      new bitcore.PrivateKey(bobPrivKey).toPublicKey(),
      new bitcore.PrivateKey(samPrivKey).toPublicKey(),
    ]
    const requiredSignatures = 2
    const address = new bitcore.Address(allPublicKeys, requiredSignatures)
    console.log('address: ', address)

    // Use 2 of the 3 private keys.
    const privateKeys = [
      new bitcore.PrivateKey(alicePrivKey),
      new bitcore.PrivateKey(bobPrivKey)
      // new bitcore.PrivateKey(samPrivKey)
    ]

    // 2 of 3 public keys.
    const publicKeys = privateKeys.map(bitcore.PublicKey)

    // Get the UTXO
    const utxos = await bchjs.Utxo.get(address.toString())
    const utxo = utxos.bchUtxos[0]
    // console.log(`utxo: ${JSON.stringify(utxo, null, 2)}`)

    // Add properties to the UTXO expected by bitcore
    utxo.outputIndex = utxo.vout
    utxo.script = new bitcore.Script(address).toHex()
    utxo.satoshis = utxo.value
    console.log(`utxo: ${JSON.stringify(utxo, null, 2)}`)

    // Generate the transaction object.
    const txObj = new bitcore.Transaction()
      .from(utxo, allPublicKeys, requiredSignatures)
      .to(RECEIVER_ADDR, 1500)
      .feePerByte(1)
      .change(address)
      .sign(privateKeys)

    // Serialize the transaction to a hex string, ready to broadcast to the network.
    // const txHex = txObj.toString()
    let txHex = txObj.toBuffer()
    txHex = txHex.toString('hex')
    console.log('hex: ', txHex)

    // Note: Attempting to broadcast the transaction results in:
    // hex:  02000000017ef119fc32cfbda48ec0e859e5e8687e12779c8e0258360f0cd2107bd03127ce0000000000ffffffff01a4060000000000001976a9143e31055173cf58d56edb075499daf29d7b488f0988ac00000000
    // { error: 'bad-txns-undersize (code 64)' }

    // Broadcast the transaction to the network.
    // const txid = await bchjs.RawTransactions.sendRawTransaction(txHex)
    // console.log(`txid: ${txid}`)

  } catch(err) {
    console.error(err)
  }
}
runTest()
