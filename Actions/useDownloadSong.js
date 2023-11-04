import { API_URL } from "@env"
import { useState, useEffect } from 'react';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
export default function useDownloadSong(downloadData) {
    const [downloadResult, setDownloadResult] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [errorDownloading, setErrorDownloading] = useState(null);

    const checkIfAudioExists = async (title) => {
        try {
            const fileUri = `${FileSystem.cacheDirectory}${title}.mp3`;
            const fileInfo = await FileSystem.getInfoAsync(fileUri);
            return fileInfo.exists;

        } catch (error) {
            console.error('Error checking if audio exists:', error);
            return false;
        }
    };
    const downloadAndCacheSong = async () => {
        setIsDownloading(true);

        try {
            const fileUri = `${FileSystem.cacheDirectory}${downloadData.title}.mp3`;

            fileExists = await checkIfAudioExists(downloadData.title)
            if (fileExists) {
                return setDownloadResult(fileUri)
            }
            const formData = new FormData();
            formData.append('audio_url', downloadData.url);
            formData.append('audio_title', downloadData.title);
            const response = await axios.post(`${API_URL}/download`, formData);
            const audio_base64 = response.data[0].audio_base64

            await FileSystem.writeAsStringAsync(fileUri, audio_base64, { encoding: FileSystem.EncodingType.Base64 });
            setDownloadResult(fileUri);
        } catch (err) {
            setErrorDownloading(err.message);
        } finally {
            setIsDownloading(false);
        }
    };

    useEffect(() => {
        if (downloadData.url && downloadData.title) {
            downloadAndCacheSong();
        }
    }, [downloadData.url && downloadData.title]);

    return {
        downloadResult,
        isDownloading,
        errorDownloading,
        setIsDownloading,
        setErrorDownloading,
        setDownloadResult
    };
}
