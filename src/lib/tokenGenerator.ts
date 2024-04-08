export function generateTokenNumber(): string {
	// Define the character set for the code portion
	const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	// Generate a random code string with 4 characters
	let code = '';
	for (let i = 0; i < 5; i++) {
		code += charSet.charAt(Math.floor(Math.random() * charSet.length));
	}

	// const date = new Date();
	// const formattedTime = `${pad(date.getDate(), 2)}${pad(date.getMonth() + 1, 2)}${pad(date.getFullYear() % 100, 2)}${pad(date.getHours(), 2)}${pad(date.getMinutes(), 2)}${pad(date.getSeconds(), 2)}`;

	// Combine the code and timestamp into a single string
	// return code + formattedTime;
	return code;
}

// Helper function to pad single-digit numbers with a leading zero
// function pad(number: number, length: number) {
// 	return String(number).padStart(length, '0');
// }
