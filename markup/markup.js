const { Markup } = require("telegraf");

const MARKUP = {
  authorizedUser: Markup.keyboard([
    ["⚙️ Account details ⚙️"],
    ["➕ Add account ➕"],
    ["📊 Statement 📊"],
    ["💸 Request payment 💸"],
    ["👨‍💻 Support 👨‍💻"],
  ]).resize(),
  unAuthorizedUser: Markup.keyboard([
    ["🔐 Sign up 🔐"],
    ["📝 How to connect cashback 📝"],
    ["👨‍💻 Support 👨‍💻"],
  ]).resize(),
  nextStep: Markup.keyboard([["Next step"]]).resize(),
  brokerList: Markup.keyboard([["Binance"], ["Bybit"]]).resize(),
  changeAccountData: Markup.inlineKeyboard([
    [Markup.button.callback("Change Binance ID", "changeBinance")],
    [Markup.button.callback("Change Bybit ID", "changeBybit")],
    [Markup.button.callback("Change TRC20 address", "changeWallet")],
    [Markup.button.callback("Change E-mail", "changeEmail")],
  ]),
};

module.exports = MARKUP;
