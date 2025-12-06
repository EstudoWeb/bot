const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const TOKEN = "8541236999:AAEFQhgvUHx48Wq3rzctpW-gihfjGTrYUB8";
const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/assistente (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userMessage = match[1];

  // Envia mensagem inicial com ênfase
  const loadingMsg = await bot.sendMessage(chatId, "_Lendo e Respondendo..._", {
    parse_mode: "Markdown"
  });

  try {
    bot.sendChatAction(chatId, "typing");

    const result = await axios.post("https://api-ia-mdgl.onrender.com/api", {
      message: userMessage,
      token: "TESTE"
    });

    const resposta = result.data.response || "Sem resposta encontrada.";

    // Agora editamos a mensagem enviada anteriormente
    bot.editMessageText(resposta, {
      chat_id: chatId,
      message_id: loadingMsg.message_id,
      parse_mode: "Markdown"
    });

  } catch (error) {
    console.log(error);

    bot.editMessageText("❌ Erro ao processar sua mensagem.", {
      chat_id: chatId,
      message_id: loadingMsg.message_id
    });
  }
});

bot.onText(/\/assistente$/, (msg) => {
  bot.sendMessage(msg.chat.id, "Use assim:\n/assistente sua dúvida");
});
