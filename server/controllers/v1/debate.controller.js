/* This controller is for managing the Debate Endpoints */

const mongoose = require('mongoose');
const Debate = require('../../models/debate');
const User = require('../../models/user');

const voteDebate = async (req, res) => {
  const { debateId } = req.params;
  const { userId } = req.body;
  const { vote } = req.query;

  const allowedVotes = ['with', 'against'];

  try {
    // Find the debate and user
    const debate = await Debate.findById(debateId);
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }

    const userAlreadyVotedWith = debate.votesWith.includes(userId);
    const userAlreadyVotedAgainst = debate.votesAgainst.includes(userId);

    // Prevent users from voting more than once or changing their vote
    if (userAlreadyVotedWith || userAlreadyVotedAgainst) {
      // remove the vote from the respective list
      const voteList = userAlreadyVotedWith ? debate.votesWith : debate.votesAgainst;
      const voteIndex = voteList.indexOf(userId);
      voteList.splice(voteIndex, 1);

      return res.status(400).json({ message: 'User already voted. Vote removed successfully' });
    }

    // Validate the vote type (either 'with' or 'against')
    if (!allowedVotes.includes(vote)) {
      return res.status(400).json({ message: 'Invalid vote type. Must be "with" or "against"' });
    }

    // Add the user to the respective vote list
    if (vote === 'with') {
      debate.votesWith.push(userId);
    } else if (vote === 'against') {
      debate.votesAgainst.push(userId);
    }

    // Save the updated debate with the votes
    await debate.save();

    // Respond with the updated debate info
    res.status(200).json({
      message: 'Vote cast successfully',
      debate: {
        topic: debate.topic,
        votesWith: debate.votesWith.length,
        votesAgainst: debate.votesAgainst.length,
      },
    });
  } catch (error) {
    console.error('Error voting on debate:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const postDebate = async (req, res, next) => {
  const { topic, category, endTime, owner, maxParticipants, participants } =
    req.body;

  // Basic validation
  if (!topic || !category || !endTime || !owner || !participants) {
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

  if( mongoose.Types.ObjectId.isValid(owner) === false){
    return res.status(400).json({ message: 'Invalid owner ID format' });
  }

  try {
    // Fetch all participants
    const participantsDB = await User.find({ _id: { $in: participants } });

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
      owner,
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

    let query = Debate.find(filter).populate('owner', 'username');

    // If sort is provided, apply sorting by the debate end time
    if (sort) {
      if (!allowedSortOrders.includes(sort)) {
        return res.status(400).json({ message: 'Invalid sort order' });
      }
      const sortOption = sort === asc ? 1 : -1;
      query = query.sort({ endTime: sortOption });
    }

    // Execute the query and get the debates
    const debates = await query;

    // Send the debates along with HATEOAS links
    res.status(200).json({
      debates: debates.map(debate => ({
        ...debate.toObject(),
        links: {
          self: `${req.protocol}://${req.get('host')}${req.baseUrl}/${debate._id}`,
          arguments: `${req.protocol}://${req.get('host')}${req.baseUrl}/${debate._id}/arguments`,
          update: `${req.protocol}://${req.get('host')}${req.baseUrl}/${debate._id}`,
          delete: `${req.protocol}://${req.get('host')}${req.baseUrl}/${debate._id}`
        }
      })),
    });
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
      .status(200)
      .json({ message: `${result.deletedCount} debates deleted successfully` });
  } catch (err) {
    return next(err);
  }
};

const deleteDebateByID = async (req, res, next) => {
  const { debateId } = req.params;

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
    const results = await Debate.deleteMany({ owner: userId });

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
    const result = await Debate.findOneAndDelete({ owner: userId, _id: debateId });

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
  voteDebate,
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
