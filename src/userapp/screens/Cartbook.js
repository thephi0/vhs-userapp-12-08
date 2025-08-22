import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  BackHandler,
  PermissionsAndroid,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  Pressable,
  Platform, // Added for KeyboardAvoidingView behavior
} from 'react-native';

import {useFCMToken} from '../../ApiServices/FCMtoken';

import {Checkbox} from 'react-native-paper';
import _debounce from 'lodash/debounce';
import Modal from 'react-native-modal';
import axios from 'axios';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RadioButton} from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import {useRoute} from '@react-navigation/native';
import WebView from 'react-native-webview';
import {Calendar} from 'react-native-calendars';
import LottieView from 'lottie-react-native';
import {
  addToCart,
  addToCart1,
  removeMyCartItem,
  clearCart,
} from './Redux1/MyCartSlice';
import {deleteMyCartItem} from './Redux1/MyCartSlice';
import {
  addToCartaddon,
  addToCart1addon,
  removeMyCartItemaddon,
  clearCartaddon,
} from './Redux/MyCartSlice';
import {deleteMyCartItemaddon} from './Redux/MyCartSlice';
import BottomSheet from 'react-native-gesture-bottom-sheet';
import MapView, {Marker} from 'react-native-maps';
import {useDispatch} from 'react-redux';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Geolocation from '@react-native-community/geolocation';
import Loader from './Loader';

function Cartbook({navigation}) {
  // --- START: Hardcoded Blocking Rules ---
  const BLOCKED_DATE = '2025-06-07'; // Dynamically gets tomorrow's date
  const BLOCKED_CITIES = ['Bangalore', 'Hyderabad', 'Chennai'];
  const BLOCKED_CATEGORY_NAME = 'Cleaning';
  // --- END: Hardcoded Blocking Rules ---
  const scrollViewRef = useRef(null);
  const MyCartItmes = useSelector(state => state.cart);
  const MyCartaddonItmes = useSelector(state => state.addon);
  const [locationModalVisible, setlocationModalVisible] = useState(false);
  const fcmtoken = useFCMToken();
  const dispatch = useDispatch();

  console.log('fcmtoken cartbook', fcmtoken);

  const [Carttotal, setCarttotal] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);

  useEffect(() => {
    const newCarttotal = MyCartItmes.reduce((accumulator, item) => {
      const offerPrice = parseFloat(item?.offerprice);
      const quantity = parseInt(item?.qty);

      if (!isNaN(offerPrice) && !isNaN(quantity)) {
        const subtotal = offerPrice * quantity;

        return accumulator + subtotal;
      } else {
        return accumulator;
      }
    }, 0);

    setCarttotal(newCarttotal);
    setCouponDiscount(newCarttotal);
  }, [MyCartItmes]);

  const Carttotal1 = MyCartItmes.reduce((accumulator, item) => {
    const offerPrice = parseFloat(item?.planPrice);
    const quantity = parseInt(item?.qty);

    if (!isNaN(offerPrice) && !isNaN(quantity)) {
      const subtotal = offerPrice * quantity;

      return accumulator + subtotal;
    } else {
      return accumulator;
    }
  }, 0);

  const CartSavedtotal = MyCartItmes.reduce((accumulator, item) => {
    const offerPrice = parseFloat(item?.offerprice);
    const planPrice = parseFloat(item?.planPrice);
    const quantity = parseInt(item?.qty);

    if (!isNaN(offerPrice) && !isNaN(quantity)) {
      const subtotal = planPrice * quantity - offerPrice * quantity;

      return accumulator + subtotal;
    } else {
      return accumulator;
    }
  }, 0);

  const total1 = MyCartaddonItmes?.reduce((accumulator, item) => {
    const subtotal = parseFloat(item.oferprice) * item.qty;
    return accumulator + subtotal;
  }, 0);

  const totaladdon1 = MyCartaddonItmes?.reduce((accumulator, item) => {
    const subtotal = parseFloat(item.planPrice) * item.qty;
    return accumulator + subtotal;
  }, 0);

  const FreqensaveAmt1 = MyCartaddonItmes?.reduce((accumulator, item) => {
    const subtotal =
      (parseFloat(item.planPrice) - parseFloat(item.oferprice)) * item.qty;

    return accumulator + subtotal;
  }, 0);

  const [isSelected, setSelection] = useState(false);
  const [useLortti, setUseLortti] = useState(false);

  const handlePress = () => {
    setUseLortti(true);
    setSelection(!isSelected);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setUseLortti(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isSelected]);

  const [ModalVisible1, setModalVisible1] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [cancelationModel, setcancelationModel] = useState(false);
  const [savecity, setsavecity] = useState('');

  // =========== START: MODIFICATION - New modal states ===========
  const [isDateTimeModalVisible, setDateTimeModalVisible] = useState(false);
  const [isAddressModalVisible, setAddressModalVisible] = useState(false);
  // =========== END: MODIFICATION ===========

  const [showDatePickerSingle, setShowDatePickerSingle] = useState(false);
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const [checked, setChecked] = useState('');
  const [address, setaddress] = useState('');

  const [voucherdata, setvoucherdata] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [addondata, setaddondata] = useState([]);
  const bottomSheet = useRef();
  const route = useRoute();
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
  const [user, setuser] = useState('');
  const [value, setuser1] = useState('');

  const today = moment();
  const tomorrow = moment().add(1, 'days');
  const nextTwoDays = moment().add(2, 'days');

  const [date, setDate] = useState(false);
  const [Coupancode, setCoupancode] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [Fulladd, setFulladd] = useState('');

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calenderModel, setcalenderModel] = useState(false);

  const [customerName, setcustomerName] = useState(user?.customerName);
  const [email, setemail] = useState(user?.email);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const [whatsappdata, setWhatsappData] = useState(null);
  const [templateName, setTemplateName] = useState('Service confirmed');

  useEffect(() => {
    getWhatsappTemplate();
  }, [templateName]);

  const getWhatsappTemplate = async () => {
    try {
      const res = await axios.get(
        `https://newapi.vijayhomeservicebengaluru.in/api/whatsapp-templates/get-template/${templateName}`,
      );

      if (res.status === 200) {
        setWhatsappData(res.data?.content);
      }
    } catch (error) {
      console.error('Error fetching WhatsApp template:', error);
    }
  };

  useEffect(() => {
    getaddon();
  }, []);

  const getaddon = async () => {
    let res = await axios.get(
      'https://api.vijayhomesuperadmin.in/api/userapp/getServiceAddOns',
    );
    if ((res.status = 200)) {
      setaddondata(
        res.data?.AddOns.filter(
          i => i.addOnsCategory === MyCartItmes[0]?.service?.serviceName,
        ),
      );
    }
  };
  const handleaddon = item => {
    dispatch(addToCartaddon(item));
  };
  const handleaddon1 = item => {
    dispatch(addToCart1addon(item));
  };
  console.log('user-----', user);

  const addcustomeraddresss = async e => {
    // Simplified check, as button is disabled
    if (!canSubmitNewAddress) {
      Alert.alert('Incomplete Information', 'Please fill all required fields.');
      return;
    }

    try {
      const config = {
        url: '/address',
        method: 'post',
        baseURL:
          'https://newapi.vijayhomeservicebengaluru.in/api/customer-address',
        headers: {'Content-Type': 'application/json'},
        data: {
          user_id: user?.id,
          address: address,
          save_as: saveAs,
          landmark: landmark,
          other_data: otherData,
          platno: platNo,
          marker_coordinate: markerCoordinate,
        },
      };

      const response = await axios(config);

      if (response.status === 201) {
        setFulladd(response.data);
        closeModal();
        setmapModalVisible(false);
        setModalVisible(false);
        getaddress();
        // After adding address, close the address modal and open payment sheet
        setAddressModalVisible(false);
        bottomSheet.current.show();
      }
    } catch (error) {
      console.error(error);
      alert(
        'Address not added, Please delete one address to update another address ',
      );
    }
  };
  console.log('user id', user?.id);

  const [customeraddress, setcustomerAddressdata] = useState([]);
  useEffect(() => {
    if (user?.id) {
      getaddress();
    }
  }, [modalVisible, user]);

  const getaddress = async () => {
    let res = await axios.get(
      `https://newapi.vijayhomeservicebengaluru.in/api/customer-address/address/user/${user?.id}`,
    );
    if (res.status === 200) {
      setcustomerAddressdata(res.data);
    }
  };

  useEffect(() => {
    getwalletdeduction();
  }, []);

  const [walletdeductiondata, setwalletdeductiondata] = useState([]);

  const getwalletdeduction = async () => {
    let res = await axios.get(
      `https://api.vijayhomesuperadmin.in/api/getwalletDisc/`,
    );
    if ((res.status = 200)) {
      setwalletdeductiondata(res.data?.walletDisc);
    }
  };

  const [selectedLocation, setSelectedLocation] = useState({
    latitude: Fulladd?.markerCoordinate?.latitude,
    longitude: Fulladd?.markerCoordinate?.longitude,
  });

  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: selectedLocation.latitude,
    longitude: selectedLocation.longitude,
  });

  const handleSelectedAddress = i => {
    setChecked(i);
    setFulladd(i);
    setMarkerCoordinate({
      latitude: i.markerCoordinate?.latitude,
      longitude: i.markerCoordinate?.longitude,
    });
    // After selecting an address, close the modal and open the payment sheet
    setAddressModalVisible(false);
    bottomSheet.current.show();
  };

  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      });
    }
  }, [selectedLocation]);

  const toda = new Date();

  const handleBackButton = () => {
    navigation.navigate('cart');
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );

    return () => {
      backHandler.remove();
    };
  }, [navigation]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('cart');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const handleDayPress = day => {
    setSelectedDate(day.dateString);
    closeCalendar();
    setDate(true); // To show the selected date
  };

  const openCalendar = () => {
    setIsCalendarOpen(true);
    setcalenderModel(true);
  };

  const closeCalendar = () => {
    setIsCalendarOpen(false);
    setcalenderModel(false);
  };

  const handleTabClick = date => {
    const formattedDate = date.format('YYYY-MM-DD');
    setSelectedDate(formattedDate);
    setDate(false); // Reset calendar date view
    console.log('Selected date:', formattedDate);
  };

  const isTabActive = tab => {
    return selectedDate === tab;
  };

  const deleteAllCartItems = () => {
    MyCartItmes.forEach(item => {
      dispatch(deleteMyCartItem({id: item.id}));
    });
  };

  const deleteAllCartaddonItems = () => {
    MyCartaddonItmes.forEach(item => {
      dispatch(deleteMyCartItemaddon({id: item.id}));
    });
  };
  const handle = item => {
    dispatch(addToCart1(item));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const addressData = await AsyncStorage.getItem('address');
        console.log('addressData', addressData);

        if (userData) {
          setuser(JSON.parse(userData));
          setuser1(JSON.parse(userData));
        }

        if (addressData) {
          setFulladd(JSON.parse(addressData));
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchData();
  }, []);

  const [vijay, setVijay] = useState('');
  useEffect(() => {
    const fetchData1 = async () => {
      try {
        const userData = await AsyncStorage.getItem('usedVoucherCodes');
        if (userData) {
          setVijay(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchData1();
  }, []);

  const joinedNames = MyCartItmes.map(item => {
    const serviceName = item.service?.serviceName || '';
    return `${serviceName}+${item.planName}(${item.qty})`;
  });
  const joinedaddonNames = MyCartaddonItmes.map(item => {
    const serviceName = item.planName || '';
    return `${item.planName}(${item.qty})`;
  });

  const joinedPlanNames = joinedNames.join(', ');
  const joinedPlanaddonNames = joinedaddonNames.join(', ');

  const treatmentdata = MyCartItmes.map(item => item.service?.serviceName);

  const abc1 = treatmentdata.join(', ');
  const joinedServiceNames = abc1;

  useEffect(() => {
    getvoucher();
  }, []);

  const getvoucher = async () => {
    let res = await axios.get(
      'https://api.vijayhomesuperadmin.in/api/userapp/getvoucher',
    );
    if (res.status === 200) {
      const uniqueCategories = Array.from(
        new Set(MyCartItmes.map(item => item.service?.category)),
      );

      const filteredVoucherData = res.data?.voucher.filter(
        i => i.category === MyCartItmes[0]?.category,
      );

      setvoucherdata(filteredVoucherData);
    }
  };

  const [validationMessage, setValidationMessage] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const applyCouponCode = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);

      if (user.voucherCode === voucherCode) {
        alert('Coupon code already applied');
        return Carttotal;
      }

      const appliedCoupon = voucherdata.find(
        item => item.voucherCode === voucherCode,
      );

      if (appliedCoupon) {
        const discountPercentageValue = parseInt(
          appliedCoupon.discountPercentage,
          10,
        );
        const discountAmount = (discountPercentageValue / 100) * Carttotal;
        const getResults = Carttotal - discountAmount;

        setCouponDiscount(getResults);
        setValidationMessage('');
        setAppliedCoupon(appliedCoupon);

        user.voucherCode = voucherCode;
        await AsyncStorage.setItem('user', JSON.stringify(user));

        return getResults;
      } else {
        setValidationMessage('Invalid coupon');
        setAppliedCoupon(null);
        setCouponDiscount(Carttotal);
        return Carttotal;
      }
    } else {
      console.error('User data not found in AsyncStorage');
      alert('User data not found. Please log in or create a user account.');
      return Carttotal;
    }
  };

  const handleSlotClick1 = (index, startTime) => {
    setSelectedSlotIndex(index);
    setSelectedSlot(`${startTime}`);
  };

  const filteredData =
    MyCartItmes[0]?.service?.store_slots?.filter(
      item => item.slotCity === savecity,
    ) || [];

  const now = new Date();
  const filteredData1 = filteredData.filter(item => {
    try {
      const currentDateISO = now.toISOString().split('T')[0];

      const dateTimeString = `${currentDateISO}T${item.startTime
        .split('-')[0]
        .trim()}`;

      const startTime = moment(dateTimeString, 'YYYY-MM-DDThh:mmA');

      if (!startTime.isValid()) {
        return false;
      }

      const startTimeDate = startTime.toDate();

      const timeDifferenceInHours = (startTimeDate - now) / (1000 * 60 * 60);

      return timeDifferenceInHours >= 2;
    } catch (error) {
      console.error('Error parsing date:', error);
      return false;
    }
  });

  const renderSlots = () => {
    // --- START: HARDCODED BLOCKING LOGIC ---
    const currentCategory = MyCartItmes[0]?.service?.category;

    const isDateBlocked = selectedDate === BLOCKED_DATE;
    const isCityBlocked = BLOCKED_CITIES.map(c => c.toLowerCase()).includes(
      savecity?.toLowerCase(),
    );
    const isCategoryBlocked =
      currentCategory?.toLowerCase() === BLOCKED_CATEGORY_NAME.toLowerCase();

    if (isDateBlocked && isCityBlocked && isCategoryBlocked) {
      return (
        <View style={{padding: 20, alignItems: 'center'}}>
          <Text
            style={{
              color: 'darkred',
              fontSize: 14,
              fontFamily: 'Poppins-Medium',
              textAlign: 'center',
            }}>
            Slots Full. Please Select Another Date
          </Text>
        </View>
      );
    }
    // --- END: HARDCODED BLOCKING LOGIC ---
    const currentDate = new Date();
    const dateToCompare = new Date(selectedDate);

    let slots;

    if (currentDate.toDateString() === dateToCompare.toDateString()) {
      slots = filteredData1 || [];
    } else {
      slots = filteredData || [];
    }

    slots.sort((a, b) => {
      const timeA = moment(a.startTime, 'hh:mm A');
      const timeB = moment(b.startTime, 'hh:mm A');
      if (timeA.isBefore(timeB)) return -1;
      if (timeA.isAfter(timeB)) return 1;
      return 0;
    });

    const morningSlots = slots.filter(slot => {
      const hour = moment(slot.startTime, 'hh:mm A').hour();
      return hour < 12;
    });

    const afternoonSlots = slots.filter(slot => {
      const hour = moment(slot.startTime, 'hh:mm A').hour();
      return hour >= 12;
    });

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {morningSlots.length > 0 && (
          <View style={styles.slotSection}>
            <View style={styles.slotHeader}>
              <Feather name="sun" size={20} color="#777" />
              <Text style={styles.slotHeaderText}>Morning</Text>
            </View>
            <View style={styles.slotGrid}>
              {morningSlots.map((slot, index) => (
                <TouchableOpacity
                  key={`morning-${index}`}
                  onPress={() =>
                    handleSlotClick1(index, `${slot.startTime}`)
                  }
                  style={[
                    styles.slotButton1,
                    selectedSlot === `${slot.startTime}` &&
                      styles.selectedSlotButton,
                  ]}>
                  <Text
                    style={[
                      styles.slotButtonText,
                      selectedSlot === `${slot.startTime}` &&
                        styles.selectedSlotButtonText,
                    ]}>
                    {slot.startTime}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {afternoonSlots.length > 0 && (
          <View style={styles.slotSection}>
            <View style={styles.slotHeader}>
              <Feather name="sunset" size={20} color="#777" />
              <Text style={styles.slotHeaderText}>Afternoon</Text>
            </View>
            <View style={styles.slotGrid}>
              {afternoonSlots.map((slot, index) => (
                <TouchableOpacity
                  key={`afternoon-${index}`}
                  onPress={() =>
                    handleSlotClick1(
                      morningSlots.length + index,
                      `${slot.startTime}`,
                    )
                  }
                  style={[
                    styles.slotButton,
                    selectedSlot === `${slot.startTime}` &&
                      styles.selectedSlotButton,
                  ]}>
                  <Text
                    style={[
                      styles.slotButtonText,
                      selectedSlot === `${slot.startTime}` &&
                        styles.selectedSlotButtonText,
                    ]}>
                    {slot.startTime}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    );
  };

  const calculateExpiryDate = (selectedDate, servicePeriod) => {
    let monthsToAdd = 0;

    if (servicePeriod === 'monthly') {
      monthsToAdd = 1;
    } else if (servicePeriod === 'quart') {
      monthsToAdd = 3;
    } else if (servicePeriod === 'half') {
      monthsToAdd = 6;
    } else if (servicePeriod === 'year') {
      monthsToAdd = 12;
    }

    const expiryDate = moment(selectedDate)
      .add(monthsToAdd, 'months')
      .format('YYYY-MM-DD');

    return expiryDate;
  };

  const servicePeriod = 1;
  const serviceFrequency = 1;
  const expiryDate = calculateExpiryDate(selectedDate, servicePeriod);
  const sDate = moment(selectedDate, 'YYYY-MM-DD');
  const eDate = moment(expiryDate, 'YYYY-MM-DD');

  const totalDays = Math.ceil(eDate.diff(sDate, 'days'));
  const interval = Math.ceil(totalDays / serviceFrequency);

  const dividedDates = [];

  const sf = serviceFrequency ? serviceFrequency : '1';
  for (let i = 0; i < sf; i++) {
    const date = sDate
      .clone()
      .add(interval * i, 'days')
      .format('YYYY-MM-DD');
    dividedDates.push(date);
  }

  const dividedamtCharges = [Carttotal];

  const sAmtDate = moment(selectedDate, 'YYYY-MM-DD');
  const eamtDate = moment(selectedDate, 'YYYY-MM-DD');
  const amtFrequency = 1;
  const totalamtDays = Math.ceil(eamtDate.diff(sAmtDate, 'days'));
  const intervalamt = Math.ceil(totalamtDays / amtFrequency);

  const dividedamtDates = [];

  for (let i = 0; i < amtFrequency; i++) {
    const date = sDate
      .clone()
      .add(intervalamt * i, 'days')
      .format('YYYY-MM-DD');
    dividedamtDates.push(date);
  }

  let discountAmount = 0;

  const vAmount = user?.wAmount;

  const dis = walletdeductiondata[0]?.Discount;
  discountAmount = vAmount <= dis ? vAmount : (vAmount * dis) / 100;

  const walletdetailsAdd = async a => {
    try {
      const config = {
        url: '/customer-wallet//wallet/add',
        method: 'post',
        baseURL: 'https://newapi.vijayhomeservicebengaluru.in/api',
        headers: {'content-type': 'application/json'},
        data: {
          user_id: user?.id,
          description: 'Purchase the service',
          wamt: discountAmount,
        },
      };
      await axios(config).then(function (response) {
        if (response.status === 200) {
        }
      });
    } catch (error) {
      console.log(error.response.data.error);
    }
  };

  const [mapModalVisible, setmapModalVisible] = useState(false);

  const mapModal = () => {
    setaddress('');
    setPlatNo('');
    setLandmark('');
    setsaveAs('');
    setotherData('');
    setIsHomeClicked(false);
    setIsOthersClicked(false);
    setmapModalVisible(true);
    // Keep the address modal open when opening the map
    // setAddressModalVisible(false);
  };

  const [storagedata, setStoragedata] = useState([]);
  const [platNo, setPlatNo] = useState('');
  const [landmark, setLandmark] = useState('');
  const [otherData, setotherData] = useState('');

  const [saveAs, setsaveAs] = useState('');

  const [isHomeClicked, setIsHomeClicked] = useState(false);
  const [isOthersClicked, setIsOthersClicked] = useState(false);

  const handleHomePress = () => {
    setIsHomeClicked(true);
    setIsOthersClicked(false);
    setsaveAs('Home');
  };

  const handleOthersPress = () => {
    setIsHomeClicked(false);
    setIsOthersClicked(true);
    setsaveAs('other');
  };

  const homeButtonStyle = {
    borderColor: isHomeClicked ? 'orange' : 'black',
    borderWidth: 1,
    padding: 6,
    marginRight: 10,
    borderRadius: 5,
    width: 70,
    textAlign: 'center',
    backgroundColor: 'white',
  };

  const othersButtonStyle = {
    borderColor: isOthersClicked ? 'orange' : 'black',
    borderWidth: 1,
    padding: 6,
    borderRadius: 5,
    width: 70,
  };

  useEffect(() => {
    AsyncStorage.getItem('locationData').then(value => {
      setStoragedata(value);
    });
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
        return true;
      } else {
        console.log('LOCATION permission denied');
        return false;
      }
    } catch (err) {
      console.warn('Error requesting location permission:', err);
      return false;
    }
  };

  const searchLocation = async query => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=YOUR_GOOGLE_API_KEY`,
      );

      if (response.data && response.data.results.length > 0) {
        const result = response.data.results[0];
        const {geometry, formatted_address} = result;

        const lat = geometry.location.lat;
        const lng = geometry.location.lng;

        setSelectedLocation({latitude: lat, longitude: lng});
        setMarkerCoordinate({latitude: lat, longitude: lng});

        setaddress(formatted_address);

        setIsModalVisible(true);
      } else {
        setaddress('Location not found.');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      Alert.alert('Error', 'Failed to search for location. Please try again.');
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const getLocation = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Location Permission Required',
        'Please grant location permission to use this feature.',
      );
      return;
    }

    setModalVisible1(true);
    Geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        setSelectedLocation({latitude: lat, longitude: long});
        setMarkerCoordinate({latitude: lat, longitude: long});

        getGeocodeFromCoordinates(lat, long);
        setModalVisible1(false);
      },
      error => {
        console.error('Error getting location:', error.message);
        setModalVisible1(false);
        Alert.alert('Error', 'Failed to fetch location. Please try again.');
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000},
    );
  };

  const getGeocodeFromCoordinates = async (lat, long) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=YOUR_GOOGLE_API_KEY`,
      );

      if (response.data && response.data.results.length > 0) {
        const formattedAddress = response.data.results[0].formatted_address;
        setaddress(formattedAddress);
      } else {
        setaddress('No address found for the given coordinates.');
      }
    } catch (error) {
      console.error('Error fetching geocode:', error);
      Alert.alert('Error', 'Failed to fetch address. Please try again.');
    } finally {
      setModalVisible1(false);
    }
  };

  const handleMarkerMove = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_API_KEY`,
      );

      if (response.data && response.data.results.length > 0) {
        const formattedAddress = response.data.results[0].formatted_address;
        setaddress(formattedAddress);
      } else {
        setaddress('Location not found.');
      }
    } catch (error) {
      console.error('Error reverse geocoding location:', error);
      Alert.alert('Error', 'Failed to fetch address. Please try again.');
    }
  };

  useEffect(() => {
    const fetchSavedData = async () => {
      const city = await AsyncStorage.getItem('savecity');
      const locationData = await AsyncStorage.getItem('locationData');

      if (city) setsavecity(city);
      if (locationData) {
        try {
          const parsedData = JSON.parse(locationData);
          setFulladd(parsedData);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      }
    };

    fetchSavedData();
  }, [mapModalVisible]);

  const [canSubmitNewAddress, setCanSubmitNewAddress] = useState(false);

  useEffect(() => {
    const isMapAddressValid =
      address.trim() !== '' &&
      address.trim() !== 'Location not found.' &&
      address.trim() !== 'No address found for the given coordinates.';

    const isSaveAsComplete =
      saveAs.trim() !== '' &&
      (saveAs === 'Home' || (saveAs === 'other' && otherData.trim() !== ''));

    const isFormValid =
      isMapAddressValid &&
      platNo.trim() !== '' &&
      landmark.trim() !== '' &&
      isSaveAsComplete;

    setCanSubmitNewAddress(isFormValid);
  }, [address, platNo, landmark, saveAs, otherData]);

  const debouncedRegionChange = _debounce(region => {
    setMarkerCoordinate({
      latitude: region.latitude,
      longitude: region.longitude,
    });
    handleMarkerMove(region.latitude, region.longitude);
  }, 500);

  const handleemail = text => {
    setemail(text);
  };
  const handlecustomer = text => {
    setcustomerName(text);
  };

  const makeApiCall = async (selectedResponse, contactNumber) => {
    const contentTemplate = whatsappdata || '';

    if (!contentTemplate) {
      console.error('Content template is empty. Cannot proceed.');
      return;
    }

    const content = contentTemplate.replace(
      /\{Customer_name\}/g,
      customerName ? customerName : user.customerName,
    );
    const serviceName = content.replace(
      /\{Service_name\}/g,
      MyCartItmes[0]?.service.serviceName,
    );
    const slotTiming = serviceName.replace(/\{Slot_timing\}/g, selectedSlot);
    const serivePrice = slotTiming.replace(
      /\{Service_amount\}/g,
      couponDiscount,
    );
    const serviceDate = serivePrice.replace(/\{Service_date\}/g, selectedDate);
    const serviceVideoLink = serviceDate.replace(/\{Video_link\}/g, '');

    const convertedText = serviceVideoLink
      .replace(/<p>/g, '\n')
      .replace(/<\/p>/g, '')
      .replace(/<br>/g, '\n')
      .replace(/&nbsp;/g, '')
      .replace(/<strong>(.*?)<\/strong>/g, '<b>$1</b>')
      .replace(/<[^>]*>/g, '');

    try {
      const response = await axios.post(
        `https://newapi.vijayhomeservicebengaluru.in/api/whats-msg/send-message`,
        {
          mobile: '91' + contactNumber,
          msg: convertedText,
        },
      );

      if (response.status === 200) {
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const abc = isSelected
    ? couponDiscount + total1 - discountAmount
    : couponDiscount + total1;
  const st = String(abc);

  const ab = couponDiscount + total1;
  const bc = ab - discountAmount;

  const vendorCharge = ab;
  const vendorCharge1 = bc;

  const GST = isSelected ? vendorCharge1 * 0.05 : vendorCharge * 0.05;

  const finalGST = GST.toFixed(2);

  const VhsGT = isSelected
    ? couponDiscount + total1 - discountAmount + parseInt(finalGST)
    : couponDiscount + total1 + parseInt(finalGST);

  const finalGrandTotal = VhsGT.toFixed(2);

  const addtreatmentdetails = async () => {
    if (!selectedDate) {
      alert('Please select the Service date  ');
      return;
    }
    if (!selectedSlot) {
      alert('Please select the Service slot  ');
      return;
    }
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);

        if (user.customerName) {
          if (!Fulladd?.address) {
            alert('Please select the address  ');
          } else {
            setModalVisible1(true);
            const config = {
              url: 'https://newapi.vijayhomeservicebengaluru.in/api/bookings/create',
              method: 'post',
              headers: {'content-type': 'application/json'},
              data: {
                customerName: customerName ? customerName : user.name,
                email: email ? email : user.email,
                city: savecity,
                category: MyCartItmes[0]?.category,
                contract_type: 'One Time',
                service: MyCartItmes[0]?.service?.serviceName,
                service_id: MyCartItmes[0]?.service?._id,
                service_charge: finalGrandTotal,
                date_of_service: selectedDate,
                selected_slot_text: selectedSlot,
                serviceFrequency: '1',
                start_date: selectedDate,
                expiry_date: expiryDate,
                amtstart_date: selectedDate,
                amtexpiry_date: selectedDate,
                type: 'userapp',
                description: joinedPlanNames + joinedPlanaddonNames,
                user_id: user?.id,
                delivery_address: Fulladd,
                discount_amount: isSelected ? discountAmount : 0,
                amt_frequency: 1,
                grand_total: finalGrandTotal,
                payment_mode: 'cash',
                total_amount: Carttotal + totaladdon1,
                coupon_code: Coupancode,
                total_saved: CartSavedtotal + FreqensaveAmt1,
                marker_coordinate: markerCoordinate,
              },
            };
            await axios(config).then(function (response) {
              if (response.status === 201) {
                const selectedResponse = whatsappdata[0];
                deleteAllCartItems();
                deleteAllCartaddonItems();
                setModalVisible1(false);
                clearCartaddon();
                bottomSheet.current.close();
                setlocationModalVisible(false);

                makeApiCall(selectedResponse, user.mainContact);
                AsyncStorage.setItem(
                  'user',
                  JSON.stringify(response.data.user),
                );
                navigation.navigate('success', {data: response.data.booking});
                dispatch(clearCart());
                dispatch(clearCartaddon());
                if (isSelected) {
                  walletdetailsAdd();
                }
              }
            });
          }
        } else if (customerName) {
          if (!Fulladd) {
            alert('Please select the address  ');
          } else {
            setModalVisible1(true);
            const config = {
              url: ' https://newapi.vijayhomeservicebengaluru.in/api/bookings/create',
              method: 'post',
              headers: {'content-type': 'application/json'},
              data: {
                customerName: customerName ? customerName : user.name,
                email: email ? email : user.email,
                city: savecity,
                category: MyCartItmes[0]?.category,
                contract_type: 'One Time',
                service: MyCartItmes[0]?.service?.serviceName,
                service_id: MyCartItmes[0]?.service?._id,
                service_charge: finalGrandTotal,
                date_of_service: selectedDate,
                selected_slot_text: selectedSlot,
                serviceFrequency: '1',
                start_date: selectedDate,
                expiry_date: expiryDate,
                amtstart_date: selectedDate,
                amtexpiry_date: selectedDate,
                amt_frequency: 1,
                type: 'userapp',
                description: joinedPlanNames + joinedPlanaddonNames,
                user_id: user?.id,
                delivery_address: Fulladd,
                discount_amount: isSelected ? discountAmount : 0,
                grand_total: finalGrandTotal,
                payment_mode: 'cash',
                total_amount: Carttotal + totaladdon1,
                coupon_code: Coupancode,
                total_saved: CartSavedtotal + FreqensaveAmt1,
                marker_coordinate: markerCoordinate,
              },
            };
            await axios(config).then(function (response) {
              if (response.status === 201) {
                const selectedResponse = whatsappdata[0];
                deleteAllCartItems();
                deleteAllCartaddonItems();
                setModalVisible1(false);
                bottomSheet.current.close();
                setlocationModalVisible(false);

                makeApiCall(selectedResponse, user.mainContact);
                if (isSelected) {
                  walletdetailsAdd();
                }
                AsyncStorage.setItem(
                  'user',
                  JSON.stringify(response.data.user),
                );
                dispatch(clearCart());
                dispatch(clearCartaddon());
                navigation.navigate('success', {data: response.data.booking});
              }
            });
          }
        } else {
          alert('Please provide customer name and email  ');
          setModalVisible1(false);
        }
      } else {
        alert('User data not found. Please log in or create a user account.');
        setModalVisible1(false);
      }
    } catch (error) {
      console.error(error);
      setModalVisible1(false);
      alert(' Not Added');
    }
  };

  return (
    <View style={{flex: 1}}>
      {isLoading ? (
        <Loader />
      ) : (
        <View style={{flex: 1}}>
          {useLortti && (
            <LottieView
              source={require('../../../assets/wallet.json')}
              autoPlay
              loop
              width={'100%'}
              height={'100%'}
              style={{position: 'absolute', zIndex: 11}}
            />
          )}

          <ScrollView style={styles.container} ref={scrollViewRef}>
            <View style={{margin: 15}}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 18,
                  fontFamily: 'Poppins-Medium',
                }}>
                Service Details
              </Text>

              <ScrollView>
                {MyCartItmes.map(item => (
                  <View style={styles.card} key={item.id}>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 0.7}}>
                        <View style={{marginLeft: 5}}>
                          <View></View>
                          <Text
                            style={{
                              fontSize: 16,
                              fontFamily: 'Roboto',
                              color: '#000000',
                            }}>
                            {item.planName}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: 'Poppins-Bold',
                              color: '#36454F',
                            }}>
                            {item.service?.serviceName}
                          </Text>

                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                marginLeft: 0,
                                color: 'grey',
                                textDecorationLine: 'line-through',
                                fontSize: 16,
                              }}>
                              
                              {item.planPrice}
                            </Text>
                            <Text style={{marginLeft: 10, color: 'grey', fontSize: 16}}>
                              <FontAwesome name="rupee" size={14} />{' '}
                              {item.offerprice}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={{flex: 0.3}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                          }}>
                          <FontAwesome
                            name="rupee"
                            size={14}
                            color="black"
                            style={{marginTop: 4}}
                          />

                          <Text
                            style={{
                              textAlign: 'center',
                              marginLeft: 2,
                              color: 'black',
                              fontSize: 15,
                              fontFamily: 'Poppins-Medium',
                            }}>
                            {item.qty * item.offerprice}
                          </Text>
                        </View>

                        <View
                          style={{
                           flexDirection: 'row',
                        marginTop: 4,
                        backgroundColor: 'white',
                       
                        padding: 5,
                        justifyContent: 'center',
                        width: 80,
                        borderColor: '#1434A4',
                        borderWidth: 1,
                        borderRadius: 5,
                        marginLeft: 10,
                          
                          }}>
                          <TouchableOpacity
                            style={{}}
                            onPress={() => {
                              if (item.qty > 1) {
                                dispatch(removeMyCartItem(item));
                              } else {
                                dispatch(deleteMyCartItem(item.id));
                              }
                            }}>
                            <Text>
                              <AntDesign
                            name="minus"
                            size={18}
                            color="#1434A4"
                              />{' '}
                            </Text>
                          </TouchableOpacity>
                           <Text style={{color: '#1434A4', marginLeft: 5, fontFamily: 'Roboto-Bold', fontSize: 16, fontWeight: 'bold'}}>
                            {item.qty}
                          </Text>

                          <TouchableOpacity
                            style={{marginLeft: 10}}
                            onPress={() => handle(item)}>
                            <Text>
                              <AntDesign
                                  name="plus"
                            size={18}
                            color="#1434A4"
                              />
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>

            {addondata.length > 0 ? (
              <View style={{backgroundColor: 'white', margin: 10}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 18,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  Frequently Added Together
                </Text>

                <View>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {addondata.map(i => {
                      const cartItem = MyCartaddonItmes.find(
                        cartItem => cartItem.id === i._id,
                      );
                      const isItemInCart = !!cartItem;

                      return (
                        <View
                          key={i.addOnsId}
                          style={{
                            width: 180,
                            borderColor: '#FFD700',
                            borderRadius: 10,
                            margin: 10,
                          }}>
                          <View>
                            <Image
                              source={{
                                uri: `https://api.vijayhomesuperadmin.in/addOns/${i.addOnsImage}`,
                              }}
                              style={{
                                width: '100%',
                                height: 150,
                              }}
                            />
                            {isItemInCart ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  padding: 2,
                                  width: '70%',
                                  justifyContent: 'center',
                                  alignContent: 'center',
                                  alignSelf: 'center',
                                  borderRadius: 5,
                                  elevation: 15,
                                  backgroundColor: 'darkred',
                                  position: 'absolute',
                                  bottom: 10,
                                }}>
                                <TouchableOpacity
                                  style={{}}
                                  onPress={() => {
                                    if (cartItem.qty > 1) {
                                      dispatch(removeMyCartItemaddon(cartItem));
                                    } else {
                                      dispatch(
                                        deleteMyCartItemaddon(cartItem.id),
                                      );
                                    }
                                  }}>
                                  <Text>
                                    <AntDesign
                                      name="minuscircleo"
                                      size={15}
                                      color="white"
                                    />
                                  </Text>
                                </TouchableOpacity>
                                <Text
                                  style={{
                                    marginLeft: 10,
                                    color: 'white',
                                  }}>
                                  {cartItem.qty}
                                </Text>

                                <TouchableOpacity
                                  style={{marginLeft: 10}}
                                  onPress={() => handleaddon1(cartItem)}>
                                  <Text>
                                    <AntDesign
                                      name="pluscircleo"
                                      size={15}
                                      color="white"
                                    />
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            ) : (
                              <TouchableOpacity
                                style={{
                                  width: 80,
                                  borderColor: 'grey',
                                  borderRadius: 5,
                                  position: 'absolute',
                                  bottom: 10,
                                  justifyContent: 'center',
                                  alignSelf: 'center',
                                  elevation: 15,
                                  backgroundColor: 'darkred',
                                }}
                                onPress={() => handleaddon(i)}>
                                <Text
                                  style={{
                                    textAlign: 'center',
                                    fontSize: 13,
                                    padding: 1,
                                    fontFamily: 'Poppins-Medium',
                                    color: 'white',
                                  }}>
                                  Add
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                          <View style={{padding: 5}}>
                            <View>
                              <Text style={styles.summarytext} numberOfLines={2}>
                                {i.addOnsName}
                              </Text>
                            </View>

                            <View
                              style={{
                                flexDirection: 'row',
                              }}>
                              <Text
                                style={{
                                  textDecorationLine: 'line-through',
                                  fontSize: 14,
                                  fontFamily: 'Poppins-Bold',
                                  color: '#513b1c',
                                }}>
                                <FontAwesome name="rupee" size={12} />
                                {cartItem?.qty
                                  ? cartItem?.qty * i.addOnsPrice
                                  : i.addOnsPrice}
                              </Text>
                              <Text
                                style={{
                                  marginLeft: 10,
                                  fontFamily: 'Poppins-Medium',
                                  color: '#e41b17',
                                }}>
                                <FontAwesome name="rupee" size={12} />
                                {cartItem?.qty
                                  ? cartItem?.qty * i.addOnsOfferPrice
                                  : i.addOnsOfferPrice}
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            ) : (
              <></>
            )}
            <View style={styles.container}>
              {user?.customerName || user?.email ? (
                <></>
              ) : (
                <View>
                  <View style={{paddingLeft: 15}}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 18,
                        fontFamily: 'Poppins-Medium',
                      }}>
                      {' '}
                      Customer details
                    </Text>
                  </View>

                  <View style={{margin: 15}}>
                    <TextInput
                      placeholder="Customer Name"
                      placeholderTextColor={'black'}
                      style={styles.customerInput}
                      underlineColorAndroid={
                        Platform.OS === 'android' ? 'white' : null
                      }
                      value={customerName}
                      onChangeText={handlecustomer}
                    />
                    <TextInput
                      placeholder="Email "
                      style={[styles.customerInput, {marginTop: 15}]}
                      placeholderTextColor={'black'}
                      value={email}
                      underlineColorAndroid={
                        Platform.OS === 'android' ? 'white' : null
                      }
                      onChangeText={handleemail}
                    />
                  </View>
                </View>
              )}
            </View>
            {voucherdata.length > 0 ? (
              <View
                style={{
                  backgroundColor: 'white',
                  marginTop: 10,
                  margin: 10,
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 18,
                    fontFamily: 'Poppins-Medium',
                    marginLeft:15,
                    marginTop: 10
                  }}>
                  Coupons & Offers
                </Text>

                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View style={{flex: 0.45}}>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderRadius: 5,
                        height: 45,
                        paddingLeft: 15,
                        color: 'black',
                        fontSize: 14,
                        borderColor: '#E0E0E0',
                        marginLeft:15
                      }}
                      onChangeText={text => setVoucherCode(text)}
                      placeholder="Enter Voucher Code"
                      placeholderTextColor={'grey'}
                      underlineColorAndroid={
                        Platform.OS === 'android' ? 'white' : null
                      }
                    />
                    <Text style={{color: 'red'}}>{validationMessage}</Text>
                  </View>
                  <View style={{flex: 0.1}}></View>
                  <View style={{flex: 0.45}}>
                    <TouchableOpacity
                      onPress={() => {
                        const result = applyCouponCode();
                        setDiscountedTotal(result);
                      }}
                      style={{
                        backgroundColor: '#36454F',
                        padding: 10,
                        borderRadius: 5,
                        height: 45,
                        justifyContent: 'center',
                        marginRight:20
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 14,
                          textAlign: 'center',
                        }}>
                        Apply
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : (
              ''
            )}
            <View style={{margin: 15}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{color: '	#36454F'}}>*</Text>
                <Text
                  style={{
                    color: '#36454F',
                    fontFamily: 'Poppins-Medium',
                    textAlign: 'auto',
                    flexShr: 1,
                  }}>
                  Book Over Rs 1500 to use wallet , upto 10% From your wallet
                  Account !
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <Text style={{color: '	#36454F'}}>*</Text>
                <Text
                  style={{
                    color: '#36454F',
                    fontFamily: 'Poppins-Medium',
                    textAlign: 'auto',
                    flexShr: 1,
                  }}>
                  Book over Rs 1500, get 2% cashback in your wallet !
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: 'white',
                marginTop: 20,
                paddingLeft: 15,
                paddingBottom: 20,
              }}>
              <Text
                style={{
                  color: '	#191970',
                 marginLeft:5,
                  width: 190,
                 fontWeight: 'bold',
                  padding: 3,
                  fontSize: 20,
                  fontFamily: 'Poppins-Medium',
                }}>
                Payment summary
              </Text>

              <View style={{flexDirection: 'row', margin: 10}}>
                <View style={{flex: 0.8}}>
                  <Text style={styles.summarytext}>Total Amount</Text>
                </View>
                <View style={{flex: 0.2, alignItems: 'flex-end'}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      textDecorationLine: 'line-through',
                    }}>
                    <FontAwesome
                      name="rupee"
                      color="black"
                      size={14}
                      style={{marginTop: 3}}
                    />
                    <Text
                      style={{
                        textDecorationLine: 'line-through',
                        color: 'black',
                      }}>
                      {Carttotal1 + totaladdon1}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{flexDirection: 'row', margin: 10}}>
                <View style={{flex: 0.8}}>
                  <Text style={styles.summarytext}>Discount</Text>
                </View>
                <View style={{flex: 0.2, alignItems: 'flex-end'}}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.summarytext}>
                      {couponDiscount !== Carttotal && appliedCoupon
                        ? `${appliedCoupon.discountPercentage}%`
                        : '0%'}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{flexDirection: 'row', margin: 10}}>
                <View style={{flex: 0.8}}>
                  <Text style={styles.summarytext}>Taxes and Fee</Text>
                </View>
                <View style={{flex: 0.2, alignItems: 'flex-end'}}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.summarytext}>{finalGST}</Text>
                  </View>
                </View>
              </View>

              <View style={{flexDirection: 'row', margin: 10}}>
                <View style={{flex: 0.8}}>
                  <Text style={styles.summarytext}>Saved</Text>
                </View>
                <View style={{flex: 0.2, alignItems: 'flex-end'}}>
                  <View style={{flexDirection: 'row'}}>
                    <FontAwesome
                      name="rupee"
                      color="rgb(30,135,226)"
                      size={14}
                      style={{marginTop: 3}}
                    />
                    <Text style={{color: 'rgb(30,135,226)'}}>
                      {CartSavedtotal + FreqensaveAmt1}
                    </Text>
                  </View>
                </View>
              </View>
              {voucherCode ? (
                <View style={{flexDirection: 'row', margin: 10}}>
                  <View style={{flex: 0.5}}>
                    <Text style={styles.summarytext}>Coupon Code</Text>
                  </View>
                  <View style={{flex: 0.5, alignItems: 'flex-end'}}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{fontSize: 12, color: 'green'}}>
                        {voucherCode ? voucherCode : ''}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <></>
              )}

              {discountAmount && couponDiscount + total1 >= 1500 ? (
                <View style={{flexDirection: 'row', margin: 5}}>
                  <View style={{flex: 0.5, flexDirection: 'row'}}>
                    <Checkbox
                      status={isSelected ? 'checked' : 'unchecked'}
                      onPress={handlePress}
                    />

                    <Text
                      style={{
                        marginTop: 10,
                        fontFamily: 'Poppins-Medium',
                        color: 'black',
                      }}>
                      Use wallet balance{' '}
                    </Text>
                  </View>
                  <View style={{flex: 0.5, alignItems: 'flex-end'}}>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'green',
                          marginRight: 5,
                        }}>
                        {discountAmount ? discountAmount.toFixed(2) : ''}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <></>
              )}

              <Text
                style={{
                  borderBottomWidth: 1,
                  borderColor: 'lightgray',
                }}></Text>

              <View style={{flexDirection: 'row', margin: 10}}>
                <View style={{flex: 0.8}}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: 'black',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    Grand Total
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'grey',
                    }}>
                    (including GST & Other Charges)
                  </Text>
                </View>
                <View style={{flex: 0.25, alignItems: 'flex-end'}}>
                  <View style={{flexDirection: 'row'}}>
                    <FontAwesome
                      name="rupee"
                      color="black"
                      size={18}
                      style={{marginTop: 3, marginRight: 2}}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        color: 'black',
                        fontFamily: 'Poppins-Medium',
                      }}>
                      {finalGrandTotal}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: 'white',
                  borderRadius: 5,
                  padding: 10,
                  margin: 2,
                }}
                onPress={() => setcancelationModel(true)}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'darkred',
                    fontFamily: 'Poppins-Bold',
                  }}>
                  Cancellation Policy
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* =========== START: MODIFICATION - Persistent Bottom Button =========== */}
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity
              style={styles.bottomButton}
              onPress={() => setDateTimeModalVisible(true)}>
              <Text style={styles.bottomButtonText}>Select Slot & Date</Text>
            </TouchableOpacity>
          </View>
          {/* =========== END: MODIFICATION =========== */}

          {/* =========== START: MODIFICATION - New Date & Time Modal =========== */}
          <Modal
            isVisible={isDateTimeModalVisible}
            style={styles.bottomModal}
            onBackdropPress={() => setDateTimeModalVisible(false)}>
            <View style={styles.modalViewContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Date & Time</Text>
                <TouchableOpacity
                  onPress={() => setDateTimeModalVisible(false)}>
                  <AntDesign name="close" size={24} color="#555" />
                </TouchableOpacity>
              </View>

              <View style={{paddingHorizontal: 10}}>
                <Text style={styles.modalSectionTitle}>Select Date</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <TouchableOpacity
                    style={[
                      styles.dateButton,
                      isTabActive(today.format('YYYY-MM-DD')) &&
                        styles.selectedDateButton,
                    ]}
                    onPress={() => handleTabClick(today)}>
                    <Text
                      style={[
                        styles.dateButtonText,
                        isTabActive(today.format('YYYY-MM-DD')) &&
                          styles.selectedDateButtonText,
                      ]}>
                      {today.format('DD')}{' '}
                    </Text>
                    <Text
                      style={[
                        styles.dateButtonSubText,
                        isTabActive(today.format('YYYY-MM-DD')) &&
                          styles.selectedDateButtonText,
                      ]}>
                      Today
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.dateButton,
                      isTabActive(tomorrow.format('YYYY-MM-DD')) &&
                        styles.selectedDateButton,
                    ]}
                    onPress={() => handleTabClick(tomorrow)}>
                    <Text
                      style={[
                        styles.dateButtonText,
                        isTabActive(tomorrow.format('YYYY-MM-DD')) &&
                          styles.selectedDateButtonText,
                      ]}>
                      {tomorrow.format('DD')}
                    </Text>
                    <Text
                      style={[
                        styles.dateButtonSubText,
                        isTabActive(tomorrow.format('YYYY-MM-DD')) &&
                          styles.selectedDateButtonText,
                      ]}>
                      Tomorrow
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.dateButton,
                      isTabActive(nextTwoDays.format('YYYY-MM-DD')) &&
                        styles.selectedDateButton,
                    ]}
                    onPress={() => handleTabClick(nextTwoDays)}>
                    <Text
                      style={[
                        styles.dateButtonText,
                        isTabActive(nextTwoDays.format('YYYY-MM-DD')) &&
                          styles.selectedDateButtonText,
                      ]}>
                      {nextTwoDays.format('DD')}
                    </Text>
                    <Text
                      style={[
                        styles.dateButtonSubText,
                        isTabActive(nextTwoDays.format('YYYY-MM-DD')) &&
                          styles.selectedDateButtonText,
                      ]}>
                      {nextTwoDays.format('ddd')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.dateButton} onPress={openCalendar}>
                    {!date ? (
                      <View style={{alignItems: 'center'}}>
                        <Feather
                          name="calendar"
                          size={20}
                          color="#5D3FD3"
                          style={{paddingBottom: 4}}
                        />
                        <Text style={styles.dateButtonSubText}>Pick Date</Text>
                      </View>
                    ) : (
                      <View style={{alignItems: 'center'}}>
                        <Text style={styles.dateButtonText}>
                          {moment(selectedDate).format('DD')}
                        </Text>
                        <Text style={styles.dateButtonSubText}>
                          {moment(selectedDate).format('MMM')}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={{height: 1, backgroundColor: '#eee', marginVertical: 20}} />

                <Text style={styles.modalSectionTitle}>Select Start Time</Text>
                <View style={{height: 250, marginTop: 10}}>
                  {selectedDate ? (
                    renderSlots()
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={{color: '#777', fontFamily: 'Poppins-Medium'}}>
                        Please select a date to see available slots
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.confirmSlotButton,
                  (!selectedDate || !selectedSlot) && {backgroundColor: '#ccc'},
                ]}
                disabled={!selectedDate || !selectedSlot}
                onPress={() => {
                  setDateTimeModalVisible(false);
                  setAddressModalVisible(true);
                }}>
                <Text style={styles.confirmSlotButtonText}>Confirm Slot</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          {/* =========== END: MODIFICATION =========== */}

          {/* =========== START: MODIFICATION - New Address Modal =========== */}
          <Modal
            isVisible={isAddressModalVisible}
            style={styles.bottomModal}
            onBackdropPress={() => setAddressModalVisible(false)}>
            <View style={[styles.modalViewContent, {height: '60%'}]}>
              <View style={[styles.modalHeader, {justifyContent: 'space-between'}]}>
                <Text style={styles.modalTitle}>Choose an Address</Text>
                <TouchableOpacity onPress={() => setAddressModalVisible(false)}>
                  <Text style={{color: '#5D3FD3', fontFamily: 'Poppins-Bold'}}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView>
                {customeraddress.map((i, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      flexDirection: 'row',
                      marginTop: 15,
                      alignItems: 'center',
                    }}
                    onPress={() => handleSelectedAddress(i)}>
                    <View style={{flex: 0.15}}>
                      <RadioButton.Android
                        value={i}
                        status={checked === i ? 'checked' : 'unchecked'}
                        onPress={() => handleSelectedAddress(i)}
                        color="teal"
                      />
                    </View>
                    <View style={{flex: 0.85}}>
                      <Text style={styles.addressType}>
                        {i.save_as === 'other' ? i.other_data : i.save_as}
                      </Text>
                      <Text style={styles.addressText}>
                        {i.platno}, {i.landmark}, {i.address}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                onPress={() => {
                  setAddressModalVisible(false); // Close address modal first
                  setTimeout(() => mapModal(), 300); // Then open map modal
                }}
                style={styles.addNewAddressButton}>
                <AntDesign
                  name="plus"
                  size={18}
                  style={{color: '#5D3FD3', marginRight: 10}}
                />
                <Text style={styles.addNewAddressText}>Add New Address</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          {/* =========== END: MODIFICATION =========== */}

          <Modal isVisible={ModalVisible1}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'white',
                padding: 15,
              }}>
              <ActivityIndicator size="large" />
              <Text style={{color: 'black', fontSize: 23, marginLeft: 10}}>
                Please wait.....
              </Text>
            </View>
          </Modal>

          <Modal isVisible={calenderModel}>
            <View
              style={{
                padding: 15,
              }}>
              <TouchableOpacity
                onPress={() => setcalenderModel(false)}
                style={{
                  position: 'absolute',
                  right: 0,
                  backgroundColor: 'white',
                  zIndex: 1,
                  borderRadius: 50,
                }}>
                <AntDesign name="closecircle" color="" size={35} />
              </TouchableOpacity>
              <Calendar
                minDate={today.toISOString().split('T')[0]}
                onDayPress={handleDayPress}
                current={selectedDate || new Date().toISOString().split('T')[0]}
                markedDates={{
                  [selectedDate]: {
                    selected: true,
                    disableTouchEvent: true,
                    selectedColor: 'teal',
                  },
                }}
              />
            </View>
          </Modal>

          <Modal isVisible={cancelationModel}>
            <View style={styles.content}>
              <TouchableOpacity
                onPress={() => {
                  setcancelationModel(false);
                }}
                style={{
                  alignSelf: 'flex-end',
                  backgroundColor: '',
                  borderWidth: 1,
                  borderRadius: 50,
                  borderColor: 'gray',
                  marginBottom: 20,
                }}>
                <Feather name="x" color="grey" size={25} />
              </TouchableOpacity>
              <Text style={styles.title}>
                Vijay Home Services Cancellation Policy
              </Text>
              <Text style={styles.subtitle}>
                At Vijay Home Services, we understand that plans can change. Our
                cancellation policy is designed to be fair and transparent for
                all our customers.
              </Text>
              <Text style={styles.sectionTitle}>
                No Cancellation Charges !!
              </Text>
              <Text style={styles.sectionText}>
                Before 4 Hours: If you cancel your service more than 4 hours
                before the scheduled slot, there will be no cancellation
                charges.
              </Text>
              <Text style={styles.sectionTitle}>Cancellation Charges !!</Text>
              <Text style={styles.sectionText}>
                Within 4 Hours to 1 Hour Before Scheduled Slot:
                {'\n'}- Full House Cleaning: ₹500
                {'\n'}- Sofa/Kitchen/Bathroom/Mini-Services Cleaning: ₹100
                {'\n'}- Home Repair Services: ₹200
                {'\n'}- Appliances Services: ₹200
              </Text>
              <Text style={styles.sectionText}>
                Within 1 Hour and After Scheduled Slot:
                {'\n'}- Full House Cleaning: ₹700
                {'\n'}- Sofa/Kitchen/Bathroom/Mini-Services Cleaning: ₹150
              </Text>
              <Text style={styles.sectionText}>
                We appreciate your understanding and cooperation. Please contact
                us as soon as possible if you need to cancel or reschedule your
                service to avoid any charges.
              </Text>
              <TouchableOpacity>
                <Text></Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <View>
            <BottomSheet hasDraggableIcon ref={bottomSheet} height={700}>
              <View style={{flex: 1}}>
                <ScrollView contentContainerStyle={{paddingBottom: 20}}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      marginTop: 20,
                      paddingLeft: 15,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 10,
                        marginTop: 10,
                        paddingRight: 15,
                      }}>
                      <Text style={{fontSize: 14, color: 'black'}}>
                        Selected Date:{' '}
                        <Text style={{fontFamily: 'Poppins-Bold'}}>
                          {selectedDate}
                        </Text>
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          bottomSheet.current.close();
                          setDateTimeModalVisible(true);
                        }}>
                        <Feather
                          name="edit"
                          color="grey"
                          size={16}
                          marginRight={5}
                        />
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 10,
                        paddingRight: 15,
                      }}>
                      <Text style={{fontSize: 14, color: 'black'}}>
                        Selected Slot:{' '}
                        <Text style={{fontFamily: 'Poppins-Bold'}}>
                          {selectedSlot || 'None'}
                        </Text>
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          bottomSheet.current.close();
                          setDateTimeModalVisible(true);
                        }}>
                        <Feather
                          name="edit"
                          color="grey"
                          size={16}
                          marginRight={5}
                        />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 20,
                        paddingRight: 15,
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: 'black',
                          flex: 1,
                          flexWrap: 'wrap',
                        }}>
                        Selected Address:{' '}
                        <Text style={{fontFamily: 'Poppins-Bold'}}>
                          {(() => {
                            if (!Fulladd) return 'None';

                            const platnoPart =
                              Fulladd.platno &&
                              String(Fulladd.platno).trim() !== ''
                                ? String(Fulladd.platno).trim()
                                : '';
                            const landmarkPart =
                              Fulladd.landmark &&
                              String(Fulladd.landmark).trim() !== ''
                                ? String(Fulladd.landmark).trim()
                                : '';
                            const addressPart =
                              Fulladd.address &&
                              String(Fulladd.address).trim() !== ''
                                ? String(Fulladd.address).trim()
                                : '';

                            const combined = [
                              platnoPart,
                              landmarkPart,
                              addressPart,
                            ]
                              .filter(part => part !== '')
                              .join(', ');

                            return combined || 'None';
                          })()}
                        </Text>
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          bottomSheet.current.close();
                          setAddressModalVisible(true);
                        }}>
                        <Feather
                          name="edit"
                          color="grey"
                          size={16}
                          marginRight={5}
                        />
                      </TouchableOpacity>
                    </View>

                    {voucherdata.length > 0 ? (
                      <View
                        style={{
                          paddingRight: 15,
                          marginBottom: 20,
                        }}>
                        <Text
                          style={{
                            color: 'black',
                            fontSize: 18,
                            fontFamily: 'Poppins-Medium',
                          }}>
                          Coupons & Offers
                        </Text>

                        <View style={{flexDirection: 'row', marginTop: 10}}>
                          <View style={{flex: 0.45}}>
                            <TextInput
                              style={{
                                borderWidth: 1,
                                borderRadius: 5,
                                height: 45,
                                paddingLeft: 15,
                                color: 'black',
                                fontSize: 14,
                                borderColor: '#E0E0E0',
                              }}
                              onChangeText={text => setVoucherCode(text)}
                              placeholder="Enter Voucher Code"
                              placeholderTextColor={'grey'}
                              underlineColorAndroid={
                                Platform.OS === 'android' ? 'white' : null
                              }
                            />
                            <Text style={{color: 'red'}}>{validationMessage}</Text>
                          </View>
                          <View style={{flex: 0.1}}></View>
                          <View style={{flex: 0.45}}>
                            <TouchableOpacity
                              onPress={() => {
                                const result = applyCouponCode();
                                setDiscountedTotal(result);
                              }}
                              style={{
                                backgroundColor: '#36454F',
                                padding: 10,
                                borderRadius: 5,
                                height: 45,
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={{
                                  color: 'white',
                                  fontSize: 14,
                                  textAlign: 'center',
                                }}>
                                Apply
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ) : null}

                    <Text
                      style={{
                        color: 'black',
                        
                        width: 190,
                        borderTopRightRadius: 80,
                        padding: 3,
                        fontSize: 17,
                        fontFamily: 'Poppins-Medium',
                      }}>
                      Payment summary
                    </Text>
                                        <View style={{borderBottomWidth: 1, borderColor: 'lightgray', marginVertical: 4}} />

                    <View
                      style={{
                        paddingRight: 15,
                      }}>
                      <View style={{flexDirection: 'row', margin: 10}}>
                        <View style={{flex: 0.8}}>
                          <Text style={styles.summarytext}>Total Amount</Text>
                        </View>
                        <View style={{flex: 0.2, alignItems: 'flex-end'}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              textDecorationLine: 'line-through',
                            }}>
                            <FontAwesome
                              name="rupee"
                              color="black"
                              size={14}
                              style={{marginTop: 3}}
                            />
                            <Text
                              style={{
                                textDecorationLine: 'line-through',
                                color: 'black',
                              }}>
                              {Carttotal1 + totaladdon1}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={{flexDirection: 'row', margin: 10}}>
                        <View style={{flex: 0.8}}>
                          <Text style={styles.summarytext}>Discount</Text>
                        </View>
                        <View style={{flex: 0.2, alignItems: 'flex-end'}}>
                          <View style={{flexDirection: 'row'}}>
                            <Text style={styles.summarytext}>
                              {couponDiscount !== Carttotal && appliedCoupon
                                ? `${appliedCoupon.discountPercentage}%`
                                : '0%'}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={{flexDirection: 'row', margin: 10}}>
                        <View style={{flex: 0.8}}>
                          <Text style={styles.summarytext}>Taxes and Fee</Text>
                        </View>
                        <View style={{flex: 0.2, alignItems: 'flex-end'}}>
                          <View style={{flexDirection: 'row'}}>
                            <Text style={styles.summarytext}>{finalGST}</Text>
                          </View>
                        </View>
                      </View>

                      <View style={{flexDirection: 'row', margin: 10}}>
                        <View style={{flex: 0.8}}>
                          <Text style={styles.summarytext}>Saved</Text>
                        </View>
                        <View style={{flex: 0.2, alignItems: 'flex-end'}}>
                          <View style={{flexDirection: 'row'}}>
                            <FontAwesome
                              name="rupee"
                              color="rgb(30,135,226)"
                              size={14}
                              style={{marginTop: 3}}
                            />
                            <Text style={{color: 'rgb(30,135,226)'}}>
                              {CartSavedtotal + FreqensaveAmt1}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {voucherCode ? (
                        <View style={{flexDirection: 'row', margin: 10}}>
                          <View style={{flex: 0.5}}>
                            <Text style={styles.summarytext}>Coupon Code</Text>
                          </View>
                          <View style={{flex: 0.5, alignItems: 'flex-end'}}>
                            <View style={{flexDirection: 'row'}}>
                              <Text style={{fontSize: 12, color: 'green'}}>
                                {voucherCode ? voucherCode : ''}
                              </Text>
                            </View>
                          </View>
                        </View>
                      ) : null}

                      {discountAmount && couponDiscount + total1 >= 1500 ? (
                        <View style={{flexDirection: 'row', margin: 5}}>
                          <View style={{flex: 0.5, flexDirection: 'row'}}>
                            <Checkbox
                              status={isSelected ? 'checked' : 'unchecked'}
                              onPress={handlePress}
                            />
                            <Text
                              style={{
                                marginTop: 10,
                                fontFamily: 'Poppins-Medium',
                                color: 'black',
                              }}>
                              Use wallet balance
                            </Text>
                          </View>
                          <View style={{flex: 0.5, alignItems: 'flex-end'}}>
                            <Text
                              style={{
                                fontSize: 15,
                                color: 'green',
                                marginRight: 5,
                              }}>
                              {discountAmount ? discountAmount.toFixed(2) : ''}
                            </Text>
                          </View>
                        </View>
                      ) : null}

                      <Text
                        style={{
                          borderBottomWidth: 1,
                          borderColor: 'lightgray',
                        }}></Text>

                      <View style={{flexDirection: 'row', margin: 10}}>
                        <View style={{flex: 0.8}}>
                          <Text
                            style={{
                              fontSize: 18,
                              color: 'black',
                              fontFamily: 'Poppins-Medium',
                            }}>
                            Grand Total
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: 'grey',
                            }}>
                            (inc. Taxes & Other Charges)
                          </Text>
                        </View>

                        <View
                          style={{
                            flex: 0.25,
                            alignItems: 'flex-end',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <FontAwesome
                            name="rupee"
                            color="black"
                            size={16}
                            style={{marginRight: 2}}
                          />

                          <Text
                            style={{
                              fontSize: 19,
                              color: 'black',
                              fontFamily: 'Poppins-Medium',
                              fontWeight: 'bold',
                            }}>
                            {finalGrandTotal}
                          </Text>
                        </View>
                      </View>
                      <View>
                        <TouchableOpacity
                          style={{
                            backgroundColor: 'white',
                            borderRadius: 5,
                            padding: 10,
                            margin: 2,
                            marginTop: -10,
                          }}
                          onPress={() => setcancelationModel(true)}>
                          <Text
                            style={{
                              fontSize: 15,
                              color: 'darkred',
                              fontFamily: 'Poppins-Bold',
                            }}>
                            Cancellation Policy
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </ScrollView>
                <View style={styles.bottomSheetFooter}>
                  <TouchableOpacity
                    style={styles.primaryPaymentButton1}
                    onPress={addtreatmentdetails}>
                    <Text style={styles.paymentButtonText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BottomSheet>
          </View>
          <Modal isVisible={mapModalVisible}>
            <TouchableOpacity
              onPress={() => setmapModalVisible(false)}
              style={{
                justifyContent: 'flex-end',
                alignSelf: 'flex-end',
                backgroundColor: 'white',
                zIndex: 1,
                borderRadius: 50,
              }}>
              <AntDesign name="closecircle" color="darkred" size={35} />
            </TouchableOpacity>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{flex: 1, backgroundColor: 'white'}}>
              <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <View style={{flex: 1}}>
                  <View style={{height: 300, backgroundColor: 'grey'}}>
                    <MapView
                      ref={mapRef}
                      style={{flex: 1}}
                      initialRegion={{
                        latitude: 12.9716,
                        longitude: 77.5946,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      }}
                      onRegionChangeComplete={region =>
                        debouncedRegionChange(region)
                      }
                    />
                    <View style={styles.markerContent}>
                      <FontAwesome name="map-pin" color={'#5D3FD3'} size={35} />
                    </View>
                    <GooglePlacesAutocomplete
                      placeholder="Search location..."
                      placeholderTextColor={'grey'}
                      onPress={(data, details = null) => {
                        if (details) {
                          const {lat, lng} = details.geometry.location;
                          const formattedAddress = data.description;
                          setaddress(formattedAddress);
                          setMarkerCoordinate({latitude: lat, longitude: lng});
                          if (mapRef.current) {
                            mapRef.current.animateToRegion({
                              latitude: lat,
                              longitude: lng,
                              latitudeDelta: 0.005,
                              longitudeDelta: 0.005,
                            });
                          }
                        } else {
                          searchLocation(data.description);
                        }
                      }}
                      query={{
                        key: 'YOUR_GOOGLE_API_KEY',
                        language: 'en',
                      }}
                      fetchDetails={true}
                      styles={{
                        container: {
                          position: 'absolute',
                          top: 0,
                          width: '100%',
                          zIndex: 11,
                          padding: 10,
                        },
                        textInput: {
                          color: 'black',
                          height: 48,
                          fontSize: 16,
                          backgroundColor: 'white',
                          elevation: 5,
                        },
                        listView: {backgroundColor: 'white', elevation: 5},
                        description: {color: 'black'},
                      }}
                    />

                    <View
                      style={{
                        position: 'absolute',
                        zIndex: 12,
                        top: 22,
                        right: 20,
                      }}>
                      <EvilIcons name="search" color="black" size={30} />
                    </View>
                  </View>
                  <View style={{padding: 15}}>
                    <TouchableOpacity
                      onPress={getLocation}
                      style={{
                        backgroundColor: '#5D3FD3',
                        padding: 10,
                        borderRadius: 5,
                        alignItems: 'center',
                        marginBottom: 15,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontFamily: 'Poppins-Medium',
                        }}>
                        Use my current location
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        ...styles.label,
                        color: 'black',
                        fontSize: 15,
                        fontFamily: 'Poppins-Medium',
                      }}>
                      Address
                    </Text>
                    <TextInput
                      style={[
                        styles.inputMap,
                        {minHeight: 45, height: 'auto', paddingTop: 10},
                      ]}
                      value={address}
                      onChangeText={text => setaddress(text)}
                      placeholder="Address"
                      placeholderTextColor="grey"
                      multiline
                    />

                    <View style={{marginTop: 10}}>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.label}>House / Flat / Block No</Text>
                        <Text style={{color: 'red'}}> *</Text>
                      </View>
                      <TextInput
                        style={styles.inputMap}
                        value={platNo}
                        onChangeText={text => setPlatNo(text)}
                      />
                    </View>

                    <View style={{marginTop: 10}}>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.label}>Landmark / Society name</Text>
                        <Text style={{color: 'red'}}> *</Text>
                      </View>
                      <TextInput
                        style={styles.inputMap}
                        value={landmark}
                        onChangeText={text => setLandmark(text)}
                      />
                    </View>

                    <View style={{flexDirection: 'row', marginTop: 10}}>
                      <Text style={styles.label}>Save as</Text>
                      <Text style={{color: 'red'}}> *</Text>
                    </View>

                    <View style={{flexDirection: 'row', marginTop: 5}}>
                      <TouchableOpacity
                        onPress={handleHomePress}
                        style={homeButtonStyle}>
                        <Text
                          style={{
                            color: 'black',
                            fontSize: 14,
                            textAlign: 'center',
                          }}>
                          Home
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleOthersPress}
                        style={othersButtonStyle}>
                        <Text
                          style={{
                            color: 'black',
                            fontSize: 14,
                            textAlign: 'center',
                          }}>
                          Others
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {isOthersClicked ? (
                      <View style={{marginTop: 10}}>
                        <TextInput
                          style={styles.inputMap}
                          value={otherData}
                          onChangeText={text => setotherData(text)}
                          placeholder="e.g. Work, Friend's house"
                        />
                      </View>
                    ) : null}

                    <TouchableOpacity
                      onPress={addcustomeraddresss}
                      disabled={!canSubmitNewAddress}
                      style={[
                        styles.submitButton,
                        {marginTop: 20},
                        !canSubmitNewAddress && {opacity: 0.5},
                      ]}>
                      <Text style={styles.submitButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </Modal>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#513b1c',
  },
  bd: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Poppins-Bold',
  },
  summarytext: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  card: {
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'white',
    elevation: 5,
    marginTop: 10,
    margin: 5,
  },
  customerInput: {
    elevation: 15,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingLeft: 10,
    color: 'black',
    height: 40,
    borderRadius: 5,
  },
  // =========== START: MODIFICATION - New Styles for Modals and Buttons ===========
  bottomButtonContainer: {
    padding: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 8,
  },
  bottomButton: {
    backgroundColor: '#5D3FD3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bottomButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalViewContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  modalSectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#555',
  },
  dateButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    width: '23%',
  },
  selectedDateButton: {
    backgroundColor: '#5D3FD3',
  },
  dateButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#5D3FD3',
  },
  dateButtonSubText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#555',
  },
  selectedDateButtonText: {
    color: 'white',
  },
  slotSection: {
    marginBottom: 15,
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  slotHeaderText: {
    marginLeft: 8,
    fontFamily: 'Poppins-Medium',
    color: '#333',
    fontSize: 15,
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  slotButton1: {
    width: '45%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginBottom: 10,
  },
    slotButton: {
    width: '32%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedSlotButton: {
    backgroundColor: '#5D3FD3',
    borderColor: '#5D3FD3',
  },
  slotButtonText: {
    color: 'black',
    fontFamily: 'Poppins-Medium',
  },
  selectedSlotButtonText: {
    color: 'white',
  },
  confirmSlotButton: {
    backgroundColor: '#5D3FD3',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 'auto',
  },
  confirmSlotButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  addressType: {
    color: 'black',
    fontFamily: 'Poppins-Bold',
    fontSize: 17,
  },
  addressText: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'Poppins-Regular',
  },
  addNewAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  addNewAddressText: {
    color: '#5D3FD3',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  // =========== END: MODIFICATION - New Styles ===========
  bottomSheetFooter: {
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  paymentButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
  },
  primaryPaymentButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
    width: '100%',
  },
    primaryPaymentButton1: {
    backgroundColor: '#00A36C',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
    width: '100%',
  },
  label: {
    color: 'black',
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    paddingBottom: 5,
  
  },
  inputMap: {
    height: 45,
    borderRadius: 5,
    backgroundColor: 'white',
    paddingLeft: 15,
    elevation: 16,
    color: 'black',
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  submitButton: {
    backgroundColor: '#36454F',
    width: '100%',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  markerContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -17.5,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexGrow: 1,
    margin: 15,
    backgroundColor: 'white',
    padding: 15,
  },
  sectionTitle: {
    fontSize: 14,
    marginTop: 15,
    marginBottom: 5,
    color: 'black',
    fontFamily: 'Poppins-ExtraBold',
  },
  sectionText: {
    fontSize: 12,
    marginBottom: 10,
    color: 'black',
    fontFamily: 'Poppins-Medium',
  },
  title: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
  },
  subtitle: {
    fontSize: 14,
    color: 'black',
    marginBottom: 10,
    fontFamily: 'Poppins-Medium',
  },
});

export default Cartbook;