import { Injectable } from '@angular/core';
import { max } from 'rxjs';
import { LocalStoreService } from './local-store.service';

export interface HiscoreItemJson {
  size: number;
  items: boolean;
  score: number;
  maxNumber: number;
}

export interface HiscoreJson {
  version: 1;
  scores: HiscoreItemJson[];
}

@Injectable({
  providedIn: 'root'
})
export class HiscoreService {

  private static readonly KEY = 'hiscore';

  constructor(private readonly localStoreService: LocalStoreService) { }

  get(): HiscoreItemJson[] {
    const json: HiscoreJson = this.load();
    return json.scores;
  }

  save(size: number, items: boolean, score: number, maxNumber: number) {
    const json: HiscoreJson = this.load();
    const found = json.scores.find(it => it.items === items && it.size === size);
    if (found === undefined) {
      const newEntry: HiscoreItemJson = {
        items,
        maxNumber,
        score,
        size
      };
      json.scores.push(newEntry);
    } else {
      if (score > found.score) {
        found.score = score;
      }
      if (maxNumber > found.maxNumber) {
        found.maxNumber = maxNumber;
      }
    }
    this.localStoreService.save(HiscoreService.KEY, json);
  }

  private load(): HiscoreJson{
    const json: HiscoreJson = this.localStoreService.has(HiscoreService.KEY) ? this.localStoreService.load(HiscoreService.KEY) : {
      version: 1,
      scores: []
    };
    return json;
  }
}
