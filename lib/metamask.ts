declare global {
  interface Window {
    ethereum?: any
  }
}

export interface MetaMaskAccount {
  address: string
  balance: string
}

export class MetaMaskService {
  private static instance: MetaMaskService

  static getInstance(): MetaMaskService {
    if (!MetaMaskService.instance) {
      MetaMaskService.instance = new MetaMaskService()
    }
    return MetaMaskService.instance
  }

  async isMetaMaskInstalled(): Promise<boolean> {
    return typeof window !== "undefined" && typeof window.ethereum !== "undefined"
  }

  async connectWallet(): Promise<MetaMaskAccount | null> {
    if (!(await this.isMetaMaskInstalled())) {
      throw new Error("MetaMask is not installed")
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length === 0) {
        throw new Error("No accounts found")
      }

      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })

      // Convert balance from wei to ETH
      const balanceInEth = (Number.parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4)

      return {
        address: accounts[0],
        balance: balanceInEth,
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error)
      throw error
    }
  }

  async sendTransaction(to: string, amount: string): Promise<string> {
    if (!(await this.isMetaMaskInstalled())) {
      throw new Error("MetaMask is not installed")
    }

    try {
      // Convert ETH to wei
      const amountInWei = "0x" + (Number.parseFloat(amount) * Math.pow(10, 18)).toString(16)

      const transactionHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            to: to,
            value: amountInWei,
          },
        ],
      })

      return transactionHash
    } catch (error) {
      console.error("Error sending transaction:", error)
      throw error
    }
  }

  async getAccounts(): Promise<string[]> {
    if (!(await this.isMetaMaskInstalled())) {
      return []
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      })
      return accounts
    } catch (error) {
      console.error("Error getting accounts:", error)
      return []
    }
  }

  async switchToEthereumMainnet(): Promise<void> {
    if (!(await this.isMetaMaskInstalled())) {
      throw new Error("MetaMask is not installed")
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1" }], // Ethereum Mainnet
      })
    } catch (error) {
      console.error("Error switching network:", error)
      throw error
    }
  }

  // Convert USD to ETH (mock conversion rate - in production, use real API)
  convertUsdToEth(usdAmount: number): number {
    // Mock ETH price: $2000 per ETH
    const ethPrice = 2000
    return usdAmount / ethPrice
  }
}

export const metaMaskService = MetaMaskService.getInstance()
