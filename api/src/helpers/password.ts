import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(scryptCallback);

const KEY_LENGTH = 64;

export async function hashPassword(plainPassword: string) {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scrypt(plainPassword, salt, KEY_LENGTH)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
}

export async function checkPassword(plainPassword: string, storedHash: string) {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) {
        return false;
    }

    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = (await scrypt(plainPassword, salt, KEY_LENGTH)) as Buffer;

    if (keyBuffer.length !== derivedKey.length) {
        return false;
    }

    return timingSafeEqual(keyBuffer, derivedKey);
}
