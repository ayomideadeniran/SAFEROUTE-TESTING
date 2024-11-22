const AfricasTalking = require('africastalking');

// Initialize Africa's Talking
const africastalking = AfricasTalking({
    apiKey: 'atsk_135ba4674ab564291ac3004253ee55ce279cab21079d12c0d868692ff9f246d3094fe9a8',
    username: 'sandbox',
});

module.exports = async function sendSMS(numbers, message) {
    if (!numbers || numbers.length === 0) {
        throw new Error("Recipients' numbers are required.");
    }
    if (!message) {
        throw new Error("Message content is required.");
    }

    // Modify numbers to ensure they are in the correct international format
    const validNumbers = numbers.map((num) => {
        // If the number starts with '0', it's a local Nigerian number. Prepend '+234'.
        if (num.startsWith('0')) {
            return '+234' + num.substring(1);  // Convert to Nigerian international format
        }
        // If the number already starts with '+', it's assumed to be in correct format
        return num;
    }).filter((num) => /^[\+]?[0-9]{10,15}$/.test(num));  // Ensure it's a valid number format

    // Log the valid numbers to verify
    console.log('Valid Numbers:', validNumbers);

    if (validNumbers.length === 0) {
        throw new Error('No valid phone numbers provided.');
    }

    try {
        const result = await africastalking.SMS.send({
            to: validNumbers, // Pass the valid phone numbers
            message: message,
            from: '89098', // Optional sender ID
        });
        console.log('SMS sent successfully:', result);
        return result;
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw error;
    }
};
