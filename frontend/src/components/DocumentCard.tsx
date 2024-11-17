import { useEffect, useState } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store';
import { setCollaborators } from '../redux/features/collaboratorSlice';
import { setDocuments, setOpenedDocument } from '../redux/features/documentSlice';
import { useNavigate } from 'react-router-dom';
import apiClient from '../lib/apiClient';
import { DELETE_DOCUMENT } from '../utils/constants';
import { openToast } from '../redux/features/ToastSlice';

interface IProps {
  document: any;
}

const DocumentCard = ({ document }: IProps) => {
  const [recentOpened, setDate] = useState(document.recentlyOpened);
  const documents = useAppSelector((state: RootState) => state.documents.userDocuments);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const date = new Date(recentOpened);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    let newDate;

    if (isToday) {
      // Format as time, e.g., "2:30 PM"
      newDate = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    } else {
      // Format as date, e.g., "January 25, 2015"
      newDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    setDate(newDate)
  }, [])



  const openDocument = async () => {
    if (document.role === 'owner') {
      dispatch(setCollaborators({ collaborators: document.document.collaborators }))
    }

    const newDoc = { ...document.document };
    delete newDoc.collaborators;


    dispatch(setOpenedDocument({ openedDocument: { document: newDoc, role: document.role } }))

    navigate(`/document/${newDoc._id}`); // Navigate to the create-document page
  }

  const openMenu = async () => {
    try {
      const docId = document.document._id
      const response = await apiClient.delete(`${DELETE_DOCUMENT}/${docId}`,
        { withCredentials: true });
      if (response.data.success) {
        const newDocs = documents.filter(({ document }: any) => docId.toString() != document._id.toString())
        console.log(newDocs)

        dispatch(setDocuments({ documents: newDocs }))
        dispatch(openToast('Document deleted '))
      }

    } catch (error) {
      console.log(error)
    }






  }
  return (
    <div className=' border  w-[208px] mr-[20px] mb-[20px] ' onClick={openDocument} >
      <div className=' w-[208px] h-[180px] overflow-hidden relative '>
        <img className='object-cover absolute top-4  ' src='/images/document.png' alt='document image' />

      </div>
      <div className=' border-t pt-[16px] pb-[14px] pr-[8px] pl-[16px] overflow-hidden'>
        <h1 className=' text-[14px] text-nowrap '>{document.document.name}</h1>
        <div className=' flex pt-[2px] items-center'>
          <div className='w-[20px] h-[20px] rounded'>
            <img className='object-cover w-[20px] h-[20px]  ' src='/images/document2.png' alt='document image' />
          </div>
          <div className='w-[80%] align-middle '>
            <p className=' text-[12px] text-slate-500 pl-1 mt-[1px] '>{recentOpened}</p>
          </div>
          <button
            onClick={(event) => {
              event.stopPropagation(); // Prevents openDocument from being triggered
              openMenu();
            }}
            className='flex center rounded-full size-[28px] hover:bg-slate-100 cursor-pointer'
          >
            <img className='object-cover w-[25px] h-[25px]  ' src='/images/menu.png' alt='document image' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default DocumentCard