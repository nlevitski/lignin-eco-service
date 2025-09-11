'use strict';

import { ValidationResult } from '../services/validation';

module.exports = {
	async feedback(ctx) {
		console.log('feedback----->: ');
		try {
			const formData = ctx.request.body;

			const { errors, errorFields }: ValidationResult = await strapi.services[
				'api::form.validation'
			].validateForm(formData);
			if (errorFields.length > 0) {
				ctx.status = 400;
				ctx.body = {
					errors,
					errorFields,
				};
				console.log('from 400 status', errors, errorFields);
				return;
			}

			// Отправка письма на почту (если раскомментировано)
			try {
				await strapi.plugins['email'].services.email.send({
					to: 'alex.bizby@gmail.com',
					from: 'alexandrwolk86@yandex.ru',
					subject: 'Форма обратной связи',
					text: `Имя: ${formData.name}\nТелефон: ${formData.phone}\nEmail: ${formData.email}\nСообщение: ${formData.message}`,
					html: `<p>👤 Имя: ${formData.name}</p><p>📱 Телефон: ${formData.phone}</p><p>📧 Email: ${formData.email}</p><p>💬 Сообщение: ${formData.message}</p>`,
				});
			} catch (emailError) {
				console.error('Error sending emeail: ', emailError);
				ctx.status === 424;
				return;
			}

			// Отправка уведомления в Telegram
			try {
				await strapi.services['api::form.telegram'].sendNotification(formData);
			} catch (notificationError) {
				console.error('Error sending notification:', notificationError);
				// return ctx.badRequest('Ошибка при отправке уведомления', {
				// 	error: notificationError.message,
				// });
				ctx.status === 424;
				return;
			}
			// try {
			// 	await strapi.services['api::form.whatsapp'].sendMessage(formData);
			// } catch (messageError) {
			// 	console.error('Error sending notification:', messageError);
			// 	return ctx.badRequest('Ошибка при отправке сообщения whatsapp: ', {
			// 		error: messageError.message,
			// 	});
			// }

			return ctx.send({
				message: `Форма успешно отправлена! ${new Date().toLocaleTimeString(
					'ru-RU'
				)}`,
				data: formData,
			});
		} catch (error) {
			ctx.status = 424;
			return;
			// return ctx.badRequest('Ошибка при отправке формы', {
			// 	error: error.message,
			// });
		}
	},
};
