alert('MOBILE JS LOADED');
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
  let provider = null;

  window.handleWalletFlip = async function() {
    console.log('handleWalletFlip called');
    let walletName = null;
    provider = null;
    if (window.phantom && window.phantom.solana && window.phantom.solana.isPhantom) {
      provider = window.phantom.solana;
      walletName = "Phantom";
    } else if (window.solflare && window.solflare.isSolflare) {
      provider = window.solflare;
      walletName = "Solflare";
    } else if (window.backpack && window.backpack.solana) {
      provider = window.backpack.solana;
      walletName = "Backpack";
    } else if (window.solana && window.solana.isTrust) {
      provider = window.solana;
      walletName = "Trust Wallet";
    } else if (window.solana && window.solana.isExodus) {
      provider = window.solana;
      walletName = "Exodus";
    }
    // ...add more wallets here as needed

   if (provider) {
  try {
    const connectResult = await provider.connect();
    walletAddress = connectResult.publicKey
      ? connectResult.publicKey.toString()
      : provider.publicKey?.toString() || '';
    // Show modal (no argument)
    showWolfWalletConnectModal();
    // (Optional) Update your UI here with walletAddress.
    console.log('Connected:', walletName, walletAddress);
    // ---- SIGN/SEND LOGIC GOES HERE AS NEEDED ----
    // Example: let signedTx = await provider.signAndSendTransaction(transaction);
  } catch (e) {
    console.error('Wallet connect error:', e);
    showWolfWalletConnectModal(); // show error/fallback modal
  }
} else {
  showWolfWalletConnectModal(); // no wallet detected
}
  };

  function afterWalletConnect() {
    localStorage.setItem("wolf_wallet_address", walletAddress);
    const modal = document.getElementById("wolf-wallet-connect-modal");
    if (modal) modal.remove();
    if (window.onWolfWalletConnected) window.onWolfWalletConnected(walletAddress);
  }

  window.wolfMachineMobileDisconnect = async function() {
    walletAddress = "";
    localStorage.removeItem("wolf_wallet_address");
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
