/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {
  Alert,
  Button,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {StripeProvider, useStripe} from '@stripe/stripe-react-native';

const STRIPE_KEY =
  'pk_test_51OvxlwRtTkO9QfIE3t6iHRAmjE71H1pa2RnfMM9NP4wMZwJNoB644xDs2xTP6NyB8NJJ7yWta63FMdYdqt6zG0bm007K6eKZsj';
function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handlerCheckout = async () => {
    const {error: paymentSheetError} = await initPaymentSheet({
      merchantDisplayName: 'Example, Inc.',
      paymentIntentClientSecret:
        'pi_3OwF1dRtTkO9QfIE0FhCX3DJ_secret_xRY2t5SvXZDvLfVsexdwGeLTp',
      defaultBillingDetails: {
        name: 'Jane Doe',
      },
    });
    if (paymentSheetError) {
      Alert.alert('Something went wrong', paymentSheetError.message);
      return;
    }
    const {error: paymentError} = await presentPaymentSheet();

    if (paymentError) {
      Alert.alert(`Error code: ${paymentError.code}`, paymentError.message);
      return;
    }
  };
  return (
    <StripeProvider publishableKey={STRIPE_KEY}>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: Colors.white,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={handlerCheckout}
            style={{
              width: 150,
              height: 50,
              margin: 24,
              backgroundColor: 'blue',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: Colors.white}}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </StripeProvider>
  );
}

export default App;
