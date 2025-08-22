import React, {useState, useRef, useEffect} from 'react';
import axios from 'axios';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  PermissionsAndroid,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Pressable,
  StatusBar,
} from 'react-native';

import Modal from 'react-native-modal';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import {useFCMToken} from '../../ApiServices/FCMtoken';
import Geocoder from 'react-native-geocoding';
import Video from 'react-native-video';
import {useIsFocused} from '@react-navigation/native';

import {Linking} from 'react-native';

import {Card} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';

import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useDispatch, useSelector} from 'react-redux';
import {updateBTSwitch} from './Redux/BTSwitch';
import AutoUpdate from '../../AutoUpdate';
import Category from '../../Components/Category';
import Category1 from '../../Components/Category1';
import GetLocation from 'react-native-get-location';
import {WebView} from 'react-native-webview';
import * as Animatable from 'react-native-animatable';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

function Home({navigation}) {
  const [imgActive, setImgActive] = React.useState(0);
  const fcmtoken = useFCMToken();
  console.log('fcmtoken', fcmtoken);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (imgActive < sliderImages.length - 1) {
        scrollViewRef.current.scrollTo({
          x: (imgActive + 1) * WIDTH,
          animated: true,
        });
      } else {
        scrollViewRef.current.scrollTo({x: 0, animated: true});
      }
    }, 3000); // Change the interval (in milliseconds) according to your needs

    return () => clearInterval(interval);
  }, [imgActive]);

  const onChange = event => {
    const slide = Math.ceil(
      event.contentOffset.x / event.layoutMeasurement.width,
    );
    if (slide !== imgActive) {
      setImgActive(slide);
    }
  };
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCity, setselectedCity] = useState();
  const [savecity, setsavecity] = useState('');
  const [city, setaddress] = useState('');
  const [Bannerdata, setBannerdata] = useState([]);
  const [categorydata, setcategorydata] = useState([]);
  const [postcategorydata, setpostcategorydata] = useState([]);
  const [subdata, setsubdata] = useState([]);
  const [homepagetitledata, sethomepagetitledata] = useState([]);
  const [spotlightdata, setspotlightdata] = useState([]);
  const [sdata, setsdata] = useState([]);
  const [ddata, setddata] = useState([]);
  const [servicedata, setservicedata] = useState([]);
  const [SelectedCategory, setSelectedCategory] = useState('');

  const [secondsdata, setsecondsdata] = useState([]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isOfferModalVisible, setOfferModalVisible] = useState(false);

  const [appupdateModalVisible, setappupdateModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [citydata, setcitydata] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);
  const isFocused = useIsFocused();
  const [videoPaused, setVideoPaused] = useState(!isFocused);

  const [version, setVersion] = useState('');

  const [CityModalVisible, setCityModalVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('savecity').then(value => {
      if (value) {
        setsavecity(value);
        setCityModalVisible(false);
      } else {
        setCityModalVisible(true);
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('city').then(value => {
      setaddress(value);
    });
    AsyncStorage.getItem('savecity').then(value => {
      setsavecity(value);
    });
  }, []);

  const getversions = async () => {
    let res = await axios.get(
      'https://api.vijayhomeservicebengaluru.in/api/getversions',
    );
    if (res.status === 200) {
      const version = res.data?.versions;
      setVersion(version[0]?.version);
    }
  };

  const spotlightbanner = async () => {
    let res = await axios.get(
      'https://api.vijayhomesuperadmin.in/api/userapp/getallbanner',
    );
    if (res.status === 200) {
      setSliderImages(res.data?.banner);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://api.vijayhomesuperadmin.in/api/userapp/getallbanner',
      );
      if (response.data && response.data.banner) {
        setBannerdata(response.data.banner);
      } else {
        console.error("API response does not contain 'banner' property");
      }
    } catch (error) {
      console.error('No internet');
    }
  };

  const getbannerimg = async () => {
    let res = await axios.get(
      'https://api.vijayhomesuperadmin.in/api/userapp/getallspotlightbanner',
    );
    if (res.status === 200) {
      setspotlightdata(res.data?.spotlightbanner);
    }
  };

  const getcategory = async () => {
    let res = await axios.get(
      'https://api.vijayhomesuperadmin.in/api/getcategory',
    );
    if (res.status === 200) {
      setcategorydata(res.data?.category);
    }
  };

  const gethomepagetitle = async () => {
    let res = await axios.get(
      'https://api.vijayhomesuperadmin.in/api/userapp/gettitle',
    );
    if (res.status === 200) {
      sethomepagetitledata(res.data?.homepagetitle);
    }
  };

  const getallsubcategory = async () => {
    let res = await axios.get(
      'https://api.vijayhomesuperadmin.in/api/userapp/getappsubcat',
    );
    if (res.status === 200) {
      const subcategories = res.data?.subcategory || [];
      setsubdata(subcategories);
      setsdata(subcategories);
    }
  };

  const getcity = async () => {
    let res = await axios.get(
      'https://api.vijayhomesuperadmin.in/api/master/getcity',
    );
    if (res.status === 200) {
      setcitydata(res.data?.mastercity);
    }
  };

  const getservices = async () => {
    const data = sdata;
    const filteredData = data.filter(i => {
      return i.homePagetitle === homepagetitledata[0]?.title;
    });

    setservicedata(filteredData);
    setsecondsdata(
      data.filter(i => i.homePagetitle === homepagetitledata[1]?.title),
    );
  };

  useEffect(() => {
    const fetchHomeScreenData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          getversions(),
          spotlightbanner(),
          fetchData(),
          getcity(),
          getbannerimg(),
          getcategory(),
          getallsubcategory(),
          gethomepagetitle(),
        ]);
      } catch (error) {
        console.error('Failed to fetch initial home screen data in parallel:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };
    fetchHomeScreenData();
  }, [refresh]);

  useEffect(() => {
    if (homepagetitledata.length > 0 && sdata.length > 0) {
      getservices();
    }
  }, [homepagetitledata, sdata]);

  const handleUpdatePress = () => {
    Linking.openURL('https://play.google.com/store/apps/details?id=com.vhs1');
  };

  const imageSliderData = sliderImages.map(item => ({
    img: `https://api.vijayhomesuperadmin.in/userbanner/${item.banner}`,
    subcategory: item.subcategory,
  }));
  const imagenew = imageSliderData.map(item => item.img);

  const setUserCity = sCity => {
    setselectedCity(sCity);
    AsyncStorage.setItem('savecity', sCity);
    setCityModalVisible(false);
  };

  const close = () => {
    setSelectedCategory('');
    setpostcategorydata([]);
    setModalVisible(false);
  };

  const handleCategoryPress = async (category) => {
    setSelectedCategory(category);
    setModalVisible(true);
    setpostcategorydata([]);

    try {
        let res = await axios.post(
          `https://api.vijayhomesuperadmin.in/api/userapp/postappsubcat/`,
          { category: category },
        );
        if (res.status === 200) {
          setpostcategorydata(res.data?.subcategory);
        }
    } catch (error) {
        console.error("Error fetching subcategory data on demand: ", error);
        close();
        alert("Could not load services. Please try again.");
    }
  };

  function groupItemsIntoRows(items, itemsPerRow) {
    const rows = [];
    for (let i = 0; i < items.length; i += itemsPerRow) {
      rows.push(items.slice(i, i + itemsPerRow));
    }
    return rows;
  }
  
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefresh(prev => !prev);
  }, []);

  useEffect(() => {
    requestCameraPermission();
    Geocoder.init('AIzaSyBF48uqsKVyp9P2NlDX-heBJksvvT_8Cqk');
    getCurrentLocation();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission Required',
          message: 'Vijay Home Services needs access to your location to provide location-based services.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the LOCATION');
      } else {
        console.log('LOCATION permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const [address, setAddress] = useState({address: '', markerCoordinate: {}});
  const getCurrentLocation = async () => {
    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      });
      const {latitude, longitude} = location;
      fetchAddress(latitude, longitude);
    } catch (error) {
      const {code, message} = error;
      console.warn(code, message);
    }
  };

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await Geocoder.from(latitude, longitude);
      const address = response.results[0].formatted_address;
      const abc = {
        address: address,
        markerCoordinate: {latitude: latitude, longitude: longitude},
      };
      AsyncStorage.setItem('address', JSON.stringify(abc));
      AsyncStorage.setItem('locationData', JSON.stringify(abc));
      setAddress({
        address: abc,
        markerCoordinate: {latitude: latitude, longitude: longitude},
      });
    } catch (error) {
      console.error('Error fetching address: ', error);
    }
  };

  const MyCartItmes = useSelector(state => state.cart);
  const TotalQuantity = MyCartItmes.reduce((accumulator, item) => {
    const quantity = parseInt(item?.qty);
    return !isNaN(quantity) ? accumulator + quantity : accumulator;
  }, 0);

  const {height} = Dimensions.get('window');

  const cityImages = {
    1: require('../../../assets/city1.png'),
    2: require('../../../assets/city2.png'),
    3: require('../../../assets/city3.png'),
    4: require('../../../assets/city4.png'),
    5: require('../../../assets/city5.png'),
    6: require('../../../assets/city6.png'),
    7: require('../../../assets/city7.png'),
    8: require('../../../assets/city8.png'),
    9: require('../../../assets/city9.png'),
    10: require('../../../assets/city10.png'),
    11: require('../../../assets/city11.png'),
    12: require('../../../assets/city12.png'),
    13: require('../../../assets/city13.png'),
    14: require('../../../assets/city14.png'),
    15: require('../../../assets/city15.png'),
    16: require('../../../assets/city16.png'),
    17: require('../../../assets/city17.png'),
    18: require('../../../assets/city18.png'),
    19: require('../../../assets/city19.png'),
    20: require('../../../assets/city20.png'),
    21: require('../../../assets/city21.png'),
  };

  const specialDealsToExclude = [
    'varalakshmi home cleaning deals',
    'varalakshmi bathroom deals',
    'varalakshmi kitchen deals',
  ];

  const filteredSubdata = (subdata || []).filter(
    item => !specialDealsToExclude.includes(item.subcategory?.trim().toLowerCase())
  );

  const offersData = [
    {
      id: 1,
      title: 'Book Home cleaning',
      deal: 'Get 5 Seat sofa cleaning FREE',
      coupon: null,
      targetSubcategory: 'varalakshmi home cleaning deals',
    },
    {
      id: 2,
      title: 'Book Bathroom cleaning',
      deal: 'Get Rs 100 OFF',
      coupon: null,
      targetSubcategory: 'varalakshmi bathroom deals',
    },
    {
      id: 3,
      title: 'Book Kitchen cleaning',
      deal: 'Get Rs 200 Off',
      coupon: null,
      targetSubcategory: 'varalakshmi kitchen deals',
    },
  ];

  useEffect(() => {
    setVideoPaused(!isFocused);
  }, [isFocused]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor="grey" barStyle="light-content" />
      <View style={styles.container} key={refresh}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
          }>
          <View style={styles.container}>
            <View style={{height: 500}}>
              <Image
                source={require('../../../assets/pest_control1.png')}
                style={styles.backgroundImage}
              />
              <View style={styles.overlayContainer}>
                <WebView
                  source={{uri: ''}}
                  style={styles.webview}
                  allowsFullscreenVideo={false}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  padding: 15,
                  elevation: 1,
                  backgroundColor: 'transparent',
                }}>
                <Pressable
                  style={{flex: 0.8}}
                  onPress={() => setCityModalVisible(true)}>
                  <View
                    style={{
                      flexDirection: 'row',
                      elevation: 3,
                      padding: 5,
                      width: 140,
                      borderRadius: 5,
                      borderColor: 'transparent',
                      backgroundColor: 'white',
                    }}>
                    <Feather
                      name="map-pin"
                      size={18}
                      color="black"
                      style={{marginTop: 3}}
                    />
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Poppins-Medium',
                        fontSize: 14,
                        marginLeft: 5,
                      }}>
                      {selectedCity ? selectedCity : savecity}
                    </Text>
                  </View>
                </Pressable>

                <View style={{flex: 0.35, flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('wallet')}
                    style={{marginRight: 10}}>
                    <Entypo name="wallet" color="white" size={30} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{position: 'relative', marginRight: 10}}
                    onPress={() => {
                      if (TotalQuantity && TotalQuantity > 0) {
                        navigation.navigate('cart');
                      } else {
                        alert('Please book the service and comeback.');
                      }
                    }}>
                    <Entypo name="shopping-cart" color="white" size={30} />
                    {TotalQuantity > 0 && (
                      <View
                        style={{
                          position: 'absolute',
                          backgroundColor: 'orange',
                          borderRadius: 10,
                          width: 20,
                          height: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                          right: -5,
                          top: -5,
                        }}>
                        <Text style={{color: 'white', fontSize: 12}}>
                          {TotalQuantity}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Profile')}
                    style={{marginRight: 10}}>
                    <MaterialIcons name="account-box" color="white" size={33} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{paddingHorizontal: 10, marginTop: 230}}>
  {/* Text for Trending Services */}
  <Text style={styles.trendingText}></Text>
  <Text style={styles.trendingText1}> Ganesh Chaturthi Offers</Text>

  {/* Images Row is now a standard View */}
  <View
    style={{
      flexDirection: 'row',          // Arranges items horizontally
      justifyContent: 'space-around', // Distributes items evenly with space
      alignItems: 'center',          // Aligns items vertically in the center
      paddingVertical: 2,
      marginTop: 8,
    }}>
    {/* Image 1 */}
    <TouchableOpacity
      onPress={() => {
        const targetSubCategory = sdata.find(
          item =>
            item.subcategory?.trim().toLowerCase() === 'varalakshmi home cleaning deals',
        );
        if (targetSubCategory) {
          navigation.navigate('repairing', {
            cdata: targetSubCategory,
          });
        } else {
          console.warn(
            "Subcategory 'geyser repairing' not found in sdata.",
          );
          alert('Service details not available at the moment.');
        }
      }}>
      <Image
        source={require('../../../assets/vp1.png')}
        style={{width: 80, height: 100, borderRadius: 5}}
      />
    </TouchableOpacity>

    {/* Image 2 (Example) */}
    <TouchableOpacity
      onPress={() => {
        const targetSubCategory = sdata.find(
          item =>
            item.subcategory?.trim().toLowerCase() === 'varalakshmi bathroom deals',
        );
        if (targetSubCategory) {
          navigation.navigate('repairing', {
            cdata: targetSubCategory,
          });
        } else {
          console.warn(
            "Subcategory 'general pest control' not found in sdata.",
          );
          alert('Pest control service details not available at the moment.');
        }
      }}>
      <Image
        source={require('../../../assets/vp3.png')}
        style={{width: 80, height: 100, borderRadius: 5}}
      />
    </TouchableOpacity>

    {/* Image 3 */}
    <TouchableOpacity 
    onPress={() => {
        const targetSubCategory = sdata.find(
          item =>
            item.subcategory?.trim().toLowerCase() === 'varalakshmi kitchen deals',
        );
        if (targetSubCategory) {
          navigation.navigate('repairing', {
            cdata: targetSubCategory,
          });
        } else {
          console.warn(
            "Subcategory 'general pest control' not found in sdata.",
          );
          alert('Pest control service details not available at the moment.');
        }
      }}>
      <Image
        source={require('../../../assets/vp2.png')}
        style={{
          width: 80,
          height: 100,
          borderRadius: 5,
        }}
      />
    </TouchableOpacity>

     {/* Image 4 (Pest Control) */}
    <TouchableOpacity 
      onPress={() => {
        // Find the specific 'pest control offers' subcategory from your data
        const targetSubCategory = sdata.find(
          item =>
            item.subcategory?.trim().toLowerCase() === 'pest control offers',
        );

        // If the subcategory is found, navigate to the service page
        if (targetSubCategory) {
          navigation.navigate('repairing', {
            cdata: targetSubCategory,
          });
        } else {
          // If not found, log a warning and show an alert to the user
          console.warn(
            "Subcategory 'pest control offers' not found in sdata.",
          );
          alert('Pest control service details not available at the moment.');
        }
      }}>
      <Image
        source={require('../../../assets/vp4.png')}
        style={{
          width: 80,
          height: 100,
        }}
      />
    </TouchableOpacity>
  </View>
</View>
</View> 
          

            <View style={{backgroundColor: 'white'}}>
              <View style={{}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 18,
                    paddingLeft: 20,
                    marginTop: 15,
                    fontFamily: 'Poppins-Bold',
                  }}>
                  CATEGORY
                </Text>

                <View style={{margin: 10}}>
                  {groupItemsIntoRows(categorydata, 4).map(
                    (rowItems, rowIndex) => (
                      <View key={rowIndex} style={{flexDirection: 'row'}}>
                        {rowItems.map((item, index) => (
                          <TouchableOpacity
                            key={item?._id || index}
                            onPress={() => {
                              if (item.category === 'Packers & Movers') {
                                navigation.navigate('Bottomtab');
                              } else {
                                handleCategoryPress(item.category);
                              }
                            }}
                            style={{
                              flex: 1 / 4,
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: 1,
                            }}>
                            {item ? (
                              <View style={{marginTop: 0}}>
                                <View style={styles.servicesimgrow}>
                                  <Image
                                    source={{
                                      uri: `https://api.vijayhomesuperadmin.in/category/${item.categoryImg}`,
                                    }}
                                    style={styles.servicesimg}
                                  />
                                </View>
                                <Text style={styles.servicestext}>
                                  {item.category}
                                </Text>
                              </View>
                            ) : null}
                          </TouchableOpacity>
                        ))}
                      </View>
                    ),
                  )}
                </View>
              </View>
            </View>
            <SafeAreaView style={styles.container}>
              <ScrollView
                ref={scrollViewRef}
                onScroll={({nativeEvent}) => onChange(nativeEvent)}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                horizontal
                style={styles.scrollView}>
                {imageSliderData.map((e, index) => (
                  <TouchableOpacity
                    key={index.toString()}
                    style={styles.imageContainer}
                    onPress={() => {
                      const filteredData = sdata.filter(
                        i => i.subcategory === e.subcategory,
                      );
                      if (filteredData.length > 0) {
                        navigation.navigate('repairing', {
                          cdata: filteredData[0],
                        });
                      }
                    }}>
                    <Image
                      resizeMode="stretch"
                      style={styles.image}
                      source={{uri: e.img}}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.wrapDot}>
                {imagenew.map((e, index) => (
                  <Text
                    key={e}
                    style={imgActive === index ? styles.dotActive : styles.dot}>
                    ●
                  </Text>
                ))}
              </View>
            </SafeAreaView>

            <Category
              navigation={navigation}
              category={categorydata[0]?.category}
              subdata={filteredSubdata}
              title={'          Up to 50% off          '}
              color={'#ffb6c1'}
              style={{paddingHorizontal: 100}}
            />
            <Category
              navigation={navigation}
              category={categorydata[1]?.category}
              subdata={subdata}
              title={'     100% in House Staff    '}
              color={'#add8e6'}
            />
            <Category
              navigation={navigation}
              category={categorydata[2]?.category}
              subdata={subdata}
              title={' Licensed Company '}
              color={'#98fb98'}
            />

            <View style={{backgroundColor: 'white'}}>
              <TouchableOpacity
                style={{margin: 20}}
                onPress={() => {
                  if (categorydata[5]?.category === 'Packers & Movers') {
                    navigation.navigate('Bottomtab');
                  } else {
                    navigation.navigate('repairing', {
                      cdata: categorydata[5],
                    });
                  }
                }}>
                <View style={{flexDirection: 'row', gap: 10}}>
                  <Text style={styles.homepagetitle}>
                    {categorydata[5]?.category}
                  </Text>
                  <Text
                    style={{
                      backgroundColor: '#ffb6c1',
                      borderRadius: 20,
                      paddingHorizontal: 10,
                      paddingVertical: 3,
                      fontSize: 12,
                      color: 'black',
                      textTransform: 'uppercase',
                      marginTop: 5,
                      marginBottom: 5,
                      marginLeft: 3,
                      fontFamily: 'Poppins-Medium',
                    }}>
                    1lakh + Happy Customer
                  </Text>
                </View>

                <Pressable
                  onPress={() =>
                    navigation.navigate('Bottomtab', {
                      cdata: sdata.find(
                        i => i.subcategory === spotlightdata[0]?.category,
                      ),
                    })
                  }>
                  <Card style={styles.bcard}>
                    <View style={styles.booknow}>
                      <Text style={{color: 'white'}}>Book Now</Text>
                    </View>
                    <Video
                      source={{
                        uri: 'https://vijayahomeservices.b-cdn.net/packersbanner.mp4',
                      }}
                      style={{width: '100%', height: 180}}
                      resizeMode="cover"
                      loop
                      muted
                      repeat
                      controls={false}
                    />
                  </Card>
                </Pressable>
              </TouchableOpacity>
            </View>
            <View style={{margin: 15}}>
              <Pressable
                onPress={() =>
                  navigation.navigate('repairing', {
                    cdata: sdata.find(
                      i => i.subcategory === spotlightdata[0]?.category,
                    ),
                  })
                }>
                <Card style={styles.bcard}>
                  <View style={styles.booknow}>
                    <Text style={{color: 'white'}}>Book Now</Text>
                  </View>

                  <Image
                    source={{
                      uri: `https://api.vijayhomesuperadmin.in/spotlight/${spotlightdata[0]?.banner}`,
                    }}
                    style={styles.bannerimg}
                  />
                </Card>
              </Pressable>
            </View>

            <Category1
              navigation={navigation}
              category={categorydata[3]?.category}
              subdata={subdata}
              title={'            Shine Like New           '}
              color={'#98fb98'}
            />

            <Category1
              navigation={navigation}
              category={categorydata[6]?.category}
              subdata={subdata}
              title={'100+ Booking Per Day'}
              color={'#ffb6c1'}
            />

            <View style={{margin: 15}}>
              <Pressable
                onPress={() =>
                  navigation.navigate('repairing', {
                    cdata: sdata.find(
                      i => i.subcategory === spotlightdata[1]?.category,
                    ),
                  })
                }>
                <Card style={styles.bcard}>
                  <View style={styles.booknow}>
                    <Text style={{color: 'white'}}>Book Now</Text>
                  </View>

                  <Image
                    source={{
                      uri: `https://api.vijayhomesuperadmin.in/spotlight/${spotlightdata[1]?.banner}`,
                    }}
                    style={styles.bannerimg}
                  />
                </Card>
              </Pressable>
            </View>

            <Category1
              navigation={navigation}
              category={categorydata[4]?.category}
              subdata={subdata}
              title={'       Trained Team     '}
              color={'#ffb6c1'}
            />
            <Category1
              navigation={navigation}
              category={categorydata[7]?.category}
              subdata={subdata}
            />

            <View style={{backgroundColor: 'white'}}>
              <View style={{margin: 20}}>
                <Text style={styles.homepagetitle}>
                  {homepagetitledata[0]?.title}
                </Text>
                <View style={{marginTop: 10}}>
                  <FlatList
                    data={sdata.filter(
                      i => i.homePagetitle === homepagetitledata[0]?.title,
                    )}
                    keyExtractor={item => item._id}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item: i}) => (
                      <TouchableOpacity
                        onPress={() => {
                          if (i.category.trim() === 'Packers & Movers') {
                            navigation.navigate('Bottomtab');
                          } else {
                            navigation.navigate('repairing', {cdata: i});
                          }
                        }}
                        style={{paddingHorizontal: 8}}>
                        <View style={styles.servicesimgrow1}>
                          <Image
                            source={{
                              uri: `https://api.vijayhomesuperadmin.in/subcat/${i.subcatimg}`,
                            }}
                            style={styles.servicesimg1}
                          />
                        </View>
                        <Text style={styles.servicestext1}>{i.subcategory}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
            </View>

            {homepagetitledata[1]?.title ? (
              <View style={{backgroundColor: 'white'}}>
                <View style={{margin: 20}}>
                  <Text style={styles.homepagetitle}>
                    {homepagetitledata[1]?.title}
                  </Text>
                  <View style={{marginTop: 10}}>
                    <FlatList
                      data={sdata.filter(
                        i => i.homePagetitle === homepagetitledata[1]?.title,
                      )}
                      keyExtractor={item => item._id}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      renderItem={({item: i}) => (
                        <TouchableOpacity
                          onPress={() => {
                            if (i.category.trim() === 'Packers & Movers') {
                              navigation.navigate('Bottomtab');
                            } else {
                              navigation.navigate('repairing', {cdata: i});
                            }
                          }}
                          style={{paddingHorizontal: 8}}>
                          <View style={styles.servicesimgrow1}>
                            <Image
                              source={{
                                uri: `https://api.vijayhomesuperadmin.in/subcat/${i.subcatimg}`,
                              }}
                              style={styles.servicesimg1}
                            />
                          </View>
                          <Text style={styles.servicestext1}>
                            {i.subcategory}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </View>
              </View>
            ) : null}
            <TouchableOpacity
              onPress={() => navigation.navigate('socialmedia')}
              style={{
                flexDirection: 'row',
                borderWidth: 1,
                borderColor: 'gray',
                padding: 10,
                margin: 15,
                backgroundColor: 'gray',
                borderRadius: 10,
                marginBottom: 100,
              }}>
              <View style={{flex: 0.85, padding: 5}}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 18,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  Connect with us
                </Text>
                <Text style={{color: 'white'}}>
                  Connect with us and get first buy bonus connect for more
                  updates
                </Text>
              </View>
              <TouchableOpacity style={{flex: 0.15}}>
                <Entypo name="chat" size={50} color="black" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
        {/* MODAL FOR OFFERS - UNCHANGED */}
        <Modal
          isVisible={isOfferModalVisible}
          onBackdropPress={() => setOfferModalVisible(false)}
          backdropColor="black"
          backdropOpacity={0.7}
          animationIn="zoomIn"
          animationOut="zoomOut"
          useNativeDriverForBackdrop={true}>
          <View style={styles.offerModalContainer}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setOfferModalVisible(false)}>
              <AntDesign name="closecircle" size={28} color="darkred" />
            </TouchableOpacity>

            {/* Modal Content */}
            <Text style={styles.offerModalTitle}>Independence Day Offers</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {offersData.map((offer, index) => (
                <Animatable.View
                  key={offer.id}
                  animation="fadeInUp"
                  duration={800}
                  delay={index * 150}>
                  <TouchableOpacity
                    style={styles.offerItem}
                    onPress={() => {
                      const target = (sdata || []).find(
                        item =>
                          item.subcategory?.trim().toLowerCase() ===
                          offer.targetSubcategory,
                      );

                      if (target) {
                        setOfferModalVisible(false);
                        navigation.navigate('repairing', {cdata: target});
                      } else {
                        alert('Deal not available at the moment.');
                      }
                    }}>
                    <View style={styles.offerContent}>
                      <Text style={styles.offerTitle}>{offer.title}</Text>
                      <Text style={styles.offerDeal}>{offer.deal}</Text>
                      {offer.coupon && (
                        <View style={styles.couponContainer}>
                          <Text style={styles.couponText}></Text>
                        </View>
                      )}
                    </View>
                    <MaterialIcons
                      name="keyboard-arrow-right"
                      size={24}
                      color="#555"
                    />
                  </TouchableOpacity>
                  {index < offersData.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </Animatable.View>
              ))}
            </ScrollView>
          </View>
        </Modal>

        {/* ================================================================= */}
        {/* MODIFIED SERVICES MODAL (BOTTOM SHEET)                            */}
        {/* ================================================================= */}
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={close}
          onSwipeComplete={close}
          swipeDirection="down"
          style={styles.bottomModal}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          backdropOpacity={0.4}>
          <View style={styles.modalContentContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{SelectedCategory}</Text>
              <TouchableOpacity onPress={close}>
                <AntDesign name="closecircle" size={28} color="#999" />
              </TouchableOpacity>
            </View>

            {postcategorydata.length > 0 ? (
              <FlatList
                data={postcategorydata.sort(
                  (a, b) => parseInt(a.order.trim()) - parseInt(b.order.trim()),
                )}
                numColumns={4}
                keyExtractor={(item, index) => item._id || index.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => {
                      close();
                      navigation.navigate('repairing', {cdata: item});
                    }}
                    style={{
                      flex: 1 / 4,
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      marginBottom: 20,
                    }}>
                    <View>
                      <Image
                        source={{
                          uri: `https://api.vijayhomesuperadmin.in/subcat/${item.subcatimg}`,
                        }}
                        style={{
                          width: 65,
                          height: 65,
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: '#eee',
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        color: 'black',
                        textAlign: 'center',
                        fontFamily: 'Poppins-Medium',
                        marginTop: 8,
                      }}
                      numberOfLines={2}>
                      {item.subcategory}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View style={{height: 250, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="darkred" />
              </View>
            )}
          </View>
        </Modal>
        
        {/* CITY AND APP UPDATE MODALS - UNCHANGED */}
        <Modal isVisible={CityModalVisible}>
          <SafeAreaView
            style={{borderRadius: 20, backgroundColor: 'white', flex: 1}}>
            <Image
              source={require('../../../assets/city.gif')}
              style={{
                width: '100%',
                height: 100,
                borderRadius: 10,
                backgroundColor: 'white',
              }}
            />
            <View style={{flex: 1, paddingTop: 10, overflow: 'hidden'}}>
              <ScrollView contentContainerStyle={styles.modalContainer}>
                {citydata
                  .slice()
                  .sort((a, b) => a.city.localeCompare(b.city))
                  .map((i, index) => (
                    <TouchableOpacity
                      key={i._id}
                      onPress={() => setUserCity(i.city)}
                      style={[
                        styles.cityItem,
                        {
                          backgroundColor:
                            selectedCity === i.city ? 'darkred' : 'white',
                        },
                      ]}>
                      <Image
                        source={cityImages[index + 1]}
                        style={styles.cityImage}
                      />
                      <Text
                        style={{
                          color:
                            selectedCity === i.city
                              ? 'white'
                              : [
                                  'Bangalore',
                                  'Chennai',
                                  'Delhi',
                                  'Gurugram',
                                  'Hyderabad',
                                  'Mumbai',
                                  'Pune',
                                ].includes(i.city)
                              ? 'red'
                              : 'black',
                          marginTop: 3,
                          marginLeft: 5,
                          fontFamily: 'Poppins-Medium',
                          fontSize: 12,
                          marginBottom: 5,
                        }}>
                        {i.city}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>

        <Modal isVisible={appupdateModalVisible}>
          <View style={{borderRadius: 20, backgroundColor: 'white'}}>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Poppins-Medium',
                fontSize: 18,
                textAlign: 'center',
                marginTop: 20,
              }}>
              New update is available
            </Text>
            <Text style={{color: 'grey', textAlign: 'center', margin: 20}}>
              The current version of this application is no longer supported. We
              apologize for any inconvenience we may have caused you.
            </Text>
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity onPress={handleUpdatePress}>
                <Text
                  style={{
                    backgroundColor: 'darkred',
                    color: 'white',
                    padding: 8,
                    borderRadius: 20,
                    marginTop: 20,
                    width: 150,
                    textAlign: 'center',
                    marginBottom: 20,
                  }}>
                  UPDATE NOW
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <AutoUpdate />
    </View>
  );
}

const styles = StyleSheet.create({
  // ORIGINAL STYLES
  container1: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    marginBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 10,
    overflow: 'hidden',
    position: 'relative',
    paddingHorizontal: 10,
  },
  cityItem: {
    flexBasis: '30%',
    margin: 5,
    padding: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  cityImage: {
    width: 55,
    height: 55,
    borderRadius: 25,
    marginBottom: 3,
  },
  card: {},
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 5,
    backgroundColor: 'gray',
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: 'red',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  homepagetitle: {
    color: 'black',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    paddingVertical: 5,
  },
  servicesimgrow: {
    padding: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
  servicesimgrow1: {
    width: 100,
    height: 100,
  },
  servicesimg: {
    width: 65,
    height: 65,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  servicesimg1: {
    width: '100%',
    height: 90,
    borderRadius: 10,
    resizeMode: 'contain',
    marginRight: 5,
  },
  servicestext: {
    color: 'black',
    textAlign: 'center',
    fontSize: 11,
    marginTop: 5,
    fontFamily: 'Poppins-Medium',
  },
  servicestext1: {
    color: 'black',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    fontSize: 12,
    width: 100,
  },
  bcard: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  bannerimg: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  booknow: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'rgb(135, 20, 20)',
    padding: 5,
    borderRadius: 3,
    bottom: -15,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    width: WIDTH,
    height: HEIGHT * 0.25,
    marginTop: 10,
  },
  imageContainer: {
    borderRadius: 10,
    marginHorizontal: 10,
  },
  image: {
    width: WIDTH - 20,
    height: HEIGHT * 0.25,
    borderRadius: 10,
  },
  wrapDot: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dotActive: {
    margin: 3,
    color: 'black',
  },
  dot: {
    margin: 3,
    color: '#ffff',
  },
  trendingText: {
    color: 'darkred',
    fontSize: 28,
    fontFamily: 'Poppins',
    textAlign: 'left',
    marginBottom: 0,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  trendingText1: {
    color: '#f4f2f2',
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    textAlign: 'left',
    marginBottom: 0,
    marginLeft: 8,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover',
  },
  overlayContainer: {
    position: 'absolute',
    top: '25%',
    left: '14%',
    transform: [{translateX: -50}, {translateY: -50}],
    width: '100%',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    width: 400,
    height: 250,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  floatingButton: {
    position: 'absolute',
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    right: 1,
    bottom: 10,
    backgroundColor: '#800000',
    borderRadius: 15,
    elevation: 8,
    shadowColor: 'white',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderColor: 'white',
    borderWidth: 1,
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
  offerModalContainer: {
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 0,
    paddingVertical: 25,
    paddingTop: 45,
    borderRadius: 20,
    position: 'relative',
    maxHeight: '80%',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
  },
  offerModalTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  offerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '100%',
  },
  offerContent: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#2c3e50',
  },
  offerDeal: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: 'darkred',
    marginTop: 4,
  },
  couponContainer: {
    backgroundColor: '#fdeceb',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  couponText: {
    color: 'darkred',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
  separator: {
    height: 1,
    width: '90%',
    backgroundColor: '#e0e0e0',
    alignSelf: 'center',
  },

  // ===============================================
  // NEW STYLES FOR BOTTOM SHEET MODAL
  // ===============================================
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContentContainer: {
    backgroundColor: 'white',
    padding: 16,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: HEIGHT * 0.6, // Set max height to 60% of screen
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: 'black',
  },
});

export default Home;