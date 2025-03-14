// Summarizing pages content and providing a written report for the link structure

const openai = require('openai')
const api_key = process.env.OPENAI

async function summarize_report (report, links){
    const client = new openai.OpenAI({apiKey:api_key});

    const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: "Write a one-sentence bedtime story about a unicorn.",
            },
        ],
    });

}