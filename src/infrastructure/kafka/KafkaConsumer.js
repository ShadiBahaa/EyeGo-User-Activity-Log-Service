const kafka = require('../config/kafka');
const MongoLogRepository = require('../db/MongoLogRepository');
const { safeJsonParse } = require('../../shared/utils'); 

const topic = process.env.KAFKA_TOPIC || 'user-activity-logs';

const consumer = kafka.consumer({ groupId: process.env.KAFKA_CONSUMER_GROUP || 'eyeGoGroup' });

const runConsumer = async () => {
    let connected = false;
    while (!connected) {
        try {
            await consumer.connect();
            await consumer.subscribe({ topic, fromBeginning: false });
            connected = true;
            console.log('Kafka consumer connected and subscribed.');
        } catch (err) {
            console.warn('Kafka not ready, retrying in 3s:', err.message);
            await new Promise(res => setTimeout(res, 3000));
        }
    }

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const logData = safeJsonParse(message.value.toString());
                if (!logData) {
                    console.error('Invalid JSON in Kafka message');
                    return;
                }
                await MongoLogRepository.createLog(logData);
                console.log(`Consumed and saved log: ${JSON.stringify(logData)}`);
            } catch (error) {
                if (error.message.includes('leadership election')) {
                    console.warn('Kafka is electing a leader, will retry...');
                } else {
                    console.error('Error processing Kafka message:', error.message);
                }
            }
        },
    });
};

module.exports = { consumer, runConsumer };