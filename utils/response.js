import { success } from "zod"

export function successResponse(res, data = {}, message = "Success", statusCode = 200, meta = {}) {
    return res.status(statusCode)
        .json({
            success: true,
            message,
            data,
            meta
        })
}

export function errorResponse(res, message = "Internal Server Error", statusCode = 500, error = null) {
    return res.status(statusCode)
        .json({
            success: false,
            error:error ? error.message : undefined,
            message,
        })
}