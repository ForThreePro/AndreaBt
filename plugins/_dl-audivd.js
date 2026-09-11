import { join } from 'path'
import { promises as fs } from 'fs'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

// FUNCION PARA REACCIONES
const react = async (conn, m, text) => {
  try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
}

const handler = async (m, { conn }) => {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''

    if (!/video/.test(mime)) {
        await react(conn, m, "❌")
        return m.reply(`💗 𓆩 ***𝗔𝗨𝗗𝗜𝗩𝗗*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` —˙𖦹.❌꒷

── *📝 AVISO* ╏
❌ ➛ Responde a un video para extraer su audio

━━━━━━━━━━━`)
    }

    await react(conn, m, "⏳")
    await m.reply(`💗 𓆩 ***𝗘𝗫𝗧𝗥𝗔𝗬𝗘𝗡𝗗𝗢 𝗔𝗨𝗗𝗜𝗢*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`PROCESANDO\`\` —˙𖦹.⚙️꒷

── *📊 ESTADO* ╏
📥 ➛ Descargando video...
🎵 ➛ Convirtiendo a MP3...

━━━━━━━━━━━`)

    let tempVideo, tempAudio
    try {
        const videoBuffer = await q.download()
        if (!videoBuffer) throw new Error('No se pudo obtener el buffer del video.')

        // ARREGLO: usar el mismo timestamp para ambos
        const id = Date.now()
        const tempDir = join(process.cwd(), './tmp')
        await fs.mkdir(tempDir, { recursive: true }).catch(() => {})

        tempVideo = join(tempDir, `${id}.mp4`)
        tempAudio = join(tempDir, `${id}.mp3`)

        await fs.writeFile(tempVideo, videoBuffer)

        await execFileAsync('ffmpeg', [
            '-y',
            '-i', tempVideo,
            '-vn',
            '-ar', '44100',
            '-ac', '2',
            '-b:a', '192k',
            tempAudio
        ], { timeout: 120000 })

        const audioBuffer = await fs.readFile(tempAudio)

        await react(conn, m, "🎵")
        await conn.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName: `strawberry_audio_${id}.mp3`,
            ptt: false
        }, { quoted: m })

        await m.reply(`💗 𓆩 ***𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗔𝗗𝗢*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`AUDIO LISTO\`\` —˙𖦹.✅꒷

── *📊 INFORMACIÓN* ╏
🍓 ➛ Formato: *MP3 192kbps*
☁️ ➛ Extraído de: *Video*

━━━━━━━━━━━`)

    } catch (e) {
        console.error(e)
        await react(conn, m, "❌")
        await m.reply(`💗 𓆩 ***𝗘𝗥𝗥𝗢𝗥*** 𓆪 💗

.⃟𖥔 ݁. 𖦹˙— \`\`FALLO\`\` —˙𖦹.❌꒷

── *📝 AVISO* ╏
❌ ➛ ${e.message}
❌ ➛ ¿El video es muy pesado?

━━━━━━━━━━━`)
    } finally {
        await fs.unlink(tempVideo).catch(() => {})
        await fs.unlink(tempAudio).catch(() => {})
    }
}

handler.help = ['audivd']
handler.tags = ['tools']
handler.command = ['audivd', 'audio', 'toaudio']
handler.limit = true

export default handler