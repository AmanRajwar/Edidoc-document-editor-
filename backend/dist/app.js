"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const error_1 = require("./middleware/error");
const document_route_1 = __importDefault(require("./routes/document.route"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json({ limit: "50mb" }));
//cookie parser
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true,
}));
//routes
exports.app.use('/api/v1', user_route_1.default, document_route_1.default);
//testing api
exports.app.get('/test', (req, res, next) => {
    res.status(200).json({
        success: true,
        msessage: "API is working"
    });
});
exports.app.use(error_1.ErrorMiddleware);
