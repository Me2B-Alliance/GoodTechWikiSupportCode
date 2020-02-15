"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const slugify_1 = tslib_1.__importDefault(require("slugify"));
const path_1 = tslib_1.__importDefault(require("path"));
const uuid_1 = tslib_1.__importDefault(require("uuid"));
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const _1 = require(".");
// --------------------------------------------------------------------------
// Impelementation
class SimpleTiddler {
    constructor(data, base) {
        this.guid = uuid_1.default.v4();
        this.base = base;
        this.title = data.title || "untitled";
        this.created = data.created || Date.now();
        this.modified = data.modified || Date.now();
        this.type = data.type || _1.TIDDLERTYPE;
        this.guid = data.guid || this.guid;
        this.wiki_text = data.text || 'No body provided';
        this.fields = data.fields || new Map();
    }
    tiddlerdir() {
        return this.base.path;
    }
    tiddlerfile() {
        const filepart = slugify_1.default(this.title) + ".tid";
        return path_1.default.join(this.tiddlerdir(), filepart);
    }
    tiddlerdata() {
        return "" +
            "created:" + this.created + "\n" +
            "modified:" + this.modified + "\n" +
            "title:" + this.title + "\n" +
            "type:" + this.type + "\n";
    }
    getFieldData(key) {
        const val = this.fields[key];
        if (typeof (val) == "string")
            return val.trim();
        else {
            const vals = [];
            val.forEach((v) => { vals.push(v.trim()); });
            return vals.join(" ");
        }
    }
    async writeTiddler() {
        const dir = this.tiddlerdir();
        const path = this.tiddlerfile();
        const data = this.tiddlerdata();
        this.base.ensurePath(dir);
        console.log("Writing Tiddler:", path);
        await fs_extra_1.default.writeFile(path, data);
    }
}
exports.SimpleTiddler = SimpleTiddler;
