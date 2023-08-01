const axios = require('axios')
const config = require('../../config/rabbit.json')

const setSchema = async () => {
  const rabbitMQConfig = {
    baseURL: 'http://rabbitmq:15672',
    auth: {
      username: 'guest',
      password: 'guest'
    },
    headers: {
      'Content-Type': 'application/json'
    }
  };

  await axios.post('/api/definitions', config, rabbitMQConfig);
}

module.exports = {
  setSchema
}