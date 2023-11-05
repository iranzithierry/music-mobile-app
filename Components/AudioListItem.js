import PrimaryButton from "./PrimaryButton";
import { View, Text } from "react-native";
import { TrashIcon } from "react-native-heroicons/solid";
export default function AudioListItem({ item, index, playAudio, deleteSongFromCache }) {
    return (
        <View className="flex flex-row justify-between items-center p-2">
            <PrimaryButton onPress={() => playAudio(index)} classNameArg={"w-full justify-start"}>
                <Text numberOfLines={1} ellipsizeMode='tail' key={index} className="text-white text-sm ml-2 font-sans_regular">
                    {item.slice(0, -4).replace("Lyrics", "")}
                </Text>
            </PrimaryButton>
            <PrimaryButton onPress={() => deleteSongFromCache(index)} size='small' classNameArg={"absolute right-2"}>
                <TrashIcon color={"red"} size={25} />
            </PrimaryButton>
        </View>
    )
};