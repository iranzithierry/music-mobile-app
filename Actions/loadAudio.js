import { Alert } from 'react-native';
import { Audio } from 'expo-av';
import { checkIfAudioExists } from '../Utils/AsyncStorage.js';

export const loadAudio = async ({ index, setAudioIsLoading, soundObject, mp3Files, cacheDirectory, setAudioIsPlaying, setSliderPosition, setSliderDuration, setElapsedTime, setRemainingTime }) => {
    try {
        setAudioIsLoading(true);

        if (soundObject.current) {
            await soundObject.current.unloadAsync();
        }
        fileExists = await checkIfAudioExists(mp3Files[index].slice(0, -4))
        if (!fileExists) {
            Alert.alert("Warning", "Audio not found");
            setAudioIsPlaying(false);
            setAudioIsLoading(false);
            return;
        }

        const audioFilePath = `${cacheDirectory}${mp3Files[index]}`;
        const { sound } = await Audio.Sound.createAsync({ uri: audioFilePath });
        soundObject.current = sound;

        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
                const nextIndex = index + 1;
                if (nextIndex < mp3Files.length) {
                    loadAudio({ index: nextIndex, setAudioIsLoading, soundObject, mp3Files, cacheDirectory, setAudioIsPlaying, setSliderPosition, setSliderDuration, setElapsedTime, setRemainingTime,
                    });
                } else {
                    Alert.alert("Warning", "No songs left to play");
                    setAudioIsPlaying(false);
                    setAudioIsLoading(false);
                    return;
                }
            }
            if (status.isLoaded) {
                setSliderPosition(status.positionMillis);
                setSliderDuration(status.durationMillis);
                setElapsedTime(status.positionMillis);
                setRemainingTime(status.durationMillis - status.positionMillis);
            }
        });

        await sound.playAsync();
        setAudioIsPlaying(true);
        setAudioIsLoading(false);
    } catch (error) {
        Alert.alert("Error playing audio:", error);
        setAudioIsLoading(false);
    }
};
