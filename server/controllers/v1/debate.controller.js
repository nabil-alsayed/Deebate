const mongoose = require('mongoose');
const Debate = require('../../models/debate');
const Argument = require('../../models/argument');
const User = require('../../models/user');

/* TODO: Add more validation
   Requires more error handling ex. if creator is not a valid user
   or if endTime is not a valid date 
   or if topic is not a string
   or if status is not a string
   or if arguments is not an array
   or if arguments is not an array of valid argument ids
   or if it has an argument from a different debate 
   since debates can't share arguments */

const postDebate = async (req, res, next) => {
  const { topic, category, endTime, creator, maxParticipants, participants } =
    req.body;

  // Basic validation
  if (!topic || !category || !endTime || !creator || !participants) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Check that endTime is in the future
  if (new Date(endTime) <= new Date()) {
    return res.status(400).json({ message: 'End time must be in the future' });
  }

  if (participants.length > maxParticipants) {
    return res
      .status(400)
      .json({ message: 'Participants number is exceeding the maximum limit' });
  }

  const minParticipants = Debate.schema.path('maxParticipants').options.min;

  if (participants.length < minParticipants) {
    return res
      .status(400)
      .json({ message: 'Participants number is below the minimum limit' });
  }

  try {
    // Fetch all participants
    const participantsDB = await User.find({ _id: { $in: participants } });

    // Create a Set of participant IDs
    const uniqueParticipants = new Set(
      participants.map((participant) => participant.toString())
    );

    // Check if the number of provided participants matches the number of unique IDs
    if (participants.length !== uniqueParticipants.size) {
      return res.status(400).json({ message: 'Participants should be unique' });
    }

    // Check if the number of fetched participants matches the provided participants
    if (participantsDB.length !== participants.length) {
      return res.status(400).json({
        message: 'One or more participants are not valid users/participants',
      });
    }

    // Create a new debate
    const debate = new Debate({
      topic,
      category,
      endTime,
      creator,
      maxParticipants,
      participants,
    });

    await debate.save();
    res.status(201).json(debate);
  } catch (err) {
    return next(err);
  }
};

const getDebates = async (req, res, next) => {
  // TODO: Add pagination and filtering options
  // e.g., limit, offset, sort, filter by status, etc.

  try {
    // Find all debates and populate references to creator and arguments
    const debates = await Debate.find();
    // Send the retrieved debates as JSON response
    res.json({ debates: debates });
  } catch (err) {
    // Pass any errors to the next middleware (usually an error handler)
    return next(err);
  }
};

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
    res
      .status(200)
      .json({ message: `${result.deletedCount} debates deleted successfully` });
  } catch (err) {
    return next(err);
  }
};

const deleteDebateByID = async (req, res, next) => {
  // TODO: check if user is an admin or if the debate exists

  const debateId = req.params.id; // Using const for id as it's not reassigned

  if (!mongoose.Types.ObjectId.isValid(debateId)) {
    return res.status(404).json({ message: 'Invalid ID format' });
  }

  try {
    const debate = await Debate.findByIdAndDelete(debateId);
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    res.status(200).json({ message: 'Debate deleted successfully', debate });
  } catch (err) {
    return next(err);
  }
};

const getDebateByID = async (req, res, next) => {
  const { debateId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(debateId)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const debate = await Debate.findById(debateId);
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    res.status(200).json({ debate });
  } catch (err) {
    return next(err);
  }
};

const updateDebate = async (req, res, next) => {
  // TODO: Add more validation and error handling for debate owner or admin only access to update debates
  // check if the debate end time passed or not before updating, cause it should not be updated after the end time.

  const debateId = req.params.id;
  const { topic, status, endTime } = req.body;

  if (!mongoose.Types.ObjectId.isValid(debateId)) {
    return res.status(404).json({ message: 'Invalid ID format' });
  }

  if (!topic || !endTime) {
    return res.status(404).json({ message: 'Missing required fields' });
  }

  try {
    // Find the debate by ID and update
    const updatedDebate = await Debate.findByIdAndUpdate(
      debateId,
      { topic, status, endTime },
      { new: true, runValidators: true } // Return the updated document and run validation
    );

    // Check if the debate was found and updated
    if (!updatedDebate) {
      return res.status(404).json({ message: 'Debate not found' });
    }

    res.status(200).json({ message: 'Fields were updated', updatedDebate });
  } catch (err) {
    return next(err);
  }
};

const updateSpecificField = async (req, res, next) => {
  // TODO: Add more validation and error handling for debate owner or admin only access to update debates
  // check if the debate end time passed or not before updating, cause it should not be updated after the end time.

  const { debateId } = req.params; // Get id from URL
  const updateFields = req.body; // Get update fields from request body

  // Validate that id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const debate = await Debate.findByIdAndUpdate(debateId, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }

    res.status(200).json(debate);
  } catch (err) {
    return next(err);
  }
};

const getArgumentInDebate = async (req, res, next) => {
  const { debateId, argumentId } = req.params;

  try {
    // Validate debateId and argumentId
    if (
      !mongoose.Types.ObjectId.isValid(debateId) ||
      !mongoose.Types.ObjectId.isValid(argumentId)
    ) {
      return res
        .status(400)
        .json({ message: 'Invalid debate or argument ID format' });
    }

    // Find the debate and populate arguments
    const debate = await Debate.findById(debateId).populate('arguments');
    if (!debate) {
      return res.status(400).json({ message: 'Debate not found' });
    }

    const argument = await Argument.findById(argumentId);
    if (!argument) {
      return res.status(404).json({ message: 'Argument not found' });
    }

    const isArgumentInDebate = debate.arguments.some((argId) =>
      argId.equals(argument._id)
    );
    if (!isArgumentInDebate) {
      return res
        .status(404)
        .json({ message: 'Argument not associated with this debate' });
    }

    // Return the argument details
    res.status(200).json(argument);
  } catch (err) {
    return next(400); // Pass any errors to the error handling middleware
  }
};

const deleteArgumentInDebate = async (req, res) => {
  const { debateId, argumentId } = req.params;

  try {
    // Validate debate_id and argument_id
    if (
      !mongoose.Types.ObjectId.isValid(debateId) ||
      !mongoose.Types.ObjectId.isValid(argumentId)
    ) {
      return res
        .status(400)
        .json({ message: 'Invalid debate or argument ID format' });
    }

    // Find the debate and populate arguments
    const debate = await Debate.findById(debateId);
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }

    // Find the argument
    const argument = await Argument.findById(argumentId);
    if (!argument) {
      return res.status(404).json({ message: 'Argument not found' });
    }

    // Check if the argument is part of the debate
    const isArgumentInDebate = debate.arguments.some((argId) =>
      argId.equals(argument._id)
    );

    if (!isArgumentInDebate) {
      return res
        .status(404)
        .json({ message: 'Argument not associated with this debate' });
    }

    // Remove the argument from the debate's arguments array
    debate.arguments = debate.arguments.filter(
      (argId) => !argId.equals(argument._id)
    );
    await debate.save();

    // Delete the argument document
    await Argument.findByIdAndDelete(argumentId);

    res
      .status(200)
      .json({ message: 'Argument deleted from debate successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const joinDebate = async (req, res, next) => {
  const { debateId } = req.params;
  const { userId } = req.body;

  console.log("debate id: ", debateId + " user id: ", userId);

  try {
    const debate = await Debate.findById(debateId);
    const user = await User.findById(userId);

    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (debate.participants.length >= debate.maxParticipants) {
      return res.status(400).json({ message: 'Debate is full' });
    }

    if (debate.participants.includes(userId)) {
      return res.status(400).json({ message: 'User already joined the debate' });
    }

    debate.participants.push(userId);

    await debate.save();

    res.status(200).json({ message: 'User joined the debate successfully' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  postDebate,
  getDebates,
  deleteAllDebates,
  deleteDebateByID,
  getDebateByID,
  updateDebate,
  updateSpecificField,
  getArgumentInDebate,
  deleteArgumentInDebate,
  joinDebate
};
