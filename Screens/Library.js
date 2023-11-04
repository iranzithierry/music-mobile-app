import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Theme } from '../Theme/Index';
import { stringfyTitle } from '../Utils/StringMethod';
import PrimaryButton from '../Components/PrimaryButton.js';
import { Audio } from 'expo-av';
import { TrashIcon } from 'react-native-heroicons/solid';

export default function Library() {
    const [mp3Files, setMp3Files] = useState([]);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const showFilesInCache = async () => {
        const filesInCache = await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory);
        const mp3Files = filesInCache.filter(file => /\.mp3$/.test(file));
        setMp3Files(mp3Files);
    }

    useEffect(() => {
        showFilesInCache();
        
    }, []);
    const stopAudio = async () => {
        sound.pauseAsync();
        setIsPlaying(false)
    }
    const playAudio = async (index) => {
        if (sound) {
            if (isPlaying) {
                await sound.pauseAsync();
                setIsPlaying(false);
                if (sound.isLoaded) {
                    await sound.unloadAsync(); // Unload the current sound to stop it completely
                }
            }
        }

        const audioFilePath = `file:///data/user/0/host.exp.exponent/cache/${mp3Files[index]}`;

        try {
            const { sound } = await Audio.Sound.createAsync({ uri: audioFilePath });
            setSound(sound);
            await sound.playAsync();
            setIsPlaying(true);
        } catch (error) {
            Alert.alert("Error playing audio:", error);
        }
    };

    const deleteSongFromCache = async (index) => {
        const audioFilePath = `file:///data/user/0/host.exp.exponent/cache/${mp3Files[index]}`;

        try {
            await FileSystem.deleteAsync(audioFilePath);
            const updatedMp3Files = [...mp3Files];
            updatedMp3Files.splice(index, 1);
            setMp3Files(updatedMp3Files);
        } catch (error) {
            Alert.alert("Error deleting song from cache:", error);
        }
    };

    return (
        <View className="flex-1 relative" style={{ backgroundColor: Theme.bgSecondary.primary }}>
            <StatusBar style="light" />
            <SafeAreaView className="flex flex-1 pb-14">
                <FlatList
                    data={mp3Files}
                    renderItem={({ item, index }) => (
                        <View className="flex flex-row justify-between items-center p-2">
                            <PrimaryButton onPress={() => playAudio(index)} classNameArg={"w-full justify-start"}>
                                <Text key={index} className="text-white text-sm ml-2 font-sans_regular">
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
                {isPlaying && (
                    <PrimaryButton onPress={stopAudio} size='xlarge' borderRadius={'rounded-xl'} classNameArg={'px-8 mt-4'}>
                        <Text className="text-white font-sans_semibold">
                            Stop Audio
                        </Text>
                    </PrimaryButton>
                )}

            </SafeAreaView>
        </View>
    );
}
