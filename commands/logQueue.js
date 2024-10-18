const { SlashCommandBuilder } = require('discord.js');
const TaskQueue = require('../utils/queue')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('log')
    .setDescription('Replies with current queue!'),
  async execute(interaction) {
    let logs = TaskQueue.log()
    let message = `Currently in Queue: ${logs.length}\n`
    // for(let i = 0;i<logs.length && i < 25;i++) {
    //   message = message + `${logs[i].tasks}: ${logs[i].data.fileName}\n`
    // }
    await interaction.reply({ content: message, ephemeral: true })
  },
};

