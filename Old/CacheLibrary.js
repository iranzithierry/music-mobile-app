import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system'
import { useState } from 'react';
export const showFilesInCache = async (setMp3Files) => {
    try {
        // const filesInCache = await FileSystem.readDirectoryAsync(cacheDirectory);
        // const filteredFiles = filesInCache.filter(file => /\.mp3$/.test(file));
        const media = await MediaLibrary.getAssetsAsync({
            mediaType: "audio",
            first: 50,
            mediaSubtypes: ["mp3"],
        });
        const filteredMedia = media.assets.filter(asset => {
            return !asset.uri.includes('Android');
        });
        setMp3Files(filteredMedia);
    } catch (error) {
        return [];
    }
};