import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';
import { Theme } from '../Theme/Index';
import { stringfyTitle } from '../Utils/StringMethod';
import PrimaryButton from '../Components/PrimaryButton.js';
import { TrashIcon } from 'react-native-heroicons/solid';

export default function Library({ route }) {
    const [mp3Files, setMp3Files] = useState([]);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const cacheDirectory = FileSystem.cacheDirectory

    const { reloadCache = true } = route.params || {};

    const showFilesInCache = async () => {
        const filesInCache = await FileSystem.readDirectoryAsync(cacheDirectory);
        const mp3Files = filesInCache.filter(file => /\.mp3$/.test(file));
        setMp3Files(mp3Files);

    }

    const stopAudio = async () => {
        sound.stopAsync();
        setIsPlaying(false)
    }
    const playSingleAudio = async (index) => {
        const audioFilePath = `${cacheDirectory}${mp3Files[index]}`;
        const { sound } = await Audio.Sound.createAsync({ uri: audioFilePath });
        return sound;
    }
    const playAudio = async (index, isRandom = false) => {
        if (sound) {
            if (isPlaying) {
                await sound.pauseAsync();
                setIsPlaying(false);
                if (sound.isLoaded) {
                    await sound.unloadAsync();
                }
            }
        }
        try {
            const sound = await playSingleAudio(index)
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    console.log("Audio has ended");
                    setIsPlaying(false);
                    if (isRandom) {
                        shuffleAudio()
                    } else {
                        const nextIndex = index + 1;
                        if (nextIndex < mp3Files.length) {
                            playAudio(nextIndex);
                        }
                    }

                }
            });
            setSound(sound);
            await sound.playAsync();
            setIsPlaying(true);
        } catch (error) {
            Alert.alert("Error playing audio:", error);
        }
    };
    const shuffleAudio = async () => {
        if (mp3Files.length === 0) {
            Alert.alert("Warning", "No audios to shuffle")
            return;
        }
        randomIndex = Math.floor(Math.random() * mp3Files.length)
        playAudio(randomIndex, true)
    }

    const deleteSongFromCache = async (index) => {
        const audioFilePath = `${cacheDirectory}${mp3Files[index]}`;
        try {
            await FileSystem.deleteAsync(audioFilePath);
            const updatedMp3Files = [...mp3Files];
            updatedMp3Files.splice(index, 1);
            setMp3Files(updatedMp3Files);
        } catch (error) {
            Alert.alert("Error deleting song from cache:", error);
        }
    };
    reloadCache ? showFilesInCache() : false
    useEffect(() => {
        showFilesInCache();
    }, []);


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
