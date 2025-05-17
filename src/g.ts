import { GoogleGenAI } from '@google/genai';

import dotenv from 'dotenv';
dotenv.config();

const gemini_api_key = process.env.API_KEY;

const ai = new GoogleGenAI({ apiKey: gemini_api_key });

async function main() {
    //   const response = await ai.models.generateContent({
    //     model: "gemini-2.0-flash",
    //     contents: "Explain how AI works in a few words",
    //   });
    //   console.log(response.text);

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: 'Hello there',
        config: {
            systemInstruction:
                'You are experienced android developer. You want to know the lates news and updates related to android developemnt.',
        },
    });
    console.log(response.text);
}

main();
