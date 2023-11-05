import { formatTime } from "../Utils/AsyncTime"
import Slider from '@react-native-community/slider';
import { View, Text } from 'react-native';
import PrimaryButton from "./PrimaryButton";
export default function AudioPlayer({ elapsedTime, sliderDuration, sliderPosition, handleSliderChange, audioIsPaused, PauseAudio, stopAudio }) {
    return (
        <View>
            <View className="justify-between flex flex-row">
                <Text className="text-white font-sans_regular">
                    {formatTime(elapsedTime)}
                </Text>

                <Text className="text-white font-sans_regular">
                    {formatTime(sliderDuration)}{/* /{formatTime(remainingTime)} */}
                </Text>
            </View>
            <Slider style={{ width: '100%', height: 20 }} minimumValue={0} maximumValue={sliderDuration} value={sliderPosition} onSlidingComplete={handleSliderChange} thumbTintColor='white' maximumTrackTintColor='gray' minimumTrackTintColor='white' />
            <View className="flex flex-row justify-between items-center">
                <PrimaryButton onPress={() => PauseAudio()} size='xlarge' borderRadius={'rounded-xl'} classNameArg={'px-8 mt-4'}>
                    <Text className="text-white font-sans_semibold">
                        {audioIsPaused ? "Resume" : "Pause"}
                    </Text>
                </PrimaryButton>
                <PrimaryButton onPress={() => stopAudio()} size='xlarge' borderRadius={'rounded-xl'} classNameArg={'px-8 mt-4'}>
                    <Text className="text-white font-sans_semibold">
                        Stop
                    </Text>
                </PrimaryButton>
            </View>
        </View>
    )
};