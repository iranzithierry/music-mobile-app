import { Alert, AppState } from 'react-native';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { checkIfAudioExists } from '../Utils/AsyncStorage.js';


Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
    interruptionModeIOS: InterruptionModeIOS.DoNotMix,
    interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    staysActiveInBackground: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: true,
});
export const useSound = async ({ soundObject, index, mp3Files, cacheDirectory, setAudioIsLoading, setAudioIsPlaying, setSliderPosition, setSliderDuration, setElapsedTime, setRemainingTime }) => {

    const asyncActivities = (playing = false, loading = false) => {
        playing ? setAudioIsPlaying(true) : setAudioIsPlaying(false);
        loading ? setAudioIsLoading(true) : setAudioIsLoading(false)
    }
    setAudioIsLoading(true);
    if (soundObject.current) {
        await soundObject.current.unloadAsync();
    }
    fileExists = await checkIfAudioExists(mp3Files[index].slice(0, -4))
    if (!fileExists) {
        Alert.alert("Alert", "Audio not found");
        asyncActivities(false, false)
        return;
    }

    const audioFilePath = `${cacheDirectory}${mp3Files[index]}`;
    const { sound } = await Audio.Sound.createAsync({ uri: audioFilePath });
    soundObject.current = sound;
    const handlePlaybackStatusUpdate = (status) => {
        if (status.didJustFinish) {
            const nextIndex = index + 1;
            if (nextIndex < mp3Files.length) {
                useSound({
                    index: nextIndex, setAudioIsLoading, soundObject, mp3Files, cacheDirectory, setAudioIsPlaying, setSliderPosition, setSliderDuration, setElapsedTime, setRemainingTime,
                });
            } else {
                Alert.alert("Alert","No songs left to play");
                asyncActivities(false, false)
                return;
            }
        }
        if (status.isLoaded) {
            setSliderPosition(status.positionMillis);
            setSliderDuration(status.durationMillis);
            setElapsedTime(status.positionMillis);
        }
    };
    sound.setOnPlaybackStatusUpdate((status) => handlePlaybackStatusUpdate(status));
    const handleAudioInterruptions = (nextAppState) => {
        if (nextAppState === 'active' && soundObject.current) {
            soundObject.current.playAsync();
        }
    };
    try { const appStateSubscription = AppState.addEventListener('change', () => handleAudioInterruptions(AppState.currentState)) }
    catch (error) { Alert.alert("ERROR",`ERROR: ${error.message}`) }

    await sound.playAsync();
    asyncActivities(true, false)
    return () => appStateSubscription.remove();
};
