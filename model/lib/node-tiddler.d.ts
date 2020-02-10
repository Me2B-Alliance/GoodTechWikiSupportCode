import { Tiddler, SimpleTiddler, TiddlerData, TiddlyModel } from '.';
export interface NodeTiddler extends Tiddler {
    tmap_id: string;
    tmap_edges: string;
    element_type: string;
    element_subtype?: string;
}
export declare class SimpleNodeTiddler extends SimpleTiddler implements NodeTiddler {
    tmap_id: string;
    tmap_edges: string;
    element_type: string;
    element_subtype?: string;
    sorted_keys: string[];
    constructor(data: TiddlerData, base: TiddlyModel);
    tiddlerdir(): string;
    tiddlerdata(): string;
}
