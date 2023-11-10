import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

const BACKGROUND_TASK_NAME = 'demoTask';

TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
    console.log('Background task is running');
    // Your background task logic here
    return BackgroundFetch.Result.NewData;
});

export default function App() {
    useEffect(() => {
        TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
            console.log('Background task is running');
            // Your background task logic here
            return BackgroundFetch.Result.NewData;
        });
        // Register the background task
        BackgroundFetch.registerTaskAsync(BACKGROUND_TASK_NAME, {
            minimumInterval: 15, // Minimum interval in minutes
        });

        // return () => {
        //     // Unregister the background task when the component is unmounted
        //     BackgroundFetch.unregisterTaskAsync(BACKGROUND_TASK_NAME);
        // };
    }, []);

    return (
        <View style={styles.container}>
            <Text>Expo Background Task Demo</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
