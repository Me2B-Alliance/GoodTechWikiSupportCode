"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const slugify_1 = tslib_1.__importDefault(require("slugify"));
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const klaw_1 = tslib_1.__importDefault(require("klaw"));
const twiki_schema_1 = require("twiki-schema");
const node_tiddler_1 = require("./node-tiddler");
const tiddlymap_1 = require("./tiddlymap");
exports.subtypeFields = {
    'event': 'Category',
    'working-group': "Category",
    'person': undefined,
    'organization': "Org Type",
    'project-or-product': "Category",
    'publication': "Publication Type"
};
class TiddlyModelImpl {
    constructor(path) {
        this.path = this.ensurePath(path);
        this.nodesPath = this.ensurePath(path, "nodes");
        this.system = this.ensurePath(path, "system");
        this.templates = this.ensurePath(path, "templates");
        const mapsDir = this.ensurePath(path, "maps");
        this.mapViews = this.ensurePath(mapsDir, "views");
        this.mapEdgeTypesPath = this.ensurePath(mapsDir, "edgeTypes");
        this.mapNodeTypesPath = this.ensurePath(mapsDir, "nodeTypes");
        this.nodeMap = new Map();
        this.edgeTypes = [];
        this.nodeTypes = [];
        this.namedMaps = new Set();
        this.schemas = twiki_schema_1.schemas;
    }
    registerNamedMap(name) {
        this.namedMaps.add(slugify_1.default(name, { lower: true }));
    }
    nodes() {
        const n = [];
        for (let nid in this.nodeMap) {
            const node = this.nodeMap[nid];
            n.push(node);
        }
        return n;
    }
    readTiddlerFile(path) {
        const data = fs_extra_1.default.readFileSync(path, 'utf8');
        const sections = data.split("\n\n");
        const header = (sections.shift() || '').split("\n");
        const body = sections.join("\n\n");
        const fields = new Map();
        for (let line of header) {
            const l2 = line.trim();
            if (l2) {
                const blocks = line.split(":");
                const key = blocks.shift();
                if (key) {
                    const value = blocks.join(":").trim();
                    fields[key] = value;
                }
            }
        }
        return { fields, body };
    }
    loadNodeTiddler(path) {
        const { fields, body } = this.readTiddlerFile(path);
        function xtract(name) {
            const x = fields[name];
            fields[name] = undefined;
            return x;
        }
        const created = xtract('created');
        const modified = xtract('modified');
        const title = xtract('title');
        const type = xtract('type');
        const slugify = this.slugify; //ctx.me2b.slugify
        function extractSubtype(fields) {
            const t = fields['element.type'];
            const f = exports.subtypeFields[t];
            //console.log("T,F",t,f)
            if (f) {
                const st = fields[slugify(f)] || 'to-be-determined';
                //console.log(slugify(f),st)
                return st;
            }
            return undefined;
        }
        const et = fields['element.type'];
        if (!et) {
            console.log("Missing Element Type:", path);
        }
        this.createNodeTiddler({
            created: created,
            modified: modified,
            title: title,
            type: type,
            guid: fields['tmap.id'],
            fields: fields,
            text: body,
            element_type: fields['element.type'],
            element_subtype: extractSubtype(fields)
        });
    }
    loadNodeTypeTiddler(path) {
        const { fields, body } = this.readTiddlerFile(path);
        function xtract(name) {
            const x = fields[name];
            fields[name] = undefined;
            return x;
        }
        const created = xtract('created');
        const modified = xtract('modified');
        const title = xtract('title');
        const type = xtract('type');
        const slugify = this.slugify; //ctx.me2b.slugify
        function extractSubtype(fields) {
            const t = fields['element.type'];
            const f = exports.subtypeFields[t];
            //console.log("T,F",t,f)
            if (f) {
                const st = fields[slugify(f)] || 'to-be-determined';
                //console.log(slugify(f),st)
                return st;
            }
            return undefined;
        }
        const et = fields['element.type'];
        if (!et) {
            console.log("Missing Element Type:", path);
        }
        const result = new tiddlymap_1.NodeTypeTiddler([
            fields['element.type'],
            extractSubtype(fields)
        ], this, fields);
        this.nodeTypes.push(result);
        return result;
    }
    async load() {
        return new Promise((resolve, reject) => {
            klaw_1.default(this.nodesPath)
                .on('data', item => {
                const p = item.path;
                if (fs_extra_1.default.statSync(p).isFile() && p.endsWith(".tid"))
                    this.loadNodeTiddler(p);
            })
                .on('end', () => {
                console.log("Loaded Tiddly from ", this.path);
                resolve();
            }); // => [ ... array of files]
            klaw_1.default(this.mapNodeTypesPath)
                .on('data', item => {
                const p = item.path;
                if (fs_extra_1.default.statSync(p).isFile() && p.endsWith(".tid"))
                    this.loadNodeTypeTiddler(p);
            })
                .on('end', () => {
                console.log("Loaded Tiddly Type from ", this.path);
                resolve();
            }); // => [ ... array of files]
        });
    }
    async save() {
        console.log("Writing Nodes");
        for (let node of this.nodes()) {
            const dir = node.tiddlerdir();
            const path = node.tiddlerfile();
            const data = node.tiddlerdata();
            await this.ensurePath(dir);
            //console.log("Writing Tiddler:",path)
            await fs_extra_1.default.writeFile(path, data);
            const map = new tiddlymap_1.NeighborMap(node, this);
            await map.save();
        }
        console.log("Writing Edge Types");
        for (let type of this.edgeTypes) {
            const dir = type.tiddlerdir();
            const path = type.tiddlerfile();
            const data = type.tiddlerdata();
            await this.ensurePath(dir);
            console.log("Writing Edge Type:", path);
            await fs_extra_1.default.writeFile(path, data);
        }
        console.log("Writing Node Types");
        for (let type of this.nodeTypes) {
            const dir = type.tiddlerdir();
            const path = type.tiddlerfile();
            const data = type.tiddlerdata();
            await this.ensurePath(dir);
            console.log("Writing Node Type:", path);
            await fs_extra_1.default.writeFile(path, data);
        }
        console.log("Writing named maps");
        await this.namedMaps.forEach(async (title) => {
            const map = new tiddlymap_1.SimpleTiddlyMap(title, this);
            map.nodeFilter = '[contains:tmap.names[' + title + ']]';
            map.edgeFilter = '[all[tiddlers]]';
            await map.save();
        });
    }
    slugify(x) {
        const slug = slugify_1.default(x, {
            replacement: '.',
            //remove: null,        // regex to remove characters
            lower: true,
        });
        return '' + slug;
    }
    ensurePath(base, dir) {
        // make sure this exists
        let path = base;
        if (dir)
            path = base + "/" + dir;
        fs_extra_1.default.ensureDirSync(path);
        return path;
    }
    createNodeTiddler(data) {
        const result = new node_tiddler_1.SimpleNodeTiddler(data, this);
        //console.log("Node Tiddler:",result.tiddlerfile())
        this.nodeMap[result.guid] = result;
        return result;
    }
    createEdgeTypeTiddler(parts) {
        const result = new tiddlymap_1.EdgeTypeTiddler(parts, this);
        this.edgeTypes.push(result);
        return result;
    }
    createNodeTypeTiddler(parts) {
        const result = new tiddlymap_1.NodeTypeTiddler(parts, this);
        this.nodeTypes.push(result);
        return result;
    }
}
exports.TiddlyModelImpl = TiddlyModelImpl;
