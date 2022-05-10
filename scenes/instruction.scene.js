const { Composer, Scenes } = require("telegraf");
const MARKUP = require("../markup/markup");

const receiveBrokerInstructrionHandler = new Composer();
receiveBrokerInstructrionHandler.on("text", (ctx) => {
  const userMessage = ctx.message.text;

  if (userMessage === "Binance") {
    ctx.replyWithHTML(
      `
<u><b>STEP 1</b></u> — <b>Please copy this link <code>binance link</code>  and open it in "incognito" mode in your browser.</b>
  
<u><b>STEP 2</b></u> — <b>Create an account.</b>
  
<u><b>STEP 3</b></u> — <b>Please let our support - @cryptocadabra_support know the ID of the account you have just registered.</b>
  
<u><b>STEP 4</b></u> — <b>Please wait for confirmation from our support that registration has been completed successfully.</b>
  
<u><b>STEP 5</b></u> — <b>Done! You're awesome! Now you can connect your registered account to our @cashbackTracker_bot and earn extra money from trading.</b>
    `,
      {
        disable_web_page_preview: true,
        ...MARKUP.unAuthorizedUser,
      }
    );
  } else if (userMessage === "Bybit") {
    ctx.replyWithHTML(
      `
<u><b>STEP 1</b></u> — <b>Please copy this link <code>https://partner.bybit.com/b/cryptocadabra</code>  and open it in "incognito" mode in your browser.</b>
  
<u><b>STEP 2</b></u> — <b>Create an account.</b>
  
<u><b>STEP 3</b></u> — <b>Please let our support - @cryptocadabra_support know the ID of the account you have just registered.</b>
  
<u><b>STEP 4</b></u> — <b>Please wait for confirmation from our support that registration has been completed successfully.</b>
  
<u><b>STEP 5</b></u> — <b>Done! You're awesome! Now you can connect your registered account to our @cashbackTracker_bot and earn extra money from trading.</b>
      `,
      {
        disable_web_page_preview: true,
        ...MARKUP.unAuthorizedUser,
      }
    );
  }

  return ctx.scene.leave();
});

const casbackConnectionInstructionScene = new Scenes.WizardScene(
  "casbackConnectionInstructionWizard",
  receiveBrokerInstructrionHandler
);

casbackConnectionInstructionScene.enter((ctx) =>
  ctx.replyWithHTML(
    `
Please, choose the broker from the list below from which you want to recieve cashback
`,
    {
      disable_web_page_preview: true,
      ...MARKUP.brokerList,
    }
  )
);

module.exports = casbackConnectionInstructionScene;
