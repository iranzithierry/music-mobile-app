import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';

export default function AudioPlayer({ audioUrl }) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioUri = audioUrl

  const playAudio = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } else {
      const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
      setSound(sound);
      await sound.playAsync();
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded) {
          setPosition(status.positionMillis);
          setDuration(status.durationMillis);
        }
      });
    }
  };

  const handleSliderChange = value => {
    if (sound) {
      sound.setPositionAsync(value);
    }
  };

  return (
    <View>
      <Text>Audio Player</Text>
      <Button title={isPlaying ? "Pause Audio" : "Play Audio"} onPress={playAudio} />

      {/* Slider to control the position in the audio */}
      <Slider
        style={{ width: '80%', height: 40 }}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingComplete={handleSliderChange}
      />
    </View>
  );
};
