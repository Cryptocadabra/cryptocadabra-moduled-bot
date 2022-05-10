const { Markup } = require("telegraf");

const MARKUP = {
  authorizedUser: Markup.keyboard([
    ["⚙️ Account details ⚙️", "📇 Add account 📇"],
    ["📊 Statement 📊", "💸 Request payment 💸"],
    ["👨‍💻 Support 👨‍💻"],
  ]).resize(),
  unAuthorizedUser: Markup.keyboard([
    ["🔐 Sign up 🔐"],
    ["📝 How to connect cashback 📝"],
    ["👨‍💻 Support 👨‍💻"],
  ]).resize(),
  addAccountLater: Markup.keyboard([["Add account later"]]).resize(),
  addAccountLaterWithBrokers: Markup.keyboard([
    ["Binance", "Bybit"],
    ["Add account later"],
  ]).resize(),
  nextStep: Markup.keyboard([["Next step"]]).resize(),
  brokerList: Markup.keyboard([["Binance"], ["Bybit"]]).resize(),
  changeAccountData: Markup.inlineKeyboard([
    [Markup.button.callback("Delete account", "deleteAccountHandler")],
    [Markup.button.callback("Change TRC20 address", "changeWalletHandler")],
    [Markup.button.callback("Change E-mail", "changeEmailHandler")],
  ]),
};

module.exports = MARKUP;
