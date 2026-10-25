import { sendCreated, sendError, sendOk } from '../http/response.js';
export class BaseController {
    sendOk(res, data) {
        sendOk(res, data);
    }
    sendCreated(res, data) {
        sendCreated(res, data);
    }
    sendError(res, message, statusCode = 500) {
        sendError(res, message, statusCode);
    }
}
