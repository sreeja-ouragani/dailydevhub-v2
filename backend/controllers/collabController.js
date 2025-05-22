import CollabRequest from "../models/CollabRequest.js";

// Send a collab request
export const sendCollabRequest = async (req, res, next) => {
  try {
    const { toUser, projectRole, message } = req.body;
    if (req.user.id === toUser) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }
    const collab = new CollabRequest({
      fromUser: req.user.id,
      toUser,
      projectRole,
      message,
    });
    await collab.save();
    res.status(201).json(collab);
  } catch (error) {
    next(error);
  }
};

// Get received collab requests
export const getReceivedCollabs = async (req, res, next) => {
  try {
    const requests = await CollabRequest.find({ toUser: req.user.id })
      .populate("fromUser", "username email")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

// Respond to a collab request (accept/reject)
export const respondCollabRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "accepted" or "rejected"
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const request = await CollabRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    if (request.toUser.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    request.status = status;
    await request.save();
    res.json(request);
  } catch (error) {
    next(error);
  }
};

// ✅ NEW: Get sent collaboration requests
export const getSentCollabs = async (req, res, next) => {
  try {
    const requests = await CollabRequest.find({ fromUser: req.user.id })
      .populate("toUser", "username email")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

// ✅ NEW: Get accepted (ongoing) collaborations
export const getOngoingCollabs = async (req, res, next) => {
  try {
    const requests = await CollabRequest.find({
      $or: [
        { fromUser: req.user.id },
        { toUser: req.user.id }
      ],
      status: "accepted"
    })
      .populate("fromUser", "username email")
      .populate("toUser", "username email")
      .sort({ updatedAt: -1 });

    res.json(requests);
  } catch (error) {
    next(error);
  }
};
