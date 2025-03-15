// Summarizing pages content and providing a written report for the link structure

const {OpenAI} = require('openai');
require('dotenv').config();
const api_key = process.env.OPEN_AI;

async function summarize_report(report, pages){
    const client = new OpenAI({apiKey:api_key})
    const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Gib deine Antwort IMMER als JSON-Objekt mit folgendem Schema zurück: {'linking_structure': 'Kurzer Überblick über die Link Struktur (ca. 20 Wörter) mit kurzer Erklärung', 'content': 'Überblick über Website Inhalt (80 Wörter)'}" },
          // es wird nur der Text der Website als input übergeben
          { role: "user", content: `Link Struktur: ${pages}; Website Inhalt: ${ report[0][1].text}`},
        ],
        max_tokens: 700
      });
      return response.choices[0].message.content;
      
}


module.exports = {
    summarize_report
}
