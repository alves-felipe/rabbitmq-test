const amqp = require('amqplib')

const createConnection = async () => {
  const connection = await amqp.connect("amqp://rabbitmq:5672", { heartbeat: 10 })
  const channel = await connection.createChannel()

  return { connection, channel }
}

const sendMessage = async ({ channel, connection, message }) => {
  // channel.publish('test-exchange', 'queue', Buffer.from(JSON.stringify(message)))
  channel.sendToQueue('test-queue', Buffer.from(JSON.stringify(message)))

  await channel.close()
  await connection.close()
}

const consumeMessage = ({ channel }) => {
  channel.prefetch(1)

  channel.consume('test-queue', (message) => {
    try {
      console.log('message: ',JSON.parse(message.content))
      channel.ack(message)
    } catch (e) {
      console.log('consumer mq error: ', e)
      channel.nack(message, false, false)
    }
  })
}

module.exports = {
  createConnection,
  sendMessage,
  consumeMessage
}