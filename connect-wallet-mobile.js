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

    if (!provider && !isWalletProvider) {
      console.log("should open modal (page load)");
      showWolfWalletConnectModal();
    }

    const btn = document.getElementById("wallet-flip");
    if (btn) {
      btn.style.display = "block";
      btn.onclick = async () => {
        if (provider) {
          await provider.connect();
        } else {
          console.log("should open modal (button click)");
          showWolfWalletConnectModal();
        }
      };
    }
  });
})();
