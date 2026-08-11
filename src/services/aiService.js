import { GEMINI_API_KEY, GEMINI_MODEL } from '../config';

const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Sends recorded audio (base64) to Gemini, which:
 *   1. Transcribes the speech
 *   2. Extracts a structured task: { task, date, time }
 *
 * We pass today's date explicitly because the model has no notion of
 * "now" on its own, and needs it to resolve phrases like "tomorrow".
 */
export async function extractTaskFromAudio(base64Audio) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
  const weekday = today.toLocaleDateString('en-US', { weekday: 'long' });

  const prompt = `You are a voice assistant that converts spoken reminders into structured tasks.

Today's date is ${todayStr} (${weekday}).

Listen to the audio and:
1. Transcribe exactly what was said.
2. Extract the task description, date, and time being requested.
3. Resolve relative dates ("tomorrow", "next Monday", etc.) into an absolute YYYY-MM-DD date using today's date above.
4. If no explicit time is mentioned, set "time" to null.
5. If the audio is unclear, unrelated to a task, or empty, set "success" to false.

Respond with ONLY valid JSON, no markdown formatting, no extra text, in this exact shape:
{
  "success": true,
  "transcript": "the exact transcribed text",
  "task": "short task description",
  "date": "YYYY-MM-DD",
  "time": "HH:MM (24-hour) or null"
}`;

  const body = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: 'audio/m4a',
              data: base64Audio,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
  };

  let response;
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (networkErr) {
    throw new Error('Network error — check your internet connection.');
  }

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Gemini API error (${response.status}): ${errText.slice(0, 200)}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('AI returned an empty response.');
  }

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (e) {
    throw new Error('Could not parse AI response as JSON.');
  }

  if (!parsed.success) {
    throw new Error('Could not understand the audio. Please try again and speak clearly.');
  }

  if (!parsed.task || !parsed.date) {
    throw new Error('AI response was missing required task details.');
  }

  return {
    transcript: parsed.transcript ?? '',
    task: parsed.task,
    date: parsed.date,
    time: parsed.time ?? null,
  };
}
