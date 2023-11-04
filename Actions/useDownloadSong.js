import {API_URL} from "@env"
import { useState, useEffect } from 'react';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { stringfyTitle } from "../Utils/StringMethod";
export default function useDownloadSong(downloadUrl, downloadTitle) {
    const [downloadResult, setDownloadResult] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [errorDownloading, setErrorDownloading] = useState(null);

    const downloadAndCacheSong = async () => {
        setIsDownloading(true);

        try {
            const formData = new FormData();
            formData.append('audio_url', downloadUrl);
            formData.append('audio_title', downloadTitle);
            const response = await axios.post(`${API_URL}/download`, formData);
            const audio_base64 = response.data[0].audio_base64
            
            const fileUri = `${FileSystem.cacheDirectory}${stringfyTitle(downloadTitle)}.mp3`;
            await FileSystem.writeAsStringAsync(fileUri, audio_base64, { encoding: FileSystem.EncodingType.Base64 });
            setDownloadResult(fileUri);
        } catch (err) {
            console.log(err);
            setErrorDownloading(err.message);
        } finally {
            setIsDownloading(false);
        }
    };

    useEffect(() => {
        if (downloadUrl && downloadTitle) {
            downloadAndCacheSong();
        }
    }, [downloadUrl, downloadTitle]);

    return { downloadResult, isDownloading, errorDownloading, setIsDownloading, setErrorDownloading, setDownloadResult };
}
