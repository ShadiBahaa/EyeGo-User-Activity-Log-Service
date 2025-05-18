const kafka = require('../config/kafka');

const topic = process.env.KAFKA_TOPIC || 'user-activity-logs';

const producer = kafka.producer();


const sendLogMessage = async (logData) => {
    await producer.connect();
    await producer.send({
        topic,
        messages: [{ value: JSON.stringify(logData) }],
    });
};

module.exports = { producer, sendLogMessage };
