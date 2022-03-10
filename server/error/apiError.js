class ApiError extends Error{
    constructor(status, message) {
        super();
        this.status = status
        this.message = message
    }

    static badRequest(message){
        return new ApiError(404, message)//сервер не може знайти того, чого вимагає запит від клієнта, хоча контакт з сервером установлено
    }

    static internal(message){
        return new ApiError(500, message)//сервер не зміг виконати запит через непередбачену помилку
    }

    static forbidden(message){
        return new ApiError(403, message)// у відвідувача недостатньо прав для перегляду контенту
    }
}

module.exports = ApiError