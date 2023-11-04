import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const ThemeColor = "#F43F5E";

const pad = (n, width, z = 0) => {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

const minutesAndSeconds = (position) => ([
    pad(Math.floor(position / 60), 2),
    pad(position % 60, 2),
]);

const SeekBar = ({ trackLength, currentPosition, onSeek }) => {
    const elapsed = minutesAndSeconds(currentPosition);
    const remaining = minutesAndSeconds(trackLength - currentPosition);

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.text, { color: ThemeColor }]}>
                    {elapsed[0] + ":" + elapsed[1]}
                </Text>
                <Text style={[styles.text, { color: ThemeColor }]}>
                    {`-${remaining[0]}:${remaining[1]}`}
                </Text>
            </View>
            <Slider
                style={{ width: '100%' }}
                maximumValue={Math.max(trackLength, 1, currentPosition + 1)}
                onSlidingComplete={onSeek}
                value={currentPosition}
                minimumTrackTintColor={ThemeColor}
                maximumTrackTintColor={ThemeColor}
                thumbTintColor={ThemeColor}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    text: {
        fontSize: 16,
    },
});

export default SeekBar;
