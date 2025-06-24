// Wolf Wallet Modal (no QR, just paste/connect WMSW)
function showWolfWalletConnectModal() {
  const modalStyle = `
    position:fixed;top:0;left:0;width:100vw;height:100vh;
    background:#97948fEE;display:flex;align-items:center;justify-content:center;z-index:9999;`;
  const cardStyle = `
    background:#97948f;padding:2.6rem 2.6rem 1.5rem 2.6rem;
    border-radius:26px;box-shadow:0 4px 32px #3b2a241c;
    min-width:400px;max-width:98vw;text-align:center;min-height:220px;`;
  const headerStyle = `
    color:#faf7f7;font-size:1.11rem;font-weight:600;margin-bottom:1.0rem;letter-spacing:.01em;`;
  const inputStyle = `
    width:93%;font-size:1.12rem;margin:1rem 0 0.3rem 0;padding:0.68rem 1rem;
    border-radius:10px;border:1.5px solid #50c7c0;background:#3b2a24;color:#faf7f7;`;
  const connectBtnStyle = `
    margin-top:0.8rem;background:#50c7c0;color:#2b1f1a;padding:0.7rem 1.8rem;
    border-radius:12px;font-weight:700;cursor:pointer;border:none;font-size:1.1rem;`;
  const closeBtnStyle = `
    margin-top:0.7rem;background:#50c7c0;color:#2b1f1a;
    padding:0.9rem 2.1rem;border-radius:12px;font-weight:700;cursor:pointer;border:none;font-size:1.1rem;`;
  const footerStyle = `margin-top:1.05rem;font-size:.80rem;color:#faf7f7;opacity:0.78;letter-spacing:0.01em;`;
  const starStyle = `color:#ffd700;font-size:1.05em;`;

  let modal = document.createElement("div");
  modal.id = "wolf-wallet-connect-modal";
  modal.setAttribute("style", modalStyle);
  modal.innerHTML = `
    <div style="${cardStyle}">
      <div style="${headerStyle}">
        No wallet detected.<br/>
        <a href="${createWalletURL}" target="_blank" style="color:#50c7c0;text-decoration:underline;">Click to create one instead</a>.
        <br/><br/>Paste your Wolf Wallet address below to connect:
      </div>
      <input id="wolf-wallet-paste" type="text" placeholder="Paste your Wolf Wallet address" style="${inputStyle}" autocomplete="off"/>
      <button id="wolf-wallet-connect-btn" style="${connectBtnStyle}">Connect</button>
      <button onclick="document.getElementById('wolf-wallet-connect-modal').remove()" style="${closeBtnStyle}">Close</button>
      <div style="${footerStyle}">
        Powered by Wolf Machine & SWM <span style="${starStyle}">✦</span> Made with LOVE
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('wolf-wallet-connect-btn').onclick = () => {
    const pasted = document.getElementById('wolf-wallet-paste').value.trim();
    if (!pasted || pasted.length < 32) {
      alert("Please paste a valid Wolf Wallet address.");
      return;
    }
    walletAddress = pasted;
    afterWalletConnect();
    document.getElementById('wolf-wallet-connect-modal').remove();
  };
}
