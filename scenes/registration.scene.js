const { Composer, Scenes } = require("telegraf");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGODB);

const MARKUP = require("../markup/markup");
const PHRASES = require("../phrases/phrases");

const brokerHandler = new Composer();
brokerHandler.on("text", async (ctx) => {
  const userMessage = ctx.message.text;
  ctx.session.currentBroker = userMessage;

  // if (userMessage === "Binance") {
  //   ctx.session.isBinance = true;
  // } else if (userMessage === "Bybit") {
  //   ctx.session.isBybit = true;
  // }

  await ctx.replyWithHTML(
    `
<u><b>Step 2: ID authentication</b></u>
    
<i>Please enter your <b>${userMessage}</b> ID for your account that you registered using our partner link.</i>
    
<a href="https://www.binanceIdList.com/en/support/faq/e23f61cafb5a4307bfb32506bd39f89d">Where can I find my binanceIdList ID</a>
    ${ctx.session.currentBroker} `,
    {
      disable_web_page_preview: true,
      ...MARKUP.nextStep,
    }
  );

  return ctx.wizard.next();
});

const userIdHandler = new Composer();
userIdHandler.on("text", async (ctx) => {
  const userMessage = ctx.message.text;

  if (userMessage === "Next step") {
    await ctx.replyWithHTML(`Okay, yout can fill this data later...`);
  } else if (userMessage === "/start") {
    return ctx.scene.leave();
  }  else {
    if (ctx.session.currentBroker === "Binance") {
      ctx.session.firstBinanceAccount = userMessage;
    } else if (ctx.session.currentBroker === "Bybit") {
      ctx.session.firstBybitAccount = userMessage;
    } else {
      await ctx.replyWithHTML(PHRASES.idNotEntered);
    }

    await ctx.replyWithHTML(
      `🥳 Great! ID <code>${userMessage}</code> was added.`
    );
  }

  await ctx.replyWithHTML(PHRASES.userAddressRequest, {
    disable_web_page_preview: true,
  });

  return ctx.wizard.next();
});

const userWalletHandler = new Composer();
userWalletHandler.on("text", async (ctx) => {
  const userMessage = ctx.message.text;

  if (userMessage === "Next step") {
    await ctx.replyWithHTML(`Okay, yout can fill this data later...`);
  } else {
    ctx.session.TRC20 = userMessage;

    await ctx.replyWithHTML(
      `
      👍 Done! Address <code>${ctx.session.TRC20}</code> was added.
  
  <i>We want to remind you that you can change it at any time in your account settings.</i>
      `
    );
  }

  await ctx.replyWithHTML(PHRASES.userEmailRequest);

  return ctx.wizard.next();
});

const userEmailHandler = new Composer();
userEmailHandler.on("text", async (ctx) => {
  const userMessage = ctx.message.text;

  if (userMessage === "Next step") {
    await ctx.replyWithHTML(
      `Okay, you can fill this data later`,
      MARKUP.authorizedUser
    );
  } else {
    ctx.session.email = userMessage;

    await ctx.replyWithHTML(
      `👍 Great! Now we can contact you <code>${ctx.session.email} </code>`,
      MARKUP.authorizedUser
    );
  }

  await client.connect();
  const userListDB = await client.db().collection("userData");

  userListDB.insertOne({
    isAuthorized: true,

    userFirstName: ctx.chat.first_name || "User",
    userLastName: ctx.chat.last_name || "LastName",
    telegramChatID: ctx.chat.id,
    telegramUserName: ctx.chat.username,
    registrationDate: Date.now(),

    isBinance: ctx.session.isBinance,
    isBybit: ctx.session.isBybit,
    firstBinanceAccount: ctx.session.firstBinanceAccount,
    firstBybitAccount: ctx.session.firstBybitAccount,
    TRC20: ctx.session.TRC20,
    contacts: ctx.session.email,
  });

  return ctx.scene.leave();
});

const registrationScene = new Scenes.WizardScene(
  "registrationWizard",
  brokerHandler,
  userIdHandler,
  userWalletHandler,
  userEmailHandler
);

registrationScene.enter((ctx) =>
  ctx.replyWithHTML(
    `
<u><b>Step 1: Choosing the broker</b></u>

<i>Please choose a broker from the list below (at the moment we only work with <b>binanceIdList</b>).</i>
`,
    MARKUP.brokerList
  )
);

module.exports = registrationScene;
