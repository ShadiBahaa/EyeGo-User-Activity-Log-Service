const MongoLogRepository = require('../infrastructure/db/MongoLogRepository');
class LogService {
    static async getAllLogs() {
        return await MongoLogRepository.getAllLogs();
    }

    static async getLogsPaginated(filter, page, limit) {
        return await MongoLogRepository.getLogsPaginated(filter, page, limit);
    }

    static async getLogById(id) {
        return await MongoLogRepository.getLogById(id);
    }

    static async createLog(logData) {
        return await MongoLogRepository.createLog(logData);
    }

    static async deleteLog(id) {
        return await MongoLogRepository.deleteLog(id);
    }
}

module.exports = LogService;