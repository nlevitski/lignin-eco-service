import TelegramBot from "node-telegram-bot-api";

interface FormData {
	email: string;
	phone: string;
	name: string;
	message: string;
}

const TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = +process.env.TELEGRAM_GROUP_CHAT_ID;
let bot: TelegramBot | null = null;

if (TOKEN && CHAT_ID) {
	bot = new TelegramBot(TOKEN, { polling: false });
} else {
	console.warn("Telegram notification settings are missing");
}

export default {
	async sendNotification(data: FormData): Promise<boolean> {
		if (!bot || !CHAT_ID) return false;
		try {
			const message = `📝 Новое сообщение с сайта:\n\n👤 Имя: ${data.name}\n📧 Email: ${data.email}\n📱 Телефон: ${data.phone}\n\n💬 Сообщение:\n${data.message}`;
			await bot.sendMessage(CHAT_ID, message);

			return true;
		} catch (error) {
			console.error("Error sending Telegram notification:", error);
			return false;
		}
	},
};
