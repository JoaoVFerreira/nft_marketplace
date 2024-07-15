// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NFTMarket is ReentrancyGuard {
    address payable owner;
    uint private _itemsCounter;
    uint private _itemsSold;
    uint public listingPrice = 0.0025 ether;

    struct MarketItem {
        uint itemId;
        address nftContract;
        uint tokenId;
        address payable seller;
        address payable owner;
        uint price;
        bool sold;
    }

    mapping (uint => MarketItem) public MarketItems; // itemId => MarketItem

    event MarketItemCreated(
        uint indexed itemId,
        address indexed nftContract,
        uint indexed tokenId,
        address seller,
        uint price
    );

    constructor()  {
        owner = payable(msg.sender);
    }

    function createMarketItem(address nftContract, uint tokenId, uint price) public payable nonReentrant {
        require(price > 0, "Price cannot be zero");
        require(msg.value == listingPrice, "Value must be equal to listing price");

        uint itemId = ++_itemsCounter;
        MarketItems[itemId] = MarketItem(
            itemId, 
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        emit MarketItemCreated(itemId, nftContract, tokenId, msg.sender, price);
    }

    function createMarketSale(address nftContract, uint itemId) public payable nonReentrant {
        uint price = MarketItems[itemId].price;
        uint tokenId = MarketItems[itemId].tokenId;

        require(msg.value == price, "Please submit the asking price in order to complete your purchase");
        MarketItems[itemId].seller.transfer(msg.value);

        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        MarketItems[itemId].owner = payable(msg.sender);
        MarketItems[itemId].sold = true;

        ++_itemsSold;
        payable(owner).transfer(listingPrice);
    }

    function fetchMarketItems() view public returns (MarketItem[] memory) {
        uint totalItemsAvailable = _itemsCounter - _itemsSold;

        MarketItem[] memory items = new MarketItem[](totalItemsAvailable);
        uint currentIndex = 0;

        for(uint i = 1; i <=_itemsCounter; ++i) {
            if(!MarketItems[i].sold) {
                items[currentIndex] = MarketItems[i];
                ++currentIndex;
            }
        }

        return items;
    }

    function fetchMyNFTs() view public returns (MarketItem[] memory) {
        uint myItems = 0;

        for (uint i = 1; i <= _itemsCounter; ++i) {
            if(MarketItems[i].owner == msg.sender) {
                ++myItems;
            }
        }

        MarketItem[] memory items = new MarketItem[](myItems);
        uint currentIndex = 0;

        for(uint i = 1; i <=_itemsCounter; ++i) {
            if(MarketItems[i].owner == msg.sender) {
                items[currentIndex] = MarketItems[i];
                ++currentIndex;
            }
        }

        return items;
    }

    function fetchItemsCreated() view public returns (MarketItem[] memory) {
        uint myItems = 0;

        for (uint i = 1; i <= _itemsCounter; ++i) {
            if(MarketItems[i].seller == msg.sender) {
                ++myItems;
            }
        }

        MarketItem[] memory items = new MarketItem[](myItems);
        uint currentIndex = 0;

        for(uint i = 1; i <=_itemsCounter; ++i) {
            if(MarketItems[i].seller == msg.sender) {
                items[currentIndex] = MarketItems[i];
                ++currentIndex;
            }
        }

        return items;
    }
}
