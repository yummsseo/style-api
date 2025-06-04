import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  const allowedOrigin = "https://yummsseo.github.io"

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { gender, age, situation, weather, temperature } = req.body;

  if (!gender || !age || !situation || !weather || typeof temperature !== "number") {
    return res.status(400).json({
      error: "성별(gender), 나이(age), 상황(situation), 날씨(weather), 기온(temperature)이 필요합니다.",
    });
  }

  try {
    const today = new Date().toISOString().slice(0, 10);

    const prompt = `
    성별: ${gender}
    나이: ${age}
    상황: ${situation}
    날씨: ${weather}
    기온: ${temperature}°C
    오늘 날짜: ${today}

    위 정보를 바탕으로 오늘의 옷차림을 추천해줘.
    `;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "당신은 패션 스타일링 전문가입니다. 사람들의 성별, 나이, 날씨, 기온, 상황에 맞는 옷차림을 추천해줘. 추천은 200자 이내로 작성하고, 추가로 챙기면 좋을 아이템도 알려줘. 비가 오는 경우엔 우산 같은 소지품도 언급해줘. 부정적인 표현은 피하고, 읽는 사람이 기분 좋게 느끼도록 작성해줘.",
      },
    });

    res.status(200).json({ answer: result.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "GeminiAPI 오류 발생" });
  }
}
