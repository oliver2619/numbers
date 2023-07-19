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
