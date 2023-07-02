import BackgroundFetch from 'react-native-background-fetch';
const initBackgroundFetch = async () => {
  const status = await BackgroundFetch.configure(
    {
      minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
      stopOnTerminate: false,
      enableHeadless: true,
      startOnBoot: true,
      // Android options
      forceAlarmManager: false, // <-- Set true to bypass JobScheduler.
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY, // Default
      requiresCharging: false, // Default
      requiresDeviceIdle: false, // Default
      requiresBatteryNotLow: false, // Default
      requiresStorageNotLow: false, // Default
    },
    async taskId => {
      BackgroundFetch.finish(taskId);
    },
    taskId => {
      BackgroundFetch.finish(taskId);
    },
  );
};

export default initBackgroundFetch;
