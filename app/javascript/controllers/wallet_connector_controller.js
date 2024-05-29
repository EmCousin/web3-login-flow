import { Controller } from '@hotwired/stimulus'
import { createConfig, configureChains, watchAccount, connect, disconnect, getWalletClient } from '@wagmi/core'
import { publicProvider } from '@wagmi/core/providers/public'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { mainnet } from '@wagmi/core/chains'

export default class extends Controller {
  static targets = ["address"]

  static values = {
    projectId: { type: String, default: 'a42a3f724b5a471df91f3bb6cd32c2ab' },
    authenticityToken: String,
    accountStatus: String,
    accountAddress: String,
    signatureStatus: { type: String, default: "not_signed" },
    signature: String
  }

  connect() {
    const { publicClient, webSocketPublicClient } = configureChains(
      [mainnet],
      [publicProvider()]
    )

    this.config = createConfig({
      connectors: [this.metaMaskConnector, this.walletConnectConnector],
      autoConnect: true,
      publicClient,
      webSocketPublicClient,
    })

    watchAccount(async (account) => {
      this.accountStatusValue = account.status
      this.accountAddressValue = account.address
    })
  }

  accountStatusValueChanged(status, _previousStatus) {
    if (status === "connected") {
      this.addressTarget.textContent = this.accountAddressValue
    }
  }

  async metaMaskConnect() {
    await connect({ chainId: mainnet.id, connector: this.metaMaskConnector })
    this.sign()
  }

  async walletConnect() {
    await connect({ chainId: mainnet.id, connector: this.walletConnectConnector })
    this.sign()
  }

  async walletDisconnect() {
    await disconnect()

    const formData = new FormData()
    formData.append('authenticity_token', this.authenticityTokenValue)
    await fetch('/session', { method: 'DELETE', body: formData })
  }

  async sign() {
    const signer = await getWalletClient()
    if (!signer) return

    this.signatureStatusValue = "signing"
    try {
      const address = await this.config.connector?.getAccount()
      const nonceResponse = await fetch(`nonces/${address.toLowerCase()}`, { method: 'POST', headers: { 'Content-Type': 'application/json' } })
      const { nonce } = await nonceResponse.json()
      const message = `Login with your account. Nonce: ${nonce}`

      this.signatureValue = await signer.signMessage({ account: address.toLowerCase(), message })
      this.signatureStatusValue = "signed"

      // Send the address, message, and signature to the server
      const formData = new FormData()
      formData.append('message', message)
      formData.append('signature', this.signatureValue)
      formData.append('authenticity_token', this.authenticityTokenValue)

      const response = await fetch('/session', { method: 'POST', body: formData })
      if (response.ok) {
        // SUCCESS
      } else {
        const { error } = await response.json()
        throw new Error(error)
      }
    } catch(e) {
      this.signatureStatusValue = "error"
      console.error(e)
    }
  }

  get metaMaskConnector() {
    return new MetaMaskConnector({ chains: [mainnet] })
  }

  get walletConnectConnector() {
    return new WalletConnectConnector({ options: { projectId: this.projectIdValue } })
  }
}

