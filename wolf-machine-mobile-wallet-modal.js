export function showWolfWalletConnectModal(walletDetected = true) {
  const modalStyle = `
    position:fixed;top:0;left:0;width:100vw;height:100vh;
    background:#97948fEE;display:flex;align-items:center;justify-content:center;z-index:9999;`;
  const cardStyle = `
    background:#97948f;padding:3.8rem 2.6rem 3.5rem 2.6rem;
    border-radius:26px;box-shadow:0 4px 32px #3b2a241c;
    min-width:400px;max-width:98vw;text-align:center;min-height:320px;`;
  const headerStyle = `
    color:#faf7f7;font-size:1.13rem;font-weight:600;margin-bottom:1.1rem;letter-spacing:.01em;`;
  const connectBtnStyle = `
    background:#50c7c0;color:#2b1f1a;padding:0.80rem 2.0rem;
    border-radius:13px;font-weight:700;cursor:pointer;border:none;font-size:1.14rem;min-width:180px;display:block;margin:0 auto;`;
  const closeBtnStyle = `
    margin-top:1.8rem;background:#50c7c0;color:#2b1f1a;
    padding:0.7rem 2rem;border-radius:12px;font-weight:700;cursor:pointer;border:none;font-size:1.1rem;display:block;margin:0 auto;`;
  const footerStyle = `margin-top:1.05rem;font-size:.80rem;color:#faf7f7;opacity:0.78;letter-spacing:0.01em;`;
  const starStyle = `color:#ffd700;font-size:1.05em;`;

  let modal = document.createElement("div");
  modal.id = "wolf-wallet-connect-modal";
  modal.setAttribute("style", modalStyle);
  modal.innerHTML = `
    <div style="${cardStyle}">
      <div style="${headerStyle}">
        ${walletDetected
          ? `Connect to your Solana wallet below.`
          : `No wallet detected.<br>
            <a href="https://septemberwolfmusic.github.io/wolf-machine-wallet-portal/" target="_blank" style="color:#50c7c0;text-decoration:underline;">Create one instead?</a>`}
      </div>
      ${walletDetected
        ? `<button id="wolf-wallet-connect-btn" style="${connectBtnStyle}">Connect Wallet</button>`
        : ``}
      <button id="wolf-wallet-close-btn" style="${closeBtnStyle}">Close</button>
      <div style="${footerStyle}">
        Powered by Wolf Machine & SWM <span style="${starStyle}">✦</span> Made with LOVE
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Dynamically set connect button label based on detected wallet
  if (walletDetected) {
    let detectedName = "Connect Wallet";
    if (window.solana && window.solana.isPhantom) detectedName = "Phantom";
    else if (window.solflare && window.solflare.isSolflare) detectedName = "Solflare";
    else if (window.WalletConnectSolanaAdapter) detectedName = "WalletConnect";
    document.getElementById('wolf-wallet-connect-btn').innerText = detectedName;

    document.getElementById('wolf-wallet-connect-btn').onclick = async () => {
      try {
        // TODO: Insert your inline wallet connect logic here
        // Example: await connectWalletProviderInline();
        // On successful connect:
        // afterWalletConnect(); // Call this if accessible
        document.getElementById('wolf-wallet-connect-modal').remove();
      } catch (e) {
        document.getElementById('wolf-wallet-connect-modal').remove();
        showWolfWalletConnectModal(false);
      }
    };
  }

  // Close button handler
  document.getElementById('wolf-wallet-close-btn').onclick = () => {
    document.getElementById('wolf-wallet-connect-modal').remove();
  };
}
