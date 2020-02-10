import { TiddlyModel, SimpleTiddler } from '..';
export declare class NodeTypeTiddler extends SimpleTiddler {
    parts: string[];
    slugchain: string[];
    filepart: string;
    dirchain?: string[];
    scope: string;
    style: string;
    faIcon: string;
    twIcon: string;
    constructor(parts: string[], base: TiddlyModel, fields?: any);
    tiddlerdata(): string;
    randomRGBA(): string;
    tiddlerdir(): string;
    tiddlerfile(): string;
}
export declare class SimpleNodeTypeTiddler extends NodeTypeTiddler {
}
