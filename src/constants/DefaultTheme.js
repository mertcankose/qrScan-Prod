import {DefaultTheme} from '@react-navigation/native';

const customDefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff',
    text: '#000',
    green: '#00ff00',
    gray: '#808080',
  },
};

export default customDefaultTheme;
