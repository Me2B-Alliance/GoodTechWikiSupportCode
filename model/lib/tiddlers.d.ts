import { TiddlyModel, tiddlydate } from '.';
export interface Tiddler {
    guid: string;
    base: TiddlyModel;
    created: tiddlydate;
    modified: tiddlydate;
    title: string;
    type: string;
    wiki_text: string;
    fields: Map<string, TiddlerFieldDatum>;
    tiddlerdir: () => string;
    tiddlerfile: () => string;
    tiddlerdata: () => string;
    writeTiddler: () => void;
}
export interface TiddlerData {
    created?: tiddlydate;
    modified?: tiddlydate;
    title?: string;
    type?: string;
    guid?: string;
    fields?: Map<string, TiddlerFieldDatum>;
    text?: string;
    element_type?: string;
    element_subtype?: string;
}
export declare type TiddlerFieldDatum = string | Set<string>;
export declare class SimpleTiddler implements Tiddler {
    guid: string;
    base: TiddlyModel;
    created: tiddlydate;
    modified: tiddlydate;
    title: string;
    type: string;
    wiki_text: string;
    fields: Map<string, TiddlerFieldDatum>;
    constructor(data: TiddlerData, base: TiddlyModel);
    tiddlerdir(): string;
    tiddlerfile(): string;
    tiddlerdata(): string;
    getFieldData(key: string): string;
    writeTiddler(): Promise<void>;
}
