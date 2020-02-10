"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const __1 = require("..");
const slugify_1 = tslib_1.__importDefault(require("slugify"));
const path_1 = tslib_1.__importDefault(require("path"));
const images = [
    "\\xff206",
    "\\xff207",
    "\\xff208",
    "\\xff209",
    "\\xff20a",
    "\\xff20b",
    "\\xff20c",
    "\\xff20d",
    "\\xff20e",
    "\\xff20f",
];
const imageMap = {
    "event": "\\xff417",
    "organization": "\\xff209",
    "project-or-product": "\\xff085",
    "publication": "\\xff026",
    "working-group": "\\xff0b1",
    "person": "\\xff207"
};
let index = 0;
class NodeTypeTiddler extends __1.SimpleTiddler {
    constructor(parts, base, fields = {}) {
        super({
            fields, : .created,
            fields, : .modified,
            fields, : .type,
            fields, : .title || "$:/plugins/felixhayashi/tiddlymap/graph/nodeTypes/" + parts.join("/")
        }, base, fields);
        this.parts = parts;
        this.slugchain = [];
        const len = this.parts.length;
        for (let idx in parts)
            this.slugchain[idx] = slugify_1.default(parts[idx]);
        if (len == 1) {
            this.filepart = this.slugchain[0];
            this.dirchain = undefined;
        }
        else {
            this.filepart = this.slugchain[len - 1];
            this.dirchain = this.slugchain.slice(0, len - 1);
        }
        this.scope = fields.scope || '[field:element.type[' + this.filepart + ']]';
        this.style = fields.style || '{"color":{"border":"' + this.randomRGBA() + '","background":"' + this.randomRGBA() + '"}}';
        console.log("NODE TYPE:", parts);
        this.faIcon = fields['fa-icon'] || imageMap[parts[0]] || images[index % images.length];
        this.twIcon = fields['tw-icon'] || ''; //images[index % images.length]
        index = index + 1;
    }
    tiddlerdata() {
        return super.tiddlerdata() +
            "scope: " + this.scope + "\n" +
            "style: " + this.style + "\n" +
            "fa-icon: " + this.faIcon + "\n" +
            "tw-icon: " + this.twIcon + "\n";
    }
    randomRGBA() {
        return 'rgba('
            + Math.round(256 * Math.random()) + ','
            + Math.round(256 * Math.random()) + ','
            + Math.round(256 * Math.random()) + ','
            + Math.round(256 * Math.random()) + ')';
    }
    tiddlerdir() {
        if (this.dirchain)
            return path_1.default.join(this.base.mapNodeTypesPath, this.dirchain.join("/"));
        else
            return this.base.mapNodeTypesPath;
    }
    tiddlerfile() {
        return path_1.default.join(this.tiddlerdir(), this.filepart + ".tid");
    }
}
exports.NodeTypeTiddler = NodeTypeTiddler;
class SimpleNodeTypeTiddler extends NodeTypeTiddler {
}
exports.SimpleNodeTypeTiddler = SimpleNodeTypeTiddler;
