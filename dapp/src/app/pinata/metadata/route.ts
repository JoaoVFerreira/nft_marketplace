import axios from "axios";

async function uploadMetaData(metaData: { name?: string }): Promise<string> {
	const response = await axios({
		method: "POST",
		url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
		data: {
			pinataContent: metaData,
			pinataMetadata: { name: `${metaData.name}.json` },
		},
		headers: {
			pinata_api_key: `${process.env.API_KEY}`,
			pinata_secret_api_key: `${process.env.API_SECRET}`,
			"Content-Type": "application/json",
		},
	});

	return `ipfs://${response?.data?.IpfsHash}`;
}

export async function POST(request: Request) {
	const metaData = await request.json();
	const uri = await uploadMetaData(metaData);
	return Response.json({ uri });
}
