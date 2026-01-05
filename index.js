const { default: makeWASocket, useMultiFileAuthState, delay } = require("@whiskeysockets/baileys");
const pino = require("pino");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true, // Pour la première connexion
        logger: pino({ level: "silent" })
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        const from = msg.key.remoteJid;

        // Menu Principal
        if (text === "Menu" || text === "menu" || text === "Bot") {
            await sock.sendMessage(from, { text: "🎮 *SÉLECTIONNEZ UN JEU :*\n\n1. Aviator\n2. Lucky Jet\n3. Mines\n4. Rocket Queen\n5. Speed & Cash" });
        }

        // Logique des signaux (Réaliste et Sec)
        if (text === "1") { // Aviator
            const signal = (Math.random() * (3.5 - 1.1) + 1.1).toFixed(2);
            await sock.sendMessage(from, { text: `✈️ *AVIATOR*\n\nSignal : ${signal}x` });
        }
        
        if (text === "2") { // Lucky Jet
            const signal = (Math.random() * (5.0 - 1.2) + 1.2).toFixed(2);
            await sock.sendMessage(from, { text: `🚀 *LUCKY JET*\n\nSignal : ${signal}x` });
        }

        if (text === "3") { // Mines
            const mines = ["💣", "💎", "💎", "💣", "💎", "💎", "💎", "💣", "💎", "💎"];
            const schema = mines.sort(() => Math.random() - 0.5).slice(0, 5).join(" ");
            await sock.sendMessage(from, { text: `💣 *MINES*\n\nSchéma : ${schema}` });
        }
    });
}

startBot();
