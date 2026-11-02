import jwt from 'jsonwebtoken';

const generateToken = (id, role = 'student') => {
  const secret = process.env.JWT_SECRET || 'techfest_2026_super_secret_jwt_fallback_key_32chars';
  return jwt.sign({ id, role }, secret, {
    expiresIn: '30d',
  });
};

export default generateToken;
