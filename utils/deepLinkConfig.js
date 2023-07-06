const config = {
  screens: {
    home: {
      path: '',
    },
    notifications: 'messages',
    explore: 'explore',
    search: 'search',
    settings: 'settings',
  },
};

const linking = {
  prefixes: ['wasteofmobile://', 'https://wasteof.money', 'wasteof://'],
  config,
};

export default linking;
