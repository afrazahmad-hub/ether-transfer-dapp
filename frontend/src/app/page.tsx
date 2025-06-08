"use client";

import { useState, useEffect } from "react";
// import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants/contract";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../constants/contract";
import { ethers } from "ethers";
import toast from "react-hot-toast";


export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [gasEstimate, setGasEstimate] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<{ to: string; amount: string; hash: string }[]>([]);


  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("User rejected the request.");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // const fetchBalance = async (address: string) => {
  //   const provider = new ethers.BrowserProvider(window.ethereum);
  //   const bal = await provider.getBalance(address);
  //   setBalance(ethers.formatEther(bal));
  // };

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setStatus(""); // Clear status on switch
      } else {
        setWalletAddress(null);
      }
    };
    
    if (typeof window.ethereum !== "undefined") {
    window.ethereum
      .request({ method: "eth_accounts" })
      .then((accounts: string[]) => {
        if (accounts.length > 0) setWalletAddress(accounts[0]);
      });

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    // Optional: cleanup listener
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }
  }, []);


  const sendEther = async () => {

    if (!walletAddress) return toast.error("Please connect your wallet first");
    if (!recipient || !amount) return toast.error("Fill in all fields");
    if (!ethers.isAddress(recipient)) {
      return toast.error("Invalid recipient address");
    }
    
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
        return toast.error("Amount must be a positive number");
    }

    if (!recipient || !amount) {
      setStatus("Please fill in both fields.");
      return;
    }
    
    try {
      setStatus("Sending...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      const feeData = await provider.getFeeData();
      console.log("Suggested fees:", feeData);
  
      toast(
        `Base Fee: ${ethers.formatUnits(feeData.gasPrice!, "gwei")} Gwei`,
        { icon: "⛽" }
      );

      // Optional gas estimation
      const txEstimate = await contract.sendEther.estimateGas(recipient, {
        value: ethers.parseEther(amount),
      });
      setGasEstimate(txEstimate.toString());

      const tx = await contract.sendEther(recipient, {
        value: ethers.parseEther(amount),
        gasLimit: txEstimate,
      });

      await tx.wait();
      setTransactions((prev) => [{ to: recipient, amount, hash: tx.hash }, ...prev,]);

      setStatus("✅ Transaction successful!");
      // toast.success("Transaction successful!");
      setRecipient("");
      setAmount("");
    } catch (err: any) {
      setStatus("❌ Error: " + (err?.message || "Transaction failed"));
      // toast.error("Transaction failed: " + err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white">
    <div className="bg-purple-200 flex flex-col items-center justify-center object-center bg-opacity-10 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md"> 
      <h1 className="text-3xl font-bold text-center mb-4 text-gray-700">SendETH - Pay Simply</h1>

      {!walletAddress ? (
        <button
          onClick={connectWallet}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Connect MetaMask
        </button>
      ) : (
        <div className="text-green-700 font-semibold">
          Connected: {walletAddress}
        </div>
      )}

      <div className="w-full max-w-md text-gray-700 p-6 rounded-xl shadow space-y-4">
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Amount in ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={sendEther}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Send Ether
        </button>
        {status && <p className="text-sm">{status}</p>}
        {gasEstimate && (
          <p className="text-xs text-gray-500">Estimated Gas: {gasEstimate}</p>
        )}
      </div>
      
      {/* Transaction Details */}
      {transactions.length > 0 && (
      <div className="w-full max-w-md mt-6">
        <h2 className="text-xl text-gray-700 font-semibold mb-2">Recent Transactions</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {transactions.map((tx, index) => (
            <li key={index} className="p-3 border rounded bg-white shadow">
              <div><strong>To:</strong> {tx.to}</div>
              <div><strong>Amount:</strong> {tx.amount} ETH</div>
              <div>
                <a
                  href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View on Etherscan
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
      )}
    </div>
    </main>
  );
}
