"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("./express"));
const port = process.env.port || 4000;
express_1.default.get("/createname/:name", (req, res) => {
    //   const red = getClient.set("name", req.params.name);
    //   console.log("red:- \t", red);
    res.status(200).send({ name: req.params.name });
});
express_1.default.listen(port, () => {
    console.log("server :- ", port);
});
