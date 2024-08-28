"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { type NFT, buyNFT, loadDetails } from "@/services/Web3Service";
import Header from "@/components/header";
import Featured from "@/components/featured";

function Details() {
	const params = useParams();
	const itemId = params.itemId;

	const [nft, setNft] = useState<NFT>({} as NFT);
	const [message, setMessage] = useState<string>("");

	useEffect(() => {
		setMessage("Loading details...");
		loadDetails(Number(itemId))
			.then((nft) => setNft(nft))
			.catch((err) => setMessage(err.message));
	}, [params.itemId]);

	function btnBuyClick() {
		if (!nft) return;
		setMessage("Sending your intent to blockchain...wait...");
		buyNFT(nft)
			.then((tx) => (window.location.href = "/account"))
			.catch((err) => setMessage(err.message));
	}

	return (
		<>
			<main>
				<section className="bg-secondary-500 poster pt-4 relative text-opacity-60 text-white sm:px-4">
					<Header />
					<div className="container mx-auto pb-36 pt-16 px-4 relative">
						<div className="-mx-4 flex flex-wrap items-center space-y-6 lg:space-y-0">
							<Featured nft={nft} />
							<div className="mx-auto px-4 w-full lg:w-6/12">
								<h1 className="font-bold leading-tight mb-2 text-4xl text-white md:leading-tight md:text-5xl lg:leading-tight lg:text-6xl 2xl:leading-tight 2xl:text-7xl">
									{nft.name || "Loading..."}
								</h1>
								<p className="font-light mb-12 text-xl">
									by {nft.description || "Loading..."}
								</p>
								<div className="flex flex-wrap gap-4 items-center">
									<button
										type="button"
										onClick={btnBuyClick}
										className="bg-gradient-to-t bg-primary-500 font-bold from-primary-500 hover:bg-primary-600 hover:from-primary-600 hover:to-primary-500 inline-block px-12 py-2 rounded text-white to-primary-400"
									>
										Buy
									</button>
									{message ? (
										<p className="font-bold mt-5 text-white">{message}</p>
									) : (
										<></>
									)}
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}

export default Details;
