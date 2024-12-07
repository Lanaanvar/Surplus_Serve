import app from "./server"

// Export the app as a serverless function
export default (req, res) => app(req, res);