(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("wallet-flip-mobile");
    if (btn) {
      btn.style.display = "block";
      btn.onclick = null;
      btn.addEventListener("click", async function(event) {
        event.preventDefault();
        if (window.solana && window.solana.isPhantom && window.solana.connect) {
          try {
            await window.solana.connect();
          } catch {
            alert("Phantom connection canceled.");
          }
        } else if (typeof window.showWolfWalletConnectModal === "function") {
          window.showWolfWalletConnectModal();
        }
      });
    }
  });
})();
