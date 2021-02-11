import { ethers } from "ethers";
import { OpenSeaPort, Network } from "opensea-js";
import { OrderSide } from "opensea-js/lib/types";
import { saveToFile } from "./shared/saveToFile";

const DB_NAME = "offers.min.json";
const HASHMASK_CONTRACT_ADDRESS = "0xc2c747e0f7004f9e8817db2ca4997657a7746928";

const provider = new ethers.providers.JsonRpcProvider(
  `https://mainnet.infura.io`
);

const seaport = new OpenSeaPort(provider, {
  networkName: Network.Main,
});

type Offer = {
  id: string;
  price: number;
  symbol: string;
};

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const getOffersForPage = async (page: number): Promise<Offer[]> => {
  const { orders } = await seaport.api.getOrders(
    {
      asset_contract_address: HASHMASK_CONTRACT_ADDRESS,
      side: OrderSide.Sell,
      limit: 50,
    },
    page
  );

  if (orders.length === 0) {
    console.log(`No more orders`);
  }

  return orders.map((order) => {
    const decimals = order.paymentTokenContract?.decimals || 18;
    const price = Number(
      Number(
        ethers.utils.formatUnits(
          order.currentPrice?.toString() || "0",
          decimals
        )
      ).toFixed(4)
    );

    return {
      id: order.metadata.asset.id,
      price,
      symbol: order.paymentTokenContract?.symbol || "",
    };
  });
};

const PAGES_LENGTH = 200;

const main = async () => {
  const PAGES = Array.from({ length: PAGES_LENGTH }, (_, i) => i + 1);
  const DELAY = 550;

  const offers = await Promise.all(
    PAGES.map(async (page, index) => {
      await sleep(DELAY * index);

      console.log(`Getting offers, page ${page}`);
      return await getOffersForPage(page);
    })
  );

  const offersReversed = [...offers.flat()].reverse();

  console.log(`Found ${offersReversed.length} offers`);

  const db = offersReversed.reduce((acc, { id, price, symbol }): Record<
    string,
    number
  > => {
    if (symbol !== "ETH") return acc;

    return {
      ...acc,
      [id]: price,
    };
  }, {});

  console.log(`Saving ${Object.keys(db).length} unique offers`);

  saveToFile(db, DB_NAME);
};

main();
