/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  StripeProvider,
  useStripe,
  usePlatformPay,
  PlatformPayButton,
  PlatformPay,
  useConfirmPayment,
} from '@stripe/stripe-react-native';

const STRIPE_KEY =
  'pk_test_51OvxlwRtTkO9QfIE3t6iHRAmjE71H1pa2RnfMM9NP4wMZwJNoB644xDs2xTP6NyB8NJJ7yWta63FMdYdqt6zG0bm007K6eKZsj';
function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const {initPaymentSheet, presentPaymentSheet, resetPaymentSheetCustomer} =
    useStripe();
  const {isPlatformPaySupported, confirmPlatformPayPayment} = usePlatformPay();
  const {confirmPayment, loading} = useConfirmPayment();
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handlerCheckout = async () => {
    const {error: paymentSheetError} = await initPaymentSheet({
      merchantDisplayName: 'Example, Inc.',
      paymentIntentClientSecret:
        'pi_3OwGyvRtTkO9QfIE0G2pw26s_secret_VxQXHZMvJNFuqIUnsOifDKJQV',
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

  const pay = async () => {
    const clientSecret =
      'pi_3OwGyvRtTkO9QfIE0G2pw26s_secret_VxQXHZMvJNFuqIUnsOifDKJQV';

    const {error} = await confirmPlatformPayPayment(clientSecret, {
      googlePay: {
        testEnv: true,
        merchantName: 'My merchant name',
        merchantCountryCode: 'US',
        currencyCode: 'USD',
        billingAddressConfig: {
          format: PlatformPay.BillingAddressFormat.Full,
          isPhoneNumberRequired: true,
          isRequired: true,
        },
      },
    });

    if (error) {
      Alert.alert(error.code, error.message);
      // Update UI to prompt user to retry payment (and possibly another payment method)
      return;
    }
    Alert.alert('Success', 'The payment was confirmed successfully.');
  };

  const checkoutAlipay = async () => {
    const clientSecret =
      'pi_3OwHbJRtTkO9QfIE1mzvPzYy_secret_suxKqh5WIIvp5czwVslI5r9ZU';

    const {error, paymentIntent} = await confirmPayment(clientSecret, {
      paymentMethodType: 'Alipay',
    });

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else if (paymentIntent) {
      Alert.alert(
        'Success',
        `The payment was confirmed successfully! currency: ${paymentIntent.currency}`,
      );
    }
  };

  const logout = async () => {
    await resetPaymentSheetCustomer();
  };

  /////
  useEffect(() => {
    (async function () {
      if (
        Platform.OS === 'android' &&
        !(await isPlatformPaySupported({googlePay: {testEnv: true}}))
      ) {
        Alert.alert('Google Pay is not supported.');
        return;
      }
    })();
  }, []);

  return (
    <StripeProvider publishableKey={STRIPE_KEY} urlScheme="stripeexample">
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
          <PlatformPayButton
            type={PlatformPay.ButtonType.Pay}
            onPress={pay}
            style={{
              width: '100%',
              height: 50,
            }}
          />
          <TouchableOpacity
            onPress={handlerCheckout}
            style={styles.btnCheckout}>
            <Text style={{color: Colors.white}}>Checkout</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={checkoutAlipay} style={styles.btn}>
            <Text style={{color: Colors.white}}>Alipay</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} style={styles.btn}>
            <Text style={{color: Colors.white}}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 150,
    height: 50,
    margin: 24,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCheckout: {
    width: 150,
    height: 50,
    margin: 24,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
