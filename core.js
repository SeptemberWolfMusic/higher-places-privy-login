// core.js — minimal inline WalletConnect wallet wrapper

import { WalletConnectClient } from '@walletconnect/client'; // your version
import { PublicKey, Transaction } from '@solana/web3.js';

export class WalletConnectWallet {
  client;
  publicKey = null;
  network;
  options;

  constructor({ network, options }) {
    this.network = network;
    this.options = options;
  }

  async connect() {
    this.client = await WalletConnectClient.init({
      // required client config here (e.g. relayUrl, metadata, projectId)
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
        // chain namespaces config here
        requiredNamespaces: {
          solana: {
            methods: ['solana_signTransaction', 'solana_signMessage', 'solana_signAndSendTransaction'],
            chains: [this.network === 'devnet' ? 'solana:devnet' : 'solana:mainnet'],
            events: ['connect', 'disconnect']
          }
        }
      });

      // Show URI in your UI if needed, but we want inline only — handle in UI.

      await approval(); // wait for user to approve connection
    }

    // grab publicKey from session namespaces
    const solNamespace = this.client.session.namespaces['solana'];
    const accounts = solNamespace?.accounts || [];
    const account = accounts.length ? accounts[0] : null;
    if (!account) throw new Error('No Solana account found');

    // account format: solana:<network>:<pubkey>
    const pubkeyString = account.split(':')[2];
    this.publicKey = new PublicKey(pubkeyString);

    return { publicKey: this.publicKey };
  }

  async disconnect() {
    if (!this.client) return;
    await this.client.disconnect();
    this.publicKey = null;
  }

  async signTransaction(transaction) {
    if (!this.client) throw new Error('Wallet not connected');
    // send request via WalletConnect JSON-RPC
    const serialized = transaction.serializeMessage().toString('base64');
    const signedSerialized = await this.client.request({
      topic: this.client.session.topic,
      chainId: this.network === 'devnet' ? 'solana:devnet' : 'solana:mainnet',
      request: {
        method: 'solana_signTransaction',
        params: { message: serialized }
      }
    });
    // deserialize signed transaction back
    // (handle accordingly, here just example)
    // You'll need to implement this fully as per WalletConnect spec
    throw new Error('signTransaction needs full implementation');
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
