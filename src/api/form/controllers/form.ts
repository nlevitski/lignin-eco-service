"use strict";

import { ValidationResult } from "../services/validation";

module.exports = {
	async feedback(ctx) {
		console.log("feedback----->: ");
		try {
			const formData = ctx.request.body;

			const { errors, errorFields }: ValidationResult =
				await strapi.services["api::form.validation"].validateForm(
					formData,
				);
			if (errorFields.length > 0) {
				ctx.status = 400;
				ctx.body = {
					errors,
					errorFields,
				};
				console.log("from 400 status", errors, errorFields);
				return;
			}

			const fromEmail = process.env.SMTP_FROM_EMAIL;
			const targetEmail = process.env.SMTP_TARGET_EMAIL;

			// Создаем промисы для одновременной отправки
			const emailPromise = strapi.plugins["email"].services.email.send({
				to: targetEmail,
				from: fromEmail,
				subject: "Форма обратной связи",
				text: `Имя: ${formData.name}\nТелефон: ${formData.phone}\nEmail: ${formData.email}\nСообщение: ${formData.message}`,
				html: `<p>👤 Имя: ${formData.name}</p><p>📱 Телефон: ${formData.phone}</p><p>📧 Email: ${formData.email}</p><p>💬 Сообщение: ${formData.message}</p>`,
			});

			const telegramPromise =
				strapi.services["api::form.telegram"].sendNotification(
					formData,
				);

			// Выполняем обе отправки одновременно с Promise.allSettled
			const results = await Promise.allSettled([
				emailPromise,
				telegramPromise,
			]);

			// Обрабатываем результаты каждого промиса
			const emailResult = results[0];
			const telegramResult = results[1];

			// Проверяем результаты email и telegram
			const hasEmailError = emailResult.status === "rejected";
			const hasTelegramError = telegramResult.status === "rejected";

			if (hasEmailError) {
				console.error("Error sending email: ", emailResult.reason);
			}
			if (hasTelegramError) {
				console.error(
					"Error sending notification:",
					telegramResult.reason,
				);
			}

			// Если обе отправки не удались
			if (hasEmailError && hasTelegramError) {
				ctx.status = 424;
				ctx.body = {
					message:
						"Ошибка при отправке email и уведомления в Telegram",
					errors: {
						email:
							emailResult.reason?.message ||
							"Unknown email error",
						telegram:
							telegramResult.reason?.message ||
							"Unknown telegram error",
					},
				};
				return;
			}

			// Если только email не удался
			if (hasEmailError) {
				ctx.status = 424;
				ctx.body = {
					message: "Ошибка при отправке email",
					error: emailResult.reason?.message || "Unknown email error",
				};
				return;
			}

			// Если только telegram не удался
			if (hasTelegramError) {
				ctx.status = 424;
				ctx.body = {
					message: "Ошибка при отправке уведомления в Telegram",
					error:
						telegramResult.reason?.message ||
						"Unknown telegram error",
				};
				return;
			}

			// Оба успешно выполнены
			return ctx.send({
				message: `Форма успешно отправлена! ${new Date().toLocaleTimeString(
					"ru-RU",
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
