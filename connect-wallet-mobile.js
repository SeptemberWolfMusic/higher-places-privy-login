(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod/i.test(ua);
    const isPhantom = typeof window.solana === "object" && window.solana.isPhantom === true;
    const isSolflare = typeof window.solflare === "object" && window.solflare.isSolflare === true;
    const isBackpack = typeof window.backpack === "object";
    const isWalletProvider = isPhantom || isSolflare || isBackpack;

    const btn = document.getElementById("wallet-flip-mobile");
    if (btn) {
      btn.style.display = "block";
      btn.onclick = null;
      btn.addEventListener("click", function(event) {
        event.preventDefault();
        // On mobile, always open modal; no auto-connect attempts
        if (typeof window.showWolfWalletConnectModal === "function") {
          window.showWolfWalletConnectModal();
        }
      });
    }

    if (isWalletProvider) {
      const createWalletLine = document.querySelector(".link-line");
      if (createWalletLine) createWalletLine.style.display = "none";
    }
  });
})();
