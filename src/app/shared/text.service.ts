import { Injectable } from '@angular/core';
import { Dictionary } from './dictionary';
import { DE } from './text-de';
import { EN } from './text-en';

@Injectable({
  providedIn: 'root'
})
export class TextService {

  private readonly dictionary: Dictionary;

  constructor() {
    const result = /^([A-Z]+)/gi.exec(navigator.language);
    const language = result !== null ? result[1].toLowerCase() : 'en';
    switch (language) {
      case 'en':
      default:
        this.dictionary = EN;
        break;
      case 'de':
        this.dictionary = DE;
    }
  }

  get(textId: string, ...params: any[]): string {
    const ret = this.dictionary[textId];
    if (ret === undefined) {
      console.warn(`Text '${textId}' not translated.`);
      return textId;
    } else {
      return params.length > 0 ? this.format(ret, params) : ret;
    }
  }

  private format(text: string, params: any[]): string {
    const pattern = /\$\{([0-9]+)\}/g;
    while (true) {
      const result = pattern.exec(text);
      if (result !== null) {
        const ins = String(params[Number(result[1])]);
        text = text.substring(0, result.index) + ins + text.substring(result.index + result[0].length);
        pattern.lastIndex = result.index + ins.length;
      } else {
        break;
      }
    }
    return text;
  }
}
