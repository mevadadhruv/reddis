"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/indent */
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const apps = (0, express_1.default)();
// Use body parser to read JSON payloads
apps.use(express_1.default.json({ limit: "500mb" }));
apps.use(body_parser_1.default.json());
apps.use(body_parser_1.default.urlencoded({
    extended: true,
    limit: "500mb",
}));
exports.default = apps;
