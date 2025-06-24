function showWolfWalletConnectModal(walletName = null) {
  const modalStyle = `
    position:fixed;top:0;left:0;width:100vw;height:100vh;
    background:#97948fEE;display:flex;align-items:center;justify-content:center;z-index:9999;`;
  const cardStyle = `
    background:#97948f;padding:3rem 3rem 2rem 3rem;
    border-radius:26px;box-shadow:0 4px 32px #3b2a241c;
    min-width:440px;max-width:98vw;text-align:center;min-height:260px;`;
  const headerStyle = `
    color:#faf7f7;font-size:1.25rem;font-weight:600;margin-bottom:1.3rem;letter-spacing:.01em;`;
  const connectBtnStyle = `
    background:#50c7c0;color:#2b1f1a;padding:0.85rem 2.2rem;
    border-radius:14px;font-weight:700;cursor:pointer;border:none;font-size:1.25rem;min-width:220px;`;
  const closeBtnStyle = `
    margin-top:1rem;background:#50c7c0;color:#2b1f1a;
    padding:0.65rem 1.8rem;border-radius:12px;font-weight:700;cursor:pointer;border:none;font-size:1.05rem;
    min-width:100px;opacity:0.85;`;
  const footerStyle = `margin-top:1.05rem;font-size:.80rem;color:#faf7f7;opacity:0.78;letter-spacing:0.01em;`;
  const starStyle = `color:#ffd700;font-size:1.05em;`;

  let modal = document.createElement("div");
  modal.id = "wolf-wallet-connect-modal";
  modal.setAttribute("style", modalStyle);
  modal.innerHTML = `
    <div style="${cardStyle}">
      <div style="${headerStyle}">
        ${
          walletName
            ? `Connect to <strong>${walletName}</strong>`
            : `No wallet detected. <a href="https://septemberwolfmusic.github.io/wolf-machine-wallet-portal/" target="_blank" style="color:#50c7c0;text-decoration:underline;">Create one instead?</a>`
        }
      </div>
      ${
        walletName
          ? `<button id="wolf-wallet-connect-btn" style="${connectBtnStyle}">Connect</button>`
          : ``
      }
      <button id="wolf-wallet-close-btn" style="${closeBtnStyle}">Close</button>
      <div style="${footerStyle}">
        Powered by Wolf Machine & SWM <span style="${starStyle}">✦</span> Made with LOVE
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  if (walletName) {
    document.getElementById('wolf-wallet-connect-btn').onclick = () => {
      afterWalletConnect();
      document.getElementById('wolf-wallet-connect-modal').remove();
    };
  }
  document.getElementById('wolf-wallet-close-btn').onclick = () => {
    document.getElementById('wolf-wallet-connect-modal').remove();
  };
}
