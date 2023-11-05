import PrimaryButton from "./PrimaryButton"
import { Text, View } from "react-native"
export default function AudioControls({ playFirst, reloadCache, playRandom }) {
  return (
    <View className="flex flex-row justify-between items-center">
      <PrimaryButton onPress={() => playFirst(0)} size='xlarge' borderRadius={'rounded-xl'} classNameArg={'px-8 mt-4'}>
        <Text className="text-white font-sans_semibold">
          Play
        </Text>
      </PrimaryButton>
      <PrimaryButton onPress={() => reloadCache()} size='xlarge' borderRadius={'rounded-xl'} classNameArg={'px-8 mt-4'}>
        <Text className="text-white font-sans_semibold">
          Reload
        </Text>
      </PrimaryButton>
      <PrimaryButton onPress={() => playRandom(0, true)} size='xlarge' borderRadius={'rounded-xl'} classNameArg={'px-8 mt-4'}>
        <Text className="text-white font-sans_semibold">
          Shuffle
        </Text>
      </PrimaryButton>
    </View>
  )
};