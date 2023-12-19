const config = {
  screens: {
    parent: {
      screens: {
        home: '',
    notifications: 'messages',
    explore: 'explore',
    search: 'search',
    settings: 'settings',
      },
    },
    users: 'users/:username',
  },
};

const linking = {
  prefixes: ['wasteofmobile://', 'https://wasteof.money', 'wasteof://'],
  config,
};

export default linking;
