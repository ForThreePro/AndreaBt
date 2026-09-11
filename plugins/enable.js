let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let isEnable = /true|enable|(turn)?on|1/i.test(args[0])
  let chat = global.db.data.chats[m.chat]
  let bot = global.db.data.settings[conn.user.jid] || {}
  let type = command.toLowerCase()

  if (!args[0]) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    return m.reply(`💗 𓆩 ***𝗖𝗢𝗡𝗙𝗜𝗚𝗨𝗥𝗔𝗖𝗜𝗢𝗡*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`USO\`\` —˙𖦹.📌꒷

── *📝 INSTRUCCIONES* ╏
🍓 ➛ ${usedPrefix + command} on
☁️ ➛ ${usedPrefix + command} off

*Ejemplo:* ${usedPrefix + command} on

━━━━━━━━━━━`)
  }

  let fail = false
  let quien = ''

  switch (type) {
    case 'welcome': case 'bienvenida':
      if (m.isGroup &&!isAdmin) { quien = 'Admins'; fail = true; break }
      chat.bienvenida = isEnable
      break
    case 'subbots': case 'serbot':
      if (!isROwner) { quien = 'Owner'; fail = true; break }
      bot.jadibotmd = isEnable
      break
    case 'antispam':
      if (!isOwner) { quien = 'Owner'; fail = true; break }
      bot.antiSpam = isEnable
      break
    case 'antilink':
      if (m.isGroup &&!isAdmin) { quien = 'Admins'; fail = true; break }
      chat.antiLink = isEnable
      break
    case 'antibot':
      if (m.isGroup &&!isAdmin) { quien = 'Admins'; fail = true; break }
      chat.antiBot = isEnable
      break
    case 'modoadmin':
      if (m.isGroup &&!isAdmin) { quien = 'Admins'; fail = true; break }
      chat.modoadmin = isEnable
      break
    case 'nsfw': case 'antinopor':
      if (m.isGroup &&!isAdmin) { quien = 'Admins'; fail = true; break }
      chat.nsfw = isEnable
      break
    case 'audios':
      chat.audios = isEnable
      break
    case 'autoread': case 'autoleer':
      if (!isROwner) { quien = 'Owner'; fail = true; break }
      global.opts['autoread'] = isEnable
      break
    case 'antiprivado':
      if (!isOwner) { quien = 'Owner'; fail = true; break }
      bot.antiPrivate = isEnable
      break
    default:
      return
  }

  if (fail) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    return conn.reply(m.chat, `💗 𓆩 ***𝗦𝗜𝗡 𝗣𝗘𝗥𝗠𝗜𝗦𝗢𝗦*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` —˙𖦹.❌꒷

── *📝 AVISO* ╏
❌ ➛ Solo *${quien}* pueden usar este comando

━━━━━━━━━━━`, m)
  }

  // IMAGEN STRAWBERRY
  let catalogoImg = { url: 'https://files.evogb.win/iuWAaj.jpg' }

  let estadoTexto = isEnable? 'Activado ✅' : 'Desactivado ❌'
  let estadoEmoji = isEnable? '🟢' : '🔴'

  let statusTxt = `💗 𓆩 ***𝗖𝗢𝗡𝗙𝗜𝗚𝗨𝗥𝗔𝗖𝗜𝗢𝗡 𝗘𝗫𝗜𝗧𝗢𝗦𝗔*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`ON/OFF\`\` —˙𖦹.⚙️꒷

── *📊 DETALLES* ╏
🍓 *Función:* ${type}
☁️ *Estado:* ${estadoTexto} ${estadoEmoji}
👑 *Por:* @${m.sender.split('@')[0]}

━━━━━━━━━━━
*Powered by*: ***STRAWBERRY BOT*** 💗`

  await conn.sendMessage(m.chat, {
    image: catalogoImg,
    caption: statusTxt,
    mentions: [m.sender]
  }, { quoted: m })

  await conn.sendMessage(m.chat, { react: { text: isEnable? '✅' : '❌', key: m.key } })
}

handler.help = ['welcome','antilink', 'antibot', 'modoadmin', 'subbots', 'nsfw', 'audios', 'antiprivado', 'antispam', 'autoread'].map(v => v + ' on/off')
handler.tags = ['config']
handler.command = ['welcome', 'bienvenida', 'subbots', 'serbot', 'antispam', 'antilink', 'antibot', 'modoadmin', 'nsfw', 'antinopor', 'audios', 'autoleer', 'autoread', 'antiprivado']
handler.group = true

export default handler