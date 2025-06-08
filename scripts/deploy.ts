import { ethers } from "hardhat";

async function main() {
  const TransferEther = await ethers.getContractFactory("TransferEther");
  const transferEther = await TransferEther.deploy();
  // a common issue when using older ethers types with newer versions of Hardhat and TypeScript.
  // So always use following code now on.
  await transferEther.waitForDeployment();

  console.log("TransferEther deployed to:", await transferEther.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
