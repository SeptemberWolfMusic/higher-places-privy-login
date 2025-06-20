// Hide sections initially (locked state)
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("wallet-display").style.display = "none";
  document.getElementById("email-section").style.display = "none";
  document.getElementById("purchase-section").style.display = "none";
  document.getElementById("wallet-flip").innerText = "Connect Wallet";
});

// FlowID setup - lowercase key to match backend
let flow_id = localStorage.getItem('flow_id');
if (!flow_id) {
  flow_id = ([1e7]+-1e3+-4e3+-8e3+-1e11+'')
    .replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  localStorage.setItem('flow_id', flow_id);
}

let walletAddress = "";
let buyerName = "";
let buyerEmail = "";

// Link to Create Wallet page for modal
const createWalletURL = "https://septemberwolfmusic.github.io/wolf-machine-wallet-portal/";

// Unified connect/disconnect button logic
async function handleWalletFlip() {
  // If wallet is set and Phantom is connected, disconnect first
  if (walletAddress && window.solana && window.solana.isConnected) {
    await disconnectWallet();
    return;
  }

  // Always force connect popup if not connected
  if (window.solana && window.solana.isPhantom) {
    try {
      const resp = await window.solana.connect(); // Always show popup
      walletAddress = resp.publicKey.toString();
      afterWalletConnect();
    } catch {
      alert("Phantom connection canceled.");
    }
  } else if (window.solflare && window.solflare.isSolflare) {
    try {
      await window.solflare.connect();
      walletAddress = window.solflare.publicKey.toString();
      afterWalletConnect();
    } catch {
      alert("Solflare connection canceled.");
    }
  } else {
    showWolfWalletConnectModal();
  }
}

function afterWalletConnect() {
  document.getElementById("wallet-box").innerText = walletAddress;
  document.getElementById("wallet-display").style.display = "block";
  document.getElementById("email-section").style.display = "block";
  document.getElementById("purchase-section").style.display = "block";
  document.getElementById("wallet-flip").innerText = "Disconnect";
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function disconnectWallet() {
  if (window.solana && window.solana.isPhantom && window.solana.disconnect) {
    try {
      await window.solana.disconnect();
      // Phantom bug workaround: forcibly reset ._connected (if present)
      if (window.solana._connected) window.solana._connected = false;
    } catch (e) {
      console.warn("Phantom disconnect failed:", e);
    }
  }
  walletAddress = "";
  document.getElementById("wallet-box").innerText = "";
  document.getElementById("wallet-display").style.display = "none";
  document.getElementById("email-section").style.display = "none";
  document.getElementById("purchase-section").style.display = "none";
  document.getElementById("wallet-flip").innerText = "Connect Wallet";
  // Force reload to ensure session is truly cleared and wallet is locked out
  window.location.reload();
}
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

// Email input handling
function submitEmailAndScroll() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!email) {
    alert("❌ Please enter a valid email.");
    return;
  }
  if (!walletAddress) {
    alert("❌ Please connect your wallet before submitting.");
    return;
  }
  buyerName = name;
  buyerEmail = email;
  alert("✅ Email saved! You can now proceed to purchase.");

  const video = document.getElementById("preview-video");
  if (video) {
    const scrollTarget = video.offsetTop + video.offsetHeight * 0.4;
    window.scrollTo({ top: scrollTarget, behavior: "smooth" });
  }
}

// FlowID generator (UUID-like)
function generateFlowID() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11+'')
    .replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

// Destructure web3 globals for simpler calls (only ONCE here)
let Connection, LAMPORTS_PER_SOL, SystemProgram, Transaction, TransactionInstruction, PublicKey, clusterApiUrl;

if (window.solanaWeb3) {
  ({
    Connection,
    LAMPORTS_PER_SOL,
    SystemProgram,
    Transaction,
    TransactionInstruction,
    PublicKey,
    clusterApiUrl
  } = window.solanaWeb3);
} else {
  alert("Solana web3.js library not loaded!");
}

// SOL payment + logging (now with Memo for flow_id)
async function sendSol() {
  if (!walletAddress) {
    alert("❌ Please connect your wallet first.");
    return;
  }
  if (!buyerEmail) {
    alert("❌ Please enter a valid email.");
    return;
  }
  const connection = new Connection(clusterApiUrl("devnet"));
  const recipient = "H1jBM1DQgCX6X8e6Ns6gVBJBfntaShuLuN5U6hwC3qXK";
  const amountInSol = 0.044;
  const lamports = amountInSol * LAMPORTS_PER_SOL;

  try {
    const provider = window.solana;
    let senderPublicKey;
    let canSign = false;
    if (provider && provider.isConnected) {
      senderPublicKey = provider.publicKey;
      canSign = true;
    } else if (walletAddress) {
      senderPublicKey = new PublicKey(walletAddress);
      canSign = false;
    } else {
      alert("❌ Please connect your wallet first.");
      return;
    }

    // Always use current flow_id from localStorage
    const flowIDToLog = localStorage.getItem('flow_id') || generateFlowID();
    localStorage.setItem('flow_id', flowIDToLog);

    console.log("lamports type:", typeof lamports, "value:", lamports);

// Transfer instruction
const transferInstruction = SystemProgram.transfer({
  fromPubkey: senderPublicKey,
  toPubkey: new PublicKey(recipient),
  lamports: lamports,
});

// Memo instruction (attaches flow_id to this tx)
    const memoInstruction = new TransactionInstruction({
      keys: [],
      programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      data: new TextEncoder().encode(flowIDToLog),
    });

    // Build transaction with both instructions
    const transaction = new Transaction().add(
      transferInstruction,
      memoInstruction
    );
    const { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = senderPublicKey;

    let txid = "";
    if (canSign) {
      const signed = await provider.signTransaction(transaction);
      txid = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(txid);
    } else {
      // For pasted WMSW (no signing, display unsigned tx warning)
      alert("Please use a wallet app to sign this transaction.");
      return;
    }

    alert("✅ Payment successful! TXID: " + txid);

    const payload = {
      email: buyerEmail,
      wallet: walletAddress,
      name: buyerName,
      flow_type: "connect",
      batch: "B01",
      edition_number: "",
      txn_id: txid,
      flow_id: flowIDToLog,
      payment_method: "crypto"
    };

    console.log("Logging payment to Supabase:", payload);

    const res = await fetch("https://xlbquzoalvwmtjadteft.functions.supabase.co/connect_log_logger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error("Failed to log payment info: " + res.status);
    }

    const data = await res.json();
    console.log("Successfully logged payment:", data);

    // Clear flow_id after successful logging to avoid duplicates
    localStorage.removeItem('flow_id');

  } catch (err) {
    console.error(err);
    alert("❌ Payment or logging failed: " + err.message);
  }
}

// Tooltip text setup on load
window.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submit-email");
  if (submitBtn) submitBtn.setAttribute("data-tooltip", "Receive your unlockable content");
  const solBtn = document.getElementById("solPurchaseBtn");
  if (solBtn) solBtn.setAttribute("data-tooltip", "Purchase your NFT");
});

// Update SOL price label
async function updateSolPriceLabel() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
    const data = await res.json();
    const solPrice = data.solana.usd;
    const solAmount = (7 / solPrice).toFixed(4);
    document.getElementById("sol-price-label").innerText = `($7 USD ≈ ${solAmount} SOL)`;
  } catch (err) {
    console.error("Failed to fetch SOL price:", err);
  }
}

updateSolPriceLabel();
