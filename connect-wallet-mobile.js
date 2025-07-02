(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua);
    const isPhantom = ua.includes("phantom");
    const isSolflare = ua.includes("solflare");
    const isBackpack = ua.includes("backpack");
    const isWalletProvider = isPhantom || isSolflare || isBackpack;

    // Only run on mobile OR any wallet provider browser (even on desktop)
    if (!(isMobile || isWalletProvider)) {
      return; // Exit on regular desktop browsers
    }

    const btn = document.getElementById("wallet-flip");
    if (btn) {
      btn.style.display = "block";
      btn.onclick = null; // Remove previous (inline) handlers
      btn.addEventListener("click", function(event) {
        event.preventDefault();
        if (isPhantom && window.solana && window.solana.connect) {
          window.solana.connect();
        } else if (isSolflare && window.solflare && window.solflare.connect) {
          window.solflare.connect();
        } else if (isBackpack && window.backpack && window.backpack.connect) {
          window.backpack.connect();
        } else {
          window.showWolfWalletConnectModal();
        }
      });
    }

    // Hide "Create Wallet" paragraph in wallet browsers
    if (isWalletProvider) {
      const createWalletLine = document.querySelector(".link-line");
      if (createWalletLine) {
        createWalletLine.style.display = "none";
      }
    }
  });
})();
