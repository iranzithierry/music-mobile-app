import React, { useCallback, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { debounce } from 'lodash';
import { Theme } from '../Theme/Index';
import useDownloadSong from '../Actions/useDownloadSong';
import useSearchSong from '../Actions/useSearchSong';
import SearchBar from '../Components/SearchBar';
import SearchResults from '../Components/SearchResults';
import AudioPlayer from '../Components/AudioPlayer';
import { BlurView } from 'expo-blur';

export default function HomeScreen() {
  const [showSearch, toggleSearch] = useState(true);
  const [audioExist, SetAudioExist] = useState(false)
  const [query, setQuery] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [downloadTitle, setDownloadTitle] = useState('');
  const { searchResults, isSearching, errorSearching, setIsSearching, setErrorSearching } = useSearchSong(query);
  const { downloadResult, isDownloading, errorDownloading, setIsDownloading, setErrorDownloading, setDownloadResult } = useDownloadSong(downloadUrl, downloadTitle);

  const stringfy_title = (text) => {
    if (text) {
      const brackets_pattern = /\s*\([^)]*\)/;
      const arrays_pattern = /\s*\[[^\]]*\]/;

      const text_without_brackets = text.replace(brackets_pattern, "");
      const stringfied_title = text_without_brackets.replace(arrays_pattern, "");

      return stringfied_title;
    }
    return '';
  }

  const handleSearch = () => {
    toggleSearch(!showSearch)
    if (isSearching) {
      setIsSearching(false);
    }
    if (downloadResult) {
      setDownloadResult(null)
    }

    if (errorDownloading || errorSearching) {
      setErrorDownloading(null)
      setErrorSearching(null)
    }
  }
  const handleTextChange = (text) => {
    handleTextDebounce(text);
    if (errorSearching) {
      setErrorSearching(null);
    }
    if (errorDownloading) {
      setErrorDownloading(null);
    }
    if (downloadResult) {
      setDownloadResult(null)
    }
  }

  if (isSearching && !showSearch) {
    setIsSearching(false)
  }
  if (isDownloading && !showSearch) {
    setIsDownloading(false)
  }
  console.log(downloadResult);
  const handleSongs = (songUrl, songTitle) => {
    console.log(songUrl, songTitle);
    const ytubeUrl = `https://www.youtube.com${songUrl.split("&")[0]}`;
    setDownloadUrl(ytubeUrl);
    setDownloadTitle(songTitle);
  };
  const handleTextDebounce = useCallback(debounce(setQuery, 860), []);

  return (
    <View className="flex-1 relative" style={{ backgroundColor: Theme.bgSecondary.primary }}>
      <StatusBar style="light" />
      <SafeAreaView className="flex flex-1" style={{ zIndex: 3 }}>

        {searchResults.songs && searchResults.songs.length > 0 && !downloadResult && showSearch ? (
          <BlurView intensity={80} tint='dark' className="absolute w-full h-full" style={{ zIndex: 1 }} />
        ) : null}

        <View className="mx-4 relative z-50" style={{ height: '7%' }}>
          <SearchBar showSearch={showSearch} handleSearch={handleSearch} handleTextChange={handleTextChange} />

          {errorSearching ? (
            <View className="absolute w-full bg-gray-500 top-16 rounded-3xl z-50 py-4">
              <Text className="text-black  text-lg ml-2 font-sans_regular">{errorSearching}</Text>
            </View>
          ) : null}

          {isSearching ? (
            <View className="absolute w-full bg-gray-300 top-16 rounded-3xl z-50">
              <ActivityIndicator size="large" color="black" />
            </View>
          ) : null}
          {isDownloading ? (
            <View className="absolute w-full bg-gray-300 top-16 rounded-3xl z-50">
              <ActivityIndicator size="large" color="white" />
              <Text className="text-black  text-lg ml-2 font-sans_regular">Downloading...</Text>
            </View>
          ) : null}
          {errorDownloading && (
            <View className="absolute w-full bg-gray-500 top-16 rounded-3xl z-50 py-4">
              <Text className="text-black  text-lg ml-2 font-sans_regular">{errorDownloading}</Text>
            </View>
          )}
          {/* {downloadResult ? (
            <View className="absolute w-full bg-gray-300 top-16 rounded-3xl z-50">
               <Text className="text-black  text-lg ml-2 font-sans_regular text-center">{downloadResult.split("cache/")[1].split(".")[0]}</Text>
              <Text className="text-black  text-lg ml-2 font-sans_regular text-center">{downloadResult}</Text>
            </View>
          ) : null} */}

          {searchResults.songs && searchResults.songs.length > 0 && !downloadResult && showSearch ? (
            <SearchResults searchResults={searchResults} handleSongs={handleSongs} stringfy_title={stringfy_title} />
          ) : null}

        </View>
        <View className="justify-center items-center" style={{ zIndex: 0 }}>
          {downloadResult ? (
            <AudioPlayer audioUrl={downloadResult} />
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
}
