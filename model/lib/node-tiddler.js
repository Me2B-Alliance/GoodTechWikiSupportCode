"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _1 = require(".");
const path_1 = tslib_1.__importDefault(require("path"));
const slugify_1 = tslib_1.__importDefault(require("slugify"));
class SimpleNodeTiddler extends _1.SimpleTiddler {
    constructor(data, base) {
        super(data, base);
        this.fields = data.fields || new Map();
        this.tmap_id = this.fields['tmap.id'] || this.guid;
        this.guid = this.tmap_id;
        this.tmap_edges = this.fields['tmap.edges'] || '';
        this.element_type = data.element_type || 'undefined';
        this.element_subtype = data.element_subtype;
        this.wiki_text = data.text || "";
        this.sorted_keys = [];
        for (let k in this.fields)
            this.sorted_keys.push(k);
        this.sorted_keys.sort();
        if (this.tmap_id != this.guid)
            throw new Error("SimpleNodeTiddler TMAP_ID and GUID mismatch, tmap_id=" + this.tmap_id
                + ", guid:" + this.guid + ", title=" + this.title);
    }
    tiddlerdir() {
        if (!this.element_type)
            return this.base.nodesPath;
        else if (!this.element_subtype)
            return path_1.default.join(this.base.nodesPath, this.element_type);
        else
            return path_1.default.join(this.base.nodesPath, this.element_type, slugify_1.default(this.element_subtype, { lower: true }));
    }
    tiddlerdata() {
        let field_data = "";
        for (let k of this.sorted_keys) {
            if (this.fields[k] !== undefined)
                field_data = field_data + k + ":" + this.getFieldData(k) + "\n";
        }
        return super.tiddlerdata() + field_data + "\n" + this.wiki_text + "\n";
    }
}
exports.SimpleNodeTiddler = SimpleNodeTiddler;
