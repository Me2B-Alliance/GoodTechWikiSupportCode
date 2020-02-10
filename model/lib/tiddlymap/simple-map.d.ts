import { TiddlyModel } from '..';
import { TiddlyMap } from '.';
export declare class SimpleTiddlyMap implements TiddlyMap {
    model: TiddlyModel;
    name: string;
    description: string;
    nodes: Set<string>;
    edges: Set<string>;
    positions: Map<string, Position>;
    edgeFilter: string;
    nodeFilter: string;
    layoutData: string;
    guid: string;
    viewbase: string;
    tiddlerFile: string;
    layoutFile: string;
    edgeFilterFile: string;
    nodeFilterFile: string;
    constructor(name: string, base: TiddlyModel);
    useExplicitNodeFilter(): void;
    useExplicitEdgeFilter(): void;
    layoutGraph(): Promise<void>;
    save(): Promise<void>;
    tiddlerdata(): string;
    edgedata(): string;
    nodedata(): string;
    layoutdata(): string;
}
