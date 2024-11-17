
import NavBar from '../../components/NavBar'
import apiClient from '../../lib/apiClient'
import { CREATE_DOCUMENT } from '../../utils/constants'
import { RootState, useAppDispatch, useAppSelector } from '../../redux/store';
import { openToast } from '../../redux/features/ToastSlice';
import { useEffect, useState } from 'react';
import { setDocuments, setOpenedDocument } from '../../redux/features/documentSlice';
import { setCollaborators } from '../../redux/features/collaboratorSlice';
import { useSocket } from '../../contexts/socketContext';
import DocumentCard from '../../components/DocumentCard';
import Documents from '../../components/Documents';


const Home = () => {
  // const dispatch = useAppDispatch();


  // // const handleCreateDocument = async () => {
  // //   try {
  // //     const response = await apiClient.post(CREATE_DOCUMENT,
  // //       { title: "This is title", description: 'this is description' },
  // //       { withCredentials: true });
  // //   } catch (error: any) {
  // //     console.log(error)
  // //     dispatch(openToast(error.response.data.message));
  // //   }
  // // }

  // // const handleAddCollaborator = async () => {
  // //   try {
  // //     const response = await apiClient.post('/api/v1/add-collaborator/67270e3cc3da8a7b0abef58e',
  // //       { role: 'viewer', email: "nitin@gmail.com" },
  // //       { withCredentials: true })

  // //   } catch (error) {
  // //     console.log(error);
  // //   }
  // // }

  // const getAllDocuments = async () => {
  //   try {
  //     const response = await apiClient.get('/api/v1/get-documents',
  //       { withCredentials: true });
  //     console.log(response);

  //     dispatch(setDocuments({ documents: response.data.documents }))
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // // const openDocument = async (document: any) => {
  // //   if (open) {
  // //     setOpen(false)
  // //   }

  // //   if (document.role === 'owner') {
  // //     dispatch(setCollaborators({ collaborators: document.document.collaborators }))
  // //   }

  // //   const newDoc = { ...document.document };
  // //   delete newDoc.collaborators;

  // //   dispatch(setOpenedDocument({ openedDocument: { document: newDoc, role: document.role } }))
  // //   // setTitle(newDoc.title)
  // //   // setDescription(newDoc.description)
  // //   setOpen(true)
  // // }

  // // const handleSubmit = () => {

  // //   if (socket) {
  // //     console.log("handleSubmit", socket)
  // //     socket.emit('editDocument', {
  // //       openedDocumentId: openedDocument.document._id,
  // //       data: 'aman',
  // //       collaborators
  // //     })
  // //   }

  // // }

  // useEffect(() => {
  //   getAllDocuments();
  // }, [])

  // useEffect(() => {

  //   setTitle('aman')
  //   setDescription('oon')
  // }, [openedDocument])
  return (
    <section>
      <NavBar search={true} share={false} />

      <Documents />
      {/* <button onClick={handleCreateDocument}>Create document</button>
      <br />
      <button onClick={handleAddCollaborator}>Add Collaborator</button>
      <br />
      {userDocuments && userDocuments.map((doc: any) => (
        <>
          <button onClick={() => openDocument(doc)}> {doc.document._id} </button>
          <br />
        </>

      ))}
      <br />
      <br />
      {open &&
        (<>
          <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} />
          <br />
          <input type='text' value={description} onChange={(e) => setDescription(e.target.value)} />
          <button onClick={handleSubmit}>save</button>
        </>)} */}
    </section>
  )
}

export default Home