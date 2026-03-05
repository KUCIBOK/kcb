const { Resend } = require('resend');
const { config } = require('./environnement');

const resend = new Resend(config.resend.apiKey);

module.exports = resend;
