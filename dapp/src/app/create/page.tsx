"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { useState } from "react";
import type { NewNFT } from "@/services/Web3Service";

function Create() {
	const [nft, setNft] = useState<NewNFT>();
	const [message, setMessage] = useState<string>("");

	function onInputChange(ev: React.ChangeEvent<HTMLInputElement>) {
		setNft((prevState) => ({ ...prevState, [ev.target.id]: ev.target.value }));
	}

	function onFileChange(ev: React.ChangeEvent<HTMLInputElement>) {
		if (ev.target.files?.length) {
			const file = ev.target.files[0];
			setNft((prevState) => ({ ...prevState, image: file }));
		}
	}

	return (
		<>
			<main>
				<section className="bg-secondary-500 poster pt-4 relative text-opacity-60 text-white sm:px-4">
					<Header />
				</section>
				<section className="bg-opacity-10 bg-primary-500 py-24 sm:px-4">
					<div className="container mx-auto px-4">
						<div className="-mx-4 flex flex-wrap gap-2 items-center mb-6">
							<div className="px-4 w-full md:flex-1">
								<h2 className="capitalize font-bold text-3xl text-gray-900">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										width="1.25em"
										height="1.25em"
										className="inline-block mb-2 mr-2 text-primary-500"
									>
										<path d="M12 23a7.5 7.5 0 0 1-5.138-12.963C8.204 8.774 11.5 6.5 11 1.5c6 4 9 8 3 14 1 0 2.5 0 5-2.47.27.773.5 1.604.5 2.47A7.5 7.5 0 0 1 12 23z" />
									</svg>
									<span>Create NFT</span>
								</h2>
							</div>
						</div>
						<div>
							<form action="">
								<div className="mb-6">
									<label
										htmlFor="name"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										Name
									</label>
									<input
										type="text"
										value={nft?.name ?? ""}
										onChange={onInputChange}
										id="name"
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder:bg-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										required
									/>
								</div>
								<div className="mb-6">
									<label
										htmlFor="description"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										Author
									</label>
									<input
										type="text"
										value={nft?.description ?? ""}
										onChange={onInputChange}
										id="description"
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder:bg-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										required
									/>
								</div>
								<div className="mb-6">
									<label
										htmlFor="price"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										Price (MATIC - POL)
									</label>
									<input
										type="number"
										value={nft?.price ?? ""}
										onChange={onInputChange}
										id="price"
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder:bg-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										required
									/>
								</div>
								<div className="mb-6">
									<label
										htmlFor="image"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										Image
									</label>
									<input
										type="file"
										onChange={onFileChange}
										id="image"
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder:bg-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										required
									/>
								</div>
								<button
									type="button"
									className="bg-gradient-to-t bg-primary-500 font-bold from-primary-500 hover:bg-primary-600 hover:from-primary-600 hover:to-primary-500 inline-block px-12 py-2 rounded text-white to-primary-400"
								>
									Submit
								</button>
								{message ? <p className="font-bold mt-5">{message}</p> : <></>}
							</form>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}

export default Create;
