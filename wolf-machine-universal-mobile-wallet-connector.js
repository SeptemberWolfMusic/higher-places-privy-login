import { WalletConnectWalletAdapter } from './adapter.js';
// Wolf Machine – Universal Mobile Wallet Connector
// github.com/SeptemberWolfMusic  |  (c) 2025 Wolf Machine & SWM 

(function () {
  // Detect mobile
  function isMobile() {
    return /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(navigator.userAgent);
  }
  if (!isMobile()) return;

  // Logging (optional for debug, safe to leave in)
  function log(msg) {
    try {
      window.logToScreen ? window.logToScreen(msg) : console.log(msg);
    } catch {
      // ignore
    }
  }

  // Main state
  let walletAddress = "";
  let wcAdapter = null;
  const WALLETCONNECT_PROJECT_ID = "f6d03a5b9fc3fa717f7ec61c11789111"; // Use your real projectId
  const SOL_NETWORK = "mainnet"; // or "devnet" if testing

  // 1. Try to restore any WalletConnect session from localStorage
  async function restoreWalletConnect() {
    log("Checking for existing WalletConnect session...");
    const session = localStorage.getItem("walletConnectSession");
    if (!session) return false;
    try {
      wcAdapter = new window.WalletConnectSolanaAdapter.WalletConnectWalletAdapter({
        network: SOL_NETWORK,
        projectId: WALLETCONNECT_PROJECT_ID,
        session: JSON.parse(session)
      });
      await wcAdapter.connect();
      walletAddress = wcAdapter.publicKey.toString();
      afterWalletConnect();
      log("Restored WalletConnect session: " + walletAddress);
      return true;
    } catch (e) {
      log("Failed to restore WalletConnect session: " + (e?.message || e));
      localStorage.removeItem("walletConnectSession");
      return false;
    }
  }

  // 2. Try first-time WalletConnect connect
  async function connectWalletConnect() {
    log("Starting WalletConnect session...");
    wcAdapter = new window.WalletConnectSolanaAdapter.WalletConnectWalletAdapter({
      network: SOL_NETWORK,
      projectId: WALLETCONNECT_PROJECT_ID
    });
    try {
      await wcAdapter.connect();
      walletAddress = wcAdapter.publicKey.toString();
      // Save session for next time
      if (wcAdapter.session) {
        localStorage.setItem("walletConnectSession", JSON.stringify(wcAdapter.session));
      }
      afterWalletConnect();
      log("Connected WalletConnect: " + walletAddress);
      return true;
    } catch (e) {
      log("WalletConnect connection failed: " + (e?.message || e));
      return false;
    }
  }

  // 3. Fallback: show paste modal
  function showFallbackModal() {
    log("Showing fallback modal for manual wallet paste.");
    // Simple prompt for now; replace with your preferred modal UI if needed.
    let pasted = prompt("No wallet apps detected.\nPaste your SOL wallet address to connect:");
    if (pasted && pasted.length >= 32) {
      walletAddress = pasted;
      afterWalletConnect();
      log("Manual wallet pasted: " + walletAddress);
      return true;
    }
    alert("Please paste a valid wallet address.");
    return false;
  }

  // After connect, update app state
  function afterWalletConnect() {
    // Save wallet to localStorage for resume
    localStorage.setItem("wolf_wallet_address", walletAddress);
    // You can add any UI update logic or event dispatch here
    if (window.onWolfWalletConnected) window.onWolfWalletConnected(walletAddress);
  }

  // Main auto-connect logic
  (async function main() {
    // Step 1: Try to restore session
    if (await restoreWalletConnect()) return;
    // Step 2: Try fresh WalletConnect session
    if (await connectWalletConnect()) return;
    // Step 3: Fallback to paste modal
    showFallbackModal();
  })();

  // Expose disconnect for manual reset if needed
  window.wolfMachineMobileDisconnect = async function() {
    if (wcAdapter && wcAdapter.disconnect) {
      try { await wcAdapter.disconnect(); } catch {}
    }
    localStorage.removeItem("walletConnectSession");
    localStorage.removeItem("wolf_wallet_address");
    walletAddress = "";
    log("Disconnected all mobile wallet sessions.");
    // Optionally trigger a UI refresh
    if (window.onWolfWalletDisconnected) window.onWolfWalletDisconnected();
  };
})();

