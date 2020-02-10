"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const uuid_1 = tslib_1.__importDefault(require("uuid"));
const path_1 = tslib_1.__importDefault(require("path"));
const cytoscape_1 = tslib_1.__importDefault(require("cytoscape"));
class NeighborMap {
    constructor(elt, base) {
        this.model = base;
        this.name = elt.title + "-map";
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
        this.edgeFilter = ' -[prefix[_]] -[[tw-body:link]] -[[tw-list:tags]] -[[tw-list:list]]';
        this.nodeFilter = '';
        this.layoutData = JSON.stringify(ld, null, 3);
        this.nodes.add(elt.guid);
        this.central_topic = elt.guid;
        console.log("NOTES:", elt.guid, elt.title);
        this.useExplicitNodeFilter();
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
        console.log("Writing Neighbor View Tiddler File:", this.tiddlerFile);
        await fs_extra_1.default.writeFile(this.tiddlerFile, this.tiddlerdata());
        console.log("Writing Neighbor View Tiddler File:", this.edgeFilterFile);
        await fs_extra_1.default.writeFile(this.edgeFilterFile, this.edgedata());
        console.log("Writing Neighbor View Tiddler File:", this.nodeFilterFile);
        await fs_extra_1.default.writeFile(this.nodeFilterFile, this.nodedata());
        console.log("Writing Neighbor View Tiddler File:", this.layoutFile);
        await fs_extra_1.default.writeFile(this.layoutFile, this.layoutdata());
    }
    tiddlerdata() {
        const physics = {
            forceAtlas2Based: {
                // <- more repulsion between nodes - 0 - more attraction between nodes ->
                gravitationalConstant: -1250,
                // edge length
                springLength: 650,
                // <- less stiff edges - 0 - stiffer edges ->
                springConstant: 0.05,
                // pulls the entire network back to the center.
                centralGravity: 0.01,
                // kinetic energy reduction
                damping: 0.4
            },
            solver: 'forceAtlas2Based',
            stabilization: {
                enabled: false,
                iterations: 1000,
                updateInterval: 10,
                onlyDynamicEdges: false,
                fit: true
            }
        };
        return "" +
            "id:" + this.guid + "\n" +
            "config.central-topic: " + this.central_topic + "\n" +
            "config.vis: " + JSON.stringify(physics) + "\n" +
            "config.neighbourhood_scope: 2\n" +
            "config.show_inter_neighbour_edges: true\n" +
            "isview:" + false + "\n" +
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
exports.NeighborMap = NeighborMap;
