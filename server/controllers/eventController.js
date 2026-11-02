import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

// @desc    Get all events with optional filter and search
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    const { category, search, featured } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { venue: searchRegex },
        { category: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    const events = await Event.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found with provided ID',
      });
    }

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      category,
      description,
      shortDescription,
      date,
      time,
      venue,
      teamSize,
      prizePool,
      registrationFee,
      capacity,
      rules,
      coordinator,
      image,
      featured,
      status,
      tags,
    } = req.body;

    if (!title || !description || !category || !date || !time || !venue || !prizePool) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required event details (title, category, description, date, time, venue, prizePool)',
      });
    }

    const newEvent = await Event.create({
      title,
      category,
      description,
      shortDescription: shortDescription || description.substring(0, 150) + '...',
      date,
      time,
      venue,
      teamSize: teamSize || '1 - 4 Members',
      prizePool,
      registrationFee: registrationFee || 'Free',
      capacity: Number(capacity) || 100,
      rules: Array.isArray(rules) ? rules : (rules ? rules.split('\n').filter(r => r.trim()) : []),
      coordinator: coordinator || { name: 'TechFest Committee', phone: '+91 98765 43210', email: 'events@techfest2026.com' },
      image: image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      featured: Boolean(featured),
      status: status || 'Open',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []),
    });

    res.status(201).json({
      success: true,
      data: newEvent,
      message: 'Event created successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
export const updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found with provided ID',
      });
    }

    // Process rules & tags if strings
    const updateData = { ...req.body };
    if (typeof updateData.rules === 'string') {
      updateData.rules = updateData.rules.split('\n').map(r => r.trim()).filter(Boolean);
    }
    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    if (updateData.capacity) {
      updateData.capacity = Number(updateData.capacity);
    }

    event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: event,
      message: 'Event updated successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found with provided ID',
      });
    }

    // Remove event and any existing registrations for it
    await Registration.deleteMany({ event: req.params.id });
    await event.deleteOne();

    res.json({
      success: true,
      message: 'Event and associated registrations deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};
