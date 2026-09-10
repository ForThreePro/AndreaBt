let handler = async (m, { conn, args, command, usedPrefix }) => {
  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}

  let q = m.quoted? m.quoted : m
  let mime = (q.msg || q).mimetype || ''

  let type = command.replace('audiowelcome','').replace('audiobye','').replace('audiokick','')
              .replace('delaudiowelcome','').replace('delaudiobye','').replace('delaudiokick','')

  if (command.includes('welcome')) type = 'welcome'
  if (command.includes('bye')) type = 'bye'
  if (command.includes('kick')) type = 'kick'

  // SET AUDIO
  if (command.startsWith('audio')) {
    if (mime && /audio/.test(mime)) {
      let buffer = await q.download()
      chat[`audio${type}`] = buffer
      return m.reply(`💗 𓆩 𝗔𝗨𝗗𝗜𝗢 𝗚𝗨𝗔𝗥𝗗𝗔𝗗𝗢 𓆪 💗\n\n🍓 *Audio de ${type} guardado*\n☁️ *Se reproducirá cuando pase el evento*`)
    }

    if (args[0] && args[0].startsWith('http')) {
      chat[`audio${type}`] = args[0]
      return m.reply(`💗 𓆩 𝗟𝗜𝗡𝗞 𝗚𝗨𝗔𝗥𝗗𝗔𝗗𝗢 𓆪 💗\n\n🍓 *Audio de ${type} guardado*\n☁️ *Link:* ${args[0]}`)
    }

    return m.reply(`💗 𓆩 ***𝗦𝗧𝗥𝗔𝗪𝗕𝗘𝗥𝗬 𝗕𝗢𝗧*** 𓆪 💗\n\n📌 *Uso:* ${usedPrefix}${command} + [responder a audio]\n📌 *Uso:* ${usedPrefix}${command} <link del audio>`)
  }

  // DEL AUDIO
  if (command.startsWith('delaudio')) {
    if (!chat[`audio${type}`]) {
      return m.reply(`🍓 *No hay un audio de ${type} configurado*`)
    }
    delete chat[`audio${type}`]
    await m.reply(`💗 𓆩 𝗔𝗨𝗗𝗜𝗢 𝗘𝗟𝗜𝗠𝗜𝗡𝗔𝗗𝗢 𓆪 💗\n\n🍓 *Audio de ${type} eliminado*`)
  }
}

handler.help = ['audiowelcome', 'audiobye', 'audiokick', 'delaudiowelcome', 'delaudiobye', 'delaudiokick']
handler.tags = ['config']
handler.command = /^(audio(welcome|bye|kick)|delaudio(welcome|bye|kick))$/i
handler.group = true
handler.admin = true

export default handler