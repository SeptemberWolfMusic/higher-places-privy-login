// Wolf Machine – Universal Mobile Wallet Connector (Production, paste-only)
// github.com/SeptemberWolfMusic  |  (c) 2025 Wolf Machine & SWM 

(function () {
  // Attach handler to Connect button if present
  document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("wallet-flip");
  if (btn) {
    btn.onclick = async () => {
   const provider =
  (window.phantom?.solana?.isPhantom && window.phantom.solana) ||
  (window.solflare?.isSolflare && window.solflare) ||
  (window.backpack?.solana && window.backpack.solana) ||
  null;


      if (provider) {
        await provider.connect(); // no modal fallback here
      } else {
        showWolfWalletConnectModal();
      }
    };
  }
});
})();
