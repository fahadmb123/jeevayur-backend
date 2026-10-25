export class NotFoundMiddleware {
    static handle(req, res) {
        res.status(404).json({
            success: false,
            error: {
                message: `Cannot ${req.method} ${req.originalUrl}`,
                statusCode: 404,
                timestamp: new Date().toISOString(),
            },
        });
    }
}
