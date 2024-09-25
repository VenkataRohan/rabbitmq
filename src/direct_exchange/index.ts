import express from 'express';
import { ProducerManager } from './ProducerManager';
import { ConsumerManager } from './ConsumerManager';

const app = express();

app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Done');
})

app.post('/',async(req,res)=>{
    
    const {msg , topic} = req.body

    await ProducerManager.getInstance().connect();
    await ProducerManager.getInstance().publish(msg,topic);
    res.send('Done')
})



app.listen('3002',()=>{
    console.log('server on 3002');
})