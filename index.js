const fs = require('fs');
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
    if (message.content === '-9' && message.member.voice.channel) {
        const connection = await message.member.voice.channel.join();
        
        // console.log(message.member.)

        const audio = connection.receiver.createStream(message, { mode: 'opus', end: 'manual' });
        audio.pipe(fs.createWriteStream('user_audio'));

        connection.play(audio, { type: 'opus' });
        console.log(message.member.user.id);
    }
});
// https://discord.com/oauth2/authorize?client_id=811414051237396491&scope=bot
client.login('ODExNDE0MDUxMjM3Mzk2NDkx.YCx2OQ.krPZkUYf1KZiy52008NeNgYRIKU');