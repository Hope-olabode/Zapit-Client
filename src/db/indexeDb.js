import { openDB } from "idb";

export const dbPromise = openDB("app-cache", 2, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("dashboard")) {
      db.createObjectStore("dashboard");
    }

    if (!db.objectStoreNames.contains("outbox")) {
      db.createObjectStore("outbox", {
        keyPath: "id",
        autoIncrement: true,
      });
    }
  },
});


export const saveData = async (key, value) => {
  const db = await dbPromise;
  await db.put("dashboard", value, key);
};

export const getData = async (key) => {
  const db = await dbPromise;
  return db.get("dashboard", key);
};


export const saveOutboxIssue = async (payload) => {
  const db = await dbPromise;
  await db.add("outbox", {
    ...payload,
    createdAt: Date.now(),
  });
};

export const getOutboxIssues = async () => {
  const db = await dbPromise;
  return db.getAll("outbox");
};

export const deleteOutboxIssue = async (id) => {
  const db = await dbPromise;
  await db.delete("outbox", id);
};


export const addIssueToDashboardCache = async (issue) => {
  const db = await dbPromise;
  const dashboard = await db.get("dashboard", "dashboard");

  if (!dashboard) return;

  const updated = {
    ...dashboard,
    issues: [issue, ...(dashboard.issues || [])],
  };

  await db.put("dashboard", updated, "dashboard");
};
