const mongoose = require('mongoose');
const Debate = require('../../models/debate');
const Argument = require('../../models/argument');

const postDebate = async (req, res, next) => {

  /* TODO: Add more validation
   Requires more error handling ex. if creator is not a valid user
   or if endTime is not a valid date 
   or if topic is not a string
   or if status is not a string
   or if arguments is not an array
   or if arguments is not an array of valid argument ids
   or if it has an argument from a different debate 
   since debates can't share arguments */

    const { topic, endTime, creator } = req.body;
    const debate = new Debate(req.body);
    // Basic validation
    if (!topic || !endTime || !creator) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    // Check that endTime is in the future
    if (new Date(endTime) <= new Date()) {
      return res.status(400).json({ message: 'End time must be in the future' });
    }
  
    try {
      
      await debate.save();
      
    } catch (err) {
      return next(err);
    }
    res.status(201).json(debate);
  }

  const getDebates = async (req, res, next) => {

    // TODO: Add pagination and filtering options
    // e.g., limit, offset, sort, filter by status, etc.

    try {
        // Find all debates and populate references to creator and arguments
        const debates = await Debate.find();
        // Send the retrieved debates as JSON response
        res.json({ "debates": debates });
    } catch (err) {
        // Pass any errors to the next middleware (usually an error handler)
        return next(err);
    }
  }

  const deleteAllDebates = async (req, res, next) => {

    // TODO: Add more validation
    // e.g. check if user is an admin or if there are any debates to delete

    try {
      const result = await Debate.deleteMany();
      
      // Check if any debates were deleted
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'No debates found to delete' });
      }
      
      // Respond with the number of debates deleted
      res.status(200).json({ message: `${result.deletedCount} debates deleted successfully` });
      
    } catch (err) {
      return next(err);
    }
  }

  const deleteDebateByID = async (req, res, next) => {
    // TODO: check if user is an admin or if the debate exists
    
    const id = req.params.id; // Using const for id as it's not reassigned
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Invalid ID format' });
    }
    
    try {
      const debate = await Debate.findByIdAndDelete(id);
      if (!debate) {
        return res.status(404).json({ message: 'Debate not found' });
      }
      res.status(200).json({ message: 'Debate deleted successfully', debate });
    } catch (err) {
      return next(err);
    }
  }

  const getDebateByID = async (req, res, next) => {

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
  
    try {
      const debate = await Debate.findById(id);
      if (!debate) {
        return res.status(404).json({ message: 'Debate not found' });
      }
      res.status(200).json({ debate });
    } catch (err) {
      return next(err);
    }
  }

  const updateDebate = async (req, res, next) => {
    // TODO: Add more validation and error handling for debate owner or admin only access to update debates
    // check if the debate end time passed or not before updating, cause it should not be updated after the end time.
    
    const id = req.params.id;
    const {topic, status, endTime} = req.body;
  
    if (!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({message: "Invalid ID format"});
    }
  
    if (!topic || !endTime){
      return res.status(404).json({message: "Missing required fields"});
    }
  
    try {
      // Find the debate by ID and update
      const updatedDebate = await Debate.findByIdAndUpdate(
        id,
        { topic, status, endTime },
        { new: true, runValidators: true } // Return the updated document and run validation
      );
  
      // Check if the debate was found and updated
      if (!updatedDebate) {
        return res.status(404).json({ message: 'Debate not found' });
      }
  
      res.status(200).json({message: "Fields were updated", updatedDebate});
    } catch (err) {
      return next(err);
    }
  }

  const updateSpecificField = async (req, res, next) => {
    // TODO: Add more validation and error handling for debate owner or admin only access to update debates
    // check if the debate end time passed or not before updating, cause it should not be updated after the end time.
    
    const { id } = req.params; // Get id from URL
    const updateFields = req.body; // Get update fields from request body
  
    // Validate that id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
  
    try {
      const debate = await Debate.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });
  
      if (!debate) {
        return res.status(404).json({ message: 'Debate not found' });
      }
  
      res.status(200).json(debate);
    } catch (err) {
      return next(err);
    }
  }


  // section 2

  const addArgumentToDebate = async (req, res, next) => {
    // TODO: check if the argument user is one of the two debaters, and if the debate is still open
    // if the owner is not one of the debaters, return 403 Forbidden
    // if the debate is closed, return 403 Forbidden

    const { debate_id } = req.params;
    const { content, user_id } = req.body;
  
    try {
      const debate = await Debate.findById(debate_id);
      if (!debate) {
        return res.status(404).json({ message: 'Debate not found' });
      }
  
      // Create a new argument (assuming you have an Argument model)
      const argument = new Argument({ content, owner: user_id, debate: debate_id });
      await argument.save();
  
      // Add the argument to the debate's arguments array
      debate.arguments.push(argument._id);
      await debate.save();
  
      res.status(201).json(argument);
    } catch (err) {
      return next(err);
    }
  }

  const getAllArgumentsOfDebate = async (req, res, next) => {
    const { debate_id } = req.params;
  
    try {
      const debate = await Debate.findById(debate_id).populate('arguments');
      if (!debate) {
        return res.status(404).json({ message: 'Debate not found' });
      }
  
      res.status(200).json(debate.arguments);
    } catch (err) {
      return next(err);
    }
  }
  
  const getArgumentInDebate = async (req, res, next) => {
    const { debate_id, argument_id } = req.params;
  
    try {
      // Validate debate_id and argument_id
      if (!mongoose.Types.ObjectId.isValid(debate_id) || !mongoose.Types.ObjectId.isValid(argument_id)) {
        return res.status(400).json({ message: 'Invalid debate or argument ID format' });
      }
  
      // Find the debate and populate arguments
      const debate = await Debate.findById(debate_id).populate('arguments');
      if (!debate) {
        return res.status(400).json({ message: 'Debate not found' });
      }

      const argument = await Argument.findById(argument_id);
      if (!argument) {
        return res.status(404).json({ message: 'Argument not found'})
      }

      const isArgumentInDebate = debate.arguments.some(argId => argId.equals(argument._id));
      if (!isArgumentInDebate){
        return res.status(404).json({ message: 'Argument not associated with this debate'});
      }
  
      // Return the argument details
      res.status(200).json(argument);
    } catch (err) {
      return next(400); // Pass any errors to the error handling middleware
    }
  };
  
module.exports = { postDebate, getDebates, deleteAllDebates, deleteDebateByID, getDebateByID, updateDebate, updateSpecificField, addArgumentToDebate, getAllArgumentsOfDebate, getArgumentInDebate };