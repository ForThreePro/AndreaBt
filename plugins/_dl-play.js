import fetch from "node-fetch"
import yts from 'yt-search'

const react = async (conn, m, text) => {
  try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        if (!text.trim()) {
            await react(conn, m, '❌')
            return await conn.reply(m.chat, `💗 𓆩 ***𝗣𝗟𝗔𝗬 𝗔𝗨𝗗𝗜𝗢*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`USO\`\` —˙𖦹.📌꒷

── *📝 INSTRUCCIONES* ╏
🍓 ➛ ${usedPrefix}play <nombre o link>
☁️ ➛ *Ejemplo:* ${usedPrefix}play bad bunny

━━━━━━━━━━━`, m)
        }

        await react(conn, m, '⏳')
        await m.reply(`💗 𓆩 ***𝗕𝗨𝗦𝗖𝗔𝗡𝗗𝗢*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`PROCESANDO\`\` —˙𖦹.⚙️꒷

── *📊 ESTADO* ╏
🔍 ➛ Buscando en YouTube...
📥 ➛ Preparando audio...

━━━━━━━━━━━`)

        const videoMatch = text.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/|v\/))([a-zA-Z0-9_-]{11})/)
        const query = videoMatch? 'https://youtu.be/' + videoMatch[1] : text
        const search = await yts(query)
        const result = videoMatch? search.videos.find(v => v.videoId === videoMatch[1]) || search.all[0] : search.all[0]
        if (!result) throw 'No se encontraron resultados.'

        const { title, thumbnail, timestamp, views, videoId, author, seconds } = result
        if (seconds > 1800) throw 'El contenido supera el límite de duración (30 minutos).'

        const vistas = formatViews(views)
        const canal = author.name
        const shortUrl = `https://youtu.be/${videoId}`

        const info = `💗 𓆩 ***𝗙𝗨𝗡𝗗𝗔𝗗𝗢*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`INFORMACIÓN\`\` —˙𖦹.🎵꒷

── *📊 DETALLES* ╏
🍓 *Título:* ${title}
☁️ *Canal:* ${canal}
📊 *Vistas:* ${vistas}
⏱️ *Duración:* ${timestamp}
🔗 *Link:* ${shortUrl}

━━━━━━━━━━━
🎵 *Descargando audio...*`

        const thumb = (await conn.getFile(thumbnail)).data

        await conn.sendMessage(m.chat, { image: thumb, caption: info }, { quoted: m })

        // API PRINCIPAL + RESPALDO
        let mediaUrl = await getMediaUrl(shortUrl)
        if (!mediaUrl) mediaUrl = await getMediaUrl2(shortUrl)
        if (!mediaUrl) throw 'No se pudo obtener el audio de ninguna API.'

        await react(conn, m, '🎵')
        await conn.sendMessage(m.chat, {
            audio: { url: mediaUrl },
            fileName: `${title}.mp3`,
            mimetype: 'audio/mpeg',
            contextInfo: {
                externalAdReply: {
                    title: title,
                    body: canal,
                    thumbnail: thumb,
                    mediaType: 2,
                    mediaUrl: shortUrl
                }
            }
        }, { quoted: m })

        await react(conn, m, '✅')

    } catch (e) {
        await react(conn, m, '❌')
        return await conn.reply(m.chat, `💗 𓆩 ***𝗘𝗥𝗥𝗢𝗥*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`FALLO\`\` —˙𖦹.❌꒷

── *📝 AVISO* ╏
❌ ➛ ${typeof e === 'string'? e : e.message}

━━━━━━━━━━━`, m)
    }
}

// API 1
async function getMediaUrl(url) {
    try {
        const res = await fetch(`https://api.sventy.store/api/ytdl?url=${encodeURIComponent(url)}`).then(r => r.json())
        return res.data?.download || null
    } catch {
        return null
    }
}

// API 2 RESPALDO
async function getMediaUrl2(url) {
    try {
        const res = await fetch(`https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(url)}&type=audio&apikey=russel`).then(r => r.json())
        return res.data?.url || null
    } catch {
        return null
    }
}

function formatViews(views) {
    if (views === undefined) return "No disponible"
    if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`
    return views.toString()
}

handler.command = handler.help = ['play', 'yta', 'ytmp3', 'playaudio', 'ytaudio']
handler.tags = ['descargas']
handler.group = true
handler.limit = true

export default handler