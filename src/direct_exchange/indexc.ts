import express from 'express';
import { ProducerManager } from './ProducerManager';
import { ConsumerManager } from './ConsumerManager';

const app = express();

app.use(express.json());

app.get('/',async(req,res)=>{
    await ConsumerManager.getInstance().connect();
    await ConsumerManager.getInstance().consume();
    res.send('Done');
})



app.post('/addTopic',async(req,res)=>{
    const {topic} = req.body

    await ConsumerManager.getInstance().addTopic('slogs',topic);

    res.send('Done')
})

app.post('/removeTopic',async(req,res)=>{
    const {topic} = req.body

    await ConsumerManager.getInstance().removeTopic('slogs',topic);

    res.send('Done')
})

app.listen('3003',()=>{
    console.log('server on 3003');
})