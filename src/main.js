const {HtmlTelegramBot, userInfoToString} = require("./bot");
const ChatGptService = require("./gpt");

class MyTelegramBot extends HtmlTelegramBot {
    constructor(token) {
        super(token);
        this.mode = null;
    }

    async start(msg) {
        this.mode = 'main';
        const text = this.loadMessage('main')
        await this.sendImage('main')
        await this.sendText(text)

        // Add menu context
        await this.showMainMenu({
            'start': 'Главное меню бота',
            'profile': 'Генерация Tinder-профиля 😎',
            'opener': 'Сообщение для знакомства 🥰',
            'message': 'Переписка от вашего имени 😈',
            'date': 'Переписка со звездами 🔥',
            'gpt': 'Задать вопрос чату GPT 🧠',
        })
    }

    async html(msg){
        await  this.sendHTML('<h1>Greetings,</h1>')
        const html = this.loadHtml('main');
        await this.sendHTML(html, {theme: 'dark'});
    }

    async gpt(msg){
        this.mode = 'gpt';
        const text = this.loadMessage('gpt')
        await this.sendImage('gpt')
        await this.sendText(text)
    }

    async gptPrompt(msg) {
        const message = msg.text;
        const response  = await chatGPT.sendQuestion('Tell me', message);
        await this.sendText(response);
    }

    // Мы будем писать тут наш код
    async hello (msg) {
        if (this.mode === 'gpt') {
            await this.gptPrompt(msg)
        } else {
            await this.sendText('Hey how are you?');
            await this.sendText(`Did you mean ${msg.text}`)

            await this.sendImage('avatar_main')
            await this.sendTextButtons('What is your topic in Telegram?', {
                'theme_light':'Light',
                'theme_dark':'Dark',
            })
        }
    }

    async helloButton (callback) {
        await this.sendText(`
            You selected ${ callback.data === 'theme_light' ? 'light' : 'dark' }
        `)
    }
}
const chatGPT = new ChatGptService('gpt:fXtFfefcMJW5gbKvJxHPJFkblB3TaymEaIPsJ1W67t7kdwMM');
const bot = new MyTelegramBot("7521616950:AAEZOroxEQM-VSV5dLCo5_KYRW3hL0aVfYQ");
// Мы будем писать тут наш код

bot.onCommand(/\/start/, bot.start) // /start
bot.onCommand(/\/html/, bot.html) // /html
bot.onCommand(/\/gpt/, bot.gpt) // /gpt
bot.onTextMessage(bot.hello)
bot.onButtonCallback(/^.*/, bot.helloButton)