export const sendOk = (res, data) => {
    res.status(200).json(data);
};
export const sendCreated = (res, data) => {
    res.status(201).json(data);
};
export const sendError = (res, message, statusCode = 500) => {
    res.status(statusCode).json({
        success: false,
        error: { message, statusCode, timestamp: new Date().toISOString() },
    });
};
