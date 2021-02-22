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
  buildMask: (id: string) => ViewMask;
  buildSameTraitMasks: typeof buildSameTraitMasks;
  buildSimilarImageMasks: typeof buildSimilarImageMasks;
}

const initialState: State = {
  openseaDB: {},
  buildMask: buildMaskModel,
  buildSameTraitMasks,
  buildSimilarImageMasks,
};

const stateCtx = createContext<State>(initialState);

const DataProvider: React.FC = ({ children }) => {
  const [openseaDB, setOpenseaDB] = useState<Record<string, number[]>>({});

  useEffect(() => {
    const run = async () => {
      try {
        const result = await fetch("https://db.hashmasktools.xyz/opensea.json");
        const data = await result.json();
        setOpenseaDB(data as Record<string, number[]>);
      } catch (e) {
        console.error(e);
      }
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
