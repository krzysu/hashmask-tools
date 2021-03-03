import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ViewMask } from "../../shared/types";
import { buildMask as buildMaskModel } from "../model";
import { similarImageDb } from "../db";
import { getSameTraitMaskIds } from "../sameTraits";

const NFTX_HASHMASK_VAULT_ID = 20;

const buildSameTraitMasks = (
  id: string,
  buildMask = buildMaskModel
): ViewMask[] => {
  const sameTraitMaskIds = getSameTraitMaskIds(id);
  return sameTraitMaskIds.map((sameTraitId) => buildMask(sameTraitId));
};

const buildSimilarImageMasks = (
  id: string,
  buildMask = buildMaskModel
): ViewMask[] => {
  return similarImageDb[id]
    ? similarImageDb[id].map((id) => buildMask(id.toString()))
    : [];
};

type Prices = {
  "nftx-hashmasks-index"?: {
    eth: number;
  };
};

type State = {
  openseaDB: Record<string, number[]>;
  nftxDB: number[];
  prices: Prices;
  buildMask: (id: string) => ViewMask;
  buildSameTraitMasks: typeof buildSameTraitMasks;
  buildSimilarImageMasks: typeof buildSimilarImageMasks;
};

const initialState: State = {
  openseaDB: {},
  nftxDB: [],
  prices: {},
  buildMask: buildMaskModel,
  buildSameTraitMasks,
  buildSimilarImageMasks,
};

type NftxVaultData = {
  vaultId: number;
  holdings: string[];
};

const stateCtx = createContext<State>(initialState);

const DataProvider: React.FC = ({ children }) => {
  const [openseaDB, setOpenseaDB] = useState<Record<string, number[]>>({});
  const [nftxDB, setNftxDB] = useState<number[]>([]);
  const [prices, setPrices] = useState<Prices>({});

  useEffect(() => {
    const run = async () => {
      fetch("https://db.hashmasktools.xyz/opensea.json")
        .then((response) => response.json())
        .then((data) => setOpenseaDB(data as Record<string, number[]>))
        .catch((e) => console.error(e));

      fetch("https://nftx.ethereumdb.com/v1/vaults/?eligibilities=false")
        .then((response) => response.json())
        .then((json: NftxVaultData[]) => {
          const fund20 = json.find(
            (i: NftxVaultData) => i.vaultId === NFTX_HASHMASK_VAULT_ID
          );
          const holdings = fund20?.holdings.map((id) => Number(id));
          setNftxDB(holdings || []);
        })
        .catch((e) => console.error(e));

      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=nftx-hashmasks-index&vs_currencies=eth"
      )
        .then((response) => response.json())
        .then((json: Prices) => {
          setPrices(json);
        })
        .catch((e) => console.error(e));
    };

    run();
  }, []);

  const buildMask = useCallback((id: string) => buildMaskModel(id, openseaDB), [
    openseaDB,
  ]);

  const buildSameTraitMasksWithOffers = useCallback(
    (id: string) => buildSameTraitMasks(id, buildMask),
    [buildMask]
  );

  const buildSimilarImageMasksWithOffers = useCallback(
    (id: string) => buildSimilarImageMasks(id, buildMask),
    [buildMask]
  );

  return (
    <stateCtx.Provider
      value={{
        openseaDB,
        nftxDB,
        prices,
        buildMask,
        buildSameTraitMasks: buildSameTraitMasksWithOffers,
        buildSimilarImageMasks: buildSimilarImageMasksWithOffers,
      }}
    >
      {children}
    </stateCtx.Provider>
  );
};

export default DataProvider;

export const useDataProvider = (): State => useContext(stateCtx);
