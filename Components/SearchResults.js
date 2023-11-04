import { View, Text, TouchableOpacity } from 'react-native';
import * as Icon from 'react-native-heroicons/solid';
export default function SearchResults({ searchResults, handleSongs, stringfyTitle }) {
    return (
        <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
            {searchResults.songs.map((song, index) => {
                let showBorder = index + 1 !== searchResults.songs.length;
                let borderClass = showBorder ? ' border-b-2 border-b-gray-400' : '';
                let stringfiedTitle = stringfyTitle(song?.title)
                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleSongs(song?.url_suffix, stringfiedTitle)}
                        className={"flex-row items-center border-0 p-3 px-4 mb-1 " + borderClass}>
                        <Icon.MusicalNoteIcon size="20" color="gray" />
                        <Text className="text-black  text-sm ml-2 font-sans_regular" numberOfLines={1} ellipsizeMode='tail'>
                            {stringfiedTitle}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    )
}