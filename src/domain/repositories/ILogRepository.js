class ILogRepository {
    async getAllLogs() {
        throw new Error('Method not implemented.');
    }

    async getLogById(id) {
        throw new Error('Method not implemented.');
    }

    async createLog(logData) {
        throw new Error('Method not implemented.');
    }

    async deleteLog(id) {
        throw new Error('Method not implemented.');
    }
}

module.exports = ILogRepository;