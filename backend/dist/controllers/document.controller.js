"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ownerUpdatesDocument = exports.getAllDocuments = exports.addCollaborator = exports.deleteDocumentByRole = exports.createDocument = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const ErrorHandler_1 = require("../utils/ErrorHandler");
const document_model_1 = __importDefault(require("../models/document.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.createDocument = (0, catchAsyncError_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        let { data, name } = req.body;
        console.log(data);
        const user = req.user;
        // console.log("user = ", user)
        if (!user) {
            yield session.abortTransaction();
            session.endSession();
            return next(new ErrorHandler_1.ErrorHandler('Login to Create Document', 400));
        }
        if (!name) {
            name = 'Untitled';
        }
        const doc = yield document_model_1.default.create([{ name, data, owner: user }], { session });
        if (!doc || !doc[0]) {
            yield session.abortTransaction();
            session.endSession();
            return next(new ErrorHandler_1.ErrorHandler('Cannot create the Document', 400));
        }
        const date = new Date();
        const formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(user, { $push: { documents: { document: doc[0]._id, role: "owner", recentlyOpened: date } } }, { session, new: true });
        if (!updatedUser) {
            yield session.abortTransaction();
            session.endSession();
            return next(new ErrorHandler_1.ErrorHandler('Cannot update user with document info', 400));
        }
        yield session.commitTransaction();
        session.endSession();
        return res.status(200).json({
            success: true,
            document: doc[0]
        });
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        console.log(error);
        return next(new ErrorHandler_1.ErrorHandler(error.message, 400));
    }
}));
exports.deleteDocumentByRole = (0, catchAsyncError_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { id } = req.params; // Document ID to delete
        const userId = req.user; // Authenticated user making the request
        if (!userId) {
            yield session.abortTransaction();
            session.endSession();
            return next(new ErrorHandler_1.ErrorHandler('Please log in to delete a document', 400));
        }
        // Fetch the document to verify existence and ownership/collaboration
        const document = yield document_model_1.default.findById(id).session(session);
        if (!document) {
            yield session.abortTransaction();
            session.endSession();
            return next(new ErrorHandler_1.ErrorHandler('Document not found', 404));
        }
        // Check if the user is the owner
        if (document.owner.toString() === userId.toString()) {
            // The user is the owner - delete the document and remove references
            yield document_model_1.default.deleteOne({ _id: id }).session(session);
            // Remove the document reference from all users who collaborated on it
            yield user_model_1.default.updateMany({ 'documents.document': id }, { $pull: { documents: { document: id } } }, { session });
        }
        else {
            // The user is not the owner - remove only their reference and collaboration
            // Remove the user from the document's collaborators
            yield document_model_1.default.updateOne({ _id: id }, { $pull: { collaborators: { user: userId } } }, { session });
            // Remove the document reference from the user's document list
            yield user_model_1.default.updateOne({ _id: userId }, { $pull: { documents: { document: id } } }, { session });
        }
        yield session.commitTransaction();
        session.endSession();
        return res.status(200).json({
            success: true,
            message: 'Document updated successfully based on user role',
        });
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        console.error(error);
        return next(new ErrorHandler_1.ErrorHandler(error.message, 500));
    }
}));
exports.addCollaborator = (0, catchAsyncError_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { email, role } = req.body;
        const user = req.user;
        const docId = req.params.id;
        if (!user) {
            yield session.abortTransaction();
            session.endSession();
            return next(new ErrorHandler_1.ErrorHandler('Not Authenticated', 400));
        }
        const doc = yield document_model_1.default.findById(docId).session(session);
        if (!doc) {
            yield session.abortTransaction();
            session.endSession();
            return next(new ErrorHandler_1.ErrorHandler('Document is not valid', 400));
        }
        // Check if the user is not owner of the document 
        if (doc.owner.toString() !== user.toString()) {
            yield session.abortTransaction();
            session.endSession();
            return next(new ErrorHandler_1.ErrorHandler('You are not authorized', 403));
        }
        const collaborator = yield user_model_1.default.findOne({ email }).session(session);
        if (!collaborator) {
            yield session.abortTransaction();
            session.endSession();
            return next(new ErrorHandler_1.ErrorHandler('Provide a valid email', 400));
        }
        // Check if the owner is trying to add themselves as a collaborator
        if (doc.owner.toString() === collaborator._id.toString()) {
            yield session.abortTransaction();
            session.endSession();
            return next(new ErrorHandler_1.ErrorHandler('You are the owner of this document', 400));
        }
        // Check if the user is already a collaborator
        const existingCollaboratorIndex = doc.collaborators.findIndex((collab) => collab.user.toString() === collaborator._id.toString());
        if (existingCollaboratorIndex !== -1) {
            // User is already a collaborator, check if the role is different
            const existingRole = doc.collaborators[existingCollaboratorIndex].role;
            if (existingRole === role) {
                yield session.abortTransaction();
                session.endSession();
                return next(new ErrorHandler_1.ErrorHandler('User is already a collaborator with the same role', 400));
            }
            // Update the role if it is different
            doc.collaborators[existingCollaboratorIndex].role = role;
        }
        else {
            // Add collaborator to document's collaborators array
            doc.collaborators.push({ user: collaborator._id, role });
        }
        // Update the collaborator's documents array
        const userDocumentIndex = collaborator.documents.findIndex((docEntry) => docEntry.document.toString() === doc._id.toString());
        if (userDocumentIndex !== -1) {
            // Update the role if it already exists
            collaborator.documents[userDocumentIndex].role = role;
        }
        else {
            // Add new entry if not present
            collaborator.documents.push({ document: doc._id, role });
        }
        yield doc.save({ session });
        yield collaborator.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return res.status(200).json({
            success: true,
            document: doc,
        });
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        console.log(error);
        return next(new ErrorHandler_1.ErrorHandler(error.message, 400));
    }
}));
exports.getAllDocuments = (0, catchAsyncError_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        if (!userId) {
            return next(new ErrorHandler_1.ErrorHandler('Login Please', 400));
        }
        const user = yield user_model_1.default.findById(userId)
            .select('-password')
            .populate({
            path: 'documents.document', // Populate the documents
            populate: {
                path: 'owner',
                select: 'firstName lastName email',
            },
        });
        if (!user) {
            return next(new ErrorHandler_1.ErrorHandler('Login again', 400));
        }
        return res.status(200).json({
            success: true,
            documents: user.documents
        });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.ErrorHandler(error.message, 400));
    }
}));
exports.ownerUpdatesDocument = (0, catchAsyncError_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user; // Assume `req.user` is populated by middleware
        const { data } = req.body; // Destructure data from request body
        const { id } = req.params; // Get document ID from route params
        // Check if user is authenticated
        if (!userId) {
            return next(new ErrorHandler_1.ErrorHandler('Please log in to access this resource', 401));
        }
        // Validate the provided data
        if (!data || typeof data !== 'object') {
            return next(new ErrorHandler_1.ErrorHandler('Invalid or missing data for update', 400));
        }
        // Update the document if the user is the owner
        const doc = yield document_model_1.default.findOneAndUpdate({ _id: id, owner: userId }, // Ensure user owns the document
        { data }, // Update the `data` field
        { new: true } // Return the updated document
        );
        // If document not found or ownership check fails
        if (!doc) {
            return next(new ErrorHandler_1.ErrorHandler('Document not found or not authorized to update', 403));
        }
        return res.status(200).json({
            success: true,
            message: 'Document updated successfully',
        });
    }
    catch (error) {
        console.error(error);
        return next(new ErrorHandler_1.ErrorHandler(error.message || 'An error occurred', 500));
    }
}));
