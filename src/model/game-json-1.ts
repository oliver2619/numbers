import { GameJson } from "./game-json";

export interface GameJson1 extends GameJson {
    version: 1;
    lastInjectionPosition?: number;
    numbers: Array<number | null>;
    score: number;
    withItems: boolean;
}