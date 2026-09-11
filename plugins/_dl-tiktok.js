import fetch from 'node-fetch'
import { generateWAMessageFromContent, generateWAMessageContent, proto } from '@whiskeysockets/baileys'

// FUNCION PARA REACCIONES
const react = async (conn, m, text) => {
  try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
}

var handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    await react(conn, m, '❌')
    return m.reply(
`💗 𓆩 ***𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗗𝗢𝗥 𝗧𝗜𝗞𝗧𝗢𝗞*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`USO\`\` —˙𖦹.📌꒷

── *📝 INSTRUCCIONES* ╏
🍓 ➛ ${usedPrefix + command} <link de tiktok>
☁️ ➛ *Ejemplo:* ${usedPrefix + command} https://vm.tiktok.com/ZMkcmTCa6/

━━━━━━━━━━━`
    )
  }

  const url = args[0]
  if (!url.match(/(https?:\/\/)?(www\.)?(vm\.|vt\.|www\.)?tiktok\.com\//)) {
    await react(conn, m, '❌')
    return m.reply(`💗 𓆩 ***𝗘𝗥𝗥𝗢𝗥*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`LINK INVALIDO\`\` —˙𖦹.❌꒷

── *📝 AVISO* ╏
❌ ➛ El enlace no es de TikTok

━━━━━━━━━━━`)
  }

  try {
    await react(conn, m, "⏳")
    await m.reply(`💗 𓆩 ***𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗡𝗗𝗢*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`PROCESANDO\`\` —˙𖦹.⚙️꒷

── *📊 ESTADO* ╏
📥 ➛ Obteniendo video...
🎥 ➛ Quitando marca de agua...

━━━━━━━━━━━`)

    const tiktokData = await tiktokdl(url)
    if (!tiktokData?.data) throw 'No se pudo obtener el video.'

    const videoURL = tiktokData.data.play
    const title = tiktokData.data.title || 'Sin título'
    const author = tiktokData.data.author?.nickname || 'Desconocido'
    const likes = formatNum(tiktokData.data.digg_count)
    const comments = formatNum(tiktokData.data.comment_count)
    const shares = formatNum(tiktokData.data.share_count)

    const thumb = Buffer.from(await (await fetch(tiktokData.data.cover || 'https://files.catbox.moe/dsgmid.jpg')).arrayBuffer())

    const businessHeader = {
      key: { remoteJid: m.chat, participant: '0@s.whatsapp.net', fromMe: false },
      message: {
        locationMessage: {
          name: `STRAWBERRY BOT 💗`,
          jpegThumbnail: thumb
        }
      }
    }

    const media = await generateWAMessageContent({ video: { url: videoURL } }, { upload: conn.waUploadToServer, jid: m.chat })

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: {
              text: `💗 𓆩 ***𝗩𝗜𝗗𝗘𝗢 𝗗𝗘 𝗧𝗜𝗞𝗧𝗢𝗞*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`INFORMACIÓN\`\` —˙𖦹.🎥꒷

── *📊 DETALLES* ╏
🍓 *Título:* ${title}
☁️ *Autor:* @${author}
❤️ *Likes:* ${likes}
💬 *Comentarios:* ${comments}
📤 *Compartidos:* ${shares}

━━━━━━━━━━━
🎥 *Descarga sin marca de agua*`
            },
            footer: { text: 'STRAWBERRY BOT 💗🍓' },
            header: { hasMediaAttachment: true, videoMessage: media.videoMessage },
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
              buttons: [
                { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '🍓 Copiar título', copy_code: title }) },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '☁️ Ver en TikTok', url: url }) }
              ]
            })
          })
        }
      }
    }, { quoted: businessHeader })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    await react(conn, m, "✅")

  } catch (error) {
    await react(conn, m, "❌")
    m.reply(`💗 𓆩 ***𝗘𝗥𝗥𝗢𝗥*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`FALLO\`\` —˙𖦹.❌꒷

── *📝 AVISO* ╏
❌ ➛ ${error.message}
❌ ➛ ¿El video es privado?

━━━━━━━━━━━`)
  }
}

async function tiktokdl(url) {
  const tikwm = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`
  return await (await fetch(tikwm, { signal: AbortSignal.timeout(20000) })).json()
}

const formatNum = (n) => {
  n = Number(n)
  if (!n) return "0"
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return n.toString()
}

handler.help = ['tiktok <link>']
handler.tags = ['descargas']
handler.command = ['tt', 'tiktok', 'ttdl']
handler.limit = true

export default handler