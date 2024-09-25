import { ConsumerManager } from "./ConsumerManager";

const  main = async()=>{
    await  ConsumerManager.getInstance().connect();
    await ConsumerManager.getInstance().consume();
    console.log(ConsumerManager.getInstance());
    
 }
 
 main();