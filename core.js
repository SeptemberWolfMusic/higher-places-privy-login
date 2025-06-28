// core.js — minimal inline WalletConnect wallet wrapper (browser-only)

// No imports needed; all dependencies available via window (script tags)

// Attach WalletConnectWallet to window for modal JS to access
window.WalletConnectWallet = class WalletConnectWallet {
  client;
  publicKey = null;
  network;
  options;

  constructor({ network, options }) {
    this.network = network;
    this.options = options;
  }

  async connect() {
    // Use WalletConnect UMD from window
    this.client = new window.WalletConnect({ ... });
      relayUrl: 'wss://relay.walletconnect.com',
      projectId: this.options?.projectId || 'your-project-id',
      metadata: {
        name: 'Wolf Machine',
        description: 'Wolf Machine Universal Mobile Wallet Connector',
        url: 'https://septemberwolfmusic.github.io',
        icons: []
      }
    });

    // create or restore session
    if (!this.client.session) {
      const { uri, approval } = await this.client.connect({
        requiredNamespaces: {
          solana: {
            methods: ['solana_signTransaction', 'solana_signMessage', 'solana_signAndSendTransaction'],
            chains: [this.network === 'devnet' ? 'solana:devnet' : 'solana:mainnet'],
            events: ['connect', 'disconnect']
          }
        }
      });
      // Inline only—no UI for QR, approval() pauses until wallet approves
      await approval();
    }

    // grab publicKey from session namespaces
    const solNamespace = this.client.session.namespaces['solana'];
    const accounts = solNamespace?.accounts || [];
    const account = accounts.length ? accounts[0] : null;
    if (!account) throw new Error('No Solana account found');

    // account format: solana:<network>:<pubkey>
    const pubkeyString = account.split(':')[2];
    this.publicKey = new window.solanaWeb3.PublicKey(pubkeyString);

    return { publicKey: this.publicKey };
  }

  async disconnect() {
    if (!this.client) return;
    await this.client.disconnect();
    this.publicKey = null;
  }

  async signTransaction(transaction) {
    if (!this.client) throw new Error('Wallet not connected');

    // Serialize transaction message as base64 string
    const serialized = transaction.serializeMessage().toString('base64');

    // Send signTransaction request via WalletConnect
    const result = await this.client.request({
      topic: this.client.session.topic,
      chainId: this.network === 'devnet' ? 'solana:devnet' : 'solana:mainnet',
      request: {
        method: "solana_signTransaction",
        params: { transaction: serialized }
      }
    });

    // Decode the returned base64 transaction
    const signedTxBytes = Uint8Array.from(atob(result.transaction), c => c.charCodeAt(0));
    // Rebuild the Transaction object (using Solana web3.js)
    const signedTx = window.solanaWeb3.Transaction.from(signedTxBytes);

    return signedTx;
  }

  async signAndSendTransaction(transaction) {
    if (!this.client) throw new Error('Wallet not connected');

    // Serialize transaction as base64 string
    const serialized = transaction.serialize({
      requireAllSignatures: false, 
      verifySignatures: false
    }).toString('base64');

    // Send signAndSendTransaction request via WalletConnect
    const result = await this.client.request({
      topic: this.client.session.topic,
      chainId: this.network === 'devnet' ? 'solana:devnet' : 'solana:mainnet',
      request: {
        method: "solana_signAndSendTransaction",
        params: {
          transaction: serialized,
          sendOptions: { preflightCommitment: "finalized" }
        }
      }
    });

    // Return the transaction signature (txid)
    return result.signature;
  }
};
