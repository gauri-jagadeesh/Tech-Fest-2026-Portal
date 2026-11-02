import User from '../models/User.js';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.college = req.body.college || user.college;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;

    if (req.body.password && req.body.password.trim().length >= 6) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        college: updatedUser.college,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
      },
      message: 'Profile updated successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users & portal stats
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    const totalUsers = users.length;
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments();

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalEvents,
        totalRegistrations,
      },
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
