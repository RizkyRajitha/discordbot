const Discord = require("discord.js");
const fetch = require("node-fetch");
const fs = require("fs");
const express = require("express");
const app = express();

const emoji = require("./emojilist").emoj;

const client = new Discord.Client();

const port = process.env.PORT || 3001;

const BOT_TOKEN = process.env.BOT_TOKEN || require("./config.json").BOT_TOKEN;

const extentions = ["jpeg", "jpg", "gif", "png", "mp4", "webm", "webp"];

// const sounds = [
//   "quak",
//   "nani",
//   "wow",
//   "dbrw",
//   "gtacj",
//   "coffinpls",
//   "airhorn",
//   "sad",
//   "ph",
//   "muted",
//   "witcher",
//   "success",
//   "waiting",
//   "smf",
//   "ohnono",
//   "tenet",
// ];

let sounds = fs.readdirSync("./sounds").map((e) => e.split(".")[0]);
console.log(sounds);

let voiceConnection;
let joined = false;

app.get("/", (req, res) => {
  res.send("bot should be up now");
});

// app.get("/play", (req, res) => {
//   // voiceConnection.play(`./${msg}.mp3`);

//   if (process.env.Secret !== req.headers.authorization) {
//     res.status(403).json({ msg: "ආ.......... රියලි" });
//     return;
//   }
//   console.log(req.query.sound);

//   let msg = req.query.sound; // message.content.substring(1);
//   console.log(msg);

//   if (!voiceConnection) {
//     res.status(404).json({ msg: "හරි හරි හරි...." });
//     return;
//   }

//   if (sounds.includes(msg)) {
//     voiceConnection.play(`./${msg}.mp3`);
//     res.json({ msg: "කුපිරි" });
//   } else {
//     res.status(404).json({ msg: "ඒ මෙයා එක්ක බැ ඒ " });
//     // res.send("i cant understand you ");

//     //message.reply(`i cant understand you `);
//   }
// });

client.on("ready", () => console.log("Game On 😎"));
client.on("disconnect", () => console.log("diconnected"));

client.on("message", async function (message) {
  // console.log(message.guild);
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  if (!message.guild) return;

  if (message.content === "^help") {
    let reply = `
    Hello , i am HeshanBot කැපක් ගමුතේ
    commands:
    ^join : join to voice channel\n   ^help : help\n   ^disconnect : disconnect\n${sounds
      .map((ele) => `   ^${ele} : ${ele} \n`)
      .join("")}
    thanks you
    කුපිරි
    `;
    // console.log(reply);
    message.reply(reply);
    return;
  }

  if (message.content.startsWith("^") && message.channel.name === "general") {
    console.log("voice cn");
    console.log(message.channel.name);

    if (joined) {
      console.log("in the channel");
      // console.log(sounds.includes(`^${message.content}`));
      // console.log(sounds);
      // console.log(`^${message.content}`);
      let msg = message.content.substring(1);

      if (message.content === "^disconnect") {
        // let reply = `යන්නං`;

        console.log(message.content);
        const disconnectGif = new Discord.MessageAttachment(
          "https://media1.tenor.com/images/5ef0f8e9006d7c459d6817a71ba61c2e/tenor.gif"
        );
        await message.reply(disconnectGif);
        voiceConnection.disconnect();

        return;
      }

      console.log(msg);
      if (sounds.includes(msg)) {
        voiceConnection.play(`./sounds/${msg}.mp3`);

        let emojinum = Math.floor(Math.random() * 10000) % emoji.length;
        // console.log();
        message.react(emoji[emojinum]);
      } else {
        message.reply(`i can't understand you \nඒ මෙයා එක්ක බැ ඒ `);
      }
    } else {
      if (message.content === "^join") {
        // Only try to join the sender's voice channel if they are in one themselves
        if (!message.member.voice.channel) {
          message.reply("You need to join a voice channel first!");
          return;
        }
        console.log("in voice channel");

        try {
          voiceConnection = await message.member.voice.channel.join();
          joined = true;

          console.log("joined");
          console.log(message.author);
          message.channel.send(
            `${message.author}, successfully connected  ${
              message.author.username === "Rizky"
                ? "Lord"
                : "\nuse ^help for more information "
            }`
          );

          voiceConnection.on("disconnect", () => {
            console.log("voice diconnected");
            joined = false;
            voiceConnection = null;
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  if (message.channel.name === "meme") {
    console.log("meme");

    let msgcontent = message.content;

    const re = /\.(jpeg|jpg|gif|png|mp4)$/;
    const urlre =
      /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

    // console.log(msgcontent);
    // let e = false;
    let e = msgcontent.match(urlre);
    // console.log(e);

    if (e) {
      console.log("yes");

      fetch(msgcontent)
        .then((res) => {
          return res
            .buffer()
            .then((blob) => {
              return {
                contentType: res.headers.get("Content-Type"),
                raw: blob,
              };
            })
            .catch((err) => {});
        })
        .then(async (media) => {
          // console.log(media);

          let extention = String(media.contentType).split("/")[1];
          console.log(extention);

          // await downloadFile(msgcontent, `./meme.${extention}`);

          let isValid = extentions.includes(extention);

          console.log(isValid);
          if (isValid) {
            try {
              const attachment = new Discord.MessageAttachment(
                media.raw,
                `meme.${extention}`
              );
              // Send the attachment in the message channel with a content
              message.channel
                .send(`${message.author}, here are your memes!`, attachment)
                .then((result) => {
                  // result.

                  message
                    .delete()
                    .then((result) => {
                      // console.log(result);
                      console.log("deleted");
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  console.log(err);
                });
            } catch (error) {
              console.log(error);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
});

// const downloadFile = async (url, path) => {
//   const res = await fetch(url);
//   const fileStream = fs.createWriteStream(path);
//   await new Promise((resolve, reject) => {
//     res.body.pipe(fileStream);
//     res.body.on("error", (err) => {
//       reject(err);
//     });
//     fileStream.on("finish", function () {
//       resolve();
//     });
//   });
// };

app.listen(port, () => {
  console.log("listning on 3001");
});

client.login(BOT_TOKEN);
