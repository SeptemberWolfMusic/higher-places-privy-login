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
      btn.addEventListener("click", async function(event) {
        event.preventDefault();
        if (!isMobile && isPhantom && window.solana && window.solana.connect) {
          try {
            await window.solana.connect();
          } catch {
            alert("Phantom connection canceled.");
          }
        } else if (!isMobile && isSolflare && window.solflare && window.solflare.connect) {
          try {
            await window.solflare.connect();
          } catch {
            alert("Solflare connection canceled.");
          }
        } else if (!isMobile && isBackpack && window.backpack && window.backpack.connect) {
          try {
            await window.backpack.connect();
          } catch {
            alert("Backpack connection canceled.");
          }
        } else if (typeof window.showWolfWalletConnectModal === "function") {
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
