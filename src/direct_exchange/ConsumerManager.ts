import { Channel, Connection, Replies, connect } from 'amqplib';

export class ConsumerManager {
    private static instance: ConsumerManager;
    private connection: Connection | null = null;
    private channel: Channel | null = null;
    private queue: Replies.AssertQueue | null = null
    constructor() { }

    public static getInstance() {

        if (!ConsumerManager.instance) {
            ConsumerManager.instance = new ConsumerManager();
        }
        return ConsumerManager.instance;
    }

    public async connect() {
        if (!this.connection) {
            this.connection = await connect('amqp://localhost');
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange('slogs', 'direct', { durable: false });
            this.queue = await this.channel.assertQueue('', { exclusive: true });
            console.log(await this.channel.bindQueue(this.queue.queue, 'slogs', 't@depth'))
        }
    }

    public async consume() {
        if (!this.channel || !this.queue) return;

        const exchange = 'slogs'
        console.log(' [*] Waiting for logs. To exit press CTRL+C');

        await this.channel.consume(
            this.queue.queue,
            async (msg) => {
                if (msg) {
                    console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
                }
            },
            { noAck: true }
        );
    }

    public async addTopic(exchange: string, topic: string) {
        if (!this.channel || !this.queue) return;

        await this.channel.bindQueue(this.queue.queue, 'slogs', topic);
    }

    public async removeTopic(exchange: string, topic: string) {
        if (!this.channel || !this.queue) return;

        await this.channel.unbindQueue(this.queue.queue, 'slogs', topic);
    }
}


