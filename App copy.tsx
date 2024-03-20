/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {
  Button,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';
function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    async function initNfc() {
      if (Platform.OS === 'android') {
        await NfcManager.start();
      }
    }

    initNfc();

    return () => {};
  }, []);

  const writeWifiToTag = async () => {
    try {
      let bytes = Ndef.encodeMessage([
        Ndef.wifiSimpleRecord({
          ssid: 'UyenUyen',
          networkKey: 'uyenxinhgai',
        }),
      ]);
      const result = await NfcManager.requestTechnology(NfcTech.Ndef, {
        alertMessage: 'Place the NFC tag near your device.',
      });
      console.log('🚀 ~ writeWifiToTag ~ result:', result);
      if (result) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);

        console.log('Wi-Fi configuration written to NFC tag successfully.');
      }
    } catch (error) {
      console.error('Error writing Wi-Fi configuration to NFC tag:', error);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  const readNdef = async () => {
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      console.log('🚀 ~ readNdef ~ tag:', tag?.ndefMessage);
    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  };
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <TouchableOpacity
        onPress={writeWifiToTag}
        style={{width: 150, height: 50, margin: 24, backgroundColor: 'white'}}>
        <Text>Write Wi-Fi to NFC Tag</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={readNdef}
        style={{width: 150, height: 50, margin: 24, backgroundColor: 'white'}}>
        <Text>Scan a Tag</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default App;
