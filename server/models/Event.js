import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter an event title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Hackathon',
        'Coding',
        'Robotics',
        'Gaming',
        'AI & Data',
        'Paper Presentation',
        'Workshop',
      ],
      default: 'Coding',
    },
    description: {
      type: String,
      required: [true, 'Please enter an event description'],
    },
    shortDescription: {
      type: String,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
      default: '',
    },
    date: {
      type: String,
      required: [true, 'Please enter event date'],
      default: 'March 15, 2026',
    },
    time: {
      type: String,
      required: [true, 'Please enter event time'],
      default: '10:00 AM - 04:00 PM',
    },
    venue: {
      type: String,
      required: [true, 'Please enter event venue'],
      default: 'Main Campus Auditorium',
    },
    teamSize: {
      type: String,
      default: '1 - 4 Members',
    },
    prizePool: {
      type: String,
      required: [true, 'Please specify prize pool'],
      default: '₹25,000',
    },
    registrationFee: {
      type: String,
      default: 'Free',
    },
    capacity: {
      type: Number,
      required: [true, 'Please specify capacity limit'],
      default: 100,
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
    rules: {
      type: [String],
      default: [],
    },
    coordinator: {
      name: { type: String, default: 'TechFest Organizing Team' },
      phone: { type: String, default: '+91 98765 43210' },
      email: { type: String, default: 'events@techfest2026.com' },
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Open', 'Closing Soon', 'Completed'],
      default: 'Open',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for remaining spots
eventSchema.virtual('remainingSpots').get(function () {
  return Math.max(0, this.capacity - this.registeredCount);
});

// Ensure virtuals are serialized
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;
