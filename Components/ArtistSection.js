import { SPOTIFY_AT } from '@env'
import React, { useState, useEffect } from 'react'
import { View, Text, Image, Dimensions, FlatList, Alert, TouchableOpacity } from 'react-native'
import { Theme } from '../Theme/Index'
import axios from 'axios'
export default function ArtistSection() {
    const accessToken = SPOTIFY_AT
    const endPointUrl = "https://api.spotify.com/v1/search";

    const { width } = Dimensions.get('window');
    const gap = 12;
    const itemPerRow = 3;
    const totalGapSize = (itemPerRow - 1) * gap;
    const windowWidth = width;
    const childWidth = (windowWidth - totalGapSize) / itemPerRow;
    const numColumns = 2;

    const [artistData, setArtistData] = useState([]);

    const getArtist = async () => {
        const query = "Gunna";

        let config = {
            method: 'get',
            url: `${endPointUrl}?q=artist:${query}&type=artist`,
            headers: { 'Authorization': `Bearer ${accessToken}` }
        };

        try {
            const response = await axios.request(config);
            setArtistData(response.data.artists.items);
        } catch (error) {
            Alert.alert("Error", `ERROR: ${error}`)
        }
    }
    useEffect(() => {
        getArtist();
    }, []);
    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity key={item} className="m-1 grow flex flex-row items-center p-2 rounded-md " style={{ width: childWidth, backgroundColor: Theme.Opacity(0.2) }}>
                {/* <Image
                    className="rounded-lg h-14 w-14"
                    source={{ uri: "file:///data/user/0/host.exp.exponent/files/PpCZPdLC6Cc.jpg" }} /> */}
                                    <Image className="rounded-lg h-14 w-14" source={{ uri: item.images && item.images[0] ? item.images[0].url : 'https://i.scdn.co/image/ab6761610000e5eb6501f8a7d50c56e86e46f920' }} />
                <View className="ml-2">
                    <Text className="text-sm text-white font-sans_semibold truncate" style={{ maxWidth: 100 }} numberOfLines={2}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        );
    };
    return (
        <FlatList
            data={artistData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
        />

    )
}

