import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';

let recordingInstance = null;

/**
 * Requests microphone permission from the user.
 * Returns true if granted, false otherwise.
 */
export async function requestMicPermission() {
  const { status } = await Audio.requestPermissionsAsync();
  return status === 'granted';
}

/**
 * Starts recording audio. Throws if permission isn't granted.
 */
export async function startRecording() {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  const { recording } = await Audio.Recording.createAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY
  );

  recordingInstance = recording;
  return recording;
}

/**
 * Stops the current recording and returns:
 *  - uri: local file path of the recorded audio
 *  - base64: base64-encoded audio data (for sending to the AI API)
 */
export async function stopRecording() {
  if (!recordingInstance) {
    throw new Error('No active recording to stop.');
  }

  await recordingInstance.stopAndUnloadAsync();
  await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

  const uri = recordingInstance.getURI();
  recordingInstance = null;

  if (!uri) {
    throw new Error('Recording failed — no file was produced.');
  }

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return { uri, base64 };
}

/**
 * Cancels an in-progress recording without saving/using it.
 */
export async function cancelRecording() {
  if (recordingInstance) {
    try {
      await recordingInstance.stopAndUnloadAsync();
    } catch (e) {
      // already stopped/unloaded — safe to ignore
    }
    recordingInstance = null;
  }
}
