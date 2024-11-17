import express from 'express'
import { isAuthenticated } from '../middleware/AuthMiddleware';
import { addCollaborator, createDocument, deleteDocumentByRole, getAllDocuments, ownerUpdatesDocument } from '../controllers/document.controller';

const documentRouter = express.Router();

documentRouter.post('/create-document',isAuthenticated, createDocument);
documentRouter.post('/add-collaborator/:id',isAuthenticated, addCollaborator);
documentRouter.get('/get-documents',isAuthenticated,getAllDocuments)
documentRouter.post('/update-own-document/:id',isAuthenticated,ownerUpdatesDocument)
documentRouter.delete('/delete-document/:id',isAuthenticated,deleteDocumentByRole)


export default documentRouter