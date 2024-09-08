const {HtmlTelegramBot, userInfoToString} = require("./bot");
const ChatGptService = require("./gpt");

class MyTelegramBot extends HtmlTelegramBot {
    constructor(token) {
        super(token);
    }

    async start(msg) {
        const text = this.loadMessage('main')
        await this.sendImage('main')
        await this.sendText(text)
    }

    // Мы будем писать тут наш код
    async hello (msg) {
        await this.sendText('Hey how are you?');
        await this.sendText(`Did you mean ${msg.text}`)

        await this.sendImage('avatar_main')
        await this.sendTextButtons('What is your topic in Telegram?', {
            'theme_light':'Light',
            'theme_dark':'Dark',
        })
    }

    async helloButton (callback) {
        await this.sendText(`You clicked on this button ${callback.data === 'theme_light' ? 'light' : 'dark'}`)
    }
}

const bot = new MyTelegramBot("7521616950:AAEZOroxEQM-VSV5dLCo5_KYRW3hL0aVfYQ");
// Мы будем писать тут наш код

bot.onCommand(/\/start/, bot.start)
bot.onTextMessage(bot.hello)
bot.onButtonCallback(/^.*/, bot.helloButton)