/*
  Scratchpad for a 2-of-3 multisig wallet.

  This script generates a p2sh address based on three public keys.
*/

const BCHJS = require('@psf/bch-js')
const bchjs = new BCHJS()

const bitcore = require('bitcore-lib-cash')

async function runTest() {
  try {
    const alicePubKeyStr = "02b889abdfb5c71769bda98fa6bfcd1ade92f2a5389504c6082a1d71baeecb6702"
    const bobPubKeyStr = "02130fc6b4986fe5a9dc57dc6d4ba6ee69bcf816297d5eca3c72b8ad516559ea8b"
    const samPubKeyStr = "031838c36de2695307c0270282fddbf7e910f60ee16e26d1e7a3f23d81abd6bc0b"

    const allPublicKeys = [
      new bitcore.PublicKey(alicePubKeyStr),
      new bitcore.PublicKey(bobPubKeyStr),
      new bitcore.PublicKey(samPubKeyStr),
    ]
    const requiredSignatures = 2
    const address = new bitcore.Address(allPublicKeys, requiredSignatures)
    // console.log('address: ', address)
    console.log('address: ', address.toString())


  } catch(err) {
    console.error(err)
  }
}
runTest()
