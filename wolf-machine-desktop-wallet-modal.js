function showWolfWalletConnectModalDesktop() {
  const modalStyle = `
    position:fixed;top:0;left:0;width:100vw;height:100vh;
    background:#FAF7F7EE;display:flex;align-items:center;justify-content:center;outline: 2px solid red;z-index:9999;`;
  const cardStyle = `
    background:#97948f;padding:2.6rem 2.6rem 1.5rem 2.6rem;
    border-radius:26px;box-shadow:0 4px 32px #3b2a241c;
    min-width:400px;max-width:98vw;text-align:center;min-height:220px;`;
  const headerStyle = `
    color:#faf7f7;font-size:1.13rem;font-weight:600;margin-bottom:1.1rem;letter-spacing:.01em;`;
  const connectBtnStyle = `
    background:#50c7c0;color:#2b1f1a;padding:0.80rem 2.0rem;
    border-radius:13px;font-weight:700;cursor:pointer;border:none;font-size:1.14rem;min-width:180px;`;
  const closeBtnStyle = `
    margin-top:1.2rem;background:#50c7c0;color:#2b1f1a;
    padding:0.7rem 2rem;border-radius:12px;font-weight:700;cursor:pointer;border:none;font-size:1.1rem;`;
  const footerStyle = `margin-top:1.05rem;font-size:.80rem;color:#faf7f7;opacity:0.78;letter-spacing:0.01em;`;
  const starStyle = `color:#ffd700;font-size:1.05em;`;

  let modal = document.createElement("div");
  modal.id = "wolf-wallet-connect-modal-desktop";
  modal.setAttribute("style", modalStyle);
  modal.innerHTML = `
    <div style="${cardStyle}">
      <div style="${headerStyle}">
        Connect to your Solana wallet.
      </div>
      ${
  walletDetected
    ? `<button id="wolf-wallet-connect-btn-desktop" style="${connectBtnStyle}">Connect Wallet</button>`
    : `<button id="wolf-wallet-connect-btn-desktop" style="${connectBtnDisabledStyle}" disabled>No wallet detected</button>`
}
      <div style="${footerStyle}">
        Powered by Wolf Machine & SWM <span style="${starStyle}">✦</span> Made with LOVE
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Connect wallet handler (to be implemented)
  document.getElementById('wolf-wallet-connect-btn-desktop').onclick = () => {
    // Placeholder: insert your desktop connect logic here
    // Example: afterDesktopWalletConnect();
    document.getElementById('wolf-wallet-connect-modal-desktop').remove();
  };

  // Close handler
  document.getElementById('wolf-wallet-close-btn-desktop').onclick = () => {
    document.getElementById('wolf-wallet-connect-modal-desktop').remove();
  };
}
