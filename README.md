# Voice to Task

A React Native (Expo) mobile app that converts spoken reminders into structured,
locally-saved tasks — e.g. saying *"Remind me to call John tomorrow at 5 PM"*
produces a task with `task`, `date`, and `time` fields.

## How it works

1. **Record** — Tap the mic button to record your voice using `expo-av`.
2. **Understand** — The recorded audio is sent directly to **Google Gemini**
   (`gemini-2.0-flash`), which transcribes the speech *and* extracts the task
   details (task, date, time) in a single API call, returning structured JSON.
3. **Confirm** — The extracted details are shown on an editable screen so the
   user can fix anything before saving.
4. **Save** — The task is stored locally on-device using `AsyncStorage`.
5. **View** — All tasks are listed with the ability to mark complete or delete.

### Why no separate speech-to-text library?

Voice recognition libraries (e.g. `@react-native-voice/voice`) require native
modules that aren't included in **Expo Go**, meaning they'd need a custom dev
build to test on a physical phone. Instead, this app records raw audio with
`expo-av` (which *is* supported in Expo Go) and lets Gemini handle
transcription natively, since Gemini accepts audio as direct input. This
keeps the whole app runnable in Expo Go with zero native build steps.

## Tech Stack

- **React Native (Expo SDK 52)**
- **expo-av** — audio recording
- **expo-file-system** — reading recorded audio as base64
- **Google Gemini API** (`gemini-2.0-flash`) — speech transcription + task
  extraction (structured JSON output)
- **@react-native-async-storage/async-storage** — local persistence
- **@react-navigation/native-stack** — navigation between screens

## Project Structure

```
voice-to-task/
├── App.js
├── app.json
├── eas.json
├── config.js                     # Gemini API key
├── .env
├── .gitignore
├── icon.png
├── package.json
├── package-lock.json
├── README.md
└── src/
    ├── components/
    │   ├── AiLoader.js
    │   ├── AnimatedFab.js
    │   ├── EmptyState.js
    │   ├── GradientBackground.js  # confirm exact name
    │   ├── MicButton.js           # confirm exact name
    │   ├── Snackbar.js
    │   ├── TaskCard.js
    │   └── VoiceWaveform.js
    ├── navigation/
    │   └── AppNavigator.js
    ├── screens/
    │   ├── ConfirmScreen.js
    │   ├── RecordScreen.js
    │   └── TaskListScreen.js
    ├── services/
    │   ├── aiService.js           # Gemini API call + JSON parsing
    │   ├── audioService.js        # recording start/stop, permissions
    │   ├── notificationService.js # local notification scheduling
    │   └── storageService.js      # AsyncStorage CRUD for tasks
    └── theme/
        └── theme.js
```

## Setup Instructions

### 1. Prerequisites
- Node.js LTS installed
- [Expo Go](https://expo.dev/go) app installed on your phone
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 2. Install dependencies
```bash
cd voice-to-task
npm install
```

### 3. Add your Gemini API key
Open `src/config.js` and paste your key:
```js
export const GEMINI_API_KEY = 'YOUR_KEY_HERE';
```

### 4. Run the app
```bash
npx expo start
```
Scan the QR code with the **Expo Go** app on your phone (same Wi-Fi network
as your computer).

### 5. Try it
- Tap the mic, say something like *"Remind me to submit the report on
  Friday at 9 AM"*, tap again to stop.
- Review the extracted task on the confirmation screen, edit if needed, and
  save.
- View, complete, or delete tasks from the task list screen.

## Error Handling Covered

- Microphone permission denial
- Recording failure
- Network failure when calling the Gemini API
- Non-200 API responses
- Malformed / non-JSON AI responses
- AI-flagged "unclear audio" cases
- Missing required fields (task/date) before saving

## Possible Improvements (not implemented, out of scope for this assessment)

- Push notifications / actual device reminders at the scheduled time
- Cloud sync instead of local-only storage
- Editable recurring reminders
- On-device offline transcription fallback
