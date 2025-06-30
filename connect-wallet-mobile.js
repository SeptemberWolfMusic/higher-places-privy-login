(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const ua = navigator.userAgent.toLowerCase();
    const isWalletProvider =
      ua.includes("phantom") ||
      ua.includes("solflare") ||
      ua.includes("backpack");

    const btn = document.getElementById("wallet-flip");
    if (btn) {
      btn.style.display = "block";
      btn.onclick = () => {
        if (!isWalletProvider) {
          window.showWolfWalletConnectModal();
        }
        // In wallet browser, do nothing—native connect is handled there.
      };
    }
  });
})();
