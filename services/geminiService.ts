import { GoogleGenAI } from "@google/genai";
import { TelemetryData, RiskLevel } from "../types";

const SIMULATION_PROMPT = `
You are an expert AI Automotive Engineer and Driving Instructor.
Analyze the following vehicle telemetry data for a cornering scenario.
Determine the risk factors and provide a concise (max 3 sentences) safety assessment.

Input Data:
- Speed: {speed} km/h
- Lateral G: {latG} g
- Longitudinal G: {longG} g
- Steering Angle: {steer}°
- Road Incline: {incline}°
- Tire Temp: {temp}°C
- ESP Active: {esp}
- TC Active: {tc}
- Estimated Risk Level: {risk}

Output format:
**Observation:** [What is happening]
**Advice:** [What the driver should do]
`;

export const getSafetyInsight = async (data: TelemetryData, risk: RiskLevel): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key missing. Please configure the environment.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const filledPrompt = SIMULATION_PROMPT
      .replace('{speed}', data.speed_kmh.toString())
      .replace('{latG}', data.lateral_g.toString())
      .replace('{longG}', data.longitudinal_g.toString())
      .replace('{steer}', data.steering_angle_deg.toString())
      .replace('{incline}', data.road_incline_deg.toString())
      .replace('{temp}', data.tire_temp_c.toString())
      .replace('{esp}', data.esp_active ? 'YES' : 'NO')
      .replace('{tc}', data.tc_active ? 'YES' : 'NO')
      .replace('{risk}', risk);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: filledPrompt,
    });

    return response.text || "No insight available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI system offline. Unable to generate real-time insight.";
  }
};