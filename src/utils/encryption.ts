import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'lovechat-secret-key'; // In production, derive this from Room Password

export const encryptMessage = (text: string, roomId: string) => {
  return CryptoJS.AES.encrypt(text, `${ENCRYPTION_KEY}-${roomId}`).toString();
};

export const decryptMessage = (encryptedText: string, roomId: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, `${ENCRYPTION_KEY}-${roomId}`);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption failed", error);
    return "Locked Message";
  }
};
