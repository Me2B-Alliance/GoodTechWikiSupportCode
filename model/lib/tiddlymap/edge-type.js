"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const __1 = require("..");
const slugify_1 = tslib_1.__importDefault(require("slugify"));
const path_1 = tslib_1.__importDefault(require("path"));
class EdgeTypeTiddler extends __1.SimpleTiddler {
    constructor(parts, base) {
        super({
            title: "$:/plugins/felixhayashi/tiddlymap/graph/edgeTypes/" + parts.join("/")
        }, base);
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
        //this.style='{"color":{"color":"'+this.randomRGBA()+'"},"width":'+Math.round(1+15*Math.random())+'}'
        this.style = '{"color":{"color":"' + this.randomRGBA() + '"},"width":' + Math.round(1 + 3 * Math.random()) + '}';
    }
    tiddlerdata() {
        return super.tiddlerdata() +
            "style: " + this.style + "\n";
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
            return path_1.default.join(this.base.mapEdgeTypesPath, this.dirchain.join("/"));
        else
            return this.base.mapEdgeTypesPath;
    }
    tiddlerfile() {
        return path_1.default.join(this.tiddlerdir(), this.filepart + ".tid");
    }
}
exports.EdgeTypeTiddler = EdgeTypeTiddler;
class SimpleEdgeTypeTiddler extends EdgeTypeTiddler {
}
exports.SimpleEdgeTypeTiddler = SimpleEdgeTypeTiddler;
