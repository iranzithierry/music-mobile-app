import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';


export const getPermission = async (setAudioFiles) => {
    const permission = await MediaLibrary.getPermissionsAsync();
    if (permission.granted) {
        getAudioFiles(setAudioFiles);
    }

    if (!permission.granted && permission.canAskAgain) {
        const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();

        if (status === "denied" && canAskAgain) {
            permissionAlert();
        }
        if (status === "granted") {
            getAudioFiles(setAudioFiles);
        }
        if (status === "denied" && canAskAgain) {}
    }
};
const getAudioFiles = async (setAudioFiles) => {
    const media = await MediaLibrary.getAssetsAsync({
        mediaType: "audio",
        first: 50,
        mediaSubtypes: ["mp3"],
    });
    const filteredMedia = media.assets.filter(asset => {
        return !asset.uri.includes('Android');
    });
    setAudioFiles(filteredMedia);

};

const permissionAlert = () => {
    Alert.alert("permission required", "this app needs to read audio files", [
        {
            text: "Allow",
            onPress: () => getPermission(),
        },
        {
            text: "cancel",
            onPress: () => permissionAlert(),
        },
    ]);
};