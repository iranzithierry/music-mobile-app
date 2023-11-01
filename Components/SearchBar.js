import { Theme } from '../Theme/Index';
import * as Icon from 'react-native-heroicons/solid';
import { View, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

export default function SearchBar({ showSearch, handleSearch, handleTextChange }) {
    return (
        <TouchableWithoutFeedback onPress={handleSearch}>
            <View
                className="flex-row justify-end items-center rounded-full z-50"
                style={{ backgroundColor: showSearch ? Theme.Opacity(0.2) : 'transparent' }}>
                {showSearch ? (
                    <TextInput
                        onChangeText={handleTextChange}
                        placeholder="Search song"
                        placeholderTextColor="lightgray"
                        className="pl-6 h-10 pb-1 flex-1 text-base text-white font-sans_regular"
                    />
                ) : null}
                <TouchableOpacity
                    onPress={handleSearch}
                    className="rounded-full p-3 m-1"
                    style={{ backgroundColor: Theme.Opacity(0.3) }}>
                    {showSearch ? (
                        <Icon.XMarkIcon size="25" color="white" />
                    ) : (
                        <Icon.MagnifyingGlassIcon size="25" color="white" />
                    )}
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    )
}