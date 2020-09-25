const Discord = require("discord.js");
const fetch = require("node-fetch");
const express = require("express");
const app = express();

const client = new Discord.Client();

const port = process.env.PORT || 3001;

const BOT_TOKEN = process.env.BOT_TOKEN || require("./config.json").BOT_TOKEN;

const extentions = ["jpeg", "jpg", "gif", "png", "mp4", "webm", "webp"];

const sounds = ["quak", "nani", "wow"];

let voiceConnection;
let joined = false;

app.get("/", (req, res) => {
  res.send("bot should be up now");
});

client.on("ready", () => console.log("Game On 😎"));
client.on("disconnect", () => console.log("diconnected"));
client.on("message", function (message) {
  // console.log(message.guild);
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  if (!message.guild) return;

  if (message.content.startsWith("^") && message.channel.name === "general") {
    console.log("voice cn");
    console.log(message.channel.name);

    if (joined) {
      console.log("in the channel");
      // console.log(sounds.includes(`^${message.content}`));
      // console.log(sounds);
      // console.log(`^${message.content}`);
      let msg = message.content.substring(1);
      console.log(msg);
      if (sounds.includes(msg)) {
        voiceConnection.play(`./${msg}.mp3`);
      } else {
        message.reply(`i cant understand you `);
      }
      // if (message.content === "^quak") {
      //   voiceConnection.play("./quack.mp3");
      // } else if (message.content === "^nani") {
      //   voiceConnection.play("./nani.mp3");
      // } else if (message.content === "^wow") {
      //   voiceConnection.play("./wow.mp3");
      // }
    } else {
      if (message.content === "^join") {
        // Only try to join the sender's voice channel if they are in one themselves
        if (message.member.voice.channel) {
          console.log("in voice channel");
          if (voiceConnection) {
            message.reply("Iam here");
          } else {
            message.member.voice.channel
              .join()
              .then((connection) => {
                // const connection =
                joined = true;
                voiceConnection = connection;
                connection.on("disconnect", () => {
                  console.log("voice diconnected");
                  joined = false;
                  voiceConnection = null;
                });
                // dispatcher = connection.play("./quack.mp3");

                console.log("joined");
                console.log(message.author);
                message.channel.send(
                  `${message.author}, successfully connected ${
                    message.author.username === "Rizky" ? "Lord" : ""
                  }`
                );
                // dispatcher.
              })
              .catch((err) => {
                console.log(err);
              });
          }
        } else {
          message.reply("You need to join a voice channel first!");
        }
      }
    }
  } else if (message.channel.name === "meme") {
    console.log("meme");

    let msgcontent = message.content;

    const re = /\.(jpeg|jpg|gif|png|mp4)$/;
    const urlre = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

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
