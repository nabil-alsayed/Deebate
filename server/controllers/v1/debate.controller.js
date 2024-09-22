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
    const { category, status, sortOrder, limit = 10, page = 1 } = req.query; // Default limit of 10 debates per page
    const allowedFilters = [...Debate.schema.path('category').enumValues, ...Debate.schema.path('status').enumValues];

    let filter = {};

    // If category specified, add it to the filter
    if (category) {
      if (!allowedFilters.includes(category)) {
        return res.status(400).json({ message: 'Invalid category' });
      }
      filter.category = category;
    }

    // If status specified, add it to the filter
    if (status) {
      filter.status = status;
    }

    let query = Debate.find(filter);

    // If sortOrder is provided, apply sorting by totalVotes
    if (sortOrder) {
      const sortOption = sortOrder === 'asc' ? 1 : -1;
      query = query.sort({ totalVotes: sortOption });
    }

    // Pagination logic
    const debatesPerPage = parseInt(limit, 10); // Number of debates per page
    const currentPage = parseInt(page, 10); // Current page number

    const totalDebates = await Debate.countDocuments(filter); // Get total number of debates matching the filter

    // Apply pagination: skip documents to match the current page and limit the number of results
    query = query.skip((currentPage - 1) * debatesPerPage).limit(debatesPerPage);

    const debates = await query; // Execute the query

    // Return paginated response with metadata
    res.status(200).json({
      totalDebates, // Total number of debates that match the filter
      currentPage,
      totalPages: Math.ceil(totalDebates / debatesPerPage),
      debates,
    });
  } catch (err) {
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
    res
      .status(200)
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

  const { debateId } = req.params; // Get id from URL
  const updatedFields = req.body; // Get update fields from request body

  // Validate that id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(debateId)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const debate = await Debate.findByIdAndUpdate(debateId, updatedFields, {
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

    return res.status(200).json({ message: `${results.deletedCount} debates deleted successfully` });
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

    return res.status(200).json({ message: `Debate --> ${result.topic} <-- deleted successfully` });
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
