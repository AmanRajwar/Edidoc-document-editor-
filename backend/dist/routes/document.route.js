"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const document_controller_1 = require("../controllers/document.controller");
const documentRouter = express_1.default.Router();
documentRouter.post('/create-document', AuthMiddleware_1.isAuthenticated, document_controller_1.createDocument);
documentRouter.post('/add-collaborator/:id', AuthMiddleware_1.isAuthenticated, document_controller_1.addCollaborator);
documentRouter.get('/get-documents', AuthMiddleware_1.isAuthenticated, document_controller_1.getAllDocuments);
documentRouter.post('/update-own-document/:id', AuthMiddleware_1.isAuthenticated, document_controller_1.ownerUpdatesDocument);
documentRouter.delete('/delete-document/:id', AuthMiddleware_1.isAuthenticated, document_controller_1.deleteDocumentByRole);
exports.default = documentRouter;
