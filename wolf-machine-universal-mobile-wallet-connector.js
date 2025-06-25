alert('MOBILE JS LOADED');
import { WalletConnectWalletAdapter } from './adapters.js';

// Wolf Machine – Universal Mobile Wallet Connector
// github.com/SeptemberWolfMusic  |  (c) 2025 Wolf Machine & SWM 

(function () {
  // Detect mobile
  function isMobile() {
    return /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(navigator.userAgent);
  }
  if (!isMobile()) return;

// For testing: always show modal on connect wallet click (mobile)
window.handleWalletFlip = function() {
  showWolfUniversalWalletConnectModal();
};

  // Attach handler to Connect button if present
  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("wallet-flip");
    if (btn) btn.onclick = handleWalletFlip;
  });

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

 // 3. Universal Wallet Connect Modal UI
function showWolfUniversalWalletConnectModal() {
  console.log('Modal function called!');
  log("Showing universal wallet connect modal.");
  const modalStyle = `
    position:fixed;top:0;left:0;width:100vw;height:100vh;
    background:#97948fEE;display:flex;align-items:center;justify-content:center;z-index:9999;`;
  const cardStyle = `
    background:#97948f;padding:2.6rem 2.6rem 1.5rem 2.6rem;
    border-radius:26px;box-shadow:0 4px 32px #3b2a241c;
    min-width:400px;max-width:98vw;text-align:center;min-height:220px;`;
  const headerStyle = `
    color:#faf7f7;font-size:1.11rem;font-weight:600;margin-bottom:1.0rem;letter-spacing:.01em;`;
  const walletNameStyle = `
    margin-bottom:1rem;font-size:1.2rem;color:#50c7c0;font-weight:700;`;
  const closeBtnStyle = `
    margin-top:1.2rem;background:#50c7c0;color:#2b1f1a;
    padding:0.7rem 2rem;border-radius:12px;font-weight:700;cursor:pointer;border:none;font-size:1.1rem;`;
  const footerStyle = `margin-top:1.05rem;font-size:.80rem;color:#faf7f7;opacity:0.78;letter-spacing:0.01em;`;
  const starStyle = `color:#ffd700;font-size:1.05em;`;

  let modal = document.createElement("div");
  modal.id = "wolf-wallet-connect-modal";
  modal.setAttribute("style", modalStyle);
  modal.innerHTML = `
    <div style="${cardStyle}">
      <div style="${headerStyle}">Connect to your wallet:</div>
      <div id="detected-wallet-name" style="${walletNameStyle}">Detecting...</div>
      <button id="modal-close-btn" style="${closeBtnStyle}">Close</button>
      <div style="${footerStyle}">
        Powered by Wolf Machine & SWM <span style="${starStyle}">✦</span> Made with LOVE
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Close button handler
  document.getElementById("modal-close-btn").onclick = () => {
    document.getElementById("wolf-wallet-connect-modal").remove();
  };

  // Detect and display wallet name dynamically
  setTimeout(() => {
    let detectedName = "No wallet detected";
    if (wcAdapter && wcAdapter.publicKey) detectedName = "Wallet Connected";
    else if (window.solana && window.solana.isPhantom) detectedName = "Phantom";
    else if (window.solflare && window.solflare.isSolflare) detectedName = "Solflare";
    else if (window.WalletConnectSolanaAdapter) detectedName = "WalletConnect";
    document.getElementById("detected-wallet-name").innerText = detectedName;
  }, 500);
}

  // After connect, update app state
  function afterWalletConnect() {
    // Save wallet to localStorage for resume
    localStorage.setItem("wolf_wallet_address", walletAddress);
    // Remove modal if open
    const modal = document.getElementById("wolf-wallet-connect-modal");
    if (modal) modal.remove();
    // Callback if defined
    if (window.onWolfWalletConnected) window.onWolfWalletConnected(walletAddress);
  }

  // Main auto-connect logic
  (async function main() {
    // Step 1: Try to restore session
    if (await restoreWalletConnect()) return;
    // Step 2: Try fresh WalletConnect session
    if (await connectWalletConnect()) return;
    // Step 3: Show universal modal for manual/prompt connect
    showWolfUniversalWalletConnectModal();
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
    if (window.onWolfWalletDisconnected) window.onWolfWalletDisconnected();
  };

   // Expose handleWalletFlip for button
window.handleWalletFlip = async function() {
  console.log("flip clicked"); // Console log
  if (window.logToScreen) window.logToScreen("flip clicked"); // On-screen log
  // If wallet connected, disconnect first
  if (
    walletAddress &&
    (
      (window.solana && window.solana.isConnected) ||
      (window.solflare && window.solflare.isConnected) ||
      (window.walletConnectProvider && window.walletConnectProvider.isConnected)
    )
  ) {
    await window.wolfMachineMobileDisconnect();
    return;
  }
  // Show modal directly to connect wallet (for design/testing)
  showWolfUniversalWalletConnectModal();
};
  // --- Wolf Universal Modal Placeholder ---
// function showWolfUniversalWalletConnectModal() {
//   alert("Modal would open here! (Design Mode)");
// }

})();

// --- On-page logger for mobile (shows logs at screen bottom) ---
(function() {
  const logContainer = document.createElement('div');
  logContainer.style.position = 'fixed';
  logContainer.style.bottom = '0';
  logContainer.style.left = '0';
  logContainer.style.width = '100%';
  logContainer.style.maxHeight = '150px';
  logContainer.style.overflowY = 'auto';
  logContainer.style.background = 'rgba(0,0,0,0.7)';
  logContainer.style.color = '#fff';
  logContainer.style.fontSize = '12px';
  logContainer.style.fontFamily = 'monospace';
  logContainer.style.zIndex = '9999999';
  logContainer.style.padding = '5px';
  document.body.appendChild(logContainer);

  window.logToScreen = function(msg) {
    const line = document.createElement('div');
    line.textContent = msg;
    logContainer.appendChild(line);
    logContainer.scrollTop = logContainer.scrollHeight;
  };
