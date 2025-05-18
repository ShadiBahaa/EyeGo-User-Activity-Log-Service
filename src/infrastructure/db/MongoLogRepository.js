const mongoose = require('mongoose');
const ILogRepository = require('../../domain/repositories/ILogRepository');
const UserActivityLog = require('../../domain/entities/UserActivityLog');

// Counter schema for auto-increment
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', counterSchema);

// Log schema with numeric id
const userActivityLogSchema = new mongoose.Schema({
    id: { type: Number, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    action: { type: String, required: true, index: true },
    timestamp: { type: Date, default: Date.now, index: true },
    metadata: { type: Object, default: {} }
});
const UserActivityLogModel = mongoose.model('UserActivityLog', userActivityLogSchema);

// Helper to get next sequence number
async function getNextSequence(name) {
    const counter = await Counter.findByIdAndUpdate(
        name,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return counter.seq - 1; // Start from 0
}

class MongoLogRepository extends ILogRepository {
    static async getAllLogs() {
        const logs = await UserActivityLogModel.find({}).sort({ id: 1 });
        return logs.map(log => new UserActivityLog(log.toObject()));
    }

    static async getLogsPaginated(filter, page, limit) {
        const skip = (page - 1) * limit;
        const query = UserActivityLogModel.find(filter).sort({ id: 1 }).skip(skip).limit(limit);
        const [logs, total] = await Promise.all([
            query.exec(),
            UserActivityLogModel.countDocuments(filter)
        ]);
        return {
            logs: logs.map(log => new UserActivityLog(log.toObject())),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    static async getLogById(id) {
        const log = await UserActivityLogModel.findOne({ id: Number(id) });
        return log ? new UserActivityLog(log.toObject()) : null;
    }

    static async createLog(logData) {
        const nextId = await getNextSequence('userActivityLogId');
        const log = new UserActivityLogModel({ ...logData, id: nextId });
        const savedLog = await log.save();
        return new UserActivityLog(savedLog.toObject());
    }

    static async deleteLog(id) {
        const result = await UserActivityLogModel.findOneAndDelete({ id: Number(id) });
        return !!result;
    }
}

module.exports = MongoLogRepository;