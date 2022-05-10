// const { Composer, Scenes } = require("telegraf");
// const { MongoClient } = require("mongodb");
// require("dotenv").config();

// const client = new MongoClient(process.env.MONGODB);

// const tronLinkWalletChangeHandler = new Composer();

// tronLinkWalletChangeHandler.on("text", async (ctx) => {
//   const userMessage = ctx.message.text;

//   await client.connect();
//   const userListDB = await client.db().collection("userData");
//   const userToFind =
//     (await userListDB.findOne({
//       telegramChatID: ctx.chat.id,
//     })) || false;

//   await userListDB.updateOne(
//     { telegramChatID: ctx.chat.id },
//     {
//       $set: {
//         TRC20: userMessage,
//       },
//     }
//   );

//   ctx.replyWithHTML(
//     `Your TrokLink Wallet Address was successfully changed on ${userMessage}`
//   );

//   return ctx.scene.leave();
// });

// const tronLinkWalletChangeScene = new Scenes.WizardScene(
//   "tronLinkWalletChangeWizard",
//   tronLinkWalletChangeHandler
// );

// tronLinkWalletChangeScene.enter((ctx) =>
//   ctx.replyWithHTML(
//     `
// Please, enter new TRC20 adress`
//   )
// );

// bot.action("changeWallet", (ctx) => {
//   ctx.scene.enter("tronLinkWalletChangeScene");
// });
