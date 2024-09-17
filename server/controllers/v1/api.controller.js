const express = require('express');
const router = express.Router();

// Welcome Message for API Root
const getApiRoot = (req, res) => {
  res.json({ message: 'Welcome to the DIT342 Debate Platform API!' });
};

// Not Found Handler for Non-existing Routes
const handleNotFound = (req, res) => {
  res.status(404).json({ message: 'API endpoint not found.' });
};

// General Error Handler Middleware
const handleError = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
};

module.exports = {
  getApiRoot,
  handleNotFound,
  handleError
};
