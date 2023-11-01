import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { Audio } from 'expo-av';

const AudioPlayer = () => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUri, setAudioUri] = useState(''); // State to store the audio file URI

  const playAudio = async () => {
    if (sound) {
      if (isPlaying) {
        // If audio is playing, stop it
        await sound.stopAsync();
        setIsPlaying(false);
      } else {
        // If audio is paused, resume it
        await sound.playAsync();
        setIsPlaying(true);
      }
    } else {
      // If no sound is loaded or a different audio file is chosen, create and play it
      const { sound } = await Audio.Sound.createAsync({
        uri: audioUri,
      });
      setSound(sound);
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  // Update the sound source if the audio URI changes
  useEffect(() => {
    if (audioUri && sound) {
      sound.unloadAsync(); // Unload the previous sound
      setSound(null); // Reset the sound state
      playAudio(); // Play the new sound
    }
  }, [audioUri]);

  const changeAudio = (fileUri) => {
    setAudioUri(`file:///data/user/0/host.exp.exponent/cache/${fileUri}`);
  };

  return (
    <View className="z-20">
      <Text>Audio Player</Text>
      <Button title={isPlaying ? "Pause Audio" : "Play Audio"} onPress={playAudio} />

      {/* Example buttons to change the audio file */}
      <Button title="Play Song 1" onPress={() => changeAudio('test.mp3')} />
      <Button title="Play Song 2" onPress={() => changeAudio('Hello - Adele (Karaoke Songs With Lyrics - Original Key).mp3')} />
      {/* Add more buttons for other songs as needed */}
    </View>
  );
};

export default AudioPlayer;
