(function () {
  // Email validation for mobile
  window.submitEmailAndScrollMobile = function() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();

    // Basic email validation
    if (!email || !email.includes("@") || !email.includes(".")) {
      alert("❌ Please enter a valid email.");
      return;
    }
    if (!window.walletAddress) {
      alert("❌ Please connect your wallet before submitting.");
      return;
    }
    buyerName = name;
    buyerEmail = email;
    alert("✅ Email saved!");

    const video = document.getElementById("preview-video");
    if (video) {
      const scrollTarget = video.offsetTop + video.offsetHeight * 0.4;
      window.scrollTo({ top: scrollTarget, behavior: "smooth" });
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    const ua = navigator.userAgent.toLowerCase();
    const isPhantomInApp = ua.includes("phantom") && window.navigator.userAgent.includes("Phantom");
    const isSolflareInApp = ua.includes("solflare") && window.navigator.userAgent.includes("Solflare");
    const isBackpackInApp = ua.includes("backpack") && window.navigator.userAgent.includes("Backpack");
    const btn = document.getElementById("wallet-flip-mobile");
    if (btn) {
      btn.onclick = null;
      btn.addEventListener("click", async function(event) {
        event.preventDefault();
        if (isPhantomInApp && window.solana && window.solana.isPhantom && window.solana.connect) {
          await window.solana.connect();
          walletAddress = window.solana.publicKey.toString();
          afterWalletConnect();
        } else if (isSolflareInApp && window.solflare && window.solflare.isSolflare && window.solflare.connect) {
          await window.solflare.connect();
          walletAddress = window.solflare.publicKey.toString();
          afterWalletConnect();
        } else if (isBackpackInApp && window.backpack && window.backpack.connect) {
          await window.backpack.connect();
          walletAddress = window.backpack.publicKey.toString();
          afterWalletConnect();
        } else if (typeof window.showWolfWalletConnectModal === "function") {
          window.showWolfWalletConnectModal();
        }
      });
    }

    // Hide "Create Wallet" link in wallet browsers
    if (isPhantomInApp || isSolflareInApp || isBackpackInApp) {
      const createWalletLine = document.querySelector(".link-line");
      if (createWalletLine) createWalletLine.style.display = "none";
    }
  });
})();
