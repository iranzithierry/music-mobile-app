import { useState, useEffect } from 'react';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
export default function useDownloadSong(downloadUrl, downloadTitle) {
    const [downloadResult, setDownloadResult] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [errorDownloading, setErrorDownloading] = useState(null);

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

    const downloadAndCacheSong = async () => {
        setIsDownloading(true);

        try {
            const formData = new FormData();
            formData.append('audio_url', downloadUrl);
            formData.append('audio_title', downloadTitle);
            const response = await axios.post('https://e-sound-api-f3e9bd49346f.herokuapp.com/download', formData);
            const audio_base64 = response.data[0].audio_base64
            
            const fileUri = `${FileSystem.cacheDirectory}${stringfy_title(downloadTitle)}.mp3`;
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
