const handler = async (m, { conn, command }) => {
  if (!m.mentionedJid[0] &&!m.quoted) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    let texto = `💗 𓆩 ***𝗔𝗗𝗠𝗜𝗡 𝗧𝗢𝗢𝗟𝗦*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`USO\`\` —˙𖦹.📌꒷

── *📝 INSTRUCCIONES* ╏
🍓 ➛.${command} @user
☁️ ➛.${command} + responder mensaje

*${command === 'promote' || command === 'promover' || command === 'daradmin'? 'Promover' : 'Degradar'} a un usuario*

━━━━━━━━━━━
⚠️ *Solo admins*`

    return m.reply(texto, m.chat)
  }

  let user = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted.sender
  let action = command === 'promote' || command === 'promover' || command === 'daradmin'? 'promote' : 'demote'
  let groupMetadata = await conn.groupMetadata(m.chat)
  let admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id)

  // Validaciones
  if (user === conn.user.jid) return m.reply('❌ *No puedo cambiar mi propio rango*')
  if (action === 'promote' && admins.includes(user)) return m.reply('🍓 *Ya es admin*')
  if (action === 'demote' &&!admins.includes(user)) return m.reply('☁️ *No es admin*')

  await m.react(action === 'promote'? '👑' : '📉')

  let msgAccion = action === 'promote'
? `💗 𓆩 ***𝗨𝗦𝗨𝗔𝗥𝗜𝗢 𝗣𝗥𝗢𝗠𝗢𝗩𝗜𝗗𝗢*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`PROMOTE\`\` —˙𖦹.👑꒷

── *📊 DETALLES* ╏
🍓 *Nuevo Admin:* @${user.split('@')[0]}
☁️ *Por:* @${m.sender.split('@')[0]}

━━━━━━━━━━━
*Powered by*: ***STRAWBERRY BOT*** 💗`
    : `💗 𓆩 ***𝗨𝗦𝗨𝗔𝗥𝗜𝗢 𝗗𝗘𝗚𝗥𝗔𝗗𝗔𝗗𝗢*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`DEMOTE\`\` —˙𖦹.📉꒷

── *📊 DETALLES* ╏
🍓 *Ya no es Admin:* @${user.split('@')[0]}
☁️ *Por:* @${m.sender.split('@')[0]}

━━━━━━━━━━━
*Powered by*: ***STRAWBERRY BOT*** 💗`

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], action)
    await m.reply(msgAccion, m.chat, { mentions: [user, m.sender] })
  } catch (e) {
    await m.react('❌')
    m.reply(`💗 𓆩 ***𝗘𝗥𝗥𝗢𝗥*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`FALLO\`\` —˙𖦹.❌꒷

── *📝 AVISO* ╏
❌ ➛ ${e.message}

━━━━━━━━━━━`)
  }
}

handler.help = ['promote @user', 'demote @user']
handler.tags = ['grupos']
handler.command = /^(promote|promover|daradmin|demote|degradar|quitaradmin)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler