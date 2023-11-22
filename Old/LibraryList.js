import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import AudioItem from './AudioItem';
import { getPermission } from '../Utils/AsyncLibrary';

export default function LibraryList({ playAudio, deleteAudio, mp3Files }) {
    const [audioFiles, setAudioFiles] = useState([]);

    useEffect(() => {
        getPermission(setAudioFiles);
    }, [])
    return (
        <FlatList
            data={mp3Files}
            renderItem={({ item, index }) => (
                <AudioItem item={item} index={index} playAudio={playAudio} deleteAudio={deleteAudio} />
            )}
            ListHeaderComponent={() => (
                <View className="justify-center items-center">
                    <Text className="text-white text-lg ml-2 font-sans_regular">Library</Text>
                </View>
            )}
        />
    )
}
