// adapter.js — simplified inline-only WalletConnect adapter

import {
  BaseSignerWalletAdapter,
  WalletAdapterNetwork,
  WalletNotConnectedError,
  WalletNotReadyError,
  WalletSignTransactionError,
  WalletDisconnectionError,
  WalletWindowClosedError,
  WalletReadyState
} from '@solana/wallet-adapter-base';

import { WalletConnectWallet } from './core.js';
import { WalletConnectChainID } from './constants.js';

export const WalletConnectWalletName = 'WalletConnect';

export class WalletConnectWalletAdapter extends BaseSignerWalletAdapter {
  name = WalletConnectWalletName;
  url = 'https://walletconnect.com';
  icon = 'data:image/svg+xml;base64,...'; // your icon base64 here

  _publicKey = null;
  _connecting = false;
  _wallet = null;
  _config;
  _readyState;

  constructor(config) {
    super();
    this._config = config;
    this._readyState =
      typeof window === 'undefined' ? WalletReadyState.Unsupported : WalletReadyState.Loadable;
  }

  get publicKey() {
    return this._publicKey;
  }

  get connecting() {
    return this._connecting;
  }

  get readyState() {
    return this._readyState;
  }

  async connect() {
    if (this.connected || this.connecting) return;

    if (this._readyState !== WalletReadyState.Loadable) {
      throw new WalletNotReadyError();
    }

    this._connecting = true;

    try {
      this._wallet = new WalletConnectWallet({
        network:
          this._config.network === WalletAdapterNetwork.Mainnet
            ? WalletConnectChainID.Mainnet
            : WalletConnectChainID.Devnet,
        options: this._config.options
      });

      const { publicKey } = await this._wallet.connect();

      this._publicKey = publicKey;
      this.emit('connect', publicKey);

      // Optional: handle disconnect event internally if needed
      this._wallet.client.on('session_delete', () => this.disconnect());

    } catch (error) {
      if (error.name === 'QRCodeModalError' || error instanceof WalletWindowClosedError) {
        // suppress QR modal or window closed errors silently or handle gracefully
        throw new WalletWindowClosedError();
      }
      throw error;
    } finally {
      this._connecting = false;
    }
  }

  async disconnect() {
    if (!this._wallet) return;

    try {
      if (this._wallet.client.session) {
        await this._wallet.disconnect();
      }
    } catch (error) {
      this.emit('error', new WalletDisconnectionError(error.message, error));
    }

    this._publicKey = null;
    this.emit('disconnect');
  }

  async signTransaction(transaction) {
    if (!this._wallet) throw new WalletNotConnectedError();

    try {
      return await this._wallet.signTransaction(transaction);
    } catch (error) {
      throw new WalletSignTransactionError(error.message, error);
    }
  }

  async signAndSendTransaction(transaction) {
    if (!this._wallet) throw new WalletNotConnectedError();

    try {
      return await this._wallet.signAndSendTransaction(transaction);
    } catch (error) {
      throw new WalletSignTransactionError(error.message, error);
    }
  }
}
