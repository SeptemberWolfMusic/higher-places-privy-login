(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("wallet-flip-mobile");
    if (btn) {
      btn.style.display = "block";
      btn.onclick = null;
      btn.addEventListener("click", function(event) {
        event.preventDefault();
        if (typeof window.showWolfWalletConnectModal === "function") {
          window.showWolfWalletConnectModal();
        }
      });
    }
  });
})();
