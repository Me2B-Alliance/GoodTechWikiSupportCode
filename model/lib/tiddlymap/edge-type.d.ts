import { TiddlyModel, SimpleTiddler } from '..';
export declare class EdgeTypeTiddler extends SimpleTiddler {
    parts: string[];
    slugchain: string[];
    filepart: string;
    dirchain?: string[];
    style: string;
    constructor(parts: string[], base: TiddlyModel);
    tiddlerdata(): string;
    randomRGBA(): string;
    tiddlerdir(): string;
    tiddlerfile(): string;
}
export declare class SimpleEdgeTypeTiddler extends EdgeTypeTiddler {
}
