class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Response message
   * @param {*} data - Response data
   */
  constructor(statusCode, message, data = null) {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }

  /**
   * Send a standardized API response
   * @param {import('express').Response} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Response message
   * @param {*} data - Response data
   */
  static send(res, statusCode, message, data = null) {
    const response = new ApiResponse(statusCode, message, data);
    return res.status(statusCode).json(response);
  }
}

export default ApiResponse;
