/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		MARKETPLACE_ADDRESS: process.env.MARKETPLACE_ADDRESS,
		COLLECTION_ADDRESS: process.env.COLLECTION_ADDRESS,
		CHAIN_ID: process.env.CHAIN_ID,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "gateway.pinata.cloud",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
		],
	},
};

export default nextConfig;
