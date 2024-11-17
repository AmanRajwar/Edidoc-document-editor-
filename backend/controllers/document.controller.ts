import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncError";
import { ErrorHandler } from "../utils/ErrorHandler";
import DocumentModel from "../models/document.model";
import User from "../models/user.model";
import mongoose, { ObjectId, Types } from "mongoose";

export const createDocument = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        let { data, name } = req.body;
        console.log(data)
        const user = req.user;
        // console.log("user = ", user)
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return next(new ErrorHandler('Login to Create Document', 400));
        }
        if (!name) {
            name = 'Untitled'
        }

        const doc = await DocumentModel.create([{ name, data, owner: user }], { session });

        if (!doc || !doc[0]) {
            await session.abortTransaction();
            session.endSession();
            return next(new ErrorHandler('Cannot create the Document', 400));
        }
        const date = new Date();
        const formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        const updatedUser = await User.findByIdAndUpdate(
            user,
            { $push: { documents: { document: doc[0]._id, role: "owner", recentlyOpened: date } } },
            { session, new: true }
        );

        if (!updatedUser) {
            await session.abortTransaction();
            session.endSession();
            return next(new ErrorHandler('Cannot update user with document info', 400));
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            document: doc[0]
        });

    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        console.log(error);
        return next(new ErrorHandler(error.message, 400));
    }
});

export const deleteDocumentByRole = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params; // Document ID to delete
        const userId = req.user; // Authenticated user making the request

        if (!userId) {
            await session.abortTransaction();
            session.endSession();
            return next(new ErrorHandler('Please log in to delete a document', 400));
        }

        // Fetch the document to verify existence and ownership/collaboration
        const document = await DocumentModel.findById(id).session(session);

        if (!document) {
            await session.abortTransaction();
            session.endSession();
            return next(new ErrorHandler('Document not found', 404));
        }

        // Check if the user is the owner
        if (document.owner.toString() === userId.toString()) {
            // The user is the owner - delete the document and remove references
            await DocumentModel.deleteOne({ _id: id }).session(session);

            // Remove the document reference from all users who collaborated on it
            await User.updateMany(
                { 'documents.document': id },
                { $pull: { documents: { document: id } } },
                { session }
            );
        } else {
            // The user is not the owner - remove only their reference and collaboration
            // Remove the user from the document's collaborators
            await DocumentModel.updateOne(
                { _id: id },
                { $pull: { collaborators: { user: userId } } },
                { session }
            );

            // Remove the document reference from the user's document list
            await User.updateOne(
                { _id: userId },
                { $pull: { documents: { document: id } } },
                { session }
            );
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: 'Document updated successfully based on user role',
        });

    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        return next(new ErrorHandler(error.message, 500));
    }
});




export const addCollaborator = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { email, role } = req.body;
        const user = req.user;
        const docId = req.params.id;

        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return next(new ErrorHandler('Not Authenticated', 400));
        }

        const doc = await DocumentModel.findById(docId).session(session);
        if (!doc) {
            await session.abortTransaction();
            session.endSession();
            return next(new ErrorHandler('Document is not valid', 400));
        }

        // Check if the user is not owner of the document 
        if (doc.owner.toString() !== user.toString()) {
            await session.abortTransaction();
            session.endSession();
            return next(new ErrorHandler('You are not authorized', 403));
        }

        const collaborator = await User.findOne({ email }).session(session);
        if (!collaborator) {
            await session.abortTransaction();
            session.endSession();
            return next(new ErrorHandler('Provide a valid email', 400));
        }

        // Check if the owner is trying to add themselves as a collaborator
        if (doc.owner.toString() === (collaborator._id as Types.ObjectId).toString()) {
            await session.abortTransaction();
            session.endSession();
            return next(new ErrorHandler('You are the owner of this document', 400));
        }

        // Check if the user is already a collaborator
        const existingCollaboratorIndex = doc.collaborators.findIndex(
            (collab) => collab.user.toString() === (collaborator._id as Types.ObjectId).toString()
        );

        if (existingCollaboratorIndex !== -1) {
            // User is already a collaborator, check if the role is different
            const existingRole = doc.collaborators[existingCollaboratorIndex].role;
            if (existingRole === role) {
                await session.abortTransaction();
                session.endSession();
                return next(new ErrorHandler('User is already a collaborator with the same role', 400));
            }

            // Update the role if it is different
            doc.collaborators[existingCollaboratorIndex].role = role;
        } else {
            // Add collaborator to document's collaborators array
            doc.collaborators.push({ user: collaborator._id as Types.ObjectId, role });
        }

        // Update the collaborator's documents array
        const userDocumentIndex = collaborator.documents.findIndex(
            (docEntry) => docEntry.document.toString() === (doc._id as Types.ObjectId).toString()
        );

        if (userDocumentIndex !== -1) {
            // Update the role if it already exists
            collaborator.documents[userDocumentIndex].role = role;
        } else {
            // Add new entry if not present
            collaborator.documents.push({ document: doc._id as Types.ObjectId, role });
        }

        await doc.save({ session });
        await collaborator.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            document: doc,
        });
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        console.log(error);
        return next(new ErrorHandler(error.message, 400));
    }
});


export const getAllDocuments = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user;
        if (!userId) {
            return next(new ErrorHandler('Login Please', 400));
        }

        const user = await User.findById(userId)
            .select('-password')
            .populate({
                path: 'documents.document', // Populate the documents
                populate: {
                    path: 'owner',
                    select: 'firstName lastName email', 
                },
            });

        if (!user) {
            return next(new ErrorHandler('Login again', 400));
        }

        return res.status(200).json({
            success: true,
            documents: user.documents
        });

    } catch (error: any) {
        console.log(error);
        return next(new ErrorHandler(error.message, 400));
    }
});

export const ownerUpdatesDocument = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user; // Assume `req.user` is populated by middleware
        const { data } = req.body; // Destructure data from request body
        const { id } = req.params; // Get document ID from route params

        // Check if user is authenticated
        if (!userId) {
            return next(new ErrorHandler('Please log in to access this resource', 401));
        }

        // Validate the provided data
        if (!data || typeof data !== 'object') {
            return next(new ErrorHandler('Invalid or missing data for update', 400));
        }

        // Update the document if the user is the owner
        const doc = await DocumentModel.findOneAndUpdate(
            { _id: id, owner: userId }, // Ensure user owns the document
            { data }, // Update the `data` field
            { new: true } // Return the updated document
        );

        // If document not found or ownership check fails
        if (!doc) {
            return next(new ErrorHandler('Document not found or not authorized to update', 403));
        }

        return res.status(200).json({
            success: true,
            message: 'Document updated successfully',
        });

    } catch (error: any) {
        console.error(error);
        return next(new ErrorHandler(error.message || 'An error occurred', 500));
    }
});
