// Wolf Machine – Universal Mobile Wallet Connector (Production, paste-only)
// github.com/SeptemberWolfMusic  |  (c) 2025 Wolf Machine & SWM 

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("wallet-flip");
    if (btn) {
      btn.style.display = "block";
      btn.onclick = async () => {
        // Only detect top 3 wallets
        const provider =
          (window.phantom?.solana?.isPhantom && window.phantom.solana) ||
          (window.solflare?.isSolflare && window.solflare) ||
          (window.backpack?.solana && window.backpack.solana) ||
          null;
        if (provider) {
          await provider.connect();
        } else {
          showWolfWalletConnectModal();
        }
      };
    }
  });
})();
