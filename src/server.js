const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./infrastructure/config/db');
const logRoutes = require('./api/routes/logRoutes');
const { runConsumer } = require('./infrastructure/kafka/KafkaConsumer');
const mongoose = require('mongoose');
const { producer } = require('./infrastructure/kafka/KafkaProducer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/logs', logRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.send('EyeGo User Activity Log Service is running.');
});

app.get('/health', async (req, res) => {
    let mongoStatus = 'down';
    let kafkaStatus = 'down';
    try {
        mongoStatus = mongoose.connection.readyState === 1 ? 'up' : 'down';
    } catch {}
    try {
        await producer.connect();
        kafkaStatus = 'up';
        await producer.disconnect();
    } catch {}
    res.json({ mongo: mongoStatus, kafka: kafkaStatus });
});

const startServer = async () => {
    try {
        await connectDB();
        await producer.connect(); // Ensure producer is connected at startup
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
        runConsumer().catch(err => {
            console.error('Kafka consumer failed to start:', err.message);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing gracefully');
    await producer.disconnect();
    await mongoose.disconnect();
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing gracefully');
    await producer.disconnect();
    await mongoose.disconnect();
    process.exit(0);
});

startServer();