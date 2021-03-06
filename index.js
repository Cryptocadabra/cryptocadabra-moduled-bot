const {
  Telegraf,
  Scenes: { WizardScene, Stage },
  Markup,
  session,
  Scenes,
} = require("telegraf");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const registrationScene = require("./scenes/registration.scene");
const casbackConnectionInstructionScene = require("./scenes/instruction.scene");
const addAccountScene = require("./scenes/addAccount.scene");

const renderTemplate = require("./render/accountList.render");

const MARKUP = require("./markup/markup");
const PHRASES = require("./phrases/phrases");

const client = new MongoClient(process.env.MONGODB);
const bot = new Telegraf(process.env.BOT_TOKEN);

// Remove account action Scene
const userIdRequestHandler = Telegraf.on("text", async (ctx) => {
  const userMessase = ctx.message.text;

  await client.connect();
  const userListDB = await client.db().collection("userData");

  const userToFind =
    (await userListDB.findOne({
      telegramChatID: ctx.chat.id,
    })) || false;

  if (userToFind.accounts.length) {
    userListDB.updateOne(
      { telegramChatID: ctx.chat.id },
      { $pull: { accounts: { accountId: userMessase } } }
    );
  } else {
    await ctx.replyWithHTML(
      `😢 Unfortunately, you don't have any accounts connected yet`
    );
  }

  await ctx.reply(`Account with ID ${userMessase} was successfully removed`);

  ctx.scene.leave();
});

const deleteAccountScene = new WizardScene(
  "deleteAccountWizard",
  userIdRequestHandler
);

const stage = new Scenes.Stage([
  registrationScene,
  casbackConnectionInstructionScene,
  addAccountScene,
  deleteAccountScene,
]);
bot.use(session());
bot.use(stage.middleware());

// const stage1 = new Scenes.Stage([deleteAccountScene, ,]);
// bot.use(session());
// bot.use(stage1.middleware());

deleteAccountScene.enter(async (ctx) => {
  await client.connect();

  const userListDB = await client.db().collection("userData");
  const userToFind =
    (await userListDB.findOne({
      telegramChatID: ctx.chat.id,
    })) || false;

  if (userToFind.accounts.length) {
    ctx.reply("Please, enter ID of account which you want remove");
  } else {
    await ctx.replyWithHTML(
      `😢 Unfortunately, you don't have any accounts connected yet`
    );
  }
});

// Action
bot.action("deleteAccountHandler", async (ctx) => {
  await ctx.answerCbQuery();

  await client.connect();

  const userListDB = await client.db().collection("userData");
  const userToFind =
    (await userListDB.findOne({
      telegramChatID: ctx.chat.id,
    })) || false;

  if (userToFind.accounts.length) {
    await ctx.scene.enter("deleteAccountWizard");
  } else {
    await ctx.replyWithHTML(
      `😢 Unfortunately, you don't have any accounts connected yet`
    );
  }
});

// @START
bot.start(async (ctx) => {
  await client.connect();

  const userListDB = await client.db().collection("userData");
  const userToFind =
    (await userListDB.findOne({
      telegramChatID: ctx.chat.id,
    })) || false;

  if (userToFind.isAuthorized) {
    ctx.replyWithHTML(
      `👋 Welcome, dear ${ctx.from.first_name}!`,
      MARKUP.authorizedUser
    );
  } else {
    ctx.replyWithHTML(
      `👋 Welcome, dear ${ctx.from.first_name}!`,
      MARKUP.unAuthorizedUser
    );
  }
});

// @HEARS
bot.hears("🔐 Sign up 🔐", async (ctx) => {
  await ctx.scene.enter("registrationWizard");
});

bot.hears("📇 Add account 📇", async (ctx) => {
  await ctx.scene.enter("addAccountWizard");
});

bot.hears("⚙️ Account details ⚙️", async (ctx) => {
  await client.connect();

  const userListDB = await client.db().collection("userData");
  const userToFind =
    (await userListDB.findOne({
      telegramChatID: ctx.chat.id,
    })) || false;

  const renderData = await renderTemplate(ctx.chat.id);
  if (userToFind) {
    await ctx.replyWithHTML(`${renderData}`, MARKUP.changeAccountData);
  } else {
    ctx.reply("Please, signUp");
  }
});

bot.hears("📝 How to connect cashback 📝", async (ctx) => {
  await ctx.scene.enter("casbackConnectionInstructionWizard");
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
