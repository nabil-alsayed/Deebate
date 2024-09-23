/* This controller is for managing the Debate Endpoints */

const mongoose = require('mongoose');
const Debate = require('../../models/debate');
const Argument = require('../../models/argument');
const User = require('../../models/user');


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

  if( mongoose.Types.ObjectId.isValid(creator) === false){
    return res.status(400).json({ message: 'Invalid creator ID format' });
  }

  const minParticipants = Debate.schema.path('maxParticipants').options.min;

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
  try {
    const { category, status, sort } = req.query;
    const allowedCategories = Debate.schema.path('category').enumValues;
    const allowedStatus = Debate.schema.path('status').enumValues;
    const allowedSortOrders = ['asc', 'desc'];
    const asc = allowedSortOrders[0];

    let filter = {};

    // If category specified, add it to the filter
    if (category) {
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({ message: 'Invalid category' });
      }
      filter.category = category;
    }

    // If status specified, add it to the filter
    if (status) {
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      filter.status = status;
    }

    let query = Debate.find(filter);

    // If sortOrder is provided, apply sorting by totalVotes
    if (sort) {
      if (!allowedSortOrders.includes(sort)) {
        return res.status(400).json({ message: 'Invalid sort order' });
      }
      const sortOption = sort === asc ? 1 : -1;
      query = query.sort({ endTime: sortOption });
    }

    // Execute the query and get the debates
    const debates = await query;

    res.status(200).json({ debates });
  } catch (err) {
    return next(err);
  }
};


const deleteAllDebates = async (req, res, next) => {

  try {
    const result = await Debate.deleteMany();

    // Check if any debates were deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No debates found to delete' });
    }

    // Respond with the number of debates deleted
    res
      .status(204)
      .json({ message: `${result.deletedCount} debates deleted successfully` });
  } catch (err) {
    return next(err);
  }
};

const deleteDebateByID = async (req, res, next) => {
  // TODO: check if user is an admin or if the debate exists

  const { debateId } = req.params; // Using const for id as it's not reassigned

  if (!mongoose.Types.ObjectId.isValid(debateId)) {
    return res.status(404).json({ message: 'Invalid ID format' });
  }

  try {
    const debate = await Debate.findByIdAndDelete(debateId);
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    res.status(204).json({ message: 'Debate deleted successfully', debate });
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
  const { debateId } = req.params; 
  const updatedFields = req.body; 

  // Validate that id 
  if (!mongoose.Types.ObjectId.isValid(debateId)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    // Find the debate and update it
    const updatedDebate = await Debate.findOneAndUpdate(
      {
        _id: debateId,
        endTime: { $gt: new Date() }, // Only update if debate hasn't ended
      },
      updatedFields,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDebate) {
      return res.status(404).json({ message: 'Debate not found or already ended' });
    }

    res.status(200).json(updatedDebate);
  } catch (err) {
    return next(err);
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

    debate.participants.push(user._id);

    await debate.save();

    res.status(200).json({ message: 'User joined the debate successfully' });
  } catch (error) {
    return next(error);
  }
}

const deleteAllUserDebates = async (req, res, next) => {
  const { userId } = req.params;

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete all debates owned by the user 
    const results = await Debate.deleteMany({ creator: userId });

    // Check if any debates were deleted
    if (results.deletedCount === 0) {
      return res.status(404).json({ message: 'No debates found for this user' });
    }

    return res.status(204).json({ message: `${results.deletedCount} debates deleted successfully` });
  } catch (err) {
    return next(err);
  }
};

const deleteSpecificUserDebate = async (req, res, next) => {
  const { userId, debateId } = req.params;

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete specific debate owned by the user
    const result = await Debate.findOneAndDelete({ creator: userId, _id: debateId });

    // Check if a debate was deleted
    if (!result) {
      return res.status(404).json({ message: 'No debate found for this user with the specified ID' });
    }

    return res.status(204).json({ message: `Debate --> ${result.topic} <-- deleted successfully` });
  } catch (err) {
    return next(err);
  }
};
    

module.exports = {
  postDebate,
  getDebates,
  deleteAllDebates,
  deleteDebateByID,
  deleteAllUserDebates,
  deleteSpecificUserDebate,
  getDebateByID,
  updateDebate,
  joinDebate
};
