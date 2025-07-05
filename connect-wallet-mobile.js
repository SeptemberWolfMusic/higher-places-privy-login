(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(ua);
    const isPhantomInApp = ua.includes("phantom") && window.navigator.userAgent.includes("Phantom");
    const isSolflareInApp = ua.includes("solflare") && window.navigator.userAgent.includes("Solflare");
    const isBackpackInApp = ua.includes("backpack") && window.navigator.userAgent.includes("Backpack");

    const btn = document.getElementById("wallet-flip-mobile");
    if (btn) {
      btn.onclick = null;
      btn.addEventListener("click", async function(event) {
        event.preventDefault();
        if (isPhantomInApp && window.solana && window.solana.isPhantom && window.solana.connect) {
          await window.solana.connect();
          walletAddress = window.solana.publicKey.toString();
          afterWalletConnect();
        } else if (isSolflareInApp && window.solflare && window.solflare.isSolflare && window.solflare.connect) {
          await window.solflare.connect();
          walletAddress = window.solflare.publicKey.toString();
          afterWalletConnect();
        } else if (isBackpackInApp && window.backpack && window.backpack.connect) {
          await window.backpack.connect();
          walletAddress = window.backpack.publicKey.toString();
          afterWalletConnect();
        } else if (typeof window.showWolfWalletConnectModal === "function") {
          window.showWolfWalletConnectModal();
        }
      });
    }

    // Hide "Create Wallet" link in wallet browsers
    if (isPhantomInApp || isSolflareInApp || isBackpackInApp) {
      const createWalletLine = document.querySelector(".link-line");
      if (createWalletLine) createWalletLine.style.display = "none";
    }
  });
})();
