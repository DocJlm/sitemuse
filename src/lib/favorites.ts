export const SAVED_KEY = "sitemuse:saved:v1";
type Store = Pick<Storage, "getItem" | "setItem">;
export function createSavedStorage() {
  let fallback: string[] = [];
  return {
    read(getStore: () => Store) {
      try {
        const value = getStore().getItem(SAVED_KEY);
        const parsed: unknown = value ? JSON.parse(value) : [];
        fallback = Array.isArray(parsed)
          ? [
              ...new Set(
                parsed.filter((id): id is string => typeof id === "string"),
              ),
            ]
          : [];
        return { ids: fallback, persistent: true };
      } catch {
        return { ids: fallback, persistent: false };
      }
    },
    write(ids: string[], getStore: () => Store) {
      fallback = ids;
      try {
        getStore().setItem(SAVED_KEY, JSON.stringify(ids));
        return true;
      } catch {
        return false;
      }
    },
  };
}
export const savedStorage = createSavedStorage();
