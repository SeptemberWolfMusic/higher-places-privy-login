alert('MOBILE JS LOADED');
import { WalletConnectWalletAdapter } from './adapters.js';

// Wolf Machine – Universal Mobile Wallet Connector
// github.com/SeptemberWolfMusic  |  (c) 2025 Wolf Machine & SWM 

// NOTE: This file only detects mobile and triggers the modal. 
// All wallet connect logic now lives in wolf-machine-mobile-wallet-modal.js

(function () {
  // Detect mobile
  function isMobile() {
    return /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(navigator.userAgent);
  }
  if (!isMobile()) return;

  // Attach handler to Connect button if present
  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("wallet-flip");
    if (btn) btn.onclick = handleWalletFlip;
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

  // Call your modal from the new modal file
  window.handleWalletFlip = function() {
    showWolfWalletConnectModal(); // function from wolf-machine-mobile-wallet-modal.js
  };

  // After connect, update app state
  function afterWalletConnect() {
    localStorage.setItem("wolf_wallet_address", walletAddress);
    const modal = document.getElementById("wolf-wallet-connect-modal");
    if (modal) modal.remove();
    if (window.onWolfWalletConnected) window.onWolfWalletConnected(walletAddress);
  }

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

})();
