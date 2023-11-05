import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
export const checkIfAudioExists = async (title) => {
  try {
    const fileUri = `${FileSystem.cacheDirectory}${title}.mp3`;
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    return fileInfo.exists;

  } catch (error) {
    Alert.alert("Error", `Error: ${error}`, [{ text: "OK" }]);

  }
};