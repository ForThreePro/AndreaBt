let handler = async (m, { conn, args, command, usedPrefix }) => {
  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}

  let q = m.quoted? m.quoted : m
  let mime = (q.msg || q).mimetype || ''

  // Detectar tipo: welcome / bye / kick
  let type = command.replace('audiowelcome','').replace('audiobye','').replace('audiokick','')
              .replace('delaudiowelcome','').replace('delaudiobye','').replace('delaudiokick','')

  if (command.includes('welcome')) type = 'welcome'
  if (command.includes('bye')) type = 'bye'
  if (command.includes('kick')) type = 'kick'

  // SET AUDIO
  if (command.startsWith('audio')) {
    // Si responde a un audio o manda audio
    if (mime && /audio/.test(mime)) {
      let buffer = await q.download()
      chat[`audio${type}`] = buffer
      return m.reply(`✅ *Audio de ${type} guardado correctamente*\n\nSe reproducirá cuando ocurra el evento.`)
    }

    // Si manda un link
    if (args[0] && args[0].startsWith('http')) {
      chat[`audio${type}`] = args[0]
      return m.reply(`✅ *Audio de ${type} guardado correctamente*\n\n*Link:* ${args[0]}`)
    }

    return m.reply(`📌 *Uso:*\n${usedPrefix}${command} + [responder a un audio]\n${usedPrefix}${command} <link del audio>`)
  }

  // DEL AUDIO
  if (command.startsWith('delaudio')) {
    if (!chat[`audio${type}`]) {
      return m.reply(`❌ *No hay un audio de ${type} configurado*`)
    }
    delete chat[`audio${type}`]
    return m.reply(`🗑️ *Audio de ${type} eliminado correctamente*`)
  }
}

handler.help = ['audiowelcome', 'audiobye', 'audiokick', 'delaudiowelcome', 'delaudiobye', 'delaudiokick']
handler.tags = ['config']
handler.command = /^(audio(welcome|bye|kick)|delaudio(welcome|bye|kick))$/i
handler.group = true
handler.admin = true

export default handler