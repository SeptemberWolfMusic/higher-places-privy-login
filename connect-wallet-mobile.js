(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const isWalletProvider =
      navigator.userAgent.includes("Phantom") ||
      navigator.userAgent.includes("Solflare") ||
      navigator.userAgent.includes("Backpack");
    const provider =
      (window.phantom?.solana?.isPhantom && window.phantom.solana) ||
      (window.solflare?.isSolflare && window.solflare) ||
      (window.backpack?.solana && window.backpack.solana) ||
      null;

    const btn = document.getElementById("wallet-flip");
    if (btn) {
      btn.style.display = "block";
      btn.onclick = async () => {
        console.log('Connect Wallet button clicked');
        if (!provider && !isWalletProvider) {
          console.log("should open modal (button click, no wallet found, not in wallet browser)");
          window.showWolfWalletConnectModal();
        } else {
          if (window.phantom?.solana?.isPhantom) {
            await window.phantom.solana.connect();
          } else if (window.solflare?.isSolflare) {
            await window.solflare.connect();
          } else if (window.backpack?.solana) {
            await window.backpack.solana.connect();
          }
        }
      };
    }
  });
})();
