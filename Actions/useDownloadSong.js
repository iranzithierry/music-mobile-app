import { API_URL } from "@env"
import { useState, useEffect } from 'react';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { checkIfAudioExists } from "../Utils/AsyncStorage";

export default function useDownloadSong(downloadData) {
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [errorDownloading, setErrorDownloading] = useState(null);
    const [abortedDownload, abortDownload] = useState(false);
    const [controller] = useState(new AbortController());
    const [signal] = useState(controller.signal);

    const downloadAndCacheSong = async () => {
        setIsDownloading(true);

        try {
            const fileUri = `${FileSystem.cacheDirectory}${downloadData.title}.mp3`;

            fileExists = await checkIfAudioExists(downloadData.title)
            if (fileExists) {
                return setIsDownloaded(fileUri)
            }

            const formData = new FormData();
            formData.append('audio_url', downloadData.url);
            formData.append('audio_title', downloadData.title);
            const response = await axios.post(`${API_URL}/download`, formData, { signal });

            const audio_base64 = response.data[0].audio_base64
            await FileSystem.writeAsStringAsync(fileUri, audio_base64, { encoding: FileSystem.EncodingType.Base64 });

            setIsDownloaded(true);
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
        if (abortedDownload && isDownloading) {
            controller.abort();
            setIsDownloading(false)
            return;
        }

    }, [downloadData.url && downloadData.title, abortedDownload]);

    return {
        isDownloaded,
        isDownloading,
        errorDownloading,
        setIsDownloading,
        setErrorDownloading,
        setIsDownloaded,
        abortDownload
    };
}
