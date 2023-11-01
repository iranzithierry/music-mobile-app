import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
const AudioPlayer = () => {
  const [sound, setSound] = useState(null);
  const [audioUri, setAudioUri] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // Simulate fetching .mp3 files from a directory and creating a playlist
  useEffect(() => {
    // Replace this with your actual logic to fetch .mp3 files
    const fetchPlaylist = async () => {
      try {
        // Simulated list of .mp3 files
        const filesInCache = await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory);

        // Filter .mp3 files using regex
        const mp3Files = filesInCache.filter(file => /\.mp3$/.test(file));

        setPlaylist(mp3Files);
        setAudioUri(`file:///data/user/0/host.exp.exponent/cache/${mp3Files[0]}`);
      } catch (error) {
        console.error('Error fetching playlist', error);
      }
    };

    fetchPlaylist();
  }, []);

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

  const changeAudio = (index) => {
    setCurrentTrackIndex(index);
    setAudioUri(`file:///data/user/0/host.exp.exponent/cache/${playlist[index]}`);
  };

  const handleSliderChange = value => {
    if (sound) {
      sound.setPositionAsync(value);
    }
  };

  const playNext = () => {
    if (currentTrackIndex < playlist.length - 1) {
      changeAudio(currentTrackIndex + 1);
    }
  };

  const playPrevious = () => {
    if (currentTrackIndex > 0) {
      changeAudio(currentTrackIndex - 1);
    }
  };

  return (
    <View>
      <Text>Audio Player</Text>
      <Button title={isPlaying ? "Pause Audio" : "Play Audio"} onPress={playAudio} />
      <Button title="Previous" onPress={playPrevious} />
      <Button title="Next" onPress={playNext} />

      {/* Slider to control the position in the audio */}
      <Slider
        style={{ width: '80%', height: 40 }}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingComplete={handleSliderChange}
      />

      <Text>Playlist:</Text>
      {playlist.map((track, index) => (
        <Button
          key={index}
          title={track}
          onPress={() => changeAudio(index)}
        />
      ))}
    </View>
  )
};

export default AudioPlayer;
