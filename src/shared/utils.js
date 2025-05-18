function hasRequiredFields(obj, requiredFields) {
    return requiredFields.every(field => obj.hasOwnProperty(field) && obj[field] !== undefined && obj[field] !== null);
}

function safeJsonParse(str) {
    try {
        return JSON.parse(str);
    } catch {
        return null;
    }
}

module.exports = {
    hasRequiredFields,
    safeJsonParse,
};