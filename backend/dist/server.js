"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const socket_1 = __importDefault(require("./socket"));
const db_1 = __importDefault(require("./utils/db"));
// import './types.d.ts';
const port = 8000;
const server = app_1.app.listen(port, () => {
    console.log("server is up and running on port ", port);
    (0, db_1.default)();
}).on('error', (error) => {
    console.log('error while running the server :', error);
});
(0, socket_1.default)(server);
