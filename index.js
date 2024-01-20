const env = require('node-env-file')
env(__dirname + '/.env')
const fs = require('fs')
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(process.env.TELEGRAM_API_KEY, { polling: true })
const room = process.env.TELEGRAM_ROOM
const imgDir = __dirname + '/img/'
const appdata = __dirname + '/appdata/'

// mkdir img -> upload image files here
// mkdir appdata
// echo [] > appdata/used.json
// note this does not detect / correct when used images are all used, either 
// delete the used object to rern or get some new images 

const run = async () => {
  const _used = fs.readFileSync(appdata + 'used.json')
  let used = JSON.parse(_used)
  const ls = fs.readdirSync(imgDir)
  const getAvailable = () => {
    const available = []
    for (let i = 0; i < ls.length; i++) {
      let found = false
      for (let j = 0; j < used.length; j++) {
        if (used[j] === ls[i]) {
          found = true
        }
      }
      if (found === false) {
        available.push(ls[i])
      }
    }
    return available
  }
  const availImages = getAvailable() 
  const send = availImages[Math.floor(Math.random() * availImages.length)]
  used.push(send)
  fs.writeFileSync(appdata + 'used.json', JSON.stringify(used, null, 4))
  await bot.sendPhoto(room, imgDir + send)
  console.log('Operation Complete')
  process.exit(0)
}

; (async () => {
  try {
    console.log('image poster')
    await run()
  } catch (error) {
    console.log(error)
    process.exit(-1)
  }
})()