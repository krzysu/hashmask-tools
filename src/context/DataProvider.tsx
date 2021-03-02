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

interface State {
  openseaDB: Record<string, number[]>;
  nftxDB: number[];
  buildMask: (id: string) => ViewMask;
  buildSameTraitMasks: typeof buildSameTraitMasks;
  buildSimilarImageMasks: typeof buildSimilarImageMasks;
}

const initialState: State = {
  openseaDB: {},
  nftxDB: [],
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

  useEffect(() => {
    const run = async () => {
      fetch("https://db.hashmasktools.xyz/opensea.json")
        .then((response) => response.json())
        .then((data) => setOpenseaDB(data as Record<string, number[]>))
        .catch((e) => console.error(e));

      fetch("https://nftx.xyz/funds-data")
        .then((response) => response.json())
        .then((json: NftxVaultData[]) => {
          const fund20 = json.find(
            (i: NftxVaultData) => i.vaultId === NFTX_HASHMASK_VAULT_ID
          );
          const holdings = fund20?.holdings.map((id) => Number(id));
          setNftxDB(holdings || []);
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
