import * as FileSystem from 'expo-file-system';
import { useEffect, useState, useCallback, useRef } from 'react';
import { View, Alert } from 'react-native';
import LibraryItem from '../Components/LibraryItem.js';
import AudioControls from '../Components/AudioControls.js';
import AudioPlayer from '../Components/AudioPlayer.js';
import { loadAudio } from '../Actions/loadAudio.js';
import Layout from './Layout.js';

export default function Library({ route }) {
    const [mp3Files, setMp3Files] = useState([]);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);
    const [sliderPosition, setSliderPosition] = useState(0);
    const [sliderDuration, setSliderDuration] = useState(0);
    const [audioIsPaused, setAudioIsPaused] = useState(false);
    const [audioIsPlaying, setAudioIsPlaying] = useState(false);
    const [audioIsLoading, setAudioIsLoading] = useState(false);

    const cacheDirectory = FileSystem.cacheDirectory;

    const { reloadCache = true } = route.params || {};

    const soundObject = useRef(null);

    const showFilesInCache = useCallback(async () => {
        try {
            const filesInCache = await FileSystem.readDirectoryAsync(cacheDirectory);
            const filteredFiles = filesInCache.filter(file => /\.mp3$/.test(file));
            setMp3Files(filteredFiles);
        } catch (error) {
            Alert.alert("Error reading cache:", error);
        }
    }, [cacheDirectory]);



    const playAudio = useCallback(async (index, isRandom = false) => {
        if (mp3Files.length === 0 || audioIsLoading) {
            Alert.alert("Warning", "No audios found or audio is still loading.");
            return;
        }

        isRandom ? (index = Math.floor(Math.random() * mp3Files.length)) : index;
        loadAudio({
            index, setAudioIsLoading, soundObject, mp3Files, cacheDirectory, setAudioIsPlaying, setSliderPosition, setSliderDuration, setElapsedTime, setRemainingTime,
        });
    }, [mp3Files, loadAudio, audioIsLoading]);


    const PauseAudio = () => {
        if (!audioIsPaused) {
            if (soundObject.current) {
                soundObject.current.pauseAsync();
                setAudioIsPaused(true)
            }
        }
        else {
            if (soundObject.current) {
                soundObject.current.playAsync();
                setAudioIsPaused(false)
            }
        }
    }
    const stopAudio = useCallback(async () => {
        if (soundObject.current) {
            await soundObject.current.stopAsync();
            setAudioIsPlaying(false);
        }
    }, []);

    const deleteSongFromCache = useCallback(async (index) => {
        try {
            const audioFilePath = `${cacheDirectory}${mp3Files[index]}`;
            await FileSystem.deleteAsync(audioFilePath);
            // updatedMp3Files.splice(index, 1);
            const updatedMp3Files = mp3Files.filter((_, idx) => idx !== index);
            setMp3Files(updatedMp3Files);

        } catch (error) {
            Alert.alert("Error", `Error deleting song from cache: ${error}`);
        }
    }, [cacheDirectory, mp3Files]);

    const handleSliderChange = (value) => {
        if (soundObject.current) {
            setSliderPosition(value);
            soundObject.current.setPositionAsync(value);
            setElapsedTime(value);
            setRemainingTime(sliderDuration - value);
            if (!audioIsPlaying || audioIsPaused) {
                audioIsPaused ? setAudioIsPaused(false) : setAudioIsPlaying(true)
                soundObject.current.playAsync()
            };
        }
    };

    useEffect(() => {
        if (reloadCache) {
            showFilesInCache();
        }
    }, [reloadCache, showFilesInCache]);

    return (
        <Layout>
            <LibraryItem mp3Files={mp3Files} playAudio={playAudio} deleteSongFromCache={deleteSongFromCache} />
            <View className="px-4">
                {audioIsPlaying ? (
                    <AudioPlayer
                        elapsedTime={elapsedTime}
                        sliderDuration={sliderDuration}
                        sliderPosition={sliderPosition}
                        handleSliderChange={handleSliderChange}
                        audioIsPaused={audioIsPaused}
                        PauseAudio={PauseAudio}
                        stopAudio={stopAudio}
                    />

                ) : (
                    <AudioControls
                        playFirst={playAudio}
                        reloadCache={showFilesInCache}
                        playRandom={playAudio}
                    />
                )}
            </View>
        </Layout>
    );
}

