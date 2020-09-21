const Discord = require("discord.js");
const fetch = require("node-fetch");
const client = new Discord.Client();
const fs = require("fs");
const BOT_TOKEN = process.env.BOT_TOKEN || require("./config.json").BOT_TOKEN;

const extentions = ["jpeg", "jpg", "gif", "png", "mp4", "webm", "webp"];

client.on("ready", () => console.log("Game On 😎"));

client.on("message", function (message) {
  let msgcontent = message.content;

  const re = /\.(jpeg|jpg|gif|png|mp4)$/;
  const urlre = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

  console.log(msgcontent);
  let e = msgcontent.match(urlre);
  console.log(e);
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

client.login(BOT_TOKEN);
