"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DocumentSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    data: {
        type: mongoose_1.Schema.Types.Mixed, // Allows storing a complex object (like Delta format)
        required: true, // Make it required if necessary
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    collaborators: [
        {
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            role: {
                type: String,
                required: true,
                enum: ["viewer", "editor", "owner"],
            },
        },
    ],
}, { timestamps: true });
const DocumentModel = (0, mongoose_1.model)("Document", DocumentSchema);
exports.default = DocumentModel;
