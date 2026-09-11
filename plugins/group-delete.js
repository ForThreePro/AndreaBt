let handler = async (m, { conn, usedPrefix, command }) => {

if (!m.quoted) {
    await m.react('❌')
    return conn.reply(m.chat, `💗 𓆩 ***𝗘𝗟𝗜𝗠𝗜𝗡𝗔𝗥 𝗠𝗘𝗡𝗦𝗔𝗝𝗘*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`USO\`\` —˙𖦹.📌꒷

── *📝 INSTRUCCIONES* ╏
🍓 ➛ Responde al mensaje que deseas eliminar con *${usedPrefix + command}*
☁️ ➛ Debes ser admin

━━━━━━━━━━━`, m)
}

try {
    await m.react('🗑️')
    let delet = m.message.extendedTextMessage?.contextInfo?.participant
    let bang = m.message.extendedTextMessage?.contextInfo?.stanzaId
    
    if (delet && bang) {
        // Para mensajes de otros
        await conn.sendMessage(m.chat, { 
            delete: { 
                remoteJid: m.chat, 
                fromMe: false, 
                id: bang, 
                participant: delet 
            }
        })
    } else {
        // Para mensajes del bot
        await conn.sendMessage(m.chat, { delete: m.quoted.vM.key })
    }
    
    await m.reply(`💗 𓆩 ***𝗠𝗘𝗡𝗦𝗔𝗝𝗘 𝗘𝗟𝗜𝗠𝗜𝗡𝗔𝗗𝗢*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`ELIMINADO\`\` —˙𖦹.🗑️꒷

── *📊 DETALLES* ╏
🍓 *Mensaje borrado exitosamente*
☁️ *Por:* @${m.sender.split('@')[0]}

━━━━━━━━━━━`, m, { mentions: [m.sender] })

} catch (e) {
    await m.react('❌')
    return conn.reply(m.chat, `💗 𓆩 ***𝗘𝗥𝗢𝗥*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`FALLO\`\` —˙𖦹.❌꒷

── *📝 AVISO* ╏
❌ ➛ No se pudo eliminar el mensaje
❌ ➛ *Motivo:* ${e.message}

━━━━━━━━━━━`, m)
}
}

handler.help = ['del']
handler.tags = ['grupos']
handler.command = /^del(ete)?$/i
handler.admin = true
handler.botAdmin = true
handler.group = true

export default handler