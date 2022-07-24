import React, {useRef, useContext} from 'react';
import {SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';
import {AuthContext} from '../context/Auth';

const PaymentWebView = () => {
  const webview = useRef(null);

  const {addCognitoToken} = useContext(AuthContext);

  const handleStateChanges = params => {
    const {url} = params;

    if (url.includes('id_token')) {
      const id_key = url.split('=')[1].split('&access')[0];
      const access_key = url.split('=')[2].split('&expires')[0];

      addCognitoToken(access_key);

      webview.current.stopLoading();
      webview.current = null;
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <WebView
        //style={{backgroundColor: '#f20000'}}
        ref={webview}
        onShouldStartLoadWithRequest={() => true}
        source={{
          uri: 'https://lumberapp-authenticate.auth.us-east-1.amazoncognito.com/login?client_id=i54mgm01tvoeqsliev3ensson&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=https://example.com/callback',
        }}
        startInLoadingState={true}
        onNavigationStateChange={handleStateChanges}
      />
    </SafeAreaView>
  );
};

export default PaymentWebView;
