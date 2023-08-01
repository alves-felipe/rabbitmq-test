const express = require('express')
const app = express()
const router = express.Router()

const { createConnection, sendMessage, consumeMessage } = require('./rabbit/rabbitFunctions')
const { setSchema } = require('./rabbit/setRabbitSchema')

app.use(express.json())

const consumer = async () => {
  try {
    await setSchema()
    const connection = await createConnection()
    consumeMessage(connection)
  } catch (e) {
    console.log(e)
  }
}

consumer()

router.use((req, res, next) => {
  console.log('middleware')
  next()
})

router.post('/', async (req, res) => {
  try {
    const { connection, channel } = await createConnection()
    const message = req.body
    await sendMessage({ connection, channel, message })
    res.send('message pushed')
  } catch (e) {
    console.log('publish mq error: ', e)
  }
})

app.use('/create-message', router)

app.listen(3030, async () => {
  console.log('server up')
})
