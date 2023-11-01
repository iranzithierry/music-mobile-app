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

            const response = await axios.post('https://e-sound-api-f3e9bd49346f.herokuapp.com/download', formData);
            console.log(response.status)

            if (response.data[0].binary) {
                const songData = response.data[0].binary;
                console.log(downloadTitle);

                const fileUri = `${FileSystem.cacheDirectory}${downloadTitle}.mp3`;
                await FileSystem.writeAsStringAsync(fileUri, songData, { encoding: FileSystem.EncodingType.Base64 });
                setDownloadResult(fileUri);

                const filesInCache = await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory);
                console.log('Files in cache directory:', filesInCache);
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
