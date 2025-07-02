(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const ua = navigator.userAgent.toLowerCase();
    const isPhantom = ua.includes("phantom");
    const isSolflare = ua.includes("solflare");
    const isBackpack = ua.includes("backpack");
    const isWalletProvider = isPhantom || isSolflare || isBackpack;
    const isMobile = /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua);

    // Only override on mobile or wallet provider browsers
    if (isMobile || isWalletProvider) {
      const btn = document.getElementById("wallet-flip");
      if (btn) {
        btn.onclick = null; // Remove inline for these cases
        btn.addEventListener("click", function(event) {
          event.preventDefault();
          if (isPhantom && window.solana && window.solana.connect) {
            window.solana.connect();
          } else if (isSolflare && window.solflare && window.solflare.connect) {
            window.solflare.connect();
          } else if (isBackpack && window.backpack && window.backpack.connect) {
            window.backpack.connect();
          } else {
      if (typeof window.showWolfWalletConnectModal === "function") {
        window.showWolfWalletConnectModal();
       }
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
    }
  });
})();
