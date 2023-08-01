export interface GameJson {
    version: 1;
    numbers: Array<number | null>;
    score: number;
    items: string[];
    withItems: boolean;
    lastInjectionPosition?: number;
}