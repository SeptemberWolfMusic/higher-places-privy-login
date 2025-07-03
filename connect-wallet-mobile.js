(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("wallet-flip-mobile");
    if (btn) {
      btn.style.display = "block";
      btn.onclick = null;
      btn.addEventListener("click", async function(event) {
        event.preventDefault();
        // One-line direct connect for Phantom browser only
        if (window.solana && window.solana.isPhantom && window.solana.connect) {
          await window.solana.connect();
        } else if (typeof window.showWolfWalletConnectModal === "function") {
          window.showWolfWalletConnectModal();
        }
      });
    }

    // Hide "Create Wallet" link in wallet browsers
    const isPhantom = typeof window.solana === "object" && window.solana.isPhantom === true;
    const isSolflare = typeof window.solflare === "object" && window.solflare.isSolflare === true;
    const isBackpack = typeof window.backpack === "object";
    const isWalletProvider = isPhantom || isSolflare || isBackpack;

    if (isWalletProvider) {
      const createWalletLine = document.querySelector(".link-line");
      if (createWalletLine) createWalletLine.style.display = "none";
    }
  });
})();
