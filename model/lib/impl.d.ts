import { TiddlyModel } from '.';
import { TiddlerData } from './tiddlers';
import { NodeTiddler } from './node-tiddler';
import { EdgeTypeTiddler, NodeTypeTiddler } from './tiddlymap';
export declare const subtypeFields: {
    'event': string;
    'working-group': string;
    'person': undefined;
    'organization': string;
    'project-or-product': string;
    'publication': string;
};
export declare class TiddlyModelImpl implements TiddlyModel {
    path: string;
    nodesPath: string;
    nodeMap: Map<string, NodeTiddler>;
    mapViews: string;
    mapEdgeTypesPath: string;
    edgeTypes: EdgeTypeTiddler[];
    mapNodeTypesPath: string;
    nodeTypes: NodeTypeTiddler[];
    system: string;
    templates: string;
    namedMaps: Set<string>;
    schemas: any;
    constructor(path: string);
    registerNamedMap(name: string): void;
    nodes(): NodeTiddler[];
    readTiddlerFile(path: string): any;
    loadNodeTiddler(path: string): void;
    loadNodeTypeTiddler(path: string): NodeTypeTiddler | undefined;
    load(): Promise<void>;
    save(): Promise<void>;
    slugify(x: string): string;
    ensurePath(base: string, dir?: string): string;
    createNodeTiddler(data: TiddlerData): NodeTiddler;
    createEdgeTypeTiddler(parts: string[]): EdgeTypeTiddler;
    createNodeTypeTiddler(parts: string[]): NodeTypeTiddler;
}
