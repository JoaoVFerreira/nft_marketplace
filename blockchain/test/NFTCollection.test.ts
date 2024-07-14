import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("NFTCollection", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    const nftMarket = await NFTMarket.deploy()
    const marketAddress = await nftMarket.getAddress()
    const NFTCollection = await ethers.getContractFactory("NFTCollection");
    const nftCollection = await NFTCollection.deploy(marketAddress)

    return { nftCollection, owner, otherAccount, marketAddress};
  }

  it('Should mint a token', async () => {
    // ARRANGE
    const { nftCollection } = await loadFixture(deployFixture);

    // ACT
    await nftCollection.mint("https://ipfs.something");
    const response = await nftCollection.tokenURI(1);

    // ASSERT
    expect(response).to.equal("https://ipfs.something")
  })

  it("Should change approval", async function () {
    // ARRANGE
    const { nftCollection, otherAccount, owner } = await loadFixture(deployFixture);
    const instance = nftCollection.connect(otherAccount);

    // ACT
    await instance.mint("https://ipfs.something");
    await instance.setApprovalForAll(owner.address, false);
    const response = await nftCollection.isApprovedForAll(otherAccount.address, owner.address);

    // ASSERT
    expect(response).to.equal(false);
  });

  it("Should not change approval", async function () {
    // ARRANGE
    const { nftCollection, otherAccount, marketAddress } = await loadFixture(deployFixture);
    const instance = nftCollection.connect(otherAccount);

    // ACT
    await instance.mint("https://ipfs.something");

    // ASSERT
    await expect(instance.setApprovalForAll(marketAddress, false))
      .to.be.revertedWith("Cannot remove marketplace approval")
  });
});
