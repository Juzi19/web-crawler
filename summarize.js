// Summarizing pages content and providing a written report for the link structure

const {OpenAI} = require('openai');
const { printContactData } = require('./report');
require('dotenv').config();
const api_key = process.env.OPEN_AI;

async function summarize_report(report, pages){
    const contact_links = printContactData(pages)
    const client = new OpenAI({apiKey:api_key})
    const response = await client.responses.create({
        model: "gpt-4o-mini",
        input: [{ 
            role: "system",
            content: "Erstelle eine kurze Erklärung über den Inhalt der Website (ca.70 Wörter), 30 wörter zu der linking structure und 30 Wörter zu den Kontaktmöglichkeiten"
        },
          // es wird nur der Text der Website (Homepage) als input übergeben
        { 
            role: "user", 
            content: `Link Struktur: ${pages}; Website Inhalt: ${ report[0][1].text}, Kontakt: ${contact_links}`
        },
        ],
        text: {
            format: {
                type: "json_schema",
                name: "website_report",
                schema: {
                    type: "object",
                    properties: {
                        linking_structure: {
                            type: "string"
                        },
                        content: {
                            type: "string"
                        },
                        contact: {
                            type: "string"
                        }
                    },
                    required: ["linking_structure", "content", "contact"],
                    additionalProperties: false
                }
            }
        },
        max_output_tokens: 500
      });


    return JSON.parse(response.output_text);
      
}


module.exports = {
    summarize_report
}
