class UserActivityLog {
    constructor({ id, userId, action, timestamp, metadata }) {
        this.id = id;
        this.userId = userId;
        this.action = action;
        this.timestamp = timestamp || new Date();
        this.metadata = metadata || {};
    }
}

module.exports = UserActivityLog;