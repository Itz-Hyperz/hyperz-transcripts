const { Collection } = require('discord.js');
const fs = require(`fs`);
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM();
const document = dom.window.document;

class HyperzTranscripts {

    // Constructor
    constructor(debugMode) {
        this.debugMode = debugMode;
    }

    // Object params:
    // { message: message, channel: channel }
    async transcript(object) {
        let message = object?.message;
        let channelToSend = object?.channel;

        let messages = {};
        let members = ``;
        message.channel.messages.fetch({ limit: 100, before: message.id }).then(async(collected) => {
            collected.forEach(async(msg) => {
                messages[msg.id] = {
                    author: { tag: msg.author.tag, id: msg.author.id },
                    content: msg.content || `Unknown`
                };
                try {
                    messages[msg.id].image = msg.attachments.array()[0].url;
                } catch (e) {e => {if(this.debugMode) return console.log(e);}};
                if (msg.embeds[0]) {
                    messages[msg.id].embeds = {
                        title: msg.embeds[0].title,
                        description: msg.embeds[0].description
                    };
                };
                if (!members.includes(msg.author.tag)) members += msg.author.tag + `\n`;
            });
            if (members == ``) members = `Unknown`;
        });
        let messageCollection = new Collection();
        let channelMessages = await message.channel.messages.fetch({ limit: 100 }).catch(err => console.log(`HTML Transcript Error: `, err));
        messageCollection = messageCollection.concat(channelMessages);
        let msgs = Array.from(messageCollection.values()).reverse()
        fs.readFile('./node_modules/hyperz-transcripts/temp.html', 'utf8', async (err, wow) => {
            if(err) {
                console.log(`HTML Transcript Error: `, err)
            }
            let data = wow.toString()
            await fs.writeFile('./node_modules/hyperz-transcripts/ticket.html', data, (err) => {
                if(err) console.log(err)
            });
            let guildElement = document.createElement('div');
            let guildText = document.createTextNode(message.guild.name);
            let guildImg = document.createElement('img');
            guildImg.setAttribute('src', message.guild.iconURL({ format: "png" }));
            guildImg.setAttribute('width', '150');
            guildImg.setAttribute('class', 'gname');
            guildElement.appendChild(guildImg);
            guildElement.appendChild(guildText);
            await fs.appendFile('./node_modules/hyperz-transcripts/ticket.html', guildElement.outerHTML, (err) => {
                if(err) {
                    console.log(`HTML Transcript Error: `, err)
                }
            })
            msgs.forEach(async msg => {
                let parentContainer = document.createElement("div");
                parentContainer.className = "parent-container";
                let avatarDiv = document.createElement("div");
                avatarDiv.className = "avatar-container";
                let img = document.createElement('img');
                img.setAttribute('src', msg.author.displayAvatarURL());
                img.className = "avatar";
                avatarDiv.appendChild(img);
                parentContainer.appendChild(avatarDiv);

                let messageContainer = document.createElement('div');
                messageContainer.className = "message-container";
                let nameElement = document.createElement("span");
                let name = document.createTextNode(msg.author.tag + " " + msg.createdAt.toDateString() + " " + msg.createdAt.toLocaleTimeString() + " EST");
                nameElement.appendChild(name);
                messageContainer.append(nameElement);
                if(msg.content.startsWith("```")) {
                    let m = msg.content.replace(/```/g, "");
                    let codeNode = document.createElement("code");
                    let textNode =  document.createTextNode(m);
                    codeNode.appendChild(textNode);
                    messageContainer.appendChild(codeNode);
                }
                else {
                    let msgNode = document.createElement('span');
                    let textNode = document.createTextNode(msg.content);
                    msgNode.append(textNode);
                    messageContainer.appendChild(msgNode);
                }
                parentContainer.appendChild(messageContainer);
                await fs.appendFile('./node_modules/hyperz-transcripts/ticket.html', parentContainer.outerHTML, (err) => {
                    if(err) {
                        console.log(err)
                    }
                });
            });
            channelToSend.send({ files: ['./node_modules/hyperz-transcripts/ticket.html'] }).catch(e => {
                console.log(`Error sending message to transcript channel.\n`, e.stack);
            });
        });
    };

};

module.exports = HyperzTranscripts;
