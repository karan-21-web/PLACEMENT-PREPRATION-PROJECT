import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('Fatal error: JWT_SECRET environment configuration is missing.');
  }

  return jwt.sign(
    { id: userId }, 
    secret, 
    { expiresIn: '30d' }
  );
};

export default generateToken;
