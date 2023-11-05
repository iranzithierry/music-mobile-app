import * as FileSystem from 'expo-file-system';
import { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';
import { Theme } from '../Theme/Index';
import { stringfyTitle } from '../Utils/StringMethod';
import PrimaryButton from '../Components/PrimaryButton.js';
import { TrashIcon } from 'react-native-heroicons/solid';
import Slider from '@react-native-community/slider';

export default function Library({ route }) {
    const [mp3Files, setMp3Files] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);

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

    const loadAudio = useCallback(async (index, isRandom = false) => {
        try {
            if (soundObject.current) {
                await soundObject.current.unloadAsync();
            }

            const audioFilePath = `${cacheDirectory}${mp3Files[index]}`;
            const { sound } = await Audio.Sound.createAsync({ uri: audioFilePath });
            soundObject.current = sound;

            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    console.log("Audio has ended");
                    setIsPlaying(false);
                    if (isRandom) {
                        shuffleAudio();
                    } else {
                        const nextIndex = index + 1;
                        if (nextIndex < mp3Files.length) {
                            loadAudio(nextIndex);
                        } else {
                            Alert.alert("All songs have been played");
                        }
                    }
                }
                if (status.isLoaded) {
                    setPosition(status.positionMillis);
                    setDuration(status.durationMillis);
                    setElapsedTime(status.positionMillis);
                    setRemainingTime(status.durationMillis - status.positionMillis);
                }
            });

            await sound.playAsync();
            setIsPlaying(true);
        } catch (error) {
            Alert.alert("Error playing audio:", error);
        }
    }, [cacheDirectory, mp3Files]);

    const stopAudio = useCallback(async () => {
        if (soundObject.current) {
            await soundObject.current.pauseAsync();
            setIsPlaying(false);
        }
    }, []);

    const playAudio = useCallback(async (index) => {
        if (soundObject.current) {
            if (isPlaying) {
                await soundObject.current.pauseAsync();
                setIsPlaying(false);
                await soundObject.current.setPositionAsync(0);
            }
        }
        loadAudio(index);
    }, [loadAudio]);

    const shuffleAudio = useCallback(() => {
        if (mp3Files.length === 0) {
            Alert.alert("Warning", "No audios to shuffle");
            return;
        }
        const randomIndex = Math.floor(Math.random() * mp3Files.length);
        playAudio(randomIndex);
    }, [mp3Files, playAudio]);

    const deleteSongFromCache = useCallback(async (index) => {
        try {
            const audioFilePath = `${cacheDirectory}${mp3Files[index]}`;
            await FileSystem.deleteAsync(audioFilePath);
            const updatedMp3Files = mp3Files.filter((_, idx) => idx !== index);
            setMp3Files(updatedMp3Files);
        } catch (error) {
            Alert.alert("Error deleting song from cache:", error);
        }
    }, [cacheDirectory, mp3Files]);

    const handleSliderChange = (value) => {
        if (soundObject.current) {
            setPosition(value);
            soundObject.current.setPositionAsync(value);
            setElapsedTime(value);
            setRemainingTime(duration - value);
            if (!isPlaying) {
                setIsPlaying(true)
            };
        }
    };

    useEffect(() => {
        if (reloadCache) {
            showFilesInCache();
        }
    }, [reloadCache, showFilesInCache]);

    return (
        <View className="flex-1 relative" style={{ backgroundColor: Theme.bgSecondary.primary }}>
            <StatusBar style="light" />
            <SafeAreaView className="flex flex-1 pb-14">
                <FlatList
                    data={mp3Files}
                    renderItem={({ item, index }) => (
                        <View className="flex flex-row justify-between items-center p-2">
                            <PrimaryButton onPress={() => playAudio(index)} classNameArg={"w-full justify-start"}>
                                <Text numberOfLines={1} ellipsizeMode='tail' key={index} className="text-white text-sm ml-2 font-sans_regular">
                                    {stringfyTitle(item).slice(0, -4).replace("Lyrics", "")}
                                </Text>
                            </PrimaryButton>
                            <PrimaryButton onPress={() => deleteSongFromCache(index)} size='small' classNameArg={"absolute right-2"}>
                                <TrashIcon color={"red"} size={25} />
                            </PrimaryButton>
                        </View>
                    )}
                    ListHeaderComponent={() => (
                        <View className="justify-center items-center">
                            <Text className="text-white text-lg ml-2 font-sans_regular">Library</Text>
                        </View>
                    )}
                />
                <View className="px-4">
                    <View className="justify-between flex flex-row">
                        <Text className="text-white font-sans_regular">
                            {formatTime(elapsedTime)}
                        </Text>

                        <Text className="text-white font-sans_regular">
                            {formatTime(duration)}{/* /{formatTime(remainingTime)} */}
                        </Text>
                    </View>
                    <Slider
                        style={{ width: '100%', height: 20 }}
                        minimumValue={0}
                        maximumValue={duration}
                        value={position}
                        onSlidingComplete={handleSliderChange}
                        thumbTintColor='white'
                        maximumTrackTintColor='gray'
                        minimumTrackTintColor='white'
                    />
                    {isPlaying ? (
                        <PrimaryButton onPress={stopAudio} size='xlarge' borderRadius={'rounded-xl'} classNameArg={'px-8 mt-4'}>
                            <Text className="text-white font-sans_semibold">
                                Stop
                            </Text>
                        </PrimaryButton>
                    ) : (
                        <PrimaryButton onPress={shuffleAudio} size='xlarge' borderRadius={'rounded-xl'} classNameArg={'px-8 mt-4'}>
                            <Text className="text-white font-sans_semibold">
                                Shuffle
                            </Text>
                        </PrimaryButton>
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
}

function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
