// Wolf Machine – Universal Mobile Wallet Connector (Production, paste-only)
// github.com/SeptemberWolfMusic  |  (c) 2025 Wolf Machine & SWM 

(function () {
  // Attach handler to Connect button if present
  document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("wallet-flip");
  if (btn) {
    btn.onclick = async function() {
      const provider =
        (window.phantom && window.phantom.solana && window.phantom.solana.isPhantom && window.phantom.solana) ||
        (window.solflare && window.solflare.isSolflare && window.solflare) ||
        (window.backpack && window.backpack.solana && window.backpack.solana) ||
        (window.solana && window.solana.isTrust && window.solana) ||
        (window.solana && window.solana.isExodus && window.solana);

      if (provider) {
        try {
          await provider.connect();
          // Optionally trigger post-connect logic here
        } catch {
          showWolfWalletConnectModal();
        }
      } else {
        showWolfWalletConnectModal();
      }
    };
  }
});
