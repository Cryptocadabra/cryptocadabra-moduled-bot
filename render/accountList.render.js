const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB);

async function renderTemplate(userChatId) {
  await client.connect();
  console.log("connected");

  const userListDB = await client.db().collection("userData");
  const userToFind = await userListDB.findOne({
    telegramChatID: userChatId,
  });

  let template = `Your account list consist of ${userToFind.accounts.length} accounts:\n`;

  for (let i = 0; i < userToFind.accounts.length; i++) {
    const account = userToFind.accounts[i];

    template += `
<b><i>Account number</i></b> => <code>${
      userToFind.accounts.indexOf(account) + 1
    }</code>
<b><i>Exchange</i></b> => <code>${account.exchange}</code> 
<b><i>ID</i></b> => <code>${account.accountId}</code> \n
    `;
  }

  template += `
TronLink Wallet address => ${userToFind.TRC20}
`;

  console.log(template);

  if (userToFind.accounts.length) {
    return template;
  } else {
    return `😢 Unfortunately, you don't have any accounts connected yet`;
  }

  return template;
}

module.exports = renderTemplate;
