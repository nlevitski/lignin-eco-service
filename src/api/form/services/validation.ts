type FormData = {
	email: string;
	phone: string;
	name: string;
	message: string;
};

export type ValidationResult = {
	errors: ErrorMessages;
	errorFields: string[];
};
type ErrorMessages = {
	email: string;
	phone: string;
	name: string;
	message: string;
};

export default {
	validateForm(data: FormData): ValidationResult {
		console.log('from validation: ------>: ', data);
		const errorFields = [];
		const errors: ErrorMessages = {
			email: '',
			phone: '',
			name: '',
			message: '',
		};
		const fields = Object.keys(data);
		for (const field of fields) {
			if (!data[field].length) {
				errorFields.push(field);
				errors[field] = 'required';
			}
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!errorFields.includes('email') && !emailRegex.test(data.email)) {
			errorFields.push('email');
			errors.email = 'invalid';
		}

		const phoneRegex = /^\+\d{6,14}$/;
		if (!errorFields.includes('phone') && !phoneRegex.test(data.phone)) {
			errorFields.push('phone');
			errors.phone = 'invalid';
		}

		const nameSpaceCount = data.name.match(/ /g)?.length ?? 0;

		if (!errorFields.includes('name') && nameSpaceCount > 2) {
			errorFields.push('name');
			errors.name = 'nameToManySpaces';
		}

		const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\-\'\s]+$/;
		if (!errorFields.includes('name') && !nameRegex.test(data.name)) {
			errorFields.push('name');
			errors.name = 'nameInvalidChars';
		}

		if (
			(!errorFields.includes('message') && data.message.length < 5) ||
			data.message.length > 1000
		) {
			errorFields.push('message');
			errors.message = 'messageLength';
		}

		return {
			errors,
			errorFields,
		};
	},
};
