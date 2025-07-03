(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const ua = navigator.userAgent.toLowerCase();
    // Detect if inside Phantom's in-app browser specifically
    const isPhantomInApp = ua.includes("phantom") && window.navigator.userAgent.includes("Phantom");
    const btn = document.getElementById("wallet-flip-mobile");
    if (btn) {
  // Do not set style.display here; main HTML JS controls visibility
  btn.onclick = null;
  btn.addEventListener("click", async function(event) {
    event.preventDefault();
    // Only connect directly if truly inside Phantom's own browser
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
