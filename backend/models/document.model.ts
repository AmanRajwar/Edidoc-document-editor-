import mongoose, { Document, model, Model, Schema, Types } from "mongoose";

export interface IDocument extends Document {
    name: string;
    data: Record<string, any>; // Array of objects to match Delta format
    owner: Types.ObjectId;
    collaborators: {
        user: Types.ObjectId;
        role: "viewer" | "editor" | "owner"; // Enforce specific roles with TypeScript
    }[];
}

const DocumentSchema = new Schema<IDocument>(
    {
        name: {
            type: String,
            required: true,
        },
        data: {
            type: Schema.Types.Mixed, // Allows storing a complex object (like Delta format)
            required: true, // Make it required if necessary
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        collaborators: [
            {
                user: {
                    type: Schema.Types.ObjectId,
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
    },
    { timestamps: true }
);

const DocumentModel = model<IDocument>("Document", DocumentSchema);
export default DocumentModel;
