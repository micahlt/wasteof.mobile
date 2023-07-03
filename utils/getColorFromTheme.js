/**
 * Brush palette generator based on wasteof4 alpha
 * @param {string} colorString a color word from the wasteof2 API
 * @param {bool} isDark whether a dark theme is active
 * @returns {object} an object containing `headerColor`, `outlineColor`, `buttonBg`, and `buttonText`
 */
const getColorFromTheme = (colorString, isDark) => {
  switch (colorString) {
    // return values are color levels taken from the stylesheet on the latest version of the wasteof.money website
    case 'gray': {
      if (isDark) {
        return {
          headerColor: '#9ca3af', // 400 lvl
          outlineColor: '#374151', // 700 lvl
          buttonBg: '#1f2937', // 900 lvl
          buttonText: '#9ca3af', // 300 lvl
        };
      } else {
        return {
          headerColor: '#9ca3af', // 400 lvl
          outlineColor: '#374151', // 700 lvl
          buttonBg: '#e5e7eb', // 200 lvl
          buttonText: '#1f2937', // 900 lvl
        };
      }
    }
    case 'yellow': {
      if (isDark) {
        return {
          headerColor: '#facc15',
          outlineColor: '#a16207',
          buttonBg: '#713f12',
          buttonText: '#facc15',
        };
      } else {
        return {
          headerColor: '#facc15',
          outlineColor: '#a16207',
          buttonBg: '#fef08a',
          buttonText: '#713f12',
        };
      }
    }
    case 'blue': {
      if (isDark) {
        return {
          headerColor: '#60a5fa',
          outlineColor: '#1d4ed8',
          buttonBg: '#1e3a8a',
          buttonText: '#93c5fd',
        };
      } else {
        return {
          headerColor: '#60a5fa',
          outlineColor: '#1d4ed8',
          buttonBg: '#bfdbfe',
          buttonText: '#1e3a8a',
        };
      }
    }
    case 'red': {
      if (isDark) {
        return {
          headerColor: '#f87171',
          outlineColor: '#b91c1c',
          buttonBg: '#7f1d1d',
          buttonText: '#fca5a5',
        };
      } else {
        return {
          headerColor: '#f87171',
          outlineColor: '#b91c1c',
          buttonBg: '#fecaca',
          buttonText: '#7f1d1d',
        };
      }
    }
    case 'indigo': {
      if (isDark) {
        return {
          headerColor: '#818cf8',
          outlineColor: '#4338ca',
          buttonBg: '#312e81',
          buttonText: '#a5b4fc',
        };
      } else {
        return {
          headerColor: '#818cf8',
          outlineColor: '#4338ca',
          buttonBg: '#c7d2fe',
          buttonText: '#312e81',
        };
      }
    }
    case 'green': {
      if (isDark) {
        return {
          headerColor: '#4ade80',
          outlineColor: '#15803d',
          buttonBg: '#14532d',
          buttonText: '#86efac',
        };
      } else {
        return {
          headerColor: '#4ade80',
          outlineColor: '#15803d',
          buttonBg: '#bbf7d0',
          buttonText: '#14532d',
        };
      }
    }
    case 'fuchsia': {
      if (isDark) {
        return {
          headerColor: '#e879f9',
          outlineColor: '#a21caf',
          buttonBg: '#701a75',
          buttonText: '#f0abfc',
        };
      } else {
        return {
          headerColor: '#e879f9',
          outlineColor: '#a21caf',
          buttonBg: '#f5d0fe',
          buttonText: '#701a75',
        };
      }
    }
    case 'teal': {
      if (isDark) {
        return {
          headerColor: '#2dd4bf',
          outlineColor: '#0f766e',
          buttonBg: '#134e4a',
          buttonText: '#5eead4',
        };
      } else {
        return {
          headerColor: '#2dd4bf',
          outlineColor: '#0f766e',
          buttonBg: '#99f6e4',
          buttonText: '#134e4a',
        };
      }
    }
    case 'orange': {
      if (isDark) {
        return {
          headerColor: '#fb923c',
          outlineColor: '#c2410c',
          buttonBg: '#7c2d12',
          buttonText: '#fdba74',
        };
      } else {
        return {
          headerColor: '#fb923c',
          outlineColor: '#c2410c',
          buttonBg: '#fed7aa',
          buttonText: '#7c2d12',
        };
      }
    }
    default: {
      if (isDark) {
        return {
          headerColor: '#818cf8',
          outlineColor: '#4338ca',
          buttonBg: '#312e81',
          buttonText: '#a5b4fc',
        };
      } else {
        return {
          headerColor: '#818cf8',
          outlineColor: '#4338ca',
          buttonBg: '#c7d2fe',
          buttonText: '#312e81',
        };
      }
    }
  }
};

export default getColorFromTheme;
