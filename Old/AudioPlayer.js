import { useCallback, useEffect } from "react";
import { Alert, AppState } from 'react-native';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { checkIfAudioExists } from '../Utils/AsyncStorage.js';
import * as FileSystem from 'expo-file-system';

Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
    interruptionModeIOS: InterruptionModeIOS.DoNotMix,
    interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    staysActiveInBackground: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: true,
});

export default function useAudioPlayer (index, isRandom, playArgs) {
    const cacheDirectory = FileSystem.cacheDirectory
    const { soundObject, mp3Files, setAudioIsLoading, setAudioIsPlaying, setSliderPosition, setSliderDuration, setElapsedTime, setRemainingTime } = playArgs;

    const playAudio = useCallback(async (index, isRandom) => {
        console.log("Play audio called");
        console.log(mp3Files[index]);
        setAudioIsLoading(true);

        if (soundObject.current) {
            await soundObject.current.unloadAsync();
        }
        isRandom ? (index = Math.floor(Math.random() * mp3Files.length)) : index;

        // const fileExists = await checkIfAudioExists(mp3Files[index].slice(0, -4));

        // if (!fileExists) {
        //     Alert.alert("Alert", "Audio not found");
        //     asyncActivities(false, false);
        //     return;
        // }

        // const audioFilePath = `${cacheDirectory}${mp3Files[index]}`;
        const audioFilePath = `${mp3Files[index].uri}`;
        const { sound } = await Audio.Sound.createAsync({ uri: audioFilePath });
        soundObject.current = sound;

        sound.setOnPlaybackStatusUpdate((status) => handlePlaybackStatusUpdate(status));
        const appStateSubscription = AppState.addEventListener('change', () => handleAudioInterruptions(AppState.currentState));

        await sound.playAsync();
        asyncActivities(true, false);
        return () => appStateSubscription.remove();
    }, [soundObject, mp3Files, cacheDirectory, setAudioIsLoading, asyncActivities, handlePlaybackStatusUpdate, handleAudioInterruptions]);

    const asyncActivities = useCallback((playing = false, loading = false) => {
        setAudioIsPlaying(playing);
        setAudioIsLoading(loading);
    }, [setAudioIsPlaying, setAudioIsLoading]);

    const handlePlaybackStatusUpdate = useCallback((status) => {
        if (status.didJustFinish) {
            const nextIndex = mp3Files.indexOf(status.uri) + 1;
            if (nextIndex < mp3Files.length) {
                playAudio(nextIndex);
            } else {
                Alert.alert("Alert", "No songs left to play");
                asyncActivities(false, false);
            }
        }
        if (status.isLoaded) {
            setSliderPosition(status.positionMillis);
            setSliderDuration(status.durationMillis);
            setElapsedTime(status.positionMillis);
        }
    }, [mp3Files, playAudio, asyncActivities, setSliderPosition, setSliderDuration, setElapsedTime]);

    const handleAudioInterruptions = useCallback((nextAppState) => {
        if (nextAppState === 'active' && soundObject.current) {
            soundObject.current.playAsync();
        }
    }, [soundObject]);
    return {
        playAudio,
        asyncActivities,
        handlePlaybackStatusUpdate,
        handleAudioInterruptions,
    };
};
