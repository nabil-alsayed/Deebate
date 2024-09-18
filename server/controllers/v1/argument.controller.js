const Argument = require('../../models/argument');

const getArgumentById = async (req, res, next) => {
    const { id } = req.params; // Extract argument ID from URL parameters
  
    try {
      // Find the argument by its ID
      const argument = await Argument.findById(id);
  
      // If argument not found, return a 404 error
      if (!argument) {
        return res.status(404).json({ message: 'Argument not found' });
      }
  
      // Return the found argument
      res.status(200).json(argument);
    } catch (err) {
      console.error("Error fetching argument:", err);
      return next(err); // Pass error to centralized error handler
    }
  };

  module.exports = { getArgumentById }