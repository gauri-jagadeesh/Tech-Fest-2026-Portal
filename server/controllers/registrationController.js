import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import crypto from 'crypto';

// Helper to generate a unique ticket code: e.g. TF26-HACK-48B2
const generateTicketCode = (category = 'EVT') => {
  const prefix = category.substring(0, 4).toUpperCase();
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `TF26-${prefix}-${randomHex}`;
};

// @desc    Register for an event
// @route   POST /api/registrations
// @access  Private
export const registerForEvent = async (req, res, next) => {
  try {
    const { eventId, teamName, teamMembers, notes } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required',
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check capacity
    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Registration is closed: This event has reached full capacity!',
      });
    }

    // Check if user already registered
    const existingRegistration = await Registration.findOne({
      user: req.user._id,
      event: eventId,
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You have already registered for this event!',
        ticketCode: existingRegistration.ticketCode,
      });
    }

    // Generate unique ticket code
    const ticketCode = generateTicketCode(event.category);

    const registration = await Registration.create({
      user: req.user._id,
      event: eventId,
      teamName: teamName || `${req.user.name}'s Team`,
      teamMembers: teamMembers || [],
      ticketCode,
      status: 'Confirmed',
      notes: notes || '',
    });

    // Increment registered count on event
    event.registeredCount += 1;
    await event.save();

    // Populate event details before returning
    const populated = await Registration.findById(registration._id).populate('event');

    res.status(201).json({
      success: true,
      data: populated,
      message: `Registration successful! Your Ticket Code is ${ticketCode}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's registrations
// @route   GET /api/registrations/my
// @access  Private
export const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('event')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel registration
// @route   DELETE /api/registrations/:id
// @access  Private
export const cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }

    // Only owner or admin can cancel
    if (
      registration.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this registration',
      });
    }

    // Decrement event counter if active
    if (registration.status === 'Confirmed') {
      const event = await Event.findById(registration.event);
      if (event && event.registeredCount > 0) {
        event.registeredCount -= 1;
        await event.save();
      }
    }

    await registration.deleteOne();

    res.json({
      success: true,
      message: 'Registration cancelled successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registrations
// @route   GET /api/registrations
// @access  Private/Admin
export const getAllRegistrations = async (req, res, next) => {
  try {
    const { eventId, status } = req.query;
    let query = {};

    if (eventId) {
      query.event = eventId;
    }
    if (status) {
      query.status = status;
    }

    const registrations = await Registration.find(query)
      .populate('user', 'name email college phone')
      .populate('event', 'title category date time venue prizePool')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update registration status
// @route   PUT /api/registrations/:id
// @access  Private/Admin
export const updateRegistrationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }

    registration.status = status || registration.status;
    await registration.save();

    res.json({
      success: true,
      data: registration,
      message: 'Registration status updated successfully',
    });
  } catch (error) {
    next(error);
  }
};
