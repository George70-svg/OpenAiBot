const { Telegraf } = require('telegraf')
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN)

const { Configuration, OpenAIApi } = require("openai")
const { keywords, phrases } = require("./const")

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

bot.start((ctx) => ctx.reply(phrases.wellcome))

bot.on('message', async (ctx) => {
  try {
    const inputText = ctx.message.text
    const prompt = messageForBot(inputText)

    if(prompt) {
      await sendAndReceive(prompt, ctx)
    }
  } catch (error) {
    ctx.reply(phrases.reject)
    console.log(error)
  }
})

const messageForBot = (message) => {
  let keyword = ""

  if(!message) {
    return ""
  }

  keywords.forEach(word => {
    if (message.startsWith(`${word}, `)) {
      keyword = word
    }
  })

  if(keyword) {
    return message.slice(`${keyword}, `.length)
  } else {
    return ""
  }
}

const sendAndReceive = async (message, ctx) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: message,
      temperature: 0.1,
      max_tokens: 600,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.6,
      stop: ["AI", "Human"],
    });
    const outputText = response.data.choices[0].text
    ctx.reply(outputText)
  } catch (error) {
    ctx.reply(phrases.reject)
    console.error(error)
  }
}

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
