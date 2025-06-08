# 🚀 Ether Transfer DApp

A decentralized application (DApp) built using **Solidity**, **Hardhat**, **Next.js**, **TailwindCSS**, and **Ethers.js** that allows users to send Ether via MetaMask. It features:

* ✅ Wallet connection
* ✅ Ether transfers
* ✅ Real-time account switching
* ✅ Transaction history
* ✅ Toast notifications
* ✅ Gas fee info

---

## 📦 Tech Stack

* **Smart Contract**: Solidity, Hardhat
* **Frontend**: Next.js, React, TailwindCSS
* **Blockchain Interaction**: Ethers.js
* **Wallet**: MetaMask
* **Notifications**: React Hot Toast

---

## 🛠 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ether-transfer-dapp.git
cd ether-transfer-dapp
```

### 2. Install Dependencies

Install backend (Hardhat) dependencies:

```bash
cd hardhat
npm install
```

Install frontend (Next.js) dependencies:

```bash
cd ../frontend
npm install
```

### 3. Compile & Deploy Smart Contract

Start a local Hardhat network and deploy the smart contract:

```bash
cd hardhat
npx hardhat node
```

In a new terminal tab:

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

Copy the deployed contract address and ABI.

### 4. Connect Frontend to Contract

In `frontend/constants/`, update:

* `contractAddress.ts` – Add deployed address
* `contractABI.ts` – Paste ABI from `artifacts/` folder

### 5. Run Frontend

```bash
cd ../frontend
npm run dev
```

App should now be available at:
📍 [http://localhost:3000](http://localhost:3000)

---

## 🧪 Features

* 🔐 **MetaMask Wallet Integration**
* 📤 **Send Ether** to any address
* 🧾 **Transaction History** (in session)
* 🔔 **Success/Error Toasts** for feedback
* ⛽ **Gas Fee Estimation & Customization**
* 🔁 **Live Account Switching Support**
