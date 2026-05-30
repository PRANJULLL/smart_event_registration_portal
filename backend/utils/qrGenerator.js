const QRCode = require('qrcode');

/**
 * Generate QR code as a Base64 Data URI
 * @param {string} text The ticket ID or data to embed in the QR code
 * @returns {Promise<string>} Base64 data URL
 */
const generateQRCode = async (text) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(text, {
      color: {
        dark: '#1e1b4b', // Deep indigo
        light: '#ffffff', // White background
      },
      width: 300,
      margin: 2,
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

module.exports = generateQRCode;
