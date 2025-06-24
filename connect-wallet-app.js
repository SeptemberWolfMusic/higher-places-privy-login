// Hide sections initially (locked state)
// Always hide UI sections and set button on page load (for all devices)
document.getElementById("wallet-display").style.display = "none";
document.getElementById("email-section").style.display = "none";
document.getElementById("purchase-section").style.display = "none";
document.getElementById("wallet-flip").innerText = "Connect Wallet";

// --- OLD MOBILE PHANTOM HANDLER COMMENTED OUT ---
// document.addEventListener("DOMContentLoaded", async function() {
//   if (isMobile() && window.solana && window.solana.isPhantom) {
//     try {
//       const resp = await window.solana.connect({ onlyIfTrusted: true });
//       walletAddress = resp.publicKey.toString();
//       afterWalletConnect();
//     } catch {
//       // silent connect failed, no action needed
//     }
//   }
// });

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

function openPhantomDeepLink() {
  window.location.href =
    "phantom://app/ul/browse/https%3A%2F%2Fseptemberwolfmusic.github.io%2Fwolf-machine-wallet-portal%2Fconnect-wallet.html";
}

// --- Unified connect/disconnect button logic ---
async function handleWalletFlip() {
  // If wallet is set and Phantom/Solflare is connected, disconnect first
  if (walletAddress && (
      (window.solana && window.solana.isConnected) ||
      (window.solflare && window.solflare.isConnected) ||
      (window.walletConnectProvider && window.walletConnectProvider.isConnected)
    )) {
    await disconnectWallet();
    return;
  }

  // PHANTOM
  if (window.solana && window.solana.isPhantom) {
    try {
      const resp = await window.solana.connect();
      walletAddress = resp.publicKey.toString();
      afterWalletConnect();
      return;
    } catch {
      if (!isMobile()) alert("Phantom connection canceled.");
    }
  }

  // SOLFLARE
  if (window.solflare && window.solflare.isSolflare) {
    try {
      await window.solflare.connect();
      walletAddress = window.solflare.publicKey.toString();
      afterWalletConnect();
      return;
    } catch {
      alert("Solflare connection canceled.");
    }
  }

  // WALLETCONNECT
  if (window.WalletConnectSolanaAdapter) {
    try {
      // Project ID from WalletConnect Cloud (replace with your own if you want metrics)
      const projectId = "f6d03a5b9fc3fa717f7ec61c11789111";
      const adapter = new window.WalletConnectSolanaAdapter.WalletConnectWalletAdapter({
        network: "devnet",
        projectId // pass projectId directly here, not inside options object
      });
      await adapter.connect();
      walletAddress = adapter.publicKey.toString();
      // Expose for disconnect later
      window.walletConnectProvider = adapter;
      afterWalletConnect();
      return;
    } catch (e) {
      alert("WalletConnect canceled or failed: " + (e?.message || e));
    }
  }

  // Removed deep link fallback to enforce inline-only wallet connect flow per Wolf Machine design.
  // if (isMobile()) {
  //   openPhantomDeepLink();
  //   return;
  // }

  // Default: Show Wolf Wallet paste/connect modal
  showWolfWalletConnectModal();
}

function afterWalletConnect() {
  // Always generate a new flow_id after wallet connects
  let flow_id = generateFlowID();
  localStorage.setItem('flow_id', flow_id);

  document.getElementById("wallet-box").innerText = walletAddress;
  document.getElementById("wallet-display").style.display = "block";
  document.getElementById("email-section").style.display = "block";
  document.getElementById("purchase-section").style.display = "block";
  document.getElementById("wallet-flip").innerText = "Disconnect";
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function disconnectWallet() {
  // Phantom
  if (window.solana && window.solana.isPhantom && window.solana.disconnect) {
    try {
      await window.solana.disconnect();
      if (window.solana._connected) window.solana._connected = false;
    } catch (e) {
      console.warn("Phantom disconnect failed:", e);
    }
  }
  // Solflare
  if (window.solflare && window.solflare.isSolflare && window.solflare.disconnect) {
    try {
      await window.solflare.disconnect();
    } catch (e) {
      console.warn("Solflare disconnect failed:", e);
    }
  }
  // WalletConnect
  if (window.walletConnectProvider && window.walletConnectProvider.disconnect) {
    try {
      await window.walletConnectProvider.disconnect();
      window.walletConnectProvider = null;
    } catch (e) {
      console.warn("WalletConnect disconnect failed:", e);
    }
  }
  walletAddress = "";
  document.getElementById("wallet-box").innerText = "";
  document.getElementById("wallet-display").style.display = "none";
  document.getElementById("email-section").style.display = "none";
  document.getElementById("purchase-section").style.display = "none";
  document.getElementById("wallet-flip").innerText = "Connect Wallet";
  window.location.reload();
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
  const lamports = Math.floor(amountInSol * LAMPORTS_PER_SOL);

  try {
    // Determine provider based on connection method
    let provider = null;
    let senderPublicKey = null;
    let signAndSendTx = null;

    // Phantom
    if (window.solana && window.solana.isPhantom && window.solana.isConnected && window.solana.publicKey) {
      provider = window.solana;
      senderPublicKey = provider.publicKey;
      signAndSendTx = async tx => {
        const signed = await provider.signTransaction(tx);
        return connection.sendRawTransaction(signed.serialize());
      };
    }
    // Solflare
    else if (window.solflare && window.solflare.isSolflare && window.solflare.isConnected && window.solflare.publicKey) {
      provider = window.solflare;
      senderPublicKey = provider.publicKey;
      signAndSendTx = async tx => {
        const signed = await provider.signTransaction(tx);
        return connection.sendRawTransaction(signed.serialize());
      };
    }
    // WalletConnect
    else if (window.walletConnectProvider && window.walletConnectProvider.connected && window.walletConnectProvider.publicKey) {
      provider = window.walletConnectProvider;
      senderPublicKey = provider.publicKey;
      signAndSendTx = async tx => {
        const signed = await provider.signTransaction(tx);
        return connection.sendRawTransaction(signed.serialize());
      };
    }
    // Manual paste fallback
    else if (walletAddress) {
      alert("You connected via manual address entry. SOL payment must be done from a wallet extension.");
      return;
    } else {
      alert("❌ Please connect your wallet.");
      return;
    }

    // Always use current flow_id from localStorage
    const flowIDToLog = localStorage.getItem('flow_id') || generateFlowID();
    localStorage.setItem('flow_id', flowIDToLog);

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
    const transaction = new Transaction().add(transferInstruction, memoInstruction);
    const { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = senderPublicKey;

    let txid = "";
    // Sign and send
    txid = await signAndSendTx(transaction);
    await connection.confirmTransaction(txid);

    // Logging to Supabase (do this BEFORE alert!)
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

    // Only show alert after log is complete
    alert("Success! 🥳 Check for your Official Edition Number email with unlockable content soon.");

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

// --- On-page logger for mobile (shows logs at screen bottom) ---
(function() {
  const logContainer = document.createElement('div');
  logContainer.style.position = 'fixed';
  logContainer.style.bottom = '0';
  logContainer.style.left = '0';
  logContainer.style.width = '100%';
  logContainer.style.maxHeight = '150px';
  logContainer.style.overflowY = 'auto';
  logContainer.style.background = 'rgba(0,0,0,0.7)';
  logContainer.style.color = '#fff';
  logContainer.style.fontSize = '12px';
  logContainer.style.fontFamily = 'monospace';
  logContainer.style.zIndex = '9999999';
  logContainer.style.padding = '5px';
  document.body.appendChild(logContainer);

  window.logToScreen = function(msg) {
    const line = document.createElement('div');
    line.textContent = msg;
    logContainer.appendChild(line);
    logContainer.scrollTop = logContainer.scrollHeight;
  };
})();

