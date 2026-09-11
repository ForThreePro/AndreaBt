import ytSearch from 'yt-search'

let handler = async (m, { conn, text, usedPrefix }) => {
    let user = `@${m.sender.split('@')[0]}`
    let groupName = m.isGroup? (await conn.groupMetadata(m.chat)).subject : 'Privado'

    if (!text) {
        await m.react('❌')
        return m.reply(`💗 𓆩 ***𝗕𝗨𝗦𝗖𝗔𝗗𝗢𝗥 𝗦𝗧𝗥𝗔𝗪𝗕𝗘𝗥𝗥𝗬*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`USO\`\` —˙𖦹.📌꒷

── *📝 INSTRUCCIONES* ╏
🍓 ➛ ${usedPrefix}google <busqueda>
☁️ ➛ *Ejemplo:* ${usedPrefix}google bad bunny

━━━━━━━━━━━`)
    }

    await m.react('🔍')
    await m.reply(`💗 𓆩 ***𝗕𝗨𝗦𝗖𝗔𝗡𝗗𝗢*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`PROCESANDO\`\` —˙𖦹.⚙️꒷

── *📊 ESTADO* ╏
🔍 ➛ Buscando en YouTube...
📋 ➛ Obteniendo top 5...

━━━━━━━━━━━`)

    try {
        let search = await ytSearch(text)
        let results = search.videos.slice(0, 5)

        if (!results.length) {
            await m.react('❌')
            return m.reply(`💗 𓆩 ***𝗦𝗜𝗡 𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗗𝗢𝗦*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` —˙𖦹.❌꒷

── *📝 AVISO* ╏
❌ ➛ No encontré nada con: *${text}*

━━━━━━━━━━━`)
        }

        let txt = `💗 𓆩 ***𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗗𝗢𝗦 𝗗𝗘 𝗕𝗨𝗦𝗤𝗨𝗘𝗗𝗔*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`YOUTUBE\`\` —˙𖦹.🔍꒷

🍓 *Buscando:* ${text}

${results.map((v, i) => {
            return `*${i + 1}.* *${v.title}*
☁️ *Duración:* ${v.timestamp}
📊 *Vistas:* ${formatViews(v.views)}
👤 *Canal:* ${v.author.name}
🔗 ${v.url}`
        }).join('\n\n')}

━━━━━━━━━━━
👤 *Solicitado por:* ${user}
🏷 *Grupo:* ${groupName}

💗 *Tip:* Usa ${usedPrefix}play <link> para descargar el audio`

        // Enviar con thumbnail del primer video
        await conn.sendMessage(m.chat, {
            image: { url: results[0].thumbnail },
            caption: txt,
            mentions: [m.sender]
        })

        await m.react('✅')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`💗 𓆩 ***𝗘𝗥𝗥𝗢𝗥*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`FALLO\`\` —˙𖦹.❌꒷

── *📝 AVISO* ╏
❌ ➛ ${e.message}

━━━━━━━━━━━`)
    }
}

function formatViews(views) {
    if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`
    return views.toString()
}

handler.help = ['google <busqueda>']
handler.tags = ['search']
handler.command = /^google$/i
handler.limit = true

export default handler