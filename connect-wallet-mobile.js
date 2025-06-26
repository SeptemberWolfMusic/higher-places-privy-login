alert('MOBILE JS LOADED');
const WalletConnectWalletAdapter = window.WalletConnectSolanaAdapter?.WalletConnectWalletAdapter;

// Wolf Machine – Universal Mobile Wallet Connector
// github.com/SeptemberWolfMusic  |  (c) 2025 Wolf Machine & SWM 

(function () {
  // Attach handler to Connect button if present
  document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("wallet-flip");
    if (btn) {
      btn.onclick = handleWalletFlip;
      console.log('handleWalletFlip attached');
      if (window.logToScreen) window.logToScreen('handleWalletFlip attached');
    }
  });

  // Logging (optional)
  function log(msg) {
    try {
      window.logToScreen ? window.logToScreen(msg) : console.log(msg);
    } catch {}
  }

  // Main state
  let walletAddress = "";
  let wcAdapter = null;
  const WALLETCONNECT_PROJECT_ID = "f6d03a5b9fc3fa717f7ec61c11789111";
  const SOL_NETWORK = "mainnet";

  window.handleWalletFlip = function() {
  console.log('handleWalletFlip called');
  showWolfWalletConnectModal(); // from modal JS file
};

  function afterWalletConnect() {
    localStorage.setItem("wolf_wallet_address", walletAddress);
    const modal = document.getElementById("wolf-wallet-connect-modal");
    if (modal) modal.remove();
    if (window.onWolfWalletConnected) window.onWolfWalletConnected(walletAddress);
  }

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

})();

// On-page logger for mobile (bottom)
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

})();
