import axios from "axios";

async function uploadFile(formData: FormData): Promise<string> {
	const response = await axios({
		method: "POST",
		url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
		data: formData,
		headers: {
			pinata_api_key: `${process.env.API_KEY}`,
			pinata_secret_api_key: `${process.env.API_SECRET}`,
			"Content-Type": "multipart/form-data",
		},
	});

	return `ipfs://${response?.data?.IpfsHash}`;
}

export async function POST(request: Request) {
	const formData = await request.formData();
	const uri = await uploadFile(formData);
	return Response.json({ uri });
}
