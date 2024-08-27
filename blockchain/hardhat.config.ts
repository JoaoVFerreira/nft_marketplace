import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
	solidity: "0.8.24",
	networks: {
		polygonTestNet: {
			url: process.env.RPC_URL,
			chainId: Number.parseInt(`${process.env.CHAIN_ID}`),
			accounts: {
				mnemonic: process.env.SECRET,
			},
		},
		bsctest: {
			url: process.env.BSC_URL,
			chainId: Number.parseInt(`${process.env.CHAIN_ID_BSC}`),
			accounts: {
				mnemonic: process.env.SECRET,
			},
		},
	},
	etherscan: {
		apiKey: process.env.API_KEY,
	},
};

export default config;
