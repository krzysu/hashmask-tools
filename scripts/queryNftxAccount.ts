import { ethers } from "ethers";
import { OpenSeaPort, Network } from "opensea-js";
import { OrderSide, OpenSeaAsset } from "opensea-js/lib/types";
import { saveToFile } from "./shared/saveToFile";
import fetch from "node-fetch";
import { URLSearchParams } from "url";

const DB_NAME = "nftx.json";
const HASHMASK_CONTRACT_ADDRESS = "0xc2c747e0f7004f9e8817db2ca4997657a7746928";
const NFTX_OWNER_ADDRESS = "0xaf93fcce0548d3124a5fc3045adaf1dde4e8bf7e";
const NFTX_HASHMASK_VAULT_ID = 20;

const provider = new ethers.providers.JsonRpcProvider(
  `https://mainnet.infura.io`
);

const seaport = new OpenSeaPort(provider, {
  networkName: Network.Main,
});

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const fetchFromOpenSea = async () => {
  const url = "https://api.opensea.io/api/v1/assets";

  const params = new URLSearchParams({
    owner: NFTX_OWNER_ADDRESS,
    asset_contract_address: HASHMASK_CONTRACT_ADDRESS,
    offset: "0",
    limit: "50",
  });

  try {
    const responseRaw = await fetch(`${url}?${params}`);
    const response = await responseRaw.json();
    const maskIds = response.assets.map((asset) => Number(asset.token_id));
    console.log(maskIds);
  } catch (e) {
    console.error(e);
  }
};

const fetchFromNftx = async () => {
  const url = "https://nftx.xyz/funds-data";
  const responseRaw = await fetch(url);
  const response = await responseRaw.json();

  const fund20 = response.find((i) => i.vaultId === NFTX_HASHMASK_VAULT_ID);

  console.log(fund20.holdings.map((id) => Number(id)));
};

const main = async () => {
  // await fetchFromOpenSea();
  await fetchFromNftx();
};

main();
