import { createContext, useContext, useEffect, useState } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { io, Socket } from "socket.io-client";
import { HOST } from "../utils/constants";
import { setOpenedDocument } from "../redux/features/documentSlice";

const socketContext = createContext<Socket | undefined>(undefined);

export const useSocket = () => {
    return useContext(socketContext);
};

type SocketProviderProps = {
    children: React.ReactNode;
};

export const SocketProvider = ({ children }: SocketProviderProps) => {
    const dispatch = useAppDispatch();
    const [socket, setSocket] = useState<Socket | undefined>(undefined);
    const { user } = useAppSelector((state: RootState) => state.user);
    const openedDocument = useAppSelector((state: RootState) => state.documents.openedDocument)
    useEffect(()=>{

    },[openedDocument])

    useEffect(() => {
        if (user) {
            const newSocket = io(HOST, {
                withCredentials: true,
                query: { userId: user.id }
            });

            newSocket.on('connect', () => {
                console.log('Connected to the socket server');
            });

            newSocket.on('documentEdited', (data: any) => {
                console.log("data",openedDocument,data)
                dispatch(
                    setOpenedDocument({openedDocument:{
                        ...openedDocument, // Spread the existing state
                        document: { // Update the `document` field
                            ...openedDocument.document, // Spread existing `document` properties
                            data: data // Update the `data` property
                        }}
                    })
                );
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        }
    }, [user,openedDocument,dispatch]);

    return (
        <socketContext.Provider value={socket}>
            {children}
        </socketContext.Provider>
    );
};
