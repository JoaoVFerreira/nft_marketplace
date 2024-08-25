import { ethers } from "hardhat";

async function main() {

  const NFTMarket = await ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy();

  await nftMarket.waitForDeployment();
  console.log(`NFTMarket deployed to ${nftMarket.target}`);

  const NFTCollection = await ethers.getContractFactory("NFTCollection");
  const nftCollection = await NFTCollection.deploy(nftMarket.target);

  await nftCollection.waitForDeployment();
  console.log(`NFTCollection deployed to ${nftCollection.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});