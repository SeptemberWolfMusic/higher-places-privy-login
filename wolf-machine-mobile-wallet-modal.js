import { WalletConnectWallet } from './core.js';
export function showWolfWalletConnectModal() {
  const modalStyle = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: #FAF7F7EE; display: flex; align-items: center; justify-content: center;
    z-index: 9999; padding: 0; box-sizing: border-box;
  `;
  const cardStyle = `
    background:#97948f;padding:3.2rem 2rem 3rem 2rem;
    border-radius:22px;box-shadow:0 4px 32px #3b2a241c;
    min-width:360px; max-width:90vw; max-height:80vh; overflow-y:auto;
    text-align:center; min-height:220px; margin: auto;
  `;
  const headerStyle = `
    color:#FAF7F7;font-size:1.13rem;font-weight:600;margin-bottom:0.8rem;letter-spacing:.01em;`;
  const connectBtnStyle = `
    background:#50c7c0;color:#2b1f1a;padding:0.80rem 0.8rem;
    border-radius:13px;font-weight:700;cursor:pointer;border:none;font-size:1.14rem;min-width:180px;display:block;margin:3.5rem auto 0;`;
  const connectBtnDisabledStyle = `
    background:#888;color:#ccc;padding:0.80rem 0.8rem;
    border-radius:13px;font-weight:700;font-size:1.14rem;min-width:180px;display:block;margin:3.5rem auto 0;cursor:not-allowed;`;
  const closeBtnStyle = `
    margin-top:3rem;background:#50c7c0;color:#2b1f1a;
    padding:0.55rem 1.2rem;border-radius:10px;font-weight:700;cursor:pointer;border:none;font-size:1rem;display:block;width:auto;max-width:150px;margin:4rem auto 0;`;
  const footerStyle = `margin-top:1.05rem;font-size:.80rem;color:#faf7f7;opacity:0.78;letter-spacing:0.01em;`;
  const starStyle = `color:#ffd700;font-size:1.05em;`;
  const createLinkStyle = `color:#FAF7F7;text-decoration:underline;margin-top:0.8rem;display:block;font-size:0.85rem;`;

     // Detect wallet provider (WalletConnect only for mobile)
  let walletProvider = null;
  if (window.WalletConnectSolanaAdapter) walletProvider = "WalletConnect";

  // Main universal connect logic (WalletConnect only)
  async function connectAnyWallet() {
    try {
      if (window.WalletConnectSolanaAdapter) {
        // TODO: Insert WalletConnect logic here
        document.getElementById('wolf-wallet-connect-modal').remove();
        return;
      }
    } catch (e) {
      document.getElementById('wolf-wallet-connect-modal').remove();
      // Optionally show fallback here
    }
  }

  // Button markup
  let btnMarkup = walletProvider
    ? `<button id="wolf-wallet-connect-btn" style="${connectBtnStyle}">${walletProvider}</button>`
    : `<button id="wolf-wallet-connect-btn" style="${connectBtnDisabledStyle}" disabled>No wallet detected</button>`;

  let modal = document.createElement("div");
  modal.id = "wolf-wallet-connect-modal";
  modal.setAttribute("style", modalStyle);
  modal.innerHTML = `
    <div style="${cardStyle}">
      <div style="${headerStyle}">Connect your Solana wallet.</div>
      ${btnMarkup}
      <a href="https://septemberwolfmusic.github.io/wolf-machine-wallet-portal/" target="_blank" style="${createLinkStyle}">✨Create one instead?</a>
      <button id="wolf-wallet-close-btn" style="${closeBtnStyle}">Close</button>
      <div style="${footerStyle}">
        Powered by Wolf Machine & SWM <span style="${starStyle}">✦</span> Made with LOVE
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Attach connect handler if a wallet is found
  const btn = document.getElementById('wolf-wallet-connect-btn');
  if (walletProvider && btn) btn.onclick = connectAnyWallet;

  // Close handler
    document.getElementById('wolf-wallet-close-btn').onclick = () => {
    document.getElementById('wolf-wallet-connect-modal').remove();
  };
}

