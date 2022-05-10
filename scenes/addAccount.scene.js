const { Composer, Scenes } = require("telegraf");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGODB);

const MARKUP = require("../markup/markup");
const PHRASES = require("../phrases/phrases");

const chooseBrokerHandler = new Composer();
chooseBrokerHandler.on("text", async (ctx) => {
  const userMessage = ctx.message.text;
  ctx.session.currentBroker = userMessage;

  if (userMessage === "Add account later") {
    await ctx.replyWithHTML(
      `Well, you can add an account next time.`,
      MARKUP.authorizedUser
    );
    return ctx.scene.leave();
  } else {
    await ctx.replyWithHTML(
      `
<u><b>Step 2: ID authentication</b></u>
              
<i>Please enter your <b>${userMessage}</b> ID for your account that you registered using our partner link.</i>
              
<a href="https://www.binanceIdList.com/en/support/faq/e23f61cafb5a4307bfb32506bd39f89d">Where can I find my binanceIdList ID</a>
              ${ctx.session.currentBroker} `,
      {
        disable_web_page_preview: true,
        ...MARKUP.addAccountLater,
      }
    );
  }

  return ctx.wizard.next();
});

const fillUserIdHandler = new Composer();
fillUserIdHandler.on("text", async (ctx) => {
  const userMessage = ctx.message.text;

  if (userMessage === "Add account later") {
    await ctx.replyWithHTML(
      `Well, you can add an account next time.`,
      MARKUP.authorizedUser
    );
    return ctx.scene.leave();
  } else if (userMessage === "/start") {
    return ctx.scene.leave();
  } else {
    ctx.session.currentId = userMessage;

    await client.connect();
    const userListDB = await client.db().collection("userData");

    userListDB.updateOne(
      { telegramChatID: ctx.chat.id },
      {
        $push: {
          accounts: {
            exchange: ctx.session.currentBroker,
            accountId: ctx.session.currentId,
            balance: null,
          },
        },
      }
    );

    await ctx.replyWithHTML(
      `🥳 Great! ID <code>${userMessage}</code> was added.`
    );
  }

  await ctx.replyWithHTML(PHRASES.userAddressRequest, {
    disable_web_page_preview: true,
    ...MARKUP.authorizedUser,
  });

  return ctx.scene.leave();
});

const addAccountScene = new Scenes.WizardScene(
  "addAccountWizard",
  chooseBrokerHandler,
  fillUserIdHandler
);

addAccountScene.enter((ctx) =>
  ctx.replyWithHTML(
    `
<u><b>Step 1: Choosing the broker</b></u>
  
<i>Please choose a broker from the list below (at the moment we only work with <b>binanceIdList</b>).</i>
  `,
    MARKUP.addAccountLaterWithBrokers
  )
);

module.exports = addAccountScene;
