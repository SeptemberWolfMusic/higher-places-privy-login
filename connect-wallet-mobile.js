// Wolf Machine – Universal Mobile Wallet Connector (Production, paste-only)
// github.com/SeptemberWolfMusic  |  (c) 2025 Wolf Machine & SWM 

(function () {
  // Attach handler to Connect button if present
  document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("wallet-flip");
    if (btn) {
      btn.onclick = function() {
        showWolfWalletConnectModal(); // Always show modal on tap
      };
    }
  });
})();
