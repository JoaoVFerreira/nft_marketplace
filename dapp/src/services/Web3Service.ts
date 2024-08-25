import axios from "axios";
import { ethers } from "ethers";
import NFTCollectionABI from "./NFTCollection.abi.json";
import NFTMarketABI from "./NFTMarket.abi.json";
import type { EventLog } from "ethers";

const MARKETPLACE_ADDRESS = `${process.env.MARKETPLACE_ADDRESS}`;
const COLLECTION_ADDRESS = `${process.env.COLLECTION_ADDRESS}`;
const CHAIN_ID = `${process.env.CHAIN_ID}`;

export type NewNFT = {
	name?: string;
	description?: string;
	price?: string;
	image?: File;
};

type MetaData = {
	name?: string;
	description?: string;
	image?: string;
};

async function uploadFile(file: File): Promise<string> {
	const formData = new FormData();
	formData.append("file", file);

	const response = await axios({
		method: "POST",
		url: "/pinata/file",
		data: formData,
		headers: { "Content-Type": "multipart/form-data" },
	});

	return `${response?.data?.uri}`;
}

async function uploadMetaData(metadata: MetaData) {
	const response = await axios({
		method: "POST",
		url: "/pinata/metadata",
		data: metadata,
		headers: { "Content-Type": "application/json" },
	});

	return `${response?.data?.uri}`;
}

async function getProvider() {
	if (!window.ethereum) throw new Error("Wallet not found!");

	const provider = new ethers.BrowserProvider(window.ethereum);
	const accounts: string[] = await provider.send("eth_requestAccounts", []);
	if (!accounts || !accounts.length) throw new Error("Wallet not permitted!");
	await provider.send("wallet_switchEthereumChain", [
		{
			chainId: CHAIN_ID,
		},
	]);
	return provider;
}

async function createItem(url: string, price: string): Promise<number> {
	const provider = await getProvider();
	const signer = await provider.getSigner();

	// Mint NFT
	const collectionContract = new ethers.Contract(
		COLLECTION_ADDRESS,
		NFTCollectionABI,
		signer,
	);
	const mintTx = await collectionContract.mint(url);
	const mintTxReceipt: ethers.ContractTransactionReceipt = await mintTx.wait();
	let eventLog = mintTxReceipt.logs[0] as EventLog;
	const tokenId = Number(eventLog.args[2]);

	// Create Market Item
	const weiPrice = ethers.parseUnits(price, "ether");
	const marketContract = new ethers.Contract(
		MARKETPLACE_ADDRESS,
		NFTMarketABI,
		signer,
	);
	const listingPrice = (await marketContract.listingPrice()).toString();
	const createTx = await marketContract.createMarketItem(
		COLLECTION_ADDRESS,
		tokenId,
		weiPrice,
		{ value: listingPrice },
	);
	const createTxReceipt: ethers.ContractTransactionReceipt =
		await createTx.wait();

	eventLog = createTxReceipt.logs.find(
		(log) => (log as EventLog).eventName === "MarketItemCreated",
	) as EventLog;
	const itemId = Number(eventLog.args[0]);

	return itemId;
}

export async function uploadAndCreate(nft: NewNFT): Promise<number> {
	if (!nft.description || !nft.image || !nft.name || !nft.price) {
		throw new Error("All fields are required.");
	}

	const uri = await uploadFile(nft.image);
	const metaDataUri = await uploadMetaData({
		name: nft.name,
		description: nft.description,
		image: uri,
	});

	const itemId = await createItem(metaDataUri, nft.price);
	return itemId;
}
