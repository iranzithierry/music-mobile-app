import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableWithoutFeedback, TouchableOpacity, Dimensions } from 'react-native';
import { debounce } from 'lodash';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import useDownloadSong from '../Actions/useDownloadSong';
import useSearchSong from '../Actions/useSearchSong';
import SearchBar from '../Components/SearchBar';
import SearchResults from '../Components/SearchResults';
import { stringfyTitle } from '../Utils/StringMethod';
import ArtistSection from '../Components/ArtistSection.js';
import Layout from './Layout.js';
const { width, height } = Dimensions.get('window');
export default function HomeScreen() {
  const [showSearch, toggleSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [downloadData, setDownloadData] = useState({ url: null, title: null, coverUrl: null });
  const { searchResults, isSearching, errorSearching, setErrorSearching } = useSearchSong(query);
  const { isDownloaded, isDownloading, errorDownloading, setErrorDownloading, setIsDownloaded, abortDownload } = useDownloadSong(downloadData);

  const navigation = useNavigation();

  const handleSearchBar = () => {
    toggleSearch(!showSearch);
    setIsDownloaded(false);
    setErrorDownloading(null);
    setErrorSearching(null);
  };

  const handleTextChange = (text) => {
    !isDownloading && handleTextDebounce(text);
    setErrorSearching(null);
    setErrorDownloading(null);
    setIsDownloaded(false);
  };
  const handleDownloadEvent = (url_suffix, title, coverUrl) => {
    const url = `https://www.youtube.com${url_suffix.split("&")[0]}`;
    !isDownloading && setDownloadData({ url, title, coverUrl });
  };

  useEffect(() => {
    if (isDownloaded) {
      setIsDownloaded(false);
      navigation.navigate("Library", { reloadCache: true })
    }
  }, [isDownloaded]);


  const handleTextDebounce = useCallback(debounce(setQuery, 860), []);
  return (
    <Layout>
      {searchResults.songs && searchResults.songs.length > 0 && !isDownloaded && showSearch ? (
        <BlurView intensity={80} tint='dark' className="absolute" style={{ zIndex: 1,height: height, width: width }} />
      ) : null}

      <View className="mx-4 relative z-50" style={{ height: '7%' }}>
        <TouchableWithoutFeedback onPress={handleSearchBar}>
          <SearchBar showSearch={showSearch} handleSearchBar={handleSearchBar} handleTextChange={handleTextChange} />
        </TouchableWithoutFeedback>

        {errorSearching || errorDownloading ? (
          <View className="absolute w-full bg-gray-300 top-16 rounded-t-3xl z-50 py-2 flex flex-row justify-center items-center">
            <Text className="text-black text-base font-sans_regular">{errorSearching ? errorSearching : errorDownloading}</Text>
          </View>
        ) : null}

        {isSearching && showSearch ? (
          <View className="absolute w-full bg-gray-300 top-16 rounded-3xl z-50">
            <ActivityIndicator size="large" color="black" />
          </View>
        ) : null}
        {isDownloading && showSearch ? (
          <View className="absolute w-full bg-gray-300 top-16 rounded-t-3xl z-50 flex flex-col justify-center items-center border-b-gray-400">
            <ActivityIndicator size="small" color="black" />
            <View className="flex flex-row w-full justify-center">
              <Text className="text-black  text-sm ml-2 font-sans_regular">Downloading...</Text>
              <TouchableOpacity className="absolute right-2 bottom-1 bg-red-700 rounded-lg p-[2]" onPress={() => abortDownload(true)} >
                <Text className="text-white  text-sm font-sans_regular">abort</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {searchResults.songs && searchResults.songs.length > 0 && !isDownloaded && showSearch ? (
          <SearchResults searchResults={searchResults} handleDownloadEvent={handleDownloadEvent} stringfyTitle={stringfyTitle} />
        ) : null}

      </View>
      <ArtistSection artists={searchResults} />
    </Layout>
  );
}
