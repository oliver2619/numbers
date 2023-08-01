import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStoreService {

  private static readonly PREFIX = 'numbers:'
  constructor() { }

  has(key: string): boolean {
    const keyExp = LocalStoreService.getKey(key);
    return localStorage.getItem(keyExp) !== null;
  }

  list(key: string): string[] {
    const fullKey = `${LocalStoreService.PREFIX}${key}`;
    const cnt = localStorage.length;
    const ret: string[] = [];
    for (let i = 0; i < cnt; ++i) {
      const k = localStorage.key(i);
      if (k !== null && k.startsWith(fullKey)) {
        ret.push(k.substring(fullKey.length));
      }
    }
    return ret;
  }

  load<T>(key: string): T {
    const keyExp = LocalStoreService.getKey(key);
    const loaded = localStorage.getItem(keyExp);
    if (loaded === null) {
      throw RangeError(`Failed to load ${keyExp}`)
    }
    return JSON.parse(loaded);
  }

  save<T>(key: string, value: T) {
    const keyExp = LocalStoreService.getKey(key);
    localStorage.setItem(keyExp, JSON.stringify(value));
  }

  remove(key: string) {
    const keyExp = LocalStoreService.getKey(key);
    localStorage.removeItem(keyExp);
  }

  private static getKey(key: string): string {
    return `${LocalStoreService.PREFIX}${key}`;
  }
}
