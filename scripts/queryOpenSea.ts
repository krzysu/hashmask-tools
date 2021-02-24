import fs from "fs";
import path from "path";
import { ethers } from "ethers";
import { OpenSeaPort, Network } from "opensea-js";
import { AssetEvent, Order } from "opensea-js/lib/types";
import { saveToFile } from "./shared/saveToFile";

const DB_NAME = "opensea.json";
const HASHMASK_CONTRACT_ADDRESS = "0xc2c747e0f7004f9e8817db2ca4997657a7746928";

const provider = new ethers.providers.JsonRpcProvider(
  `https://mainnet.infura.io`
);

const seaport = new OpenSeaPort(provider, {
  networkName: Network.Main,
});

type Price = {
  price: number;
  symbol: string;
};

type AssetWithPrices = {
  id: string;
  offeredFor: Price | null;
  lastSale: Price | null;
};

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const formatOrder = (order: Order): Price | null => {
  // not interested in auctions where reserve price not met
  if (order.waitingForBestCounterOrder) return null;

  const decimals = order.paymentTokenContract?.decimals || 18;
  const price = Number(
    Number(
      ethers.utils.formatUnits(order.currentPrice?.toString() || "0", decimals)
    ).toFixed(4)
  );

  return {
    price,
    symbol: order.paymentTokenContract?.symbol || "",
  };
};

const formatLastSale = (event: AssetEvent): Price => {
  const decimals = event.paymentToken?.decimals || 18;
  const price = Number(
    Number(
      ethers.utils.formatUnits(event.totalPrice?.toString() || "0", decimals)
    ).toFixed(4)
  );

  return {
    price,
    symbol: event.paymentToken?.symbol || "",
  };
};

const PAGES_LENGTH = 164; // 164
const LIMIT = 50;
const PAGES = Array.from({ length: PAGES_LENGTH }, (_, i) => i);
const DELAY = 1100;

const getAssetsForPage = async (
  page: number,
  order: string
): Promise<AssetWithPrices[]> => {
  try {
    const { assets } = await seaport.api.getAssets({
      asset_contract_address: HASHMASK_CONTRACT_ADDRESS,
      limit: LIMIT,
      offset: page * LIMIT,
      order_by: "eth_price", // created_date or eth_price
      order_direction: order, // asc or desc
    });

    if (assets.length === 0) {
      console.log(`No more assets`);
    }

    return assets.map((asset) => {
      const { tokenId, sellOrders, lastSale } = asset;

      return {
        id: tokenId!,
        offeredFor:
          sellOrders && sellOrders[0] ? formatOrder(sellOrders[0]) : null,
        lastSale: lastSale ? formatLastSale(lastSale) : null,
      };
    });
  } catch (e) {
    console.error(e);
    return [];
  }
};

type Offered = number; // only ETH
type LastSale = number; // only ETH
type MinPrices = [Offered, LastSale];

const allowedSymbols = ["ETH", "WETH"];

const queryAndSave = async (order: string) => {
  const data = await Promise.all(
    PAGES.map(async (page, index) => {
      await sleep(DELAY * index);

      console.log(`Getting assets, page ${page}, order direction ${order}`);
      return await getAssetsForPage(page, order);
    })
  );

  const db = data.flat().reduce((acc, { id, offeredFor, lastSale }): Record<
    string,
    MinPrices
  > => {
    if (!offeredFor && !lastSale) return acc;

    const result = [];
    result.push(
      offeredFor && allowedSymbols.includes(offeredFor.symbol)
        ? offeredFor.price
        : 0
    );

    result.push(
      lastSale && allowedSymbols.includes(lastSale.symbol) ? lastSale.price : 0
    );

    return {
      ...acc,
      [id]: result,
    };
  }, {});

  const filePath = path.resolve(__dirname, `../public/${DB_NAME}`);
  const dbFile = fs.readFileSync(filePath, "utf8");
  const dbData = JSON.parse(dbFile);

  console.log(
    `Existing records: ${Object.keys(dbData).length}, New records ${
      Object.keys(db).length
    }, from #${Object.keys(db)[0]} to #${
      Object.keys(db)[Object.keys(db).length - 1]
    }`
  );

  saveToFile({ ...dbData, ...db }, DB_NAME);
};

const main = async () => {
  saveToFile({}, DB_NAME);
  await queryAndSave("asc");
  await queryAndSave("desc");
};

main();
