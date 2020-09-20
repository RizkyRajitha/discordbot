const Discord = require("discord.js");
const fetch = require("node-fetch");
const client = new Discord.Client();

const BOT_TOKEN = process.env.BOT_TOKEN || require("./config.json").BOT_TOKEN;

const extentions = ["jpeg", "jpg", "gif", "png", "mp4", "webm", "webp"];

client.on("ready", () => console.log("Game On 😎"));

client.on("message", function (message) {
  let msgcontent = message.content;

  const re = /\.(jpeg|jpg|gif|png|mp4)$/;

  console.log(msgcontent);
  let e = msgcontent.match(re);
  //   console.log(e);
  //   if (e) {
  //   console.log("yes");

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
    .then((media) => {
      console.log(media);

      let extention = String(media.contentType).split("/")[1];
      console.log(extention);

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
  //   }
});

client.login(BOT_TOKEN);
