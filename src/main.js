const {HtmlTelegramBot, userInfoToString} = require("./bot");
const ChatGptService = require("./gpt");

class MyTelegramBot extends HtmlTelegramBot {
    constructor(token) {
        super(token);
        this.mode = null;
        this.list = [];
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
        if (this.list.length > 0) {
            this.list.length = 0;
        }
        this.mode = 'gpt';
        const text = this.loadMessage('gpt')
        await this.sendImage('gpt')
        await this.sendText(text)
    }

    async gptPrompt(msg) {
        const userQuestion = msg.text;
        const myMessage = await this.sendText('Your message were sent to the ChatGPT')
        const response  = await chatGPT.sendQuestion('Tell me', userQuestion);
        await this.editText(myMessage, response);
    }

    async date(msg) {
        this.mode = 'date';
        const text = this.loadMessage('date')
        await this.sendImage('date')
        await this.sendTextButtons(text, {
            'date_grande':'Ariana Grande',
            'date_robbie':'Margo Robby',
            'date_zendaya':'Zendaya',
            'date_gosling':'Ryan Gosling',
            'date_hardy':'Tom Hardy',
        })
    }

    async dateHandler(callback){
        const query = callback.data;
        await this.sendImage(query);
        await this.sendText('Nice choice!');
        const prompt = this.loadPrompt(query)
        chatGPT.setPrompt(prompt);
    }

    async datePrompts(msg) {
        const userQuestion = msg.text;
        const loader = await this.sendText('Awaiting respond....')
        const response = await  chatGPT.addMessage(userQuestion);
        await this.editText(loader, response);
    }

    // Messages
    async message(msg){
        this.mode = 'message';
        const text = this.loadMessage('message')
        await this.sendImage('message')
        await this.sendTextButtons(text, {
            'message_next' : 'Next message',
            'message_date' : 'Invite on date',
        })
    }
    async messageHandler(callback){
        const query = callback.data;
        const prompt = this.loadPrompt(query);
        const userChatHistory = this.list.join('\n\n');

        const myMessage = await this.sendText('ChatGPT is looking for a next answer....')
        const response = await chatGPT.sendQuestion(prompt, userChatHistory);
        await  this.editText(myMessage, response)
    }
    async messagePrompts(msg){
        const userQuestion = msg.text;
        this.list.push(userQuestion);
    }

    // Мы будем писать тут наш код
    async hello (msg) {
        // this.list.length = 0;
        if (this.mode === 'gpt') {
            await this.gptPrompt(msg)
        } else if (this.mode === 'date') {
            await  this.datePrompts(msg)
        } else if (this.mode === 'message') {
            await this.messagePrompts(msg)
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
        const query = callback.data;
        if (query === 'theme_light') {
            await this.sendText('You selected: Light')
        } else if (this.mode === 'theme_dark') {
            await this.sendText('You selected: Dark')
        }
    }
}
const chatGPT = new ChatGptService('gpt:fXtFfefcMJW5gbKvJxHPJFkblB3TaymEaIPsJ1W67t7kdwMM');
const bot = new MyTelegramBot("7521616950:AAEZOroxEQM-VSV5dLCo5_KYRW3hL0aVfYQ");
// Мы будем писать тут наш код

bot.onCommand(/\/start/, bot.start) // /start
bot.onCommand(/\/html/, bot.html) // /html
bot.onCommand(/\/gpt/, bot.gpt) // /gpt
bot.onCommand(/\/date/, bot.date) // /date
bot.onCommand(/\/message/, bot.message) // /message

bot.onTextMessage(bot.hello)
bot.onButtonCallback(/^date_.*/, bot.dateHandler)
bot.onButtonCallback(/^message_.*/, bot.messageHandler)
bot.onButtonCallback(/^.*/, bot.helloButton)