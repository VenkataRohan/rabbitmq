import { Channel, Connection, Replies, connect } from 'amqplib';

export class RpcServer {
    private static instance: RpcServer;
    private connection: Connection | null = null;
    private channel: Channel | null = null;
    private queue: Replies.AssertQueue | null = null
    constructor() { }

    public static getInstance() {

        if (!RpcServer.instance) {
            RpcServer.instance = new RpcServer();
        }
        return RpcServer.instance;
    }

    public async connect() {
        if (!this.connection) {
            this.connection = await connect('amqp://localhost');
            this.channel = await this.connection.createChannel();
            this.queue = await this.channel.assertQueue('rpc_queue', {
                durable: false
            });
            await this.channel.prefetch(1);
            await this.consume();
        }
    }

    public async consume() {
        console.log("kljh");
        
        if (!this.channel || !this.queue) return;

        console.log(' [*] Waiting for RPC requests');

        await this.channel.consume(
            this.queue.queue,
            async (msg) => {
                if (msg) {
                    console.log(" [x] %s:", msg.content.toString());
                    this.channel?.sendToQueue(msg.properties.replyTo, Buffer.from(msg.content.toString() + " from server"), {
                        correlationId: msg.properties.correlationId
                    });
                    this.channel?.ack(msg);
                }
            },
        );
    }


}

const main =async ()=>{
    await RpcServer.getInstance().connect();
    await RpcServer.getInstance().consume();
}

main()
