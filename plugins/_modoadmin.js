const handler = async (m, { conn, args, isAdmin, isOwner }) => {
    // Validación de permisos
    if (!isAdmin &&!isOwner) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        throw `💗 𓆩 ***𝗠𝗢𝗗𝗢 𝗔𝗗𝗠𝗜𝗡*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`SIN PERMISOS\`\` —˙𖦹.❌꒷

── *📝 AVISO* ╏
❌ ➛ Solo los administradores pueden usar este comando

━━━━━━━━━━━`
    }

    let chat = global.db.data.chats[m.chat]
    if (!chat) global.db.data.chats[m.chat] = {}

    if (/on/i.test(args[0])) {
        chat.modoadmin = true
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        await conn.reply(m.chat, `💗 𓆩 ***𝗠𝗢𝗗𝗢 𝗔𝗗𝗠𝗜𝗡 𝗔𝗖𝗧𝗜𝗩𝗔𝗗𝗢*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`CONFIGURACIÓN\`\` —˙𖦹.⚙️꒷

── *📊 ESTADO* ╏
✅ ➛ Activado
🍓 ➛ Solo admins pueden usar el bot
☁️ ➛ Los demás serán ignorados

━━━━━━━━━━━`, m)
    } else if (/off/i.test(args[0])) {
        chat.modoadmin = false
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        await conn.reply(m.chat, `💗 𓆩 ***𝗠𝗢𝗗𝗢 𝗔𝗗𝗠𝗜𝗡 𝗗𝗘𝗦𝗔𝗖𝗧𝗜𝗩𝗔𝗗𝗢*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`CONFIGURACIÓN\`\` —˙𖦹.⚙️꒷

── *📊 ESTADO* ╏
❌ ➛ Desactivado
🍓 ➛ Todos pueden usar el bot

━━━━━━━━━━━`, m)
    } else {
        await conn.reply(m.chat, `💗 𓆩 ***𝗠𝗢𝗗𝗢 𝗔𝗗𝗠𝗜𝗡*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`USO\`\` —˙𖦹.📌꒷

── *📝 INSTRUCCIONES* ╏
🍓 ➛ ${m.prefix}modoadmin on
☁️ ➛ ${m.prefix}modoadmin off

━━━━━━━━━━━`, m)
    }
}

handler.help = ['modoadmin <on/off>']
handler.tags = ['config']
handler.command = /^(modoadmin|adminmode)$/i
handler.group = true
handler.admin = true

handler.before = async function (m, { conn, isAdmin, isOwner, isROwner, isPrems }) {
    if (m.isBaileys || m.fromMe) return!0

    let chat = global.db.data.chats[m.chat]
    if (!chat) return!0

    // Si estamos en un grupo
    if (m.isGroup) {
        if (chat.modoadmin &&!isAdmin &&!isOwner &&!isROwner &&!isPrems) {
            // Si el usuario intenta usar un comando
            if (m.text.startsWith('.') || m.text.startsWith('/') || m.text.startsWith('#')) {
                // Aviso opcional: solo 1 cada 30 seg para no spamear
                let lastWarn = chat.lastWarnModoAdmin || 0
                if (Date.now() - lastWarn > 30000) {
                    chat.lastWarnModoAdmin = Date.now()
                    await conn.sendMessage(m.chat, {
                        text: `💗 𓆩 ***𝗠𝗢𝗗𝗢 𝗔𝗗𝗠𝗜𝗡*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`BLOQUEADO\`\` —˙𖦹.🔒꒷

── *📝 AVISO* ╏
❌ ➛ @${m.sender.split('@')[0]} no puede usar comandos
🍓 ➛ Solo administradores

━━━━━━━━━━━`,
                        mentions: [m.sender]
                    })
                }
                return false // Detiene la ejecución
            }
        }
    }
    return!0
}

export default handler