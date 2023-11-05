import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { debounce } from 'lodash';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../Theme/Index';
import useDownloadSong from '../Actions/useDownloadSong';
import useSearchSong from '../Actions/useSearchSong';
import SearchBar from '../Components/SearchBar';
import SearchResults from '../Components/SearchResults';
import PimaryButton from '../Components/PrimaryButton.js';
import { stringfyTitle } from '../Utils/StringMethod';

export default function HomeScreen() {
  const [showSearch, toggleSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [downloadData, setDownloadData] = useState({ url: null, title: null });
  const { searchResults, isSearching, errorSearching, setIsSearching, setErrorSearching } = useSearchSong(query);
  const { downloadResult, isDownloading, errorDownloading, setIsDownloading, setErrorDownloading, setDownloadResult } = useDownloadSong(downloadData);

  const navigation = useNavigation();

  const handleSearchBar = () => {
    toggleSearch(!showSearch);
    setIsSearching(false);
    setDownloadResult(null);
    setErrorDownloading(null);
    setErrorSearching(null);
  };

  const handleTextChange = (text) => {
    !isDownloading && handleTextDebounce(text);
    setErrorSearching(null);
    setErrorDownloading(null);
    setDownloadResult(null);
  };
  if (isSearching && !showSearch) {
    setIsSearching(false)
  }
  if (isDownloading && !showSearch) {
    setIsDownloading(false)
  }

  const handleSongs = (url_suffix, title) => {
    const url = `https://www.youtube.com${url_suffix.split("&")[0]}`;
    setDownloadData({ url, title });
  };

  useEffect(() => {
    if (downloadResult) {
      // setAudioPlaylist((prevResults) => [...prevResults, downloadResult]);
      setDownloadResult(null);
      setIsDownloading(false)
      navigation.navigate("Library", { reloadCache: true })
    }
  }, [downloadResult]);


  const handleTextDebounce = useCallback(debounce(setQuery, 860), []);
  return (
    <View className="flex-1 relative" style={{ backgroundColor: Theme.bgSecondary.primary }}>
      <StatusBar style="light" />
      <SafeAreaView className="flex flex-1" style={{ zIndex: 3 }}>

        {searchResults.songs && searchResults.songs.length > 0 && !downloadResult && showSearch ? (
          <BlurView intensity={80} tint='dark' className="absolute w-full h-full" style={{ zIndex: 1 }} />
        ) : null}

        <View className="mx-4 relative z-50" style={{ height: '7%' }}>
          <TouchableWithoutFeedback onPress={handleSearchBar}>
            <SearchBar showSearch={showSearch} handleSearchBar={handleSearchBar} handleTextChange={handleTextChange} />
          </TouchableWithoutFeedback>

          {errorSearching ? (
            <View className="absolute w-full bg-gray-500 top-16 rounded-3xl z-50 py-4">
              <Text className="text-black  text-sm ml-2 font-sans_regular">{errorSearching}</Text>
            </View>
          ) : null}

          {isSearching ? (
            <View className="absolute w-full bg-gray-300 top-16 rounded-3xl z-50">
              <ActivityIndicator size="large" color="black" />
            </View>
          ) : null}
          {isDownloading ? (
            <View className="absolute w-full bg-gray-300 top-16 rounded-t-3xl z-50 flex flex-col justify-center items-center border-b-gray-400">
              <ActivityIndicator size="small" color="black" />
              <Text className="text-black  text-sm ml-2 font-sans_regular">Downloading...</Text>
            </View>
          ) : null}
          {errorDownloading && (
            <View className="absolute w-full bg-gray-500 top-16 rounded-3xl z-50 py-4">
              <Text className="text-black  text-sm ml-2 font-sans_regular">{errorDownloading}</Text>
            </View>
          )}
          {searchResults.songs && searchResults.songs.length > 0 && !downloadResult && showSearch ? (
            <SearchResults searchResults={searchResults} handleSongs={handleSongs} stringfyTitle={stringfyTitle} />
          ) : null}

        </View>
        <View className="justify-center items-center" style={{ zIndex: 0 }}>
          <PimaryButton onPress={() => navigation.navigate("Library")} size='xlarge' borderRadius={'rounded-xl'} classNameArg={'px-8 mt-4'}>
            <Text className="text-white font-sans_semibold">
              Navigate to Library
            </Text>
          </PimaryButton>
        </View>
      </SafeAreaView>
    </View>
  );
}
