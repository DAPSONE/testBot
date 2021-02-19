const fs = require('fs');
const { prefix, token } = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const { Readable } = require('stream');

const SILENCE_FRAME = Buffer.from([
    0xF8,
    0xFF,
    0xFE
]);

class Silence extends Readable {
    _read() {
        this.push(SILENCE_FRAME);
        this.destroy();
    }
}

client.once('ready', () => {
    console.log('OK');
});

client.on('message', async message => {
    if (!message.content.startsWith(`${prefix}bot`) || message.author.bot) {
        return;
    }

    const args = message.content.slice(prefix.length).trim().split(' ');
    args.shift();
    const command = args.shift().toLowerCase();

    if (command === 'v' || command === 'version') {
        message.channel.send('Current version: 1.0.0');
        return;
    }

    if (command === 'clients') {
        const channelId = '785193983118540800';
        message.guild.channels.cache.get(channelId).members.forEach((member) => {
            console.log(member.user.username);
            message.channel.send(member.user.username);
        });
        return;
    }

    if (command === 's' && message.member.voice.channel) {
        // const connection = await message.member.voice.channel.join();
        // const channelId = '785193983118540800';

        // message.guild.channels.cache.get(channelId).members.forEach((member) => {
        //     // console.log(member.user.username);
        // });

        // const audio = connection.receiver.createStream(message.guild.channels.cache.get(channelId).members.get('749829330686705796'), { mode: 'opus', end: 'manual' });
        // audio.pipe(fs.createWriteStream('user_audio'));

        // connection.play(audio, { type: 'opus' });
        message.member.voice.channel.join().then((connection) => {
            const rec = connection.receiver;
            connection.on('speaking', (user, speaking) => {
                console.log(user.username, 'speaking:', speaking);

                if (speaking) {
                    const audio = rec.createStream(user, { mode: 'opus', end: 'silence' });
                    connection.play(audio, { type: 'opus' });
                    // audio.on('data', chunk => {
                    //     console.log(`Received ${chunk.length} bytes of data.`);
                    // });
                }
            });
        });
    }
});
client.login(token);