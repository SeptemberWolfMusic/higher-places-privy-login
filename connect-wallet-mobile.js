alert('MOBILE JS LOADED');
// Wolf Machine – Universal Mobile Wallet Connector (Production, wallet-aware)
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("wallet-flip");
    if (btn) {
      btn.onclick = function() {
        // Detect common Solana wallet browsers
        const isWalletBrowser =
          (window.phantom && window.phantom.solana && window.phantom.solana.isPhantom) ||
          (window.solflare && window.solflare.isSolflare) ||
          (window.backpack && window.backpack.solana) ||
          (window.solana && window.solana.isTrust) ||
          (window.solana && window.solana.isExodus);

        if (isWalletBrowser) {
          // Let normal wallet connect flow continue (handled elsewhere)
          return;
        } else {
          // Not in wallet browser—show modal for copy/paste flow
          showWolfWalletConnectModal();
        }
      };
    }
  });
})();
