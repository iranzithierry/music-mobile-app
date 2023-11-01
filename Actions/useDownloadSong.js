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
            console.log("started ");
            const formData = new FormData();
            formData.append('video_url', downloadUrl);

            const response = await axios.post('https://e-sound-api-f3e9bd49346f.herokuapp.com/download', formData);

            const embed_url = response.data[0].embeded_audio_url

            // const fileUri = `${FileSystem.cacheDirectory}${stringfy_title(downloadTitle)}.mp3`;
            // console.log(fileUri);
            // await FileSystem.writeAsStringAsync(fileUri, songData, { encoding: FileSystem.EncodingType.Base64 });
            setDownloadResult(embed_url);

            // const filesInCache = await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory);
            // console.log('Files in cache directory:', filesInCache);

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
