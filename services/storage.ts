export const loadFromStorage = (key: string, fallback: any) => {
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load storage', error);
    return fallback;
  }
};

export const saveToStorage = (key: string, value: any) => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save storage', error);
  }
};
