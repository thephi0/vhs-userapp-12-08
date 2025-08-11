import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Switch,
  Alert,
  Modal,
  Pressable,
  TextInput,
  BackHandler,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

function Profile({navigation}) {
  const [switchValue, setSwitchValue] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState('');
  const [value, setValue] = useState('');
  const [loginModal, setLoginModal] = useState(false);
  const [mainContact, setMainContact] = useState('');
  const [otpLoader, setOtpLoader] = useState(false);

  const toggleSwitch = value => {
    setSwitchValue(value);
  };

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setValue(parsedData);
        setUser(parsedData);
        console.log('User data loaded:', parsedData);
      } else {
        console.log('No user data found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    loadUserData();
  }, []);

  const signout = () => {
    AsyncStorage.removeItem('user');
    setUser('');
    setLoginModal(false);
    navigation.navigate('tab');
    console.log('User signed out');
  };

  const sendOTP = async () => {
    console.log('sendOTP called with mainContact:', mainContact);

    const isValidMobile = /^\d{10}$/.test(mainContact);
    if (!isValidMobile) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number.');
      console.log('Invalid mobile number format');
      return;
    }

    try {
      setOtpLoader(true);
      console.log('Sending OTP request to API...');

      const response = await axios.post(
        'https://newapi.vijayhomeservicebengaluru.in/api/customers/registerorlogin',
        {
          mainContact: mainContact,
          reference: 'userapp',
        },
        {
          timeout: 10000,
        },
      );

      console.log('API Response:', response.status, response.data);

      if (response.status === 200) {
        console.log(
          'OTP sent successfully, user data:',
          response.data.customer,
        );
        AsyncStorage.setItem('user', JSON.stringify(response.data.customer));

        // Update all states before closing modal
        setUser(response.data.user);
        setMainContact('');
        setOtpLoader(false);

        // Add slight delay to ensure state updates propagate
        setTimeout(() => {
          setLoginModal(false);
          ToastAndroid.show('Login successful', ToastAndroid.SHORT);
        }, 100);
      } else {
        throw new Error('Unexpected response status: ' + response.status);
      }
    } catch (error) {
      setOtpLoader(false);
      console.error('OTP Request Error:', error.message);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        Alert.alert(
          'Error',
          error.response.data.message ||
            'Failed to send OTP. Please try again.',
        );
      } else if (error.request) {
        console.error('No response received:', error.request);
        Alert.alert(
          'Error',
          'No response from server. Check your internet connection.',
        );
      } else {
        console.error('Error details:', error);
        Alert.alert(
          'Error',
          'An error occurred while sending OTP. Please try again.',
        );
      }
    }
  };

  const deleteUserAccount = async () => {
    try {
      const response = await axios.post(
        `https://api.vijayhomeservicebengaluru.in/api/deletetercustomer/${user._id}`,
      );
      if (response.status === 200) {
        signout();
      } else {
        Alert.alert(
          'Error',
          'Account deletion failed. Please try again later.',
        );
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert(
        'Error',
        'An error occurred. Please check your internet connection.',
      );
    }
  };

  const useDoubleBackExit = () => {
    const lastBackPressed = useRef(0);
    const onBackPress = () => {
      const currentTime = new Date().getTime();
      const DOUBLE_PRESS_DELAY = 2000;
      if (currentTime - lastBackPressed.current < DOUBLE_PRESS_DELAY) {
        BackHandler.exitApp();
        return true;
      }
      navigation.goBack();
      lastBackPressed.current = currentTime;
      ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
      return true;
    };

    useEffect(() => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []);
  };

  useDoubleBackExit();

  return (
    <View style={styles.container}>
      <ScrollView>
        {user && (
          <View style={{flexDirection: 'row', backgroundColor: '#E5E1DA'}}>
            <View>
              <TouchableOpacity>
                <Image
                  source={require('../../../assets/Profile.png')}
                  style={styles.profileimg}
                />
              </TouchableOpacity>
            </View>
            <View>
              <View>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 16,
                    marginTop: 25,
                    marginLeft: 20,
                    textAlign: 'center',
                  }}>
                  {user?.customerName}
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 14,
                    fontFamily: 'Poppins-Medium',
                    marginBottom: 5,
                    textAlign: 'center',
                    marginLeft: 20,
                  }}>
                  {user?.mainContact}
                </Text>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={() => (user ? signout() : setLoginModal(true))}
          style={[
            styles.container2,
            {
              backgroundColor: user ? 'white' : 'green',
              borderColor: user ? 'red' : 'green',
            },
          ]}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.1}}>
              <MaterialIcons
                name={user ? 'logout' : 'login'}
                color={user ? 'red' : 'white'}
                size={20}
              />
            </View>
            <View style={{flex: 0.8}}>
              <Text
                style={{
                  color: user ? 'red' : 'white',
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                }}>
                {user ? 'Logout' : 'Login'}
              </Text>
            </View>
            <View style={{flex: 0.1, alignItems: 'flex-end'}}></View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('edit')}>
          <View style={styles.container1}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.1}}>
                <FontAwesome5 name="user-alt" color="black" size={18} />
              </View>
              <View style={{flex: 0.8}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 14,
                    fontFamily: 'Poppins-Bold',
                  }}>
                  Edit Profile
                </Text>
              </View>
              <View style={{flex: 0.1, alignItems: 'flex-end'}}>
                <AntDesign name="right" color="black" size={20} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('booking')}>
          <View style={styles.container2}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.1}}>
                <Fontisto name="date" color="black" size={20} />
              </View>
              <View style={{flex: 0.8}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 14,
                    fontFamily: 'Poppins-Bold',
                  }}>
                  My Booking
                </Text>
              </View>
              <View style={{flex: 0.1, alignItems: 'flex-end'}}>
                <AntDesign name="right" color="black" size={20} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('wallet')}>
          <View style={styles.container2}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.1}}>
                <AntDesign name="wallet" color="black" size={20} />
              </View>
              <View style={{flex: 0.8}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 14,
                    fontFamily: 'Poppins-Bold',
                  }}>
                  Wallet
                </Text>
              </View>
              <View style={{flex: 0.1, alignItems: 'flex-end'}}>
                <AntDesign name="right" color="black" size={20} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.container2}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.1}}>
              <Ionicons name="notifications-outline" color="black" size={20} />
            </View>
            <View style={{flex: 0.8}}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 14,
                  fontFamily: 'Poppins-Bold',
                }}>
                Notification
              </Text>
            </View>
            <View style={{flex: 0.1, alignItems: 'flex-end'}}>
              <Switch
                onValueChange={toggleSwitch}
                value={switchValue}
                trackColor={{false: 'darkred', true: 'darkred'}}
                thumbColor={switchValue ? 'white' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('language')}>
          <View style={styles.container2}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.1}}>
                <Entypo name="language" color="black" size={20} />
              </View>
              <View style={{flex: 0.7}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 14,
                    fontFamily: 'Poppins-Bold',
                  }}>
                  Language
                </Text>
              </View>
              <View
                style={{
                  flex: 0.3,
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                }}>
                <Text style={{color: 'black', fontSize: 10, marginLeft: 35}}>
                  English (US)
                </Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <AntDesign name="right" color="black" size={20} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('privacy')}>
          <View style={styles.container2}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.1}}>
                <MaterialIcons name="privacy-tip" color="black" size={20} />
              </View>
              <View style={{flex: 0.8}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 14,
                    fontFamily: 'Poppins-Bold',
                  }}>
                  Privacy Policy
                </Text>
              </View>
              <View style={{flex: 0.1, alignItems: 'flex-end'}}>
                <AntDesign name="right" color="black" size={20} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('terms')}>
          <View style={styles.container2}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.1}}>
                <EvilIcons name="lock" color="black" size={20} />
              </View>
              <View style={{flex: 0.8}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 14,
                    fontFamily: 'Poppins-Bold',
                  }}>
                  Terms and Condition
                </Text>
              </View>
              <View style={{flex: 0.1, alignItems: 'flex-end'}}>
                <AntDesign name="right" color="black" size={20} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('refund')}>
          <View style={styles.container2}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.1}}>
                <MaterialCommunityIcons
                  name="credit-card-refund-outline"
                  color="black"
                  size={20}
                />
              </View>
              <View style={{flex: 0.8}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 14,
                    fontFamily: 'Poppins-Bold',
                  }}>
                  Refund and Cancellation Policy
                </Text>
              </View>
              <View style={{flex: 0.1, alignItems: 'flex-end'}}>
                <AntDesign name="right" color="black" size={20} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('help')}>
          <View style={styles.container2}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.1}}>
                <AntDesign name="infocirlceo" color="black" size={20} />
              </View>
              <View style={{flex: 0.8}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 14,
                    fontFamily: 'Poppins-Bold',
                  }}>
                  Help & Support
                </Text>
              </View>
              <View style={{flex: 0.1, alignItems: 'flex-end'}}>
                <AntDesign name="right" color="black" size={20} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('invite')}>
          <View style={styles.container2}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.1}}>
                <FontAwesome5 name="user-friends" color="black" size={20} />
              </View>
              <View style={{flex: 0.8}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 14,
                    fontFamily: 'Poppins-Bold',
                  }}>
                  Invite Friends
                </Text>
              </View>
              <View style={{flex: 0.1, alignItems: 'flex-end'}}>
                <AntDesign name="right" color="black" size={20} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Login Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={loginModal}
        onRequestClose={() => {
          setLoginModal(false);
          console.log('Modal close requested');
        }}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* Dark overlay */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        />

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 20,
              width: '90%',
              maxWidth: 400,
            }}>
            <TouchableOpacity
              style={{alignSelf: 'flex-end', padding: 5}}
              onPress={() => {
                setLoginModal(false);
                console.log('Close button pressed');
              }}>
              <AntDesign name="close" size={20} color="lightgrey" />
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 16,
                color: 'black',
                fontFamily: 'Poppins-Medium',
                marginBottom: 10,
                textAlign: 'center',
              }}>
              Enter mobile number to continue
            </Text>

            <TextInput
              style={{
                borderWidth: 1,
                borderColor: 'grey',
                borderRadius: 5,
                height: 45,
                marginBottom: 20,
                paddingHorizontal: 10,
                color: 'black',
              }}
              keyboardType="numeric"
              maxLength={10}
              onChangeText={text => setMainContact(text)}
              value={mainContact}
              placeholder="Enter Mobile Number"
              placeholderTextColor="grey"
            />

            <TouchableOpacity
              onPress={sendOTP}
              disabled={otpLoader}
              style={{
                backgroundColor: '#ff465e',
                paddingVertical: 10,
                borderRadius: 5,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontFamily: 'Poppins-Medium',
                }}>
                {otpLoader ? (
                  <ActivityIndicator size="small" color={'white'} />
                ) : (
                  'Continue'
                )}
              </Text>
            </TouchableOpacity>

            <View style={{marginTop: 20, alignItems: 'center'}}>
              <Text style={{fontSize: 14, color: '#999'}}>
                Why to choose{' '}
                <Text style={{color: 'darkred'}}>Our Services?</Text>
              </Text>
              <View style={{marginTop: 10}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 5,
                  }}>
                  <FontAwesome
                    name="check-circle"
                    size={14}
                    color="green"
                    style={{marginRight: 5}}
                  />
                  <Text style={{fontSize: 14, color: 'black'}}>
                    Lowest Price Guaranteed
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 5,
                  }}>
                  <FontAwesome
                    name="check-circle"
                    size={14}
                    color="green"
                    style={{marginRight: 5}}
                  />
                  <Text style={{fontSize: 14, color: 'black'}}>
                    Free Reschedule
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 5,
                  }}>
                  <FontAwesome
                    name="check-circle"
                    size={14}
                    color="green"
                    style={{marginRight: 5}}
                  />
                  <Text style={{fontSize: 14, color: 'black'}}>
                    5 Star Rated Team
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 5,
                  }}>
                  <FontAwesome
                    name="check-circle"
                    size={14}
                    color="green"
                    style={{marginRight: 5}}
                  />
                  <Text style={{fontSize: 14, color: 'black'}}>
                    Dedicated Customer Support
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Help & Support Modal */}
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}>
          <View style={styles.modalView}>
            <TextInput
              style={{
                borderWidth: 1,
                width: '100%',
                borderColor: '#eee',
                borderRadius: 5,
              }}
              underlineColorAndroid={Platform.OS === 'android' ? 'white' : null}
            />
            <TextInput
              style={styles.textinput}
              multiline={true}
              numberOfLines={4}
              placeholder="Tell us your query..."
              underlineColorAndroid={Platform.OS === 'android' ? 'white' : null}
            />
            <View style={{flexDirection: 'row', margin: 20}}>
              <View
                style={{
                  flex: 0.5,
                  backgroundColor: '#eee',
                  borderRadius: 20,
                  padding: 10,
                }}>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <FontAwesome name="whatsapp" color="black" size={18} />
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 13,
                      fontFamily: 'Poppins-Medium',
                      marginLeft: 10,
                    }}>
                    Whatsapp
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flex: 0.5,
                  backgroundColor: '#eee',
                  borderRadius: 20,
                  padding: 10,
                  marginLeft: 20,
                }}>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <FontAwesome name="phone" color="black" size={18} />
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 13,
                      fontFamily: 'Poppins-Medium',
                      marginLeft: 10,
                    }}>
                    Call Now
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileimg: {
    width: 70,
    height: 90,
    borderRadius: 50,
  },
  profileimg1: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'absolute',
    top: 0,
  },
  editicon: {
    marginTop: -30,
    marginLeft: 70,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '100%',
    marginVertical: 20,
    marginTop: 0,
  },
  shadowProp: {
    shadowOffset: {width: -2, height: 4},
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  elevation: {
    elevation: 10,
  },
  container1: {
    backgroundColor: 'white',
    elevation: 0,
    borderWidth: 1,
    borderColor: 'lightgrey',
    padding: 15,
    borderRadius: 5,
    margin: 10,
  },
  textinput: {
    borderWidth: 1,
    borderColor: '#eee',
    width: '100%',
    fontSize: 16,
    marginTop: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
  container2: {
    backgroundColor: 'white',
    elevation: 0,
    borderWidth: 1,
    borderColor: 'lightgrey',
    padding: 15,
    borderRadius: 5,
    margin: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: '#000',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 15,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default Profile;
