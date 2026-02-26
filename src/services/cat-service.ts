import { CatProfile } from "@/types";
import { MOCK_CATS } from "./mock-data";

const globalForCats = globalThis as unknown as { __cats?: CatProfile[] };
if (!globalForCats.__cats) {
  globalForCats.__cats = [...MOCK_CATS];
}

function getStore(): CatProfile[] {
  return globalForCats.__cats!;
}

export const CatService = {
  getByOwner(ownerId: string): CatProfile[] {
    return getStore().filter((c) => c.ownerId === ownerId);
  },

  getById(catId: string): CatProfile | null {
    return getStore().find((c) => c.id === catId) ?? null;
  },

  getByIds(catIds: string[]): CatProfile[] {
    return getStore().filter((c) => catIds.includes(c.id));
  },

  create(cat: Omit<CatProfile, "id">): CatProfile {
    const newCat: CatProfile = { ...cat, id: `cat-${Date.now()}` };
    globalForCats.__cats = [newCat, ...getStore()];
    return newCat;
  },
};
