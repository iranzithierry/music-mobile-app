import React from 'react';
import { FlatList, Text, View } from 'react-native';
import AudioListItem from './AudioListItem';

export default function LibraryItem({ mp3Files, playAudio, deleteSongFromCache }) {
    return (
        <FlatList
            data={mp3Files}
            renderItem={({ item, index }) => (
                <AudioListItem item={item} index={index} playAudio={playAudio} deleteSongFromCache={deleteSongFromCache} />
            )}
            ListHeaderComponent={() => (
                <View className="justify-center items-center">
                    <Text className="text-white text-lg ml-2 font-sans_regular">Library</Text>
                </View>
            )}
        />
    )
}
