import { useCallback, useEffect, useState } from "react"
import Quill from "quill"
import './styles.css'
import "quill/dist/quill.snow.css"
import { useParams } from "react-router-dom"
import NavBar from "../../components/NavBar"
import { FaSave } from "react-icons/fa"
import apiClient from "../../lib/apiClient"
import { CREATE_DOCUMENT, UPDATE_OWN_DOCUMENT } from "../../utils/constants"
import { RootState, useAppDispatch, useAppSelector } from "../../redux/store"
import { useSocket } from "../../contexts/socketContext"
import { setCollaborators } from "../../redux/features/collaboratorSlice"
import { setOpenedDocument } from "../../redux/features/documentSlice"
import { openToast } from "../../redux/features/ToastSlice"

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["blockquote", "code-block"],
  ["clean"],
]

export default function DocumentEditor() {
  const socket = useSocket();
  const { id: documentId } = useParams()
  const [quill, setQuill] = useState<any>()
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state: RootState) => state.user);
  const collaborators = useAppSelector((state: RootState) => state.collaborators.collaborators);
  const openedDocument = useAppSelector((state: RootState) => state.documents.openedDocument)

  const wrapperRef = useCallback((wrapper: any) => {
    if (wrapper == null) return;
    wrapper.innerHTML = ""
    const editor = document.createElement("div")
    wrapper.append(editor)
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    })
    q.setText("Loading...")
    setQuill(q)
  }, [])



  useEffect(() => {
    if (quill && documentId) {
    
      quill.setContents(openedDocument.document.data);
      if (openedDocument.role === 'viewer') {
        quill.disable()
      }
    }
  }, [quill,openedDocument])

  //saving the document in database
  const handleSave = async () => {
    try {
      if (quill) {
        const delta = quill.getContents();

        //create document if not created 
        if (!openedDocument) {
          const response = await apiClient.post(CREATE_DOCUMENT,
            { data: delta },
            { withCredentials: true });
          console.log("response abc", response)

          const document = response.data;
          dispatch(setCollaborators({ collaborators: document.document.collaborators }))
          const newDoc = { ...document.document };
          delete newDoc.collaborators;

          dispatch(setOpenedDocument({ openedDocument: { document: newDoc, role: 'owner' } }))

        } else {
          // else update document

          console.log('user', openedDocument, user);
          if (openedDocument.role === 'owner') {
            const response = await apiClient.post(`${UPDATE_OWN_DOCUMENT}/${openedDocument.document._id}`,
              { data: delta },
              { withCredentials: true });

            if (response.data.success) {
              dispatch(openToast('Updated successfully'))
              if (socket) {
           
                socket.emit('editDocument', {
                  openedDocumentId: openedDocument._id,
                  data: delta,
                  collaborators
                })
              }
            }
          }
        }

      }
    } catch (error: any) {
      console.log(error)
      // dispatch(openToast(error.response.data.message));
    }
  }

  return <>
    <NavBar search={false} share={true} />
    <div className="container 2xl:max-w-[100vw] -z-0" ref={wrapperRef}></div>
    <div
      onClick={handleSave}
      className="fixed  z-20  bottom-5 right-5 newShadow border size-[56px] rounded-full flex center cursor-pointer"
    >
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div
          className={`absolute`}
        >
          <FaSave className="text-xl text-blue-600" />
        </div>
      </div>
    </div>

  </>

}


