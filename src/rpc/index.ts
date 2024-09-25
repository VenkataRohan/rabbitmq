import express from 'express';
import { RpcClient } from './RpcClient';


const app = express();

app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Done');
})

app.post('/',async(req,res)=>{
    
    const {msg } = req.body
    const rpcClient = new RpcClient();
    await rpcClient.connect();
    const resp = await rpcClient.sendAndAwait(msg);
    res.send(resp)
})



app.listen('3002',()=>{
    console.log('server on 3002');
})