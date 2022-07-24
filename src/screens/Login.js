import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Keyboard,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import {Eye, EyeOff, LoginImage} from '../components/icons';
import {AuthContext} from '../context/Auth';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

const Login = () => {
  const [username, onChangeUsername] = useState('');
  const [password, onChangePassword] = useState('');
  const [isShowPassword, onChangeIsShowPassword] = useState(false);

  const {addToken} = useContext(AuthContext);

  const loginSystem = () => {
    if (username === 'admin' && password === 'admin') {
      addToken('token');
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: '#F9F9F9'}]}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.avoidKeyboardContainer}>
        <Pressable
          style={styles.pressableContainer}
          onPress={() => Keyboard.dismiss()}>
          <LoginImage
            width="90%"
            height="250"
            style={{marginLeft: 'auto', marginRight: 'auto'}}
          />
          <Text style={styles.loginTitle}>Login</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.inputUsername]}
              onChangeText={onChangeUsername}
              value={username}
              placeholder="Username"
              placeholderTextColor="#979797"
              autoCapitalize="none"
              selectionColor="#1AC934"
            />
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={[styles.input, styles.inputPassword]}
                onChangeText={onChangePassword}
                value={password}
                secureTextEntry={!isShowPassword}
                placeholder="Password"
                placeholderTextColor="#979797"
                autoCapitalize={'none'}
                selectionColor="#1AC934"
              />
              <TouchableOpacity
                style={styles.togglePasswordButton}
                onPress={() => onChangeIsShowPassword(!isShowPassword)}>
                {!isShowPassword ? (
                  <EyeOff width="20" height="20" color="#1AC934" />
                ) : (
                  <Eye width="20" height="20" color="#1AC934" />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => loginSystem()}
              activeOpacity={0.9}
              style={styles.loginButton}>
              <Text style={styles.loginButtonText}>LOGIN</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avoidKeyboardContainer: {
    flex: 1,
  },
  pressableContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 36,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  input: {},
  inputUsername: {
    height: 42,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  passwordInputContainer: {
    height: 42,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 16,
    marginBottom: 36,
  },
  inputPassword: {
    flexGrow: 1,
    paddingHorizontal: 6,
    height: '100%',
  },
  togglePasswordButton: {
    justifyContent: 'center',
    paddingHorizontal: 6,
    height: '100%',
  },
  loginButton: {
    height: 40,
    backgroundColor: '#1AC934',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 1,
  },
});
