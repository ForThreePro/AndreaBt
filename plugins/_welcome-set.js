let handler = async (m, { conn, args, command, usedPrefix }) => {
  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}

  let type = command.replace('set', '').replace('del', '')
  let text = args.join(' ')

  // SET
  if (command.startsWith('set')) {
    if (!text) return m.reply(
      `📌 *Uso:* ${usedPrefix}${command} <texto>\n\n` +
      `*Variables disponibles:*\n` +
      `@user = Menciona al usuario\n` +
      `@group = Nombre del grupo\n` +
      `@desc = Descripción del grupo`
    )

    chat[`custom${type.charAt(0).toUpperCase() + type.slice(1)}`] = text
    return m.reply(
      `✅ *${type} personalizado guardado*\n\n` +
      `*Vista previa:*\n${text}`
    )
  }

  // DEL
  if (command.startsWith('del')) {
    let key = `custom${type.charAt(0).toUpperCase() + type.slice(1)}`
    if (!chat[key]) {
      return m.reply(`❌ *No hay un ${type} personalizado configurado*`)
    }
    delete chat[key]
    return m.reply(`🗑️ *${type} personalizado eliminado*\nSe usará el mensaje por defecto`)
  }
}

handler.help = ['setwelcome', 'setbye', 'setkick', 'delwelcome', 'delbye', 'delkick']
handler.tags = ['config']
handler.command = /^(setwelcome|setbye|setkick|delwelcome|delbye|delkick)$/i
handler.group = true
handler.admin = true

export default handler