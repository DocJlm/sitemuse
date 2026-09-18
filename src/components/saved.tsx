"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Heart } from "@phosphor-icons/react";
import type { Locale } from "@/lib/catalog";
import { copy } from "@/lib/i18n";
import { SAVED_KEY as KEY, savedStorage } from "@/lib/favorites";
const Context = createContext({
  ids: [] as string[],
  ready: false,
  persistent: true,
  toggle: (_id: string) => {},
});
export function SavedProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]),
    [ready, setReady] = useState(false),
    [persistent, setPersistent] = useState(true);
  useEffect(() => {
    const read = () => {
      const result = savedStorage.read(() => localStorage);
      setIds(result.ids);
      setPersistent(result.persistent);
      setReady(true);
    };
    read();
    const listener = (e: StorageEvent) => {
      if (e.key === KEY || e.key === null) read();
    };
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);
  function toggle(id: string) {
    const next = ids.includes(id) ? ids.filter((s) => s !== id) : [...ids, id];
    setIds(next);
    setPersistent(savedStorage.write(next, () => localStorage));
  }
  return (
    <Context.Provider value={{ ids, ready, persistent, toggle }}>
      {children}
    </Context.Provider>
  );
}
export const useSaved = () => useContext(Context);
export function SaveButton({
  id,
  name,
  locale,
  label = false,
}: {
  id: string;
  name: string;
  locale: Locale;
  label?: boolean;
}) {
  const { ids, ready, toggle } = useSaved();
  const active = ids.includes(id),
    t = copy(locale);
  return (
    <button
      className={`save-button ${active ? "is-saved" : ""} ${label ? "with-label" : ""}`}
      disabled={!ready}
      aria-pressed={active}
      aria-label={`${active ? t.unsave : t.save} ${name}`}
      onClick={() => toggle(id)}
    >
      <Heart size={20} weight={active ? "fill" : "regular"} />
      {label && (active ? t.unsave : t.save)}
    </button>
  );
}
export function StorageNotice({ locale }: { locale: Locale }) {
  const { persistent } = useSaved();
  return persistent ? null : (
    <p className="storage-notice" role="status">
      {copy(locale).storage}
    </p>
  );
}
