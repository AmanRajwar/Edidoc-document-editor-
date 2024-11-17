import {app} from "./app";
import setupSocket from "./socket";
import connectDB from "./utils/db";
// import './types.d.ts';

const port = 8000


const server = app.listen(port,()=>{
    console.log( "server is up and running on port " , port)
    connectDB();
}).on('error',(error)=>{
    console.log('error while running the server :', error)
})

setupSocket(server);