import { useState, useEffect } from 'react';
import axios from 'axios';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
export default function useDownloadSong(downloadUrl, downloadTitle) {
    const [downloadResult, setDownloadResult] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [errorDownloading, setErrorDownloading] = useState(null);

    const downloadAndCacheSong = async () => {
        setIsDownloading(true);

        try {
            const formData = new FormData();
            formData.append('video_url', downloadUrl);
            formData.append('video_title', downloadTitle);

            const response = await axios.post('http://127.0.0.1:8080/download', formData);
            console.log(response.status)

            if (response.data[0].binary) {
                const songData = response.data[0].binary;

                const fileUri = `${FileSystem.cacheDirectory}${downloadTitle}.mp3`;
                await FileSystem.writeAsStringAsync(fileUri, songData, { encoding: FileSystem.EncodingType.Base64 });
                setDownloadResult(fileUri);
            } else {
                setDownloadResult(response.data);
            }
        } catch (err) {
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
