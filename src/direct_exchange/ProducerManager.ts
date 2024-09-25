import { Channel, Connection,Replies, connect } from 'amqplib';


export class ProducerManager {
    private static instance: ProducerManager;
    private connection: Connection | null = null;
    private channel: Channel | null = null;
    constructor() { }

    public static getInstance() {
        if (!ProducerManager.instance) {
            ProducerManager.instance = new ProducerManager();
        }
        return ProducerManager.instance;
    }

    public async connect() {
        if (!this.connection) {
            this.connection = await connect('amqp://localhost');
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange('slogs', 'direct', { durable: false });
        }
    }

    public async publish(msg : string,topic : string) {
        if (!this.channel) {
            return;
        }
        console.log(topic);
        
        this.channel.publish('slogs', topic, Buffer.from(msg));  
    }

}
