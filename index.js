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

bot.command('help', async (ctx) => {
  ctx.reply(phrases.help)
})

bot.on('message', async (ctx) => {
  try {
    const inputText = ctx.message.text
    const prompt = messageForBot(inputText)

    if(prompt && prompt.text && prompt.type) {
      switch (prompt.type) {
        case 'text':
          await generateText(prompt.text, ctx)
          break
        case 'image':
          await generateImg(prompt.text, ctx)
          break
      }
    }
  } catch (error) {
    ctx.reply(phrases.reject)
    console.error(error)
  }
})

const messageForBot = (message) => {
  if(!message) {
    return null
  }

  const { keyword, type } = getPromptTypeFromMessage(message)

  if(keyword && type) {
    const text = message.slice(`${keyword},`.length)
    return { text, type }
  } else {
    return null
  }
}

const getPromptTypeFromMessage = (message) => {
  let keyword = ""
  let promptType = ""

  for (const key in keywords) {
    keywords[key].forEach(word => {
      if (message.startsWith(`${word},`)) {
        keyword = word
        promptType = key
      }
    })
  }

  return { keyword, type: promptType }
}

const generateText = async (message, ctx) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: message,
      temperature: 0.9,
      max_tokens: 600,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.6,
      stop: ["AI", "Human"],
    })
    const outputText = response.data.choices[0].text
    ctx.reply(outputText)
  } catch (error) {
    ctx.reply(phrases.reject)
    console.error(error)
  }
}

const generateImg = async (message, ctx) => {
  try {
    const response = await openai.createImage({
      prompt: message,
      n: 1,
      size: "512x512",
    })
    const image_url = response.data.data[0].url
    ctx.replyWithPhoto({ url: image_url })
  } catch (error) {
    ctx.reply(phrases.reject)
    console.error(error)
  }
}

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
