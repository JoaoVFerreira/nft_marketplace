import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("NFTMarket", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    const nftMarket = await NFTMarket.deploy();
    const marketAddress = await nftMarket.getAddress();
    const NFTCollection = await ethers.getContractFactory("NFTCollection");
    const nftCollection = await NFTCollection.deploy(marketAddress);

    return { nftCollection, nftMarket, owner, otherAccount };
  }

  it('Should fetch market items', async () => {
    // ARRANGE
    const { nftCollection, nftMarket } = await loadFixture(deployFixture);
    const listingPrice = (await nftMarket.listingPrice()).toString();
    const auctionPrice = ethers.parseUnits("1", "ether");
    await nftCollection.mint("https://ipfs.something");
    const nftCollectionAddress = await nftCollection.getAddress();
    await nftMarket.createMarketItem(nftCollectionAddress, 1, auctionPrice, { value: listingPrice })

    // ACT
    const response = await nftMarket.fetchMarketItems();

    // ASSERT
    expect(response.length).to.equal(1);
  })

  it('Should fetch my items', async () => {
    // ARRANGE
    const { nftCollection, nftMarket, otherAccount } = await loadFixture(deployFixture);
    const listingPrice = (await nftMarket.listingPrice()).toString();
    const auctionPrice = ethers.parseUnits("1", "ether");
    await nftCollection.mint("https://ipfs.something");
    await nftCollection.mint("https://ipfs.something/2");
    const nftCollectionAddress = await nftCollection.getAddress();
    await nftMarket.createMarketItem(nftCollectionAddress, 1, auctionPrice, { value: listingPrice });
    await nftMarket.createMarketItem(nftCollectionAddress, 2, auctionPrice, { value: listingPrice });

    // ACT
    const instance = nftMarket.connect(otherAccount);
    await instance.createMarketSale(nftCollectionAddress, 2, { value: auctionPrice });
    const response = await instance.fetchMyNFTs();

    // ASSERT
    expect(response.length).to.equal(1);
    expect(response[0].itemId).to.equal(2);
  })

  it('Should fetch my created items', async () => {
    // ARRANGE
    const { nftCollection, nftMarket } = await loadFixture(deployFixture);
    const listingPrice = (await nftMarket.listingPrice()).toString();
    const auctionPrice = ethers.parseUnits("1", "ether");
    await nftCollection.mint("https://ipfs.something");
    await nftCollection.mint("https://ipfs.something/2");
    const nftCollectionAddress = await nftCollection.getAddress();
    await nftMarket.createMarketItem(nftCollectionAddress, 1, auctionPrice, { value: listingPrice });
    await nftMarket.createMarketItem(nftCollectionAddress, 2, auctionPrice, { value: listingPrice });

    // ACT
    const response = await nftMarket.fetchMarketItems()

    // ASSERT
    expect(response.length).to.equal(2);
  })

  it('Should create and execute market sale', async () => {
    // ARRANGE
    const { nftCollection, nftMarket, otherAccount } = await loadFixture(deployFixture);
    const listingPrice = (await nftMarket.listingPrice()).toString();
    const auctionPrice = ethers.parseUnits("1", "ether");
    await nftCollection.mint("https://ipfs.something");
    const nftCollectionAddress = await nftCollection.getAddress();
    await nftMarket.createMarketItem(nftCollectionAddress, 1, auctionPrice, { value: listingPrice });

    // ACT
    const instance = nftMarket.connect(otherAccount);
    await instance.createMarketSale(nftCollectionAddress, 1, { value: auctionPrice });
    const nftOwner = await nftCollection.ownerOf(1);
    const marketItems = await nftMarket.fetchMarketItems();

    // ASSERT
    expect(nftOwner).to.equal(await otherAccount.getAddress());
    expect(marketItems.length).to.equal(0);
  })

  it('Should throw when value is not equal to listing price', async () => {
    // ARRANGE
    const { nftCollection, nftMarket } = await loadFixture(deployFixture);
    const auctionPrice = ethers.parseUnits("1", "ether");
    await nftCollection.mint("https://ipfs.something");
    const nftCollectionAddress = await nftCollection.getAddress();
    

    // ACT && ASSERT
    await expect(
      nftMarket.createMarketItem(nftCollectionAddress, 1, auctionPrice)
    ).to.be.revertedWith('Value must be equal listing price.');
  }) 

  it('Should throw when price is zero', async () => {
    // ARRANGE
    const { nftCollection, nftMarket } = await loadFixture(deployFixture);
    const listingPrice = (await nftMarket.listingPrice()).toString();
    const auctionPrice = ethers.parseUnits("0", "ether");
    await nftCollection.mint("https://ipfs.something");
    const nftCollectionAddress = await nftCollection.getAddress();
    

    // ACT && ASSERT
    await expect(
      nftMarket.createMarketItem(nftCollectionAddress, 1, auctionPrice, { value: listingPrice })
    ).to.be.revertedWith('Price cannot be zero.');
  })

  it('Should throw when given price to buy nft is not enough', async () => {
    // ARRANGE
    const { nftCollection, nftMarket } = await loadFixture(deployFixture);
    const listingPrice = (await nftMarket.listingPrice()).toString();
    const auctionPrice = ethers.parseUnits("1", "ether");
    await nftCollection.mint("https://ipfs.something");
    const nftCollectionAddress = await nftCollection.getAddress();
    await nftMarket.createMarketItem(nftCollectionAddress, 1, auctionPrice, { value: listingPrice })
    
    // ACT && ASSERT
    await expect(
      nftMarket.createMarketSale(nftCollectionAddress, 1)
    ).to.be.revertedWith('Please submit the asking price in order to complete purchase.');
  })
})