duksungAI.js

import {GoogleGenAI} from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({ apiKey:process.env.GEMINI_API_KEY});

export default async function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods","POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if(req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const {name,birth} = req.body;
  if (!gender || !age || !situation || !weather || typeof temperature !== "number") {
    return res.status(400).json({
      error: "성별(gender), 나이(age), 상황(situation), 날씨(weather), 기온(temperature)이 필요합니다.",
    });
  }
  try{
    const today = new Date().toISOString().slice(0,10);

  const prompt = `
  성별: ${gender}
  나이: ${age}
  상황: ${situation}
  날씨: ${weather}
  기온: ${temperature}°C

  오늘의 옷차림을 추천해줘
  `;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction:
        "당신은 패션 스타일링 전문가입니다. 사람들의 성별, 나이, 날씨, 기온, 상황에 맞는 옷차림을 추천해줘. 그리고 추가로 뭘 추가하면 좋겠다는 말도 추가해줘.추천은 200자 이내로 해줬으면 좋겠어. 부정적인 표현은 피해주고 비가온다면 우산과 같은 물건도 챙기라는 말같은 것도 해줘.",
      },
    });

    res.status(200).json({answer: result.text});
  }catch(err) {
    console.error(err);
    res.status(500).json({error:"GeminiAPI 오류 발생"});
  }
}


