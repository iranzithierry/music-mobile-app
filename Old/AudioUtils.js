import { useCallback } from "react";
import * as FileSystem from 'expo-file-system';
import { Alert } from "react-native";

export const pauseAudio = (audioIsPaused, currentSoundObject, setAudioIsPaused) => {
    if (!audioIsPaused) {
        if (currentSoundObject) {
            currentSoundObject.pauseAsync();
            setAudioIsPaused(true)
        }
    }
    else {
        if (currentSoundObject) {
            currentSoundObject.playAsync();
            setAudioIsPaused(false)
        }
    }
}

export const stopAudio = async (currentSoundObject, setAudioIsPlaying) => {
    if (currentSoundObject) {
        await currentSoundObject.stopAsync();
        setAudioIsPlaying(false);
    }
};

export const deleteAudio = async (index, setMp3Files) => {
    try {
        const audioFilePath = `${cacheDirectory}${mp3Files[index]}`;
        await FileSystem.deleteAsync(audioFilePath);
        const updatedMp3Files = mp3Files.filter((_, idx) => idx !== index);
        setMp3Files(updatedMp3Files);

    } catch (error) {
        Alert.alert("Error", `Error deleting song from cache: ${error}`);
    }
};