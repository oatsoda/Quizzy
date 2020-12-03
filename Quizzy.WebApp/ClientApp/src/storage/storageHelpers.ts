
  export function getStoredValue<T>(storageKey: string, defaultValue: () => T) : T {    
    const item = window.localStorage.getItem(storageKey);
    return item ? JSON.parse(item) : defaultValue();
  }

  export function storeValue<T>(storageKey: string, item: T) {
    window.localStorage.setItem(storageKey, JSON.stringify(item));
  }
