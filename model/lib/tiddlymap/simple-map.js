"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const uuid_1 = tslib_1.__importDefault(require("uuid"));
const path_1 = tslib_1.__importDefault(require("path"));
const cytoscape_1 = tslib_1.__importDefault(require("cytoscape"));
class SimpleTiddlyMap {
    constructor(name, base) {
        this.model = base;
        this.name = name;
        this.nodes = new Set();
        this.edges = new Set();
        this.positions = new Map();
        this.description = '';
        this.guid = uuid_1.default.v4();
        this.viewbase = base.ensurePath(base.mapViews, this.name);
        this.tiddlerFile = path_1.default.join(this.viewbase, "tiddler.tid");
        this.edgeFilterFile = path_1.default.join(this.viewbase, "edges.tid");
        this.nodeFilterFile = path_1.default.join(this.viewbase, "nodes.tid");
        this.layoutFile = path_1.default.join(this.viewbase, "layout.tid");
        const ld = {};
        this.edgeFilter = '';
        this.nodeFilter = '';
        this.layoutData = JSON.stringify(ld, null, 3);
    }
    useExplicitNodeFilter() {
        this.nodes.forEach((val) => {
            this.nodeFilter += "[field:tmap.id[" + val + "]] ";
        });
    }
    useExplicitEdgeFilter() {
        for (let e in this.edges) {
            this.edgeFilter += "[field:tmap.id[" + e + "]] ";
        }
    }
    async layoutGraph() {
        const n2 = [];
        for (let x in this.nodes) {
            const node = this.model.nodeMap[x];
            n2.push({
                data: node
            });
            console.log("Process Edgemap", node.edgemap);
        }
        const e2 = [];
        for (let x in this.edges) {
            e2.push({
                data: x
            });
        }
        var cy = cytoscape_1.default({
            headless: true,
            elements: [
                ...n2,
                ...e2
            ]
        });
        var layout = cy.elements().layout({
            name: 'cose'
        });
        layout.run();
        console.log("LAYOUT COMPLETE");
        for (let x of cy.elements().jsons()) {
            const elt = JSON.parse(x);
            console.log("POS:", elt.data.id, elt.position);
        }
    }
    async save() {
        console.log("Writing View Tiddler File:", this.tiddlerFile);
        await fs_extra_1.default.writeFile(this.tiddlerFile, this.tiddlerdata());
        console.log("Writing View Tiddler File:", this.edgeFilterFile);
        await fs_extra_1.default.writeFile(this.edgeFilterFile, this.edgedata());
        console.log("Writing View Tiddler File:", this.nodeFilterFile);
        await fs_extra_1.default.writeFile(this.nodeFilterFile, this.nodedata());
        console.log("Writing View Tiddler File:", this.layoutFile);
        await fs_extra_1.default.writeFile(this.layoutFile, this.layoutdata());
    }
    tiddlerdata() {
        return "" +
            "id:" + this.guid + "\n" +
            "isview:" + true + "\n" +
            "title: $:/plugins/felixhayashi/tiddlymap/graph/views/" + this.name + "\n" +
            "\n" + this.description + "\n";
    }
    edgedata() {
        return "" +
            "filter:" + this.edgeFilter + "\n" +
            "title: $:/plugins/felixhayashi/tiddlymap/graph/views/" + this.name + "/filter/edges\n" +
            "\n";
    }
    nodedata() {
        return "" +
            "type: text/vnd.tiddlywiki" + "\n" +
            "filter:" + this.nodeFilter + "\n" +
            "title: $:/plugins/felixhayashi/tiddlymap/graph/views/" + this.name + "/filter/nodes\n" +
            "\n";
    }
    layoutdata() {
        return "" +
            "type: text/vnd.tiddlywiki" + "\n" +
            "title: $:/plugins/felixhayashi/tiddlymap/graph/views/" + this.name + "/map\n" +
            "\n" + this.layoutData + "\n";
    }
}
exports.SimpleTiddlyMap = SimpleTiddlyMap;
