const localStorageUtils = {
  save: (key, value) => {
    if (value !== undefined && value !== null) {
      localStorage && localStorage.setItem(key, JSON.stringify(value));
    }
  },
  get: (key) => {
    if (localStorage) {
      const value = localStorage.getItem(key);
      try {
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.error("Error parsing JSON from localStorage", error);
        return null; // Return null if JSON parsing fails
      }
    }
    return null;
  },
  remove: (key) => {
    localStorage && localStorage.removeItem(key);
  },
  clear: () => {
    localStorage && localStorage.clear();
  },
  update: (key, value) => {
    if (value !== undefined && value !== null) {
      localStorage && localStorage.setItem(key, JSON.stringify(value));
    }
  },
};

export default localStorageUtils;
