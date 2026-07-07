import type { LocalHistory } from "../models/local.history";

const STORAGE_KEY = "history_comics";

export const addLocalHistory = (
  history: LocalHistory
) => {

  const histories: LocalHistory[] = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
  );

  const filtered = histories.filter(
    item => item.storyId !== history.storyId
  );

  filtered.unshift(history);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(filtered)
  );
};

export const getLocalHistories = (): LocalHistory[] => {
  return JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
  );
};

export const deleteLocalHistory = (
  storyId: string
) => {

  const histories = getLocalHistories();

  const filtered = histories.filter(
    item => item.storyId !== storyId
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(filtered)
  );
};

export const clearLocalHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};