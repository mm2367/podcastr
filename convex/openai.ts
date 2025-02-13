import {action} from "./_generated/server";
import {v} from "convex/values";
import OpenAI from "openai";
import {SpeechCreateParams} from "openai/resources/audio";

const openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY
})
//@ts-ignore
export const generateAudioAction = action({
    args: {input: v.string(), voice: v.string()},
    handler: async (ctx, {voice, input}) => {
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: voice as SpeechCreateParams['voice'],
            input
        });
        const buffer = await mp3.arrayBuffer();
        return buffer
    },
});

//@ts-ignore
export const generateThumbnailAction = action({
    args: {prompt: v.string()},
    handler: async (ctx, {prompt}) => {
        const imageFetch = await openai.images.generate({
            model: "dall-e-3",
            prompt,
            size:'1024x1024',
            quality:'standard',
            n:1
        });
        const url = await imageFetch.data[0].url;
        if(!url){
            throw new Error('Error generating Thumbnail')
        }
        const imageResponse= await fetch(url);
        return await imageResponse.arrayBuffer();
    },
});
