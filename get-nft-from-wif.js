/*
  This script uses minimal-slp-wallet to 'sweep' an NFT from a WIF private key.
*/

// Public npm libraries
const SlpWallet = require('minimal-slp-wallet/index')

// Constants
const WIF = process.env.TEST_WIF
const TOKEN_ID = 'eb93f05553ff088bffb0ec687519e83c59e5108c160f7c25a4b6c45109d7e40b'
const RECV_ADDR = 'bitcoincash:qrqlz63cwmu0hcmsrfnd8jemn3atkpaqds6tf4ksrr'

async function start() {
  try {
    if(!WIF) {
      throw new Error('Add WIF to the TEST_WIF env var.')
    }

    const options = {
      interface: 'consumer-api',
      // restURL: 'https://wa-usa-bch-consumer.fullstackcash.nl'
      // restURL: 'https://bc01-ca-bch-consumer.fullstackcash.nl'
      // restURL: 'https://pdx01-usa-bch-consumer.fullstackcash.nl'
    }

    const wallet = new SlpWallet(WIF, options)

    await wallet.walletInfoPromise

    console.log(`wallet info: ${JSON.stringify(wallet.walletInfo, null, 2)}`)
    console.log(`utxo store: ${JSON.stringify(wallet.utxos.utxoStore, null, 2)}`)

    const output = {
      address: RECV_ADDR,
      tokenId: TOKEN_ID,
      qty: 1
    }

    const txid = await wallet.sendTokens(output)
    console.log(`txid: ${txid}`)
  } catch(err) {
    console.error(err)
  }
}
start()
