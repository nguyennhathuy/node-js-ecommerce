// 'use strict';

const statusCode = {
    SUCCESS: 200,
    CREATED: 201,
};

const reasonStatusCode = {
    SUCCESS: 'Success',
    CREATED: 'Created',
}

class SuccessResponse {
    constructor({
        message,
        status = statusCode.SUCCESS,
        reason = reasonStatusCode.SUCCESS,
        metadata = {}
    }) {
        this.message = !message? reasonStatusCode : message
        this.status = reason
        this.code = status
        this.metadata = metadata
    }

    send(res, headers = {}) {
        return res.status(this.code).json(this)
    }
}
class Success extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata })
    }
}

class Created extends SuccessResponse {
    constructor({
        message,
        status = statusCode.CREATED,
        reason = reasonStatusCode.CREATED,
        metadata = {}
    }) {
        super({ message, status, reason, metadata })
    }
}

module.exports = {
    Success,
    Created
};