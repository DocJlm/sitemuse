import test from "node:test";
import assert from "node:assert/strict";
import { createSavedStorage } from "../src/lib/favorites";
test("blocked storage keeps session favorites and reports persistence failure", () => {
  const storage = createSavedStorage();
  const denied = () => {
    throw new Error("SecurityError");
  };
  assert.deepEqual(storage.read(denied), { ids: [], persistent: false });
  assert.equal(storage.write(["abstractchip"], denied), false);
  assert.deepEqual(storage.read(denied), {
    ids: ["abstractchip"],
    persistent: false,
  });
});
test("saved favorites round trip and malformed data is safe", () => {
  let value = '["one","one",2]';
  const store = () => ({
    getItem: () => value,
    setItem: (_key: string, next: string) => {
      value = next;
    },
  });
  const storage = createSavedStorage();
  assert.deepEqual(storage.read(store).ids, ["one"]);
  assert.equal(storage.write(["nic"], store), true);
  assert.deepEqual(storage.read(store), { ids: ["nic"], persistent: true });
  value = "{broken";
  assert.deepEqual(storage.read(store), { ids: ["nic"], persistent: false });
});
