import {DarkTheme} from '@react-navigation/native';

const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#050505',
    text: '#fff',
    green: '#00ff00',
    gray: '#808080',
  },
};

export default customDarkTheme;
