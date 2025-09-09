// path: ./src/services/whatsapp.js

// import { Client, LocalAuth } from 'whatsapp-web.js';
// import qrcode from 'qrcode-terminal';
// import fs from 'fs';

// export default {
// 	client: null,

// 	// Инициализация клиента
// 	initialize: async () => {
// 		try {
// 			const client = new Client({
// 				authStrategy: new LocalAuth({
// 					dataPath: './whatsapp-sessions', // Путь для сохранения сессии
// 				}),
// 			});

// 			client.on('qr', (qr) => {
// 				// Сохраняем QR-код в файл для удобства доступа через админку
// 				fs.writeFileSync('./public/whatsapp-qr.txt', qr);

// 				// Также выводим в консоль
// 				qrcode.generate(qr, { small: true });
// 				console.log(
// 					'WhatsApp QR-код сгенерирован. Доступен по адресу /whatsapp-qr.txt'
// 				);
// 			});

// 			client.on('ready', () => {
// 				console.log('WhatsApp клиент готов к работе');
// 			});

// 			client.on('authenticated', () => {
// 				console.log('WhatsApp клиент аутентифицирован');
// 			});

// 			client.on('auth_failure', (msg) => {
// 				console.error('Ошибка аутентификации WhatsApp:', msg);
// 			});

// 			await client.initialize();
// 			this.client = client;
// 			return client;
// 		} catch (error) {
// 			console.error('Ошибка инициализации WhatsApp клиента:', error);
// 			throw error;
// 		}
// 	},

// 	// Отправка сообщения
// 	sendMessage: async (to, message) => {
// 		if (!this.client) {
// 			throw new Error('WhatsApp клиент не инициализирован');
// 		}
// 		let chatId;

// 		// Определяем тип получателя (группа или индивидуальный чат)
// 		if (to.includes('@g.us')) {
// 			// Это уже ID группы в правильном формате
// 			chatId = to;
// 		} else if (to.includes('@c.us')) {
// 			// Это уже ID пользователя в правильном формате
// 			chatId = to;
// 		} else if (to.startsWith('group:')) {
// 			// Если указано, что это группа, но без домена
// 			chatId = `${to.replace('group:', '')}@g.us`;
// 		} else {
// 			// По умолчанию считаем, что это номер телефона
// 			chatId = `${to}@c.us`;
// 		}

// 		try {
// 			const result = await this.client.sendMessage(chatId, message);

// 			return result;
// 		} catch (error) {
// 			console.error('Ошибка при отправке сообщения:', error);
// 			throw error;
// 		}
// 	},
// };
// interface FormData {
// 	email: string;
// 	phone: string;
// 	name: string;
// 	message: string;
// }

// export default {
// 	async sendMessage(data: FormData): Promise<boolean> {
// 		try {
// 			const message = `📝 Новое сообщение с сайта:\n\n👤 Имя: ${data.name}\n📧 Email: ${data.email}\n📱 Телефон: ${data.phone}\n\n💬 Сообщение:\n${data.message}`;
// 			await bot.sendMessage(CHAT_ID, message);

// 			return true;
// 		} catch (error) {
// 			console.error('Error sending Telegram notification:', error);
// 			return false;
// 		}
// 	},
// };
