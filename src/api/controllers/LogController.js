const LogService = require('../../application/LogService');
const { sendLogMessage } = require('../../infrastructure/kafka/KafkaProducer');
const { hasRequiredFields } = require('../../shared/utils'); 

class LogController {
    static async getAllLogs(req, res) {
        try {
            // Pagination
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            // Filtering
            const filter = {};
            if (req.query.userId) filter.userId = req.query.userId;
            if (req.query.action) filter.action = req.query.action;
            if (req.query.startDate || req.query.endDate) {
                filter.timestamp = {};
                if (req.query.startDate) filter.timestamp.$gte = new Date(req.query.startDate);
                if (req.query.endDate) filter.timestamp.$lte = new Date(req.query.endDate);
            }

            const result = await LogService.getLogsPaginated(filter, page, limit);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching logs', error: error.message });
        }
    }

    static async getLogById(req, res) {
        try {
            const { id } = req.params;
            if (isNaN(Number(id))) {
                return res.status(400).json({ message: 'Invalid log ID format' });
            }
            const log = await LogService.getLogById(id);
            if (!log) {
                return res.status(404).json({ message: 'Log not found' });
            }
            res.status(200).json(log);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching log', error: error.message });
        }
    }

    static async createLog(req, res) {
        // Validate required fields
        const requiredFields = ['userId', 'action'];
        if (!hasRequiredFields(req.body, requiredFields)) {
            return res.status(400).json({ message: 'Missing required fields: userId, action' });
        }
        try {
            await sendLogMessage(req.body);
            res.status(202).json({
                message: 'Log sent to Kafka for processing. It may take a moment to appear in the logs list.'
            });
        } catch (error) {
            res.status(400).json({ message: 'Error sending log to Kafka', error: error.message });
        }
    }

    static async deleteLog(req, res) {
        try {
            const { id } = req.params;
            if (isNaN(Number(id))) {
                return res.status(400).json({ message: 'Invalid log ID format' });
            }
            const deleted = await LogService.deleteLog(id);
            if (!deleted) {
                return res.status(404).json({ message: 'Log not found' });
            }
            res.status(200).json({ message: 'Log deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting log', error: error.message });
        }
    }
}

module.exports = LogController;