import fetch from 'node-fetch'

// FUNCION PARA REACCIONES
const react = async (conn, m, text) => {
  try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
}

const handler = async (m, { args, conn }) => {
  try {
    if (!args[0]) {
      return conn.reply(
        m.chat,
        `💗 𓆩 ***𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗗𝗢𝗥 𝗙𝗕*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`USO\`\` —˙𖦹.📌꒷

── *📝 INSTRUCCIONES* ╏
🍓 ➛ ${m.prefix}facebook <link>
☁️ ➛ *Ejemplo:* ${m.prefix}facebook https://fb.watch/xxx

━━━━━━━━━━━`,
        m
      )
    }

    if (!args[0].match(/facebook\.com|fb\.watch/)) {
      await react(conn, m, '❌')
      return m.reply(`💗 𓆩 ***𝗘𝗥𝗥𝗢𝗥*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`LINK INVALIDO\`\` —˙𖦹.❌꒷

── *📝 AVISO* ╏
❌ ➛ El enlace no es de Facebook

━━━━━━━━━━━`)
    }

    await react(conn, m, '⏳')
    await m.reply(`💗 𓆩 ***𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗡𝗗𝗢*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`PROCESANDO\`\` —˙𖦹.⚙️꒷

── *📊 ESTADO* ╏
📥 ➛ Obteniendo información...
🎥 ➛ Preparando video...

━━━━━━━━━━━`)

    const api = `https://yosoyyo-api-ofc.onrender.com/api/facebook?url=${encodeURIComponent(args[0])}&apiKey=yosoyyo_sk_2nbk5m69`
    const res = await fetch(api, { timeout: 15000 })

    if (!res.ok) throw new Error('La API no responde')

    const json = await res.json()
    const data = json.result || json.data || json

    const info = data.info || {}
    const author = data.author || {}
    const media = data.media || {}

    const videoUrl = media.video_hd || media.video_sd
    const thumbUrl = media.thumbnail || info.thumbnail

    if (!videoUrl) {
      await react(conn, m, '❌')
      return conn.reply(
        m.chat,
        `💗 𓆩 ***𝗘𝗥𝗢𝗥*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`SIN VIDEO\`\` —˙𖦹.❌꒷

── *📝 AVISO* ╏
❌ ➛ No se pudo obtener el enlace
❌ ➛ ¿El video es privado?

━━━━━━━━━━━`,
        m
      )
    }

    const titulo = info.title || 'Video de Facebook'
    const duracion = info.duration? `\n☁️ *Duración:* ${info.duration}` : ''
    const autorTxt = author.name || author.username? `\n🍓 *Autor:* ${author.name || author.username}` : ''

    let txt = `💗 𓆩 ***𝗩𝗜𝗗𝗘𝗢 𝗗𝗘 𝗙𝗔𝗖𝗘𝗕𝗢𝗞*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`INFORMACIÓN\`\` —˙𖦹.🎥꒷

── *📊 DETALLES* ╏
📝 *Título:* ${titulo}${duracion}${autorTxt}

━━━━━━━━━━━
🍓 *Enviando video...*`

    await conn.sendFile(
      m.chat,
      videoUrl,
      'facebook.mp4',
      txt,
      m,
      false,
      { thumbnail: thumbUrl? await fetch(thumbUrl).then(r => r.buffer()).catch(() => null) : null }
    )

    await react(conn, m, '✅')

  } catch (error) {
    console.log('Facebook API Error:', error.message)
    await react(conn, m, '❌')
    await m.reply(`💗 𓆩 ***𝗘𝗥𝗥𝗢𝗥*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`FALLO\`\` —˙𖦹.❌꒷

── *📝 AVISO* ╏
❌ ➛ ${error.message}
❌ ➛ Intenta de nuevo en 1 min

━━━━━━━━━━━`)
  }
}

handler.command = ['facebook', 'fb', 'fbdl']
handler.tags = ['descargas']
handler.help = ['facebook <link>']
handler.limit = true

export default handler