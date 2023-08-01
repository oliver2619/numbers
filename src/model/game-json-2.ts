import { GameJson } from "./game-json";

export interface GameStateJson2 {
    lastInjectionPosition?: number;
    numbers: Array<number | null>;
    score: number;
}

export interface GameJson2 extends GameJson {
    version: 2;
    history: GameStateJson2[];
    saved: number;
    withItems: boolean;
}