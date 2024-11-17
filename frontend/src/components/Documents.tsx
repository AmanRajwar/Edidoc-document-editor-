import React, { useState, useEffect, useRef } from 'react';
import DocumentCard from './DocumentCard';
import { RootState, useAppDispatch, useAppSelector } from '../redux/store';
import apiClient from '../lib/apiClient';
import { setDocuments, setNotUserDocument, setOnlyUserDocument } from '../redux/features/documentSlice';
import AddDocument from './AddDocument';
import Dropdown from './Dropdown';
import { GET_ALL_DOCUMENTS } from '../utils/constants';
import DocumentEditor from '../pages/document/DocumentEditor';

type OwnershipOption = 'Owned by me' | 'Owned by anyone' | 'Not owned by me';

const Documents = () => {

    const dispatch = useAppDispatch();
    const ownershipOptions: OwnershipOption[] = ['Owned by me', 'Owned by anyone', 'Not owned by me'];
    const [selectedOwnership, setSelectedOwnership] = useState<OwnershipOption>('Owned by anyone');


    const allDocuments = useAppSelector((state: RootState) => state.documents.userDocuments);
    const notUserDocuments = useAppSelector((state: RootState) => state.documents.notUserDocuments);
    const userDocuments = useAppSelector((state: RootState) => state.documents.onlyUserDocuments);

    const getAllDocuments = async () => {
        try {
            const response = await apiClient.get(GET_ALL_DOCUMENTS,
                { withCredentials: true });
            if (response.data.documents.length !== 0) {
                dispatch(setDocuments({ documents: response.data.documents }))
                const onlyUsersDoc = response.data.documents.filter((document: any) => document.role == 'owner')
                dispatch(setOnlyUserDocument({ documents: onlyUsersDoc }))
                const notUsersDoc = response.data.documents.filter((document: any) => document.role != 'owner')
                dispatch(setNotUserDocument({ documents: notUsersDoc }))
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllDocuments();
    }, [])



    // useEffect(() => {
    //     if (selectedOwnership == 'Owned by me') {
    //         const newDocs = documents.filter((document: any) => document.role == 'owner');
    //         console.log(newDocs)
    //         dispatch(setDocuments({ documents: newDocs }))
    //     }
    // }, [ownershipOptions])


    return (
        <>
            <div className='m-auto w-[1150px] text-[16px] mt-4 '>
                <div className='flex justify-between mb-4'>
                    <h1 className='text-[16px] font-bold tracking-wide text-slate-700'>Recent Document</h1>
                    <Dropdown options={ownershipOptions}
                        selectedOption={selectedOwnership}
                        onOptionSelect={(option) => setSelectedOwnership(option)}
                    />
                </div>
                {allDocuments ? <></> : <>Loading</>}
                <div className='flex'>
                    {(allDocuments && selectedOwnership == 'Owned by anyone') && allDocuments.map((document: any) => (
                        <DocumentCard document={document} />
                    ))}

                    {(notUserDocuments && selectedOwnership == 'Not owned by me') && notUserDocuments.map((document: any) => (
                        <DocumentCard document={document} />
                    ))}
                    {(userDocuments && selectedOwnership == 'Owned by me') && userDocuments.map((document: any) => (
                        <DocumentCard document={document} />
                    ))}
                </div>
            </div>
            <AddDocument />
        </>
    );
};

export default Documents;
