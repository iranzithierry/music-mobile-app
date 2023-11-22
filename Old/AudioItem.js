import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { Theme } from "../Theme/Index";
import MusicInfo from 'expo-music-info-2';

export default function AudioItem({ item, index, playAudio, deleteSong }) {
    const [metadata, setMetadata] = useState(null);

    // useEffect(() => {
    //     const fetchMetadata = async () => {
    //         try {
    //             if (!metadata) {
    //                 const metaData = await MusicInfo.getMusicInfoAsync(item.uri);
    //                 setMetadata(metaData);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching metadata:", error);
    //         }
    //     };

    //     fetchMetadata();
    // }, [item.uri, metadata]);

    return (
        <TouchableOpacity
            key={index}
            onPress={() => playAudio(index)}
            className="my-0.5 grow flex flex-row w-full items-center p-2 rounded-md bg-white"
            style={{ backgroundColor: Theme.Opacity(0.2) }}
        >
            {/* metadata !== null ? metadata.picture.pictureData :  */}
            <Image className="rounded-lg h-14 w-14" source={{ uri: 'https://i1.sndcdn.com/artworks-DvosdNeBgm9ZZ7gK-HT40tA-t500x500.jpg' }} />
            <View className="ml-2 flex justify-center">
                <Text className="text-sm text-white font-sans_semibold truncate" style={{ maxWidth: 290 }} numberOfLines={1}>
                    {item.filename}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
