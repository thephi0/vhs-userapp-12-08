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
  const [visible, setVisible] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isOfferModalVisible, setOfferModalVisible] = useState(false); // <-- NEW STATE

  const [appupdateModalVisible, setappupdateModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [citydata, setcitydata] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);
  const isFocused = useIsFocused(); // Returns true if the screen is focused, false otherwise.
  const [videoPaused, setVideoPaused] = useState(!isFocused); // Initially pause if not focused

  const [version, setVersion] = useState('');

  const [CityModalVisible, setCityModalVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('savecity').then(value => {
      if (value) {
        // If a city is already saved, hide the modal
        setsavecity(value);
        setCityModalVisible(false);
      } else {
        // If no city is saved, show the modal
        setCityModalVisible(true);
      }
    });
  }, []);

  const getversions = async () => {
    let res = await axios.get(
      'https://api.vijayhomeservicebengaluru.in/api/getversions',
    );
    if ((res.status = 200)) {
      const version = res.data?.versions;

      setVersion(version[0]?.version);
    }
  };

  const handleUpdatePress = () => {
    Linking.openURL('https://play.google.com/store/apps/details?id=com.vhs1');
  };

  useEffect(() => {
    spotlightbanner();
  }, []);

  const spotlightbanner = async () => {
    let res = await axios.get(
      'https://api.vijayhomesuperadmin.in/api/userapp/getallbanner',
    );
    if ((res.status = 200)) {
      setSliderImages(res.data?.banner);
    }
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

  const toggleModal = () => {
    setModalVisible(true);
  };

  const close = () => {
    setSelectedCategory('');
    setModalVisible(false);
  };

  useEffect(() => {
    AsyncStorage.getItem('city').then(value => {
      setaddress(value);
    });
    AsyncStorage.getItem('savecity').then(value => {
      setsavecity(value);
    });
  }, []);

  function groupItemsIntoRows(items, itemsPerRow) {
    const rows = [];
    for (let i = 0; i < items.length; i += itemsPerRow) {
      rows.push(items.slice(i, i + itemsPerRow));
    }
    return rows;
  }

  useEffect(() => {
    try {
      getcity();
    } catch (error) {
      console.error('An error occurred in the second useEffect:', error);
    }
  }, []);

  useEffect(() => {
    try {
      fetchData();
    } catch (error) {
      console.error('An error occurred in the third useEffect:', error);
    }
  }, []);

  useEffect(() => {
    try {
      getsubcategory();
    } catch (error) {
      console.error('An error occurred in the fourth useEffect:', error);
    }
  }, [SelectedCategory]);

  useEffect(() => {
    try {
      getbannerimg();
      getcategory();
      getallsubcategory();
      gethomepagetitle();
    } catch (error) {
      console.error('An error occurred in the fifth useEffect:', error);
    }
  }, []);

  useEffect(() => {
    try {
      getservices();
    } catch (error) {
      console.error('An error occurred in the sixth useEffect:', error);
    }
  }, [homepagetitledata]);

  useEffect(() => {
    try {
      setInterval(() => {
        setVisible(!visible);
      }, 2000);
    } catch (error) {
      console.error('An error occurred in the seventh useEffect:', error);
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://api.vijayhomesuperadmin.in/api/userapp/getallbanner',
      );

      if (response.data && response.data.banner) {
        setBannerdata(response.data.banner);
      } else {
        console.error(
          "Error fetching images: API response does not contain 'addbanner' property",
        );
      }
    } catch (error) {
      console.error('No internet');
    }
  };

  const getsubcategory = async () => {
    let res = await axios.post(
      `https://api.vijayhomesuperadmin.in/api/userapp/postappsubcat/`,
      {
        category: SelectedCategory,
      },
    );

    if ((res.status = 200)) {
      setpostcategorydata(res.data?.subcategory);
    }
  };

  const getbannerimg = async () => {
    let res = await axios.get(
      'https://api.vijayhomesuperadmin.in/api/userapp/getallspotlightbanner',
    );
    if ((res.status = 200)) {
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

  const getservices = async () => {
    let res = await axios.get(
      'https://api.vijayhomesuperadmin.in/api/userapp/getappsubcat',
    );
    if (res.status === 200) {
      const data = res.data?.subcategory;
      const filteredData = data.filter(i => {
        const shouldInclude = i.homePagetitle === homepagetitledata[0]?.title;

        return shouldInclude;
      });

      setsdata(res.data?.subcategory);

      setservicedata(filteredData);
      setsecondsdata(
        data.filter(i => i.homePagetitle === homepagetitledata[1]?.title),
      );
    }
  };

  const gethomepagetitle = async () => {
    let res = await axios.get(
      'https://api.vijayhomesuperadmin.in/api/userapp/gettitle',
    );
    if ((res.status = 200)) {
      sethomepagetitledata(res.data?.homepagetitle);
    }
  };

  const getallsubcategory = async () => {
    let res = await axios.get(
      'https://api.vijayhomesuperadmin.in/api/userapp/getappsubcat',
    );
    if ((res.status = 200)) {
      setsubdata(res.data?.subcategory);
    }
  };

  const getcity = async () => {
    let res = await axios.get(
      'https://api.vijayhomesuperadmin.in/api/master/getcity',
    );
    if ((res.status = 200)) {
      setcitydata(res.data?.mastercity);
    }
  };

  const startRefreshTimer = (refreshCallback, interval) => {
    const timer = setInterval(() => {
      refreshCallback();
    }, interval);

    return () => {
      clearInterval(timer);
    };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefresh(true);

    setTimeout(() => {
      setRefresh(false);
    }, 2000);
  }, []);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission Required',
          message:
            'Vijay Home Services needs access to your location to provide location-based services.',
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

  const MyCartItmes = useSelector(state => state.cart);
  const TotalQuantity = MyCartItmes.reduce((accumulator, item) => {
    const quantity = parseInt(item?.qty);
    if (!isNaN(quantity)) {
      return accumulator + quantity;
    } else {
      return accumulator;
    }
  }, 0);

  const [address, setAddress] = useState({address: '', markerCoordinate: {}});
  useEffect(() => {
    Geocoder.init('AIzaSyBF48uqsKVyp9P2NlDX-heBJksvvT_8Cqk');
  }, []);
  useEffect(() => {
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

        console.log('abc', abc);
        setAddress({
          address: abc,
          markerCoordinate: {latitude: latitude, longitude: longitude},
        });
      } catch (error) {
        console.error('Error fetching address: ', error);
      }
    };

    getCurrentLocation();
  }, []);

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
    'varalakshmi kitchen deals'
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
    targetSubcategory: 'varalakshmi home cleaning deals'
  },
  {
    id: 2,
    title: 'Book Bathroom cleaning',
    deal: 'Get Rs 100 OFF',
    coupon: null,
    targetSubcategory: 'varalakshmi bathroom deals'
  },
  {
    id: 3,
    title: 'Book Kitchen cleaning',
    deal: 'Get Rs 200 Off',
    coupon: null,
    targetSubcategory: 'varalakshmi kitchen deals'
  },
];

  useEffect(() => {
    setVideoPaused(!isFocused); // Play when focused, pause when not focused
  }, [isFocused]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor="darkred" barStyle="light-content" />
      <View style={styles.container} key={refresh}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={styles.container}>
            <View style={{height: 500}}>
              <Image
                source={require('../../../assets/pest_control1.png')} // Path to your .mp4 file
                style={styles.backgroundImage} // You can reuse or adapt your backgroundImage style
              />
              {/* You can overlay other content here if needed */}
              {/* e.g., <Text style={styles.overlayText}>Pest Control Services</Text> */}

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
                      // borderWidth: 1,
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
                        // Handle the case when TotalQuantity doesn't exist or is 0
                        // For example, show an alert or perform a different action
                        alert('Please book the service and comeback.');
                        console.log('TotalQuantity is not present or zero');
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

              <View style={{paddingHorizontal: 10, marginTop: 215}}>
  {/* Text for Trending Services */}
  <Text style={styles.trendingText}>Buy 1 Get 1 Free</Text>
  <Text style={styles.trendingText1}>(Limited Period Offer)</Text>

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
        style={{width: 100, height: 131, borderRadius: 5}}
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
        style={{width: 100, height: 131, borderRadius: 5}}
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
        source={require('../../../assets/vp4.png')}
        style={{
          width: 100,
          height: 131,
          borderRadius: 5,
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
                    // fontFamily: 'Poppins-Bold',
                    fontSize: 18,
                    paddingLeft: 20,
                    marginTop: 10,
                  }}>
                  Services By Us
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
                                setSelectedCategory(item.category);
                                toggleModal();
                              }
                            }}
                            style={{
                              flex: 1 / 4,
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: 1,
                            }}>
                            {item ? (
                              <View style={{marginTop: 10}}>
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
                            ) : (
                              <></>
                            )}
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
                    key={index.toString()} // Use index as a key (assuming it's unique)
                    style={styles.imageContainer}
                    onPress={() => {
                      const filteredData = sdata.filter(
                        i => i.subcategory === e.subcategory,
                      );
                      if (filteredData.length > 0) {
                        // Check if filteredData is not empty
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

            {/* Cleaning */}
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
                      cdata: i,
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
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
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
                      resizeMode="cover" // Move resizeMode here
                      loop
                      muted
                      repeat
                      controls={false} // Hide video controls if not needed
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
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {sdata
                      .filter(
                        i => i.homePagetitle === homepagetitledata[0]?.title,
                      ) // Filter based on category
                      .map((i, index) => (
                        <View
                          key={i._id || index}
                          style={{flex: 1, flexDirection: 'row'}}>
                          <TouchableOpacity
                            onPress={() => {
                              if (i.category.trim() === 'Packers & Movers') {
                                navigation.navigate('Bottomtab'); // Uncomment this when needed.
                              } else {
                                navigation.navigate('repairing', {
                                  cdata: i,
                                });
                              }
                            }}
                            style={{
                              flex: 1 / 3, // Each item should take 1/3 of the row width
                              paddingHorizontal: 8, // Add some horizontal spacing between items
                            }}>
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
                        </View>
                      ))}
                  </ScrollView>
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
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}>
                      {sdata
                        .filter(
                          i => i.homePagetitle === homepagetitledata[1]?.title,
                        ) // Filter based on category
                        .map((i, index) => (
                          <View
                            key={i._id || index}
                            style={{flex: 1, flexDirection: 'row'}}>
                            <TouchableOpacity
                              onPress={() => {
                                if (i.category.trim() === 'Packers & Movers') {
                                  navigation.navigate('Bottomtab'); // Uncomment this when needed.
                                } else {
                                  navigation.navigate('repairing', {
                                    cdata: i,
                                  });
                                }
                              }}
                              style={{
                                flex: 1 / 3, // Each item should take 1/3 of the row width
                                paddingHorizontal: 8, // Add some horizontal spacing between items
                              }}>
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
                          </View>
                        ))}
                    </ScrollView>
                  </View>
                </View>
              </View>
            ) : (
              <></>
            )}
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
        {/***************************************************************/}
        {/*           START: FLOATING BUTTON AND OFFER MODAL            */}
        {/***************************************************************/}
         <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setOfferModalVisible(true)}>
          <Text style={styles.floatingButtonText}>VARALAKSHMI OFFERS</Text>
        </TouchableOpacity>

        {/* MODIFIED: The entire Modal is rebuilt for the offers list */}
        <Modal
          isVisible={isOfferModalVisible}
          onBackdropPress={() => setOfferModalVisible(false)}
          backdropColor="black"
          backdropOpacity={0.7}
          animationIn="zoomIn"
          animationOut="zoomOut"
          useNativeDriverForBackdrop={true}>
          
          <View style={styles.offerModalContainer}>
            {/* Close Icon Button (remains the same) */}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setOfferModalVisible(false)}>
              <AntDesign name="closecircle" size={28} color="darkred" />
            </TouchableOpacity>

            {/* Modal Content */}
            <Text style={styles.offerModalTitle}>Varalaksmi Pooja Offers</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* We now map over the offersData array to create the list */}
              {offersData.map((offer, index) => (
                <Animatable.View
                  key={offer.id}
                  animation="fadeInUp" // Each item will fade in and slide up
                  duration={800}
                  delay={index * 150} // Staggered animation for a professional effect
                >
                  <TouchableOpacity
                    style={styles.offerItem}
                     onPress={() => {
                      const target = (sdata || []).find(
                        item => item.subcategory?.trim().toLowerCase() === offer.targetSubcategory
                      );
                      
                      if (target) {
                        setOfferModalVisible(false); // Close the modal
                        navigation.navigate('repairing', { cdata: target });
                      } else {
                        alert('Deal not available at the moment.');
                      }
                    }}
                    >
                    <View style={styles.offerContent}>
                      <Text style={styles.offerTitle}>{offer.title}</Text>
                      <Text style={styles.offerDeal}>{offer.deal}</Text>
                      {/* This part only shows if a coupon code exists */}
                      {offer.coupon && (
                        <View style={styles.couponContainer}>
                          <Text style={styles.couponText}>
                           
                          </Text>
                        </View>
                      )}
                    </View>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color="#555" />
                  </TouchableOpacity>
                  {/* Add a separator between items, but not after the last one */}
                  {index < offersData.length - 1 && <View style={styles.separator} />}
                </Animatable.View>
              ))}
            </ScrollView>
          </View>
        </Modal>
        {/***************************************************************/}
        {/*            END: FLOATING BUTTON AND OFFER MODAL             */}
        {/***************************************************************/}

        <Modal isVisible={isModalVisible}>
          <TouchableOpacity onPress={close}>
            <AntDesign
              name="closecircleo"
              color="darkred"
              size={30}
              style={{
                width: 30,
                justifyContent: 'flex-end',
                alignSelf: 'flex-end',
                textAlign: 'right',
                marginTop: 10,
                backgroundColor: 'white',
                zIndex: 11,
                borderRadius: 50,
              }}
            />
          </TouchableOpacity>

          <View style={{backgroundColor: 'white'}}>
            <Image
              source={require('../../../assets/city.gif')}
              style={{
                width: '100%',
                height: 100,
                borderRadius: 10,
                backgroundColor: 'white',
                position: 'fixed',
                obejctFit: 'cover',

                paddingBottom: 10,
              }}
              repeat={true}
              muted={true}
            />

            {postcategorydata.length > 0 ? (
              <FlatList
                data={postcategorydata.sort(
                  (a, b) => parseInt(a.order.trim()) - parseInt(b.order.trim()),
                )}
                numColumns={4}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      setSelectedCategory('');
                      navigation.navigate('repairing', {cdata: item});
                    }}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      margin: 5,
                      padding: 3,
                      paddingBottom: 10,
                      paddingTop: 10,
                    }}>
                    <View>
                      <Image
                        source={{
                          uri: `https://api.vijayhomesuperadmin.in/subcat/${item.subcatimg}`,
                        }}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: 'lightgrey',
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 10,
                        color: 'black',
                        textAlign: 'left',
                        height: 'auto',
                        fontFamily: 'Poppins-Medium',
                      }}>
                      {item.subcategory}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View>
                <ActivityIndicator size="large" color="darkred" />
              </View>
            )}
          </View>
        </Modal>
        <>
          <StatusBar backgroundColor="darkred" barStyle="light-content" />

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
                  position: 'fixed',
                  obejctFit: 'cover',
                }}
                repeat={true}
                muted={true}
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
                        {/* Circular Image */}
                        <Image
                          source={cityImages[index + 1]} // Dynamically load city images
                          style={styles.cityImage}
                        />
                        {/* City Name */}
                        <Text
                          style={{
                            color:
                              selectedCity === i.city
                                ? 'white' // White font when selected
                                : [
                                    'Bangalore',
                                    'Chennai',
                                    'Delhi',
                                    'Gurugram',
                                    'Hyderabad',
                                    'Mumbai',
                                    'Pune',
                                  ].includes(i.city)
                                ? 'red' // Red font for specific cities when not selected
                                : 'black', // Default font color for other cities
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
        </>

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
            <Text style={{color: 'grey', textAlign: 'center', marginTop: 20}}>
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
    flexBasis: '30%', // Set to 48% for 2 cities per row with some spacing
    margin: 5,
    padding: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column', // Stack image and text vertically
  },
  cityImage: {
    width: 55, // Adjust size as needed
    height: 55, // Adjust size as needed
    borderRadius: 25, // Makes the image circular
    marginBottom: 3, // Space between image and text
  },
  card: {
    // width: windowWidth,
  },
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
    backgroundColor: 'red', // Customize the active indicator color
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  lottie: {
    width: 100,
    height: 100,
  },

  row: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 15,
  },
  textinput: {
    margin: 15,
    borderRadius: 10,
    paddingLeft: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    fontSize: 16,
  },
  textinputicon: {
    position: 'absolute',
    top: 27,
    marginLeft: 13,
    paddingLeft: 10,
  },
  homepagetitle: {
    color: 'black',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    paddingVertical: 5,
  },
  elevation: {
    elevation: 2,
  },
  row1: {
    backgroundColor: 'white',
    marginTop: 10,
    flex: 1,
  },
  servicesimgrow: {
    // backgroundColor: "#e8f0fe75",
    padding: 1,
    borderRadius: 5,
    // width: 80,
    // height: 80,
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
    // fontWeight: "bold",
    textAlign: 'center',
    fontSize: 11,
    // height: 30,
    marginTop: 5,
    fontFamily: 'Poppins-Medium',
  },
  servicestext1: {
    color: 'black',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    fontSize: 12,
    // height: ,
    width: 100,
  },
  wrow: {
    backgroundColor: 'white',
    padding: 20,
    flex: 0.5,
    borderRadius: 5,
    width: 250,
    marginBottom: 5,
  },
  wrow1: {
    backgroundColor: 'white',
    padding: 20,
    flex: 0.5,
    borderRadius: 5,
    width: 250,
    marginLeft: 10,
    marginBottom: 5,
  },
  helpimg: {
    width: 60,
    height: 60,
    marginTop: 70,
    borderRadius: 50,
  },
  homeimg: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  row2: {
    backgroundColor: '#a61717',
    marginTop: 20,
  },
  listTab: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    marginTop: 10,
  },
  btnTab: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'grey',
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 10,
    marginRight: 10,
    width: 80,
    justifyContent: 'center',
    // width: Dimensions.get('window').width / 3.5,
  },

  textTab: {
    fontSize: 12,
  },
  btnTabActive: {
    borderColor: 'red',
  },
  textTabActive: {
    color: 'red',
  },
  itemcontainer: {
    flexDirection: 'row',
    paddingVertical: 15,
  },
  filtertext: {
    position: 'absolute',
    left: 33,
    fontSize: 12,
    color: 'black',
  },
  filtericon: {
    position: 'absolute',
    bottom: 5,
    right: 35,
    color: 'white',
    fontSize: 30,
  },
  filterimg: {
    width: 130,
    height: 130,
    borderRadius: 10,
  },
  filtercontainer: {
    flex: 0.5,
    textAlign: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    paddingLeft: 40,
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
  },
  textinput1: {
    // backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#eee',
    width: '100%',
    fontSize: 16,
    marginTop: 20,
    paddingLeft: 10,
    borderRadius: 5,
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
  hrtag: {
    height: 1,
    backgroundColor: 'lightgray',
    margin: 15,
  },
  booknow: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'rgb(135, 20, 20)',
    padding: 5,
    borderRadius: 3,
    bottom: -15, // Adjust this value to control the distance from the bottom
    alignSelf: 'center', // Center the view horizontally
    alignItems: 'center', // Center the text horizontally within the view
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    width: '100%',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowRadius: 4,
    elevation: 5,
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
  scrollView: {
    width: WIDTH,
    height: HEIGHT * 0.25,
    marginTop: 10,
  },
  imageContainer: {
    borderRadius: 10,
    marginHorizontal: 10, // Adjust this value to set the desired gap on both sides
  },
  image: {
    width: WIDTH - 20, // Adjust this value to account for the gap on both sides
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
  video: {
    position: 'absolute', // Position the video behind content
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: -1, // Push the video behind other content
  },

  trendingText: {
    color: 'darkred', // Set text color to white
    fontSize: 28, // Set font size to 18px
    fontFamily: 'Poppins', // Optionally make it bold
    textAlign: 'left', // Center the text
    marginBottom: 0, // Add some spacing below the text
    marginLeft: 10, // Add some spacing below the text
    fontWeight: 'bold', // Make the text bold
  },
  trendingText1: {
    color: 'darkred', // Set text color to white
    fontSize: 12, // Set font size to 18px
    fontFamily: 'Poppins-Medium', // Optionally make it bold
    textAlign: 'left', // Center the text
    marginBottom: 0, // Add some spacing below the text
    marginLeft: 85, // Add some spacing below the text
  },
  backgroundImage: {
    width: '100%', // Set image to fill the width of the container
    height: '100%', // Set image to fill the height of the container
    position: 'absolute', // Ensures it acts as a background
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
  overlayGif: {
    width: '100%',
    height: 'auto',
  },
  webview: {
    width: 400, // Adjust width
    height: 250, // Adjust height
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  container1: {
    flex: 1,
    // justifyContent: 'center', // Optional: if you want to center video if it's smaller
    // alignItems: 'center',    // Optional
  },
  backgroundVideo: {
    // If you want it to be a full-screen background:
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  // --- START: NEW STYLES FOR FLOATING BUTTON AND MODAL ---
  floatingButton: {
    position: 'absolute',
    width: 150, // Wider to fit text
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    right: 1, // Adjusted position
    bottom: 10, // Adjusted position
    backgroundColor: '#800000', // Changed to orange
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
    fontFamily: 'Poppins-Bold', // Use a bold font if available
  },

  // MODIFIED: Styles for the new offer modal
  offerModalContainer: {
    backgroundColor: '#f7f7f7', // A light, clean background
    paddingHorizontal: 0, // Padding will be on items
    paddingVertical: 25,
    paddingTop: 45, // Make space for the close button
    borderRadius: 20,
    position: 'relative',
    maxHeight: '80%', // Ensure modal doesn't take up the whole screen
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
    paddingHorizontal: 20, // Give title padding
  },

  // NEW: Styles for each individual offer item
  offerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '100%',
  },
  offerContent: {
    flex: 1, // Takes up all available space
  },
  offerTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#2c3e50', // A dark, soft black
  },
  offerDeal: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: 'darkred',
    marginTop: 4,
  },
  couponContainer: {
    backgroundColor: '#fdeceb', // A very light red
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 8,
    alignSelf: 'flex-start', // Important: makes the background only as wide as the text
  },
  couponText: {
    color: 'darkred',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
  separator: {
    height: 1,
    width: '90%',
    backgroundColor: '#e0e0e0', // A light grey line
    alignSelf: 'center',
  },
  // --- END: NEW STYLES ---
});
export default Home;