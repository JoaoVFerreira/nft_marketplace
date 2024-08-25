import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const OpenCModule = buildModule("OpenCModule", (m) => {
  const nftMarket = m.contract("NFTMarket");
  const nftCollection = m.contract("NFTCollection", [nftMarket]);
  
  return { nftMarket, nftCollection };
});

export default OpenCModule;