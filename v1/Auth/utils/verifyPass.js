import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

const encryptPassword = async (password, salt) => {
  const derivedKey = await scryptAsync(password, salt, 32);
  return derivedKey.toString('hex');
};

export const hashPassword = async (password) => {
  const salt = randomBytes(16).toString('hex');
  const hashed = await encryptPassword(password, salt);
  return hashed + salt;
};

export const verifyPass = async (password, hash) => {
  const salt = hash.slice(64);
  const originalPassHash = hash.slice(0, 64);
  const currentPassHash = await encryptPassword(password, salt);
  return originalPassHash === currentPassHash;
};
