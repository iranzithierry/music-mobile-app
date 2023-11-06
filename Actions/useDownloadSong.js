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

    // const downloadImage = async (imageUrl, audioId) => {
    //     const fileUri = `${FileSystem.documentDirectory}${audioId}.jpg`;

    //     try {
    //         const response = await fetch(imageUrl);
    //         if (response.ok) {
    //             const imageBlob = await response.blob();
    //             const reader = new FileReader();

    //             reader.onload = async () => {
    //                 const base64Image = reader.result.split(',')[1];
    //                 await FileSystem.writeAsStringAsync(fileUri, base64Image, { encoding: FileSystem.EncodingType.Base64 });
    //                 console.log(`Image downloaded and saved at: ${fileUri}`);
    //             };
    //             reader.readAsDataURL(imageBlob);
    //         } else {
    //             console.error(`Failed to download image. HTTP status: ${response.status}`);
    //         }
    //     } catch (error) {
    //         console.error('Error downloading image:', error);
    //     }
    // };

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

            // if (downloadData.coverUrl) {
            //     downloadImage(downloadData.coverUrl, downloadData.url.split("v=")[1])
            // }

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

    }, [downloadData.url && downloadData.title, downloadData.coverUrl, abortedDownload]);

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
