import { GoogleGenAI } from '@google/genai';

import dotenv from 'dotenv';
import { PROMPT_ANDROID_UPDATES } from './promt_android_news';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function checkContent(message: string) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: PROMPT_ANDROID_UPDATES + '\n\n' + message,
            config: {
                temperature: 0.5,
                systemInstruction:
                    'You are experienced android developer. You want to know the lates updates of libraries and tools.',
            },
        });

        console.log('Response text:', response.text);
        if (response.text == undefined || response.text === '') {
            return false;
        }

        const json = JSON.parse(response.text.replaceAll('```json', '').replaceAll('```', ''));
        return json;
    } catch (error) {
        console.error('Error in checkContent:', error);
        return null;
    }
}

//   const response = await ai.models.generateContent({
//     model: "gemini-2.0-flash",
//     contents: "Explain how AI works in a few words",
//   });
//   console.log(response.text);

// const response = await ai.models.generateContent({
//     model: "gemini-2.0-flash",
//     contents: "Hello there",
//     config: {
//       systemInstruction: "You are experienced android developer. You want to know the lates news and updates related to android developemnt.",
//     },
//   });
//   console.log(response.text);
