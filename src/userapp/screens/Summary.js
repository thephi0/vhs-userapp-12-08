import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Button,
  TextInput,
  ActivityIndicator,
  BackHandler,
  PermissionsAndroid,
  Pressable,
} from 'react-native';
import Modal from 'react-native-modal';
import axios from 'axios';
import moment from 'moment';
import _debounce from 'lodash/debounce';
import {Checkbox} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RadioButton} from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import {useRoute} from '@react-navigation/native';
import WebView from 'react-native-webview';
import {Calendar} from 'react-native-calendars';
import {
  addToCartaddon,
  addToCart1addon,
  removeMyCartItemaddon,
} from './Redux/MyCartSlice';
import {useFCMToken} from '../../ApiServices/FCMtoken';
import LottieView from 'lottie-react-native';

import {deleteMyCartItemaddon} from './Redux/MyCartSlice';
import BottomSheet from 'react-native-gesture-bottom-sheet';

import MapView, {Marker} from 'react-native-maps';

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Geolocation from '@react-native-community/geolocation';
import Loader from './Loader';

function Summary({navigation}) {
  const [showWebView, setShowWebView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [time, setTime] = useState(false);
  const [cancelationModel, setcancelationModel] = useState(false);
  const [ModalVisible1, setModalVisible1] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // State to track the selected item
  const [discountperc, setdiscountperc] = useState('');
  const [city, setcity] = useState('');
  const [savecity, setsavecity] = useState('');
  const openDatePickerSingle = () => setShowDatePickerSingle(true);
  const [showDatePickerSingle, setShowDatePickerSingle] = useState(false);
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const [checked, setChecked] = useState('');
  const [address, setaddress] = useState('');
  const fcmtoken = useFCMToken();
  const [voucherdata, setvoucherdata] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlotText, setSelectedSlotText] = useState('');
  const [addondata, setaddondata] = useState([]);
  const bottomSheet = useRef();
  const route = useRoute();
  const {plan, sdata} = route.params;
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
  const [user, setuser] = useState('');
  const [value, setuser1] = useState('');
  const MyCartItmes = useSelector(state => state.addon);

  const [whatsappdata, setwhatsappdata] = useState([]);
  const today = moment();
  const tomorrow = moment().add(1, 'days');
  const nextTwoDays = moment().add(2, 'days');
  const nextthreeDays = moment().add(3, 'days');

  const [date, setDate] = useState(false);
  const [Coupancode, setCoupancode] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [Fulladd, setFulladd] = useState('');

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calenderModel, setcalenderModel] = useState(false);

  const [customerName, setcustomerName] = useState('');
  const [email, setemail] = useState('');
  const [mainContact, setmainContact] = useState();
  const [LoginModal, setLoginModal] = useState(false);
  const [locationModalVisible, setlocationModalVisible] = useState(false);

  // useEffect(() => {
  //   if (!user) {
  //     setLoginModal(true);
  //   } else {
  //     setLoginModal(false); // Ensure LoginModal is false if user data exists
  //   }
  // }, [user]); // Depend on user to update LoginModal

  const sendOTP = async () => {
    const isValidMobile = /^\d{10}$/.test(mainContact);

    if (!isValidMobile) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      const response = await axios.post(
        'https://newapi.vijayhomeservicebengaluru.in/api/customers/registerorlogin',
        {
          mainContact: mainContact,
          fcmtoken: fcmtoken,
          reference: 'userapp',
        },
      );

      if (response.status === 200) {
        console.log('clag', response);
        alert('succesfull login');
        setLoginModal(false);
        setuser(JSON.stringify(response.data.user));
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        Alert.alert('Error', error.response.data.error);
      } else {
        console.error('Error:', error);

        Alert.alert('Error', 'An error occurred. Please try again later.');
      }
    }
  };

  useEffect(() => {
    getwhatsapptemplate();
  }, []);

  const getwhatsapptemplate = async () => {
    try {
      let res = await axios.get(
        'https://api.vijayhomeservicebengaluru.in/api/getwhatsapptemplate',
      );
      if (res.status === 200) {
        let getTemplateDatails = res.data?.whatsapptemplate?.filter(
          item => item.templatename === 'Service Added',
        );
        setwhatsappdata(getTemplateDatails);
      }
    } catch (error) {
      console.error('err', error);
    }
  };

  const addcustomeraddresss = async e => {
    e.preventDefault();

    try {
      const config = {
        url: '/addcustomeraddress',
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
      await axios(config).then(function (response) {
        if (response.status === 200) {
          setFulladd(response.data.data);
          closeModal();
          setmapModalVisible(false);
          setModalVisible(false);
          getaddress();
        }
      });
    } catch (error) {
      console.error(error);
      alert(
        'Address not added, Please delete one address to update another address ',
      );
    }
  };

  const [customeraddress, setcustomerAddressdata] = useState([]);
  useEffect(() => {
    if (user?.id) {
      getaddress();
    }
  }, [modalVisible]);

  const getaddress = async () => {
    let res = await axios.get(
      `https://newapi.vijayhomeservicebengaluru.in/api/customer-address/address/user/${user?.id}`,
    );
    if ((res.status = 200)) {
      setcustomerAddressdata(res.data);
    }
  };

  const handleSelectedAddress = i => {
    setFulladd(i);
  };

  useEffect(() => {
    getwalletdeduction();
  }, []);

  const [walletdeductiondata, setwalletdeductiondata] = useState([]);

  let discountAmount = 0; // Initialize discountAmount

  const vAmount = user?.wAmount;

  const dis = walletdeductiondata[0]?.Discount;
  discountAmount = vAmount <= dis ? vAmount : (vAmount * dis) / 100; // Update discountAmount based on conditions

  const getwalletdeduction = async () => {
    let res = await axios.get(
      `https://api.vijayhomesuperadmin.in/api/getwalletDisc/`,
    );
    if ((res.status = 200)) {
      setwalletdeductiondata(res.data?.walletDisc);
    }
  };

  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
  });

  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: selectedLocation.latitude,
    longitude: selectedLocation.longitude,
  });

  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      // Update the initialRegion when selectedLocation changes
      mapRef.current.animateToRegion({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        latitudeDelta: 0.015, // Adjust this value for your desired zoom level
        longitudeDelta: 0.0121, // Adjust this value for your desired zoom level
      });
    }
  }, [selectedLocation]);

  const debouncedRegionChange = _debounce(region => {
    setMarkerCoordinate({
      latitude: region.latitude,
      longitude: region.longitude,
    });
    handleMarkerMove(region.latitude, region.longitude);
  }, 500);

  // Calculate the max date as the 10th day of the current month
  const toda = new Date();
  const minDate = new Date(toda.getFullYear(), toda.getMonth());

  const [mLag, setmLag] = useState();
  const [mLong, setmLong] = useState();

  const handleBackButton = () => {
    if (showWebView) {
      // If the modal is open, close it
      setShowWebView(false);
      return true; // Prevent default behavior (exit the app)
    } else {
      // If the modal is not open, navigate to another screen
      navigation.navigate('summary', {plan: plan, sdata: sdata});
      return true;
    }
  };

  useEffect(() => {
    // Subscribe to the hardware back button press event
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );

    // Return a cleanup function to unsubscribe when the component unmounts
    return () => {
      backHandler.remove();
    };
  }, [navigation, showWebView]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('summary', {plan: plan, sdata: sdata});
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
  };

  const openCalendar = () => {
    setIsCalendarOpen(true);
    setcalenderModel(true);
    setDate(true);
  };

  const closeCalendar = () => {
    setIsCalendarOpen(false);
    setcalenderModel(false);
  };

  const handleTabClick = date => {
    const formattedDate = date.format('YYYY-MM-DD');
    setSelectedDate(formattedDate);
  };

  const isTabActive = tab => {
    return selectedDate === tab;
  };

  const dispatch = useDispatch();
  const deleteAllCartItems = () => {
    MyCartItmes?.forEach(item => {
      dispatch(deleteMyCartItemaddon({id: item.id}));
    });
  };

  const handle = item => {
    dispatch(addToCartaddon(item));
  };

  useEffect(() => {
    // Fetch user data from AsyncStorage and parse it
    const fetchData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const addressData = await AsyncStorage.getItem('address');
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

  const total = MyCartItmes?.reduce((accumulator, item) => {
    const subtotal = parseFloat(item.oferprice) * item.qty;
    return accumulator + subtotal;
  }, 0);

  const FreqensaveAmt = MyCartItmes?.reduce((accumulator, item) => {
    const subtotal =
      (parseFloat(item.planPrice) - parseFloat(item.oferprice)) * item.qty;

    return accumulator + subtotal;
  }, 0);

  const discAmt =
    (parseFloat(plan.pofferprice) * parseFloat(discountperc)) / 100;

  const savedAmt = parseFloat(plan.pPrice) - parseFloat(plan.pofferprice);

  const GrandTotal = total
    ? discountperc
      ? parseFloat(plan.pofferprice) + parseFloat(total) - discAmt
      : parseFloat(plan.pofferprice) + parseFloat(total)
    : discAmt
    ? plan.pofferprice - discAmt
    : plan.pofferprice;

  // Extract the planName values
  const ka = plan?.pName;

  const planNames = MyCartItmes?.map(item => item.planName);
  // Join them into a single string with commas
  const abc = planNames?.join(', ');
  const joinedPlanNames = ka ? `${ka}, ${abc}` : abc;

  useEffect(() => {
    getvoucher();
    getaddon();
    // getservice();
  }, []);

  useEffect(() => {
    // Calculate the discounted total when the component is mounted
    calculateDiscount();
  }, []); // Empty dependency array to run this effect only once

  const calculateDiscount = () => {
    const total = parseFloat(plan.pofferprice); // Convert the price to a number
    const percentage = parseFloat(discountperc) / 100; // Convert the percentage to a decimal

    // Calculate the discount amount
    const discountAmount = total * percentage;

    // Calculate the discounted total
    const finalTotal = total - discountAmount;

    // Update the state with the discounted total
    setDiscountedTotal(finalTotal.toFixed(2)); // Assuming you want to round to 2 decimal places
  };

  const getvoucher = async () => {
    let res = await axios.get(
      'https://api.vijayhomeservicebengaluru.in/api/userapp/getvoucher',
    );
    if (res.status === 200) {
      // Extract all unique categories from MyCartItems
      const uniqueCategories = Array.from(
        new Set(MyCartItmes?.map(item => item.service?.category)),
      );

      // Filter voucherdata to include only items that match any category from MyCartItems
      const filteredVoucherData = res.data?.voucher.filter(
        i => i.category === sdata?.category,
      );

      setvoucherdata(filteredVoucherData);
    }
  };

  const [couponDiscount, setCouponDiscount] = useState(GrandTotal);
  const [validationMessage, setValidationMessage] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const applyCouponCode = async () => {
    // Fetch the user's data from AsyncStorage
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);

      if (user.voucherCode === voucherCode) {
        alert('Coupon code already applied');
        return GrandTotal;
      }

      const appliedCoupon = voucherdata.find(
        item => item.voucherCode === voucherCode,
      );

      if (appliedCoupon) {
        const discountPercentageValue = parseInt(
          appliedCoupon.discountPercentage,
          10,
        );
        const discountAmount = (discountPercentageValue / 100) * GrandTotal;
        const getResults = GrandTotal - discountAmount;

        setCouponDiscount(getResults);
        setValidationMessage('');
        setAppliedCoupon(appliedCoupon);

        // Update the user's voucherCode in AsyncStorage to prevent further use
        user.voucherCode = voucherCode;
        await AsyncStorage.setItem('user', JSON.stringify(user));

        return getResults;
      } else {
        setValidationMessage('Invalid coupon');
        setAppliedCoupon(null);
        setCouponDiscount(GrandTotal);
        return GrandTotal;
      }
    } else {
      console.error('User data not found in AsyncStorage');
      alert('User data not found. Please log in or create a user account.');
      return GrandTotal;
    }
  };

  const getaddon = async () => {
    let res = await axios.get(
      'https://api.vijayhomesuperadmin.in/api/userapp/getServiceAddOns',
    );
    if ((res.status = 200)) {
      setaddondata(
        res.data?.AddOns.filter(i => i.addOnsCategory === sdata?.serviceName),
      );
    }
  };

  const handleSlotClick1 = (index, startTime) => {
    setSelectedSlotIndex(index);
    setSelectedSlotText(`${startTime}`);
  };

  const filteredData = sdata?.store_slots?.filter(
    item => item?.slotCity === savecity,
  );

  const now = new Date();
  const filteredData1 = filteredData?.filter(item => {
    try {
      // Get the current date in ISO format (e.g., "2023-09-28")
      const currentDateISO = now.toISOString().split('T')[0];

      const startTimeString = item.startTime.split('-')[0].trim();
      // Combine the current date with the time from item.startTime
      const dateTimeString = `${currentDateISO}T${item.startTime
        .split('-')[0]
        .trim()}`;

      // Parse the dateTimeString using moment
      const startTime = moment(dateTimeString, 'YYYY-MM-DDThh:mmA');

      if (!startTime.isValid()) {
        return false;
      }

      const startTimeDate = startTime.toDate();

      // Calculate the time difference in hours
      const timeDifferenceInHours = (startTimeDate - now) / (1000 * 60 * 60);

      // Check if the start time is at least 3 hours ahead of the current time
      return timeDifferenceInHours >= 2;
    } catch (error) {
      console.error('Error parsing date:', error);
      return false;
    }
  });

  const renderSlots = () => {
    const currentDate = new Date();
    const dateToCompare = new Date(selectedDate);

    let slots; // Declare the variable outside of the conditionals

    if (currentDate == dateToCompare) {
      slots = filteredData || [];
    } else if (currentDate > dateToCompare) {
      slots = filteredData1 || [];
    } else {
      slots = filteredData || [];
    }
    // Sort the slots based on their start times
    slots.sort((a, b) => {
      const startTimeA = moment(a.startTime, 'hA');
      const startTimeB = moment(b.startTime, 'hA');
      return startTimeA.diff(startTimeB);
    });

    const groupedSlots = [];

    // Group slots into arrays of three
    for (let i = 0; i < slots.length; i += 3) {
      groupedSlots.push(slots.slice(i, i + 3));
    }

    return groupedSlots.map((slotGroup, groupIndex) => (
      <View key={groupIndex} style={{flexDirection: 'row', marginBottom: 10}}>
        {slotGroup.map((slot, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              Fulladd ? setModalVisible(false) : setModalVisible(true);
              handleSlotClick1(
                groupIndex * 3 + index,
                slot.startTime,
                slot.endTime,
              );
            }}
            style={[
              styles.slotBox,
              {
                backgroundColor:
                  selectedSlotIndex === groupIndex * 3 + index
                    ? 'darkred'
                    : 'lightpink',
                color:
                  selectedSlotIndex === groupIndex * 3 + index
                    ? 'white'
                    : 'white',
              },
            ]}>
            <Text
              style={[
                styles.boxText,
                {
                  color:
                    selectedSlotIndex === groupIndex * 3 + index
                      ? 'white'
                      : 'black',
                  fontFamily: 'Poppins-Medium',
                },
              ]}>
              {slot.startTime}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  const calculateExpiryDate = (selectedDate, servicePeriod) => {
    let monthsToAdd = 0;

    // Determine the number of months to add based on service period
    if (servicePeriod === 'monthly') {
      monthsToAdd = 1;
    } else if (servicePeriod === 'quart') {
      monthsToAdd = 3;
    } else if (servicePeriod === 'half') {
      monthsToAdd = 6;
    } else if (servicePeriod === 'year') {
      monthsToAdd = 12;
    }

    // Calculate the expiryDate by adding the months
    const expiryDate = moment(selectedDate)
      .add(monthsToAdd, 'months')
      .format('YYYY-MM-DD');

    return expiryDate;
  };

  console.log('plan?.pservices', plan?.pservices);

  const servicePeriod = plan?.servicePeriod;
  const serviceFrequency = plan?.pservices;
  const expiryDate = calculateExpiryDate(selectedDate, servicePeriod);
  const sDate = moment(selectedDate, 'YYYY-MM-DD');
  const eDate = moment(expiryDate, 'YYYY-MM-DD');

  console.log('eDate', eDate, expiryDate, servicePeriod);

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

  const dividedamtCharges = [GrandTotal];

  const sAmtDate = moment(selectedDate, 'YYYY-MM-DD');
  const eamtDate = moment(selectedDate, 'YYYY-MM-DD');
  const amtFrequency = 1;
  const totalamtDays = Math.ceil(eamtDate.diff(sAmtDate, 'days'));
  const intervalamt = Math.ceil(totalamtDays / amtFrequency);
  // const dividedamtCharge = Math.ceil(remainingAmt / amtFrequency);

  const dividedamtDates = [];
  // const dividedamtCharges = [];

  for (let i = 0; i < amtFrequency; i++) {
    const date = sDate
      .clone()
      .add(intervalamt * i, 'days')
      .format('YYYY-MM-DD');
    dividedamtDates.push(date);
  }

  const [paymentMode, setpaymentMode] = useState('');

  const booking = a => {
    setpaymentMode(a);

    addtreatmentdetails(a);
  };

  const [isSelected, setSelection] = useState(false);
  const [useLortti, setUseLortti] = useState(false);

  const handlePress = () => {
    setUseLortti(true);
    setSelection(!isSelected);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setUseLortti(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, [isSelected]);

  const advp = a => {
    if (a.paymentMode === 'Online') {
      addPayment(a);
    } else {
      setModalVisible1(false);
      navigation.navigate('success', {data: a});
    }
  };

  const addPayment = async a => {
    try {
      const config = {
        url: '/addPayment',
        method: 'post',
        baseURL: 'https://api.vijayhomeservicebengaluru.in/api',
        headers: {'content-type': 'application/json'},
        data: {
          paymentDate: selectedDate,
          paymentType: 'Customer',
          paymentMode: 'online',
          amount: GrandTotal,
          Comment: 'user appp',
          serviceDate: selectedDate,
          serviceId: a?._id,
          customerId: user._id,
        },
      };
      await axios(config).then(function (response) {
        if (response.status === 200) {
          // alert("Payment Added");
          // // window.location.reload("");
          setModalVisible1(false);
          navigation.navigate('success', {data: a});
        }
      });
    } catch (error) {
      console.log(error);
      alert(error.response.data.error);
    }
  };

  ///map setup
  const [mapModalVisible, setmapModalVisible] = useState(false);

  const mapModal = () => {
    setmapModalVisible(true);
    setModalVisible(false);
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
    setIsOthersClicked(false); // Reset other button's state
    setsaveAs('Home');
  };

  const handleOthersPress = () => {
    setIsHomeClicked(false); // Reset home button's state
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
      } else {
        console.log('LOCATION permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const searchLocation = async query => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=AIzaSyBF48uqsKVyp9P2NlDX-heBJksvvT_8Cqk`,
      );

      if (response.data && response.data.results.length > 0) {
        const result = response.data.results[0];
        const {geometry, formatted_address} = result;

        const lat = geometry.location.lat;
        const lng = geometry.location.lng;

        setSelectedLocation({latitude: lat, longitude: lng});
        setMarkerCoordinate({latitude: lat, longitude: lng});

        setaddress(formatted_address);

        // Open the modal after searching for a location
        setIsModalVisible(true);
      } else {
        setaddress('Location not found.');
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    AsyncStorage.getItem('savecity').then(value => {
      setsavecity(value);
    });

    AsyncStorage.getItem('locationData').then(value => {
      if (value !== null) {
        try {
          const saveAddressData = JSON.parse(value);
          setFulladd(saveAddressData);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      }
    });
  }, [mapModalVisible]);

  const getLocation = () => {
    setModalVisible1(true);
    Geolocation.getCurrentPosition(
      position => {
        setmLag(position.coords.latitude);
        setmLong(position.coords.longitude);

        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        console.log(lat, long);
        setSelectedLocation({latitude: lat, longitude: long});
        getGeocodeFromCoordinates(lat, long);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
        error => {
          console.log('Error getting location:', error.message);
        };
        setModalVisible1(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const getGeocodeFromCoordinates = async (lat, long) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyBF48uqsKVyp9P2NlDX-heBJksvvT_8Cqk`,
      );

      if (response.data && response.data.results.length > 0) {
        const addressComponents = response.data.results[0].address_components;

        const formattedAddress = response.data.results[0].formatted_address;
        setaddress(formattedAddress);
        setModalVisible1(false);
      } else {
        setModalVisible1(false);
        setaddress('No address found for the given coordinates.');
      }
    } catch (error) {
      console.error('Error fetching geocode:', error);
      setModalVisible1(false);
      throw error;
    }
  };
  const handleMarkerMove = async (latitude, longitude) => {
    // Reverse geocode the new coordinates to get the address
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBF48uqsKVyp9P2NlDX-heBJksvvT_8Cqk`,
      );

      if (response.data && response.data.results.length > 0) {
        const formattedAddress = response.data.results[0].formatted_address;
        setaddress(formattedAddress);
      } else {
        setaddress('Location not found.');
      }
    } catch (error) {
      console.error('Error reverse geocoding location:', error);
    }
  };

  const handleemail = text => {
    setemail(text);
  };
  const handlecustomer = text => {
    setcustomerName(text);
  };

  const makeApiCall = async (selectedResponse, contactNumber) => {
    const apiURL =
      'https://wa.chatmybot.in/gateway/waunofficial/v1/api/v2/message';
    const accessToken = 'c7475f11-97cb-4d52-9500-f458c1a377f4';

    const contentTemplate = selectedResponse?.template || '';

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
      sdata?.serviceName,
    );
    const slotTiming = serviceName.replace(
      /\{Slot_timing\}/g,
      selectedSlotText,
    );
    const serivePrice = slotTiming.replace(
      /\{Service_amount\}/g,
      couponDiscount,
    );
    const serviceDate = serivePrice.replace(/\{Service_date\}/g, selectedDate);
    // const serviceVideoLink = serviceDate.replace(
    //   /\{Video_link\}/g,
    //   selectedVideoLink
    // );

    // // Replace <p> with line breaks and remove HTML tags
    const convertedText = serviceDate
      .replace(/<p>/g, '\n')
      .replace(/<\/p>/g, '')
      .replace(/<br>/g, '\n')
      .replace(/&nbsp;/g, '')
      .replace(/<strong>(.*?)<\/strong>/g, '<b>$1</b>')
      .replace(/<[^>]*>/g, '');

    const requestData = [
      {
        dst: '91' + contactNumber,
        messageType: '0',
        textMessage: {
          content: convertedText,
        },
      },
    ];
    try {
      const response = await axios.post(
        'https://api.vijayhomeservicebengaluru.in/send-message',
        {
          mobile: contactNumber,
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
    // Simulate loading for 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Clear the timer when the component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const [paymentData, setPaymentData] = useState({
    merchant_id: '3663823',
    order_id: '0001',
    currency: 'INR',
    amount: total
      ? total + parseInt(couponDiscount) - discountAmount
      : couponDiscount - discountAmount,

    cancel_url: 'http://localhost:3000/payment-cancel',
    language: 'EN',
  });

  const ab = total
    ? parseFloat(total) +
      parseFloat(couponDiscount) -
      (isSelected ? parseFloat(discountAmount) : 0)
    : parseFloat(couponDiscount) -
      (isSelected ? parseFloat(discountAmount) : 0);

  console.log('ab:', ab, 'isSelected:', isSelected);

  // Calculate vendor charge as 35% of `ab`
  const vendorCharge = (ab * 35) / 100;

  // Calculate GST based on `isSelected`
  const GST = ((vendorCharge * 18) / 100).toFixed(2); // GST is 18% of `ab` if selected

  // const finalGrandTotal = ab + parseInt(GST).toFixed(2);
  const finalGrandTotal = (ab + parseFloat(GST)).toFixed(2);

  // const handleSubmit1 = async e => {
  //   e.preventDefault();

  //   const paydata1 = {
  //     customerData: {
  //       _id: user?._id,
  //       EnquiryId: user?.EnquiryId,
  //       customerName: user?.customerName,
  //       category: user?.category,
  //       mainContact: user?.mainContact,
  //       email: user?.email,
  //       approach: user?.approach,
  //     },
  //     customerData: user?._id,
  //     dividedDates: dividedDates.length ? dividedDates : [selectedDate],
  //     customerName: customerName,
  //     email: email,
  //     userId: user?._id,
  //     dividedamtCharges: dividedamtCharges,
  //     dividedamtDates: dividedamtDates,
  //     paymentMode: 'Trying to booking',
  //     cardNo: user?.cardNo,
  //     category: sdata?.category,
  //     contractType: 'One Time',
  //     service: sdata?.serviceName,
  //     serviceID: sdata?._id,
  //     serviceCharge: GrandTotal,
  //     dateofService: selectedDate,
  //     selectedSlotText: selectedSlotText,
  //     serviceFrequency: 1,
  //     startDate: selectedDate,
  //     expiryDate: selectedDate,
  //     firstserviceDate: selectedDate,
  //     date: moment().format('YYYY-MM-DD'),
  //     time: moment().format('LT'),
  //     type: 'website',
  //     desc: joinedPlanNames,
  //     city: savecity,
  //     discAmt: isSelected ? discountAmount : 0,
  //     GrandTotal: finalGrandTotal,
  //     TotalAmt: finalGrandTotal,
  //     couponCode: Coupancode,
  //     totalSaved: discAmt
  //       ? savedAmt + FreqensaveAmt + discAmt
  //       : savedAmt + FreqensaveAmt,
  //     markerCoordinate: markerCoordinate,
  //     deliveryAddress: Fulladd,
  //     amount: total
  //       ? total + parseInt(couponDiscount) - discountAmount
  //       : couponDiscount - discountAmount,
  //     number: user.mainContact,
  //     MUID: 'MUID' + Date.now(),
  //     transactionId: 'T' + Date.now(),
  //   };

  //   const updatedRedirectUrl = `https://api.vijayhomeservicebengaluru.in/api/payment/CCAvenueUserAppstatus/${paydata1.transactionId}/${paydata1.userId}/${paydata1.serviceID}`;

  //   const paymentString = new URLSearchParams({
  //     merchant_id: paymentData.merchant_id,
  //     order_id: paymentData.order_id,
  //     currency: paymentData.currency,
  //     amount: paymentData.amount,
  //     redirect_url: updatedRedirectUrl,
  //     cancel_url: paymentData.cancel_url,
  //     language: paymentData.language,
  //   }).toString();

  //   try {
  //     const response = await axios.post(
  //       'https://api.vijayhomeservicebengaluru.in/api/payment/CCAvenueUserApppayment',
  //       {payment_string: paymentString, updateddata: paydata1},
  //     );
  //     console.log('paymentString:', paymentString);

  //     if (response && response.data && response.data.url) {
  //       setShowWebView(true);
  //       setPaymentUrl(response.data.url);
  //     }
  //   } catch (error) {
  //     console.error(
  //       'Error initiating payment:',
  //       error.response || error.message || error,
  //     );
  //   }
  // };

  const handleSubmit1 = async () => {
    if (!selectedDate) {
      alert('Please select the Service date  ');

      return;
    }
    if (!selectedSlotText) {
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
            // user.voucherCode = voucherCode;
            const config = {
              url: 'https://newapi.vijayhomeservicebengaluru.in/api/customerPG/customer-booking-payment',
              method: 'post',

              headers: {'content-type': 'application/json'},
              data: {
                customerName: customerName ? customerName : user.name,
                email: email ? email : user.email,
                city: savecity,
                category: sdata?.category,
                contract_type: !plan?.pservices ? 'One Time' : 'AMC',
                service: sdata?.serviceName,
                service_id: sdata?._id,
                service_charge: finalGrandTotal,
                date_of_service: selectedDate,
                selected_slot_text: selectedSlotText,
                serviceFrequency: plan?.pservices,
                start_date: selectedDate,
                expiry_date: expiryDate,
                amtstart_date: selectedDate,
                amtexpiry_date: selectedDate,
                servicePeriod: plan?.servicePeriod,
                type: 'userapp',
                description: joinedPlanNames,
                amt_frequency: plan?.pservices,
                user_id: user?.id,
                delivery_address: Fulladd,

                discount_amount: discAmt ? discAmt : 0,

                grand_total: finalGrandTotal,
                payment_mode: 'cash',
                total_amount: total
                  ? parseFloat(plan.pPrice) + parseFloat(total)
                  : plan.pPrice,
                coupon_code: Coupancode,
                total_saved: discAmt
                  ? savedAmt + FreqensaveAmt + discAmt
                  : savedAmt + FreqensaveAmt,
                marker_coordinate: markerCoordinate,
              },
            };
            await axios(config).then(function (response) {
              if (response.status === 200) {
                const selectedResponse = whatsappdata[0];
                deleteAllCartItems();

                setModalVisible1(false);
                bottomSheet.current.close();

                makeApiCall(selectedResponse, user.mainContact);

                AsyncStorage.setItem(
                  'user',
                  JSON.stringify(response.data.user),
                );

                if (response.data.url) {
                  setShowWebView(true);
                  setPaymentUrl(response.data.url);
                }
              }
            });
          }
        } else if (customerName) {
          if (!Fulladd) {
            alert('Please select the address  ');
          }
          // if (couponDiscount < 700) {
          //   alert("Please add morethan 700Rs ");
          // }
          else {
            setModalVisible1(true);
            const config = {
              url: 'https://newapi.vijayhomeservicebengaluru.in/api/customerPG/customer-booking-payment',
              method: 'post',

              headers: {'content-type': 'application/json'},
              data: {
                customerName: customerName ? customerName : user.name,
                email: email ? email : user.email,
                city: savecity,
                category: sdata?.category,
                contract_type: !plan?.pservices ? 'One Time' : 'AMC',
                service: sdata?.serviceName,
                service_id: sdata?._id,
                service_charge: finalGrandTotal,
                date_of_service: selectedDate,
                selected_slot_text: selectedSlotText,
                serviceFrequency: plan?.pservices,
                start_date: selectedDate,
                expiry_date: expiryDate,
                amtstart_date: selectedDate,
                amtexpiry_date: selectedDate,
                servicePeriod: plan?.servicePeriod,
                type: 'userapp',
                description: joinedPlanNames,
                amt_frequency: plan?.pservices,
                user_id: user?.id,
                delivery_address: Fulladd,

                discount_amount: discAmt ? discAmt : 0,

                grand_total: finalGrandTotal,
                payment_mode: 'cash',
                total_amount: total
                  ? parseFloat(plan.pPrice) + parseFloat(total)
                  : plan.pPrice,
                coupon_code: Coupancode,
                total_saved: discAmt
                  ? savedAmt + FreqensaveAmt + discAmt
                  : savedAmt + FreqensaveAmt,
                marker_coordinate: markerCoordinate,
              },
            };
            await axios(config).then(function (response) {
              if (response.status === 200) {
                const selectedResponse = whatsappdata[0];
                deleteAllCartItems();

                setModalVisible1(false);
                bottomSheet.current.close();

                makeApiCall(selectedResponse, user.mainContact);

                AsyncStorage.setItem(
                  'user',
                  JSON.stringify(response.data.user),
                );

                if (response.data.url) {
                  setShowWebView(true);
                  setPaymentUrl(response.data.url);
                }
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

  const addtreatmentdetails = async a => {
    if (!selectedDate) {
      alert('Please select the Service date  ');

      return;
    }
    if (!selectedSlotText) {
      alert('Please select the Service slot  ');

      return;
    }

    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);

        if (user.customerName) {
          if (!Fulladd) {
            alert('Please select the address  ');
          }
          // if(couponDiscount < 700){
          //   alert("Please add more than 700Rs");
          // }
          else {
            setModalVisible1(true);
            user.voucherCode = voucherCode;
            const config = {
              url: 'https://newapi.vijayhomeservicebengaluru.in/api/bookings/create',
              method: 'post',

              headers: {'content-type': 'application/json'},
              data: {
                customerName: customerName ? customerName : user.name,
                email: email ? email : user.email,
                city: savecity,
                category: sdata?.category,
                contract_type: !plan?.pservices ? 'One Time' : 'AMC',
                service: sdata?.serviceName,
                service_id: sdata?._id,
                service_charge: finalGrandTotal,
                date_of_service: selectedDate,
                selected_slot_text: selectedSlotText,
                serviceFrequency: plan?.pservices,
                start_date: selectedDate,
                expiry_date: expiryDate,
                amtstart_date: selectedDate,
                amtexpiry_date: selectedDate,
                servicePeriod: plan?.servicePeriod,
                type: 'userapp',
                description: joinedPlanNames,
                amt_frequency: plan?.pservices,
                user_id: user?.id,
                delivery_address: Fulladd,

                discount_amount: discAmt ? discAmt : 0,

                grand_total: finalGrandTotal,
                payment_mode: 'cash',
                total_amount: total
                  ? parseFloat(plan.pPrice) + parseFloat(total)
                  : plan.pPrice,
                coupon_code: Coupancode,
                total_saved: discAmt
                  ? savedAmt + FreqensaveAmt + discAmt
                  : savedAmt + FreqensaveAmt,
                marker_coordinate: markerCoordinate,
              },
            };
            await axios(config).then(function (response) {
              if (response.status === 201) {
                const selectedResponse = whatsappdata[0];
                deleteAllCartItems();

                setModalVisible1(false);
                navigation.navigate('success', {data: response.data.booking});
                makeApiCall(selectedResponse, user.mainContact);
                AsyncStorage.setItem(
                  'user',
                  JSON.stringify(response.data.user),
                );
              }
            });
          }
        } else if (customerName) {
          if (!Fulladd) {
            alert('Please select the address  ');
          }
          // if(couponDiscount < 700){
          //   alert("Please add more than 700Rs");
          // }
          else {
            setModalVisible1(true);
            const config = {
              url: 'https://newapi.vijayhomeservicebengaluru.in/api/bookings/create',
              method: 'post',

              headers: {'content-type': 'application/json'},
              data: {
                customerName: customerName ? customerName : user.name,
                email: email ? email : user.email,
                city: savecity,
                category: sdata?.category,
                contract_type: !plan?.pservices ? 'One Time' : 'AMC',
                service: sdata?.serviceName,
                service_id: sdata?._id,
                service_charge: finalGrandTotal,
                date_of_service: selectedDate,
                selected_slot_text: selectedSlotText,
                serviceFrequency: plan?.pservices,
                start_date: selectedDate,
                expiry_date: expiryDate,
                amtstart_date: selectedDate,
                amtexpiry_date: selectedDate,
                servicePeriod: plan?.servicePeriod,
                type: 'userapp',
                description: joinedPlanNames,
                amt_frequency: plan?.pservices,
                user_id: user?.id,
                delivery_address: Fulladd,

                discount_amount: discAmt ? discAmt : 0,

                grand_total: finalGrandTotal,
                payment_mode: 'cash',
                total_amount: total
                  ? parseFloat(plan.pPrice) + parseFloat(total)
                  : plan.pPrice,
                coupon_code: Coupancode,
                total_saved: discAmt
                  ? savedAmt + FreqensaveAmt + discAmt
                  : savedAmt + FreqensaveAmt,
                marker_coordinate: markerCoordinate,
              },
            };
            await axios(config).then(function (response) {
              if (response.status === 201) {
                const selectedResponse = whatsappdata[0];
                deleteAllCartItems();
                // dispatch(clearCart());
                setModalVisible1(false);
                navigation.navigate('success', {data: response.data.booking});

                makeApiCall(selectedResponse, user.mainContact);
                AsyncStorage.setItem(
                  'user',
                  JSON.stringify(response.data.user),
                );
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
      alert(' Not Added1');
    } finally {
      setModalVisible1(false);
    }
  };

  return (
    <View style={{flex: 1}}>
      {isLoading ? (
        <Loader />
      ) : (
        <View style={{flex: 1}}>
          {showWebView ? (
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: 'red',
                  fontSize: 18,
                  textAlign: 'center',
                  backgroundColor: 'white',
                }}>
                Please wait while you get redirected
              </Text>
              <WebView source={{uri: paymentUrl}} style={{flex: 1}} />
              <Text
                style={{
                  color: 'black',
                  fontSize: 12,
                  textAlign: 'center',
                  backgroundColor: 'white',
                }}>
                Please note: By any chance if you close the app directly we're
                not responsible for any deductions that happens and you may not
                be liable for a refund{' '}
              </Text>
            </View>
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
              {time == true ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    backgroundColor: 'white',
                  }}>
                  <LottieView
                    size={6}
                    color="blue"
                    style={{textAlign: 'center'}}
                  />
                </View>
              ) : (
                <View style={styles.container}>
                  <ScrollView style={{marginBottom: 30}}>
                    <View style={{margin: 15}}>
                      <Text
                        style={{
                          color: 'black',
                          // backgroundColor: '#41f4ee',
                          // width: 150,
                          // borderTopRightRadius: 80,
                          // padding: 3,
                          fontSize: 18,
                          fontFamily: 'Poppins-Medium',
                        }}>
                        Service Details
                      </Text>
                      <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 0.3, marginTop: 20}}>
                          <Image
                            source={{
                              uri: `https://api.vijayhomesuperadmin.in/service/${sdata?.serviceImg}`,
                            }}
                            style={{width: 80, height: 80}}
                          />

                          <View style={styles.hrtag} />
                        </View>
                        <View
                          style={{
                            flex: 0.7,
                            // margin: 10,
                          }}>
                          <Text
                            style={{
                              fontSize: 18,
                              color: 'black',
                              fontFamily: 'Poppins-Medium',
                              marginTop: 5,
                            }}>
                            {sdata?.serviceName}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              color: 'black',
                              marginTop: 5,
                            }}>
                            {sdata?.serviceDesc[0]?.text}
                          </Text>

                          <View style={{flexDirection: 'row', marginTop: 1}}>
                            <Text
                              style={{
                                color: 'black',
                                fontFamily: 'Poppins-Bold',
                              }}>
                              {' '}
                            </Text>
                            <Text style={styles.originalPrice}>
                              ₹{plan?.pPrice}
                            </Text>
                            <Text
                              style={{
                                color: 'black',
                                fontFamily: 'Poppins-Medium',
                                color: '#e41b17',
                                fontSize: 16,
                                marginLeft: 5,
                              }}>
                              {' '}
                              ₹{plan?.pofferprice}
                            </Text>
                          </View>
                          {plan?.pservices ? (
                            <Text style={{marginLeft: 10, color: 'black'}}>
                              {plan?.pservices} Services
                            </Text>
                          ) : (
                            ''
                          )}

                          <Text style={{marginLeft: 10}}>
                            {sdata?.serviceHours}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {addondata.length > 0 ? (
                      <View style={{backgroundColor: 'white', margin: 10}}>
                        <Text
                          style={{
                            color: 'black',
                            // backgroundColor: '#41f4ee',
                            // width: 250,
                            // borderTopRightRadius: 80,
                            // padding: 3,
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
                              // Replace this condition with your specific condition for checking if an item is in the cart
                              const cartItem = MyCartItmes?.find(
                                cartItem => cartItem.id === i._id,
                              );
                              // Check if the item is in the cart
                              const isItemInCart = !!cartItem;

                              console.log(
                                'cartItem ===',
                                cartItem?.qty * i.addOnsPrice,
                              );
                              return (
                                <View
                                  key={i.addOnsId} // Add a unique key for each item in the map function
                                  style={{
                                    width: 180,
                                    // borderWidth: 2,
                                    borderColor: '#FFD700',
                                    // backgroundColor: '#FFFFE0',
                                    borderRadius: 10,
                                    margin: 10,
                                    // height: 130,
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
                                          // marginTop: 20,
                                          justifyContent: 'center',
                                          // borderWidth: 1,
                                          padding: 2,
                                          width: '70%',
                                          justifyContent: 'center',
                                          alignContent: 'center',
                                          alignSelf: 'center',
                                          // borderColor: 'darkred',
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
                                              dispatch(
                                                removeMyCartItemaddon(cartItem),
                                              );
                                            } else {
                                              dispatch(
                                                deleteMyCartItemaddon(
                                                  cartItem.id,
                                                ),
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
                                          onPress={() =>
                                            handleaddon1(cartItem)
                                          }>
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
                                          // borderWidth: 1,
                                          width: 80,
                                          borderColor: 'grey',
                                          borderRadius: 5,
                                          position: 'absolute',
                                          bottom: 10,
                                          justifyContent: 'center',
                                          alignSelf: 'center',
                                          elevation: 15,
                                          backgroundColor: 'darkred',
                                          // borderColor: 'darkred',
                                        }}
                                        onPress={() => handle(i)}>
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
                                      <Text
                                        style={styles.summarytext}
                                        numberOfLines={2}>
                                        {i.addOnsName}
                                      </Text>
                                    </View>
                                    {/* <View>
                                  <Text
                                    style={{fontSize: 12, color: 'black'}}
                                    numberOfLines={2}
                                    ellipsizeMode="tail">
                                    {i.addOnsDescription}
                                  </Text>
                                </View> */}
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        // justifyContent: 'center',
                                        // alignItems: 'center',
                                        // marginTop: 10,
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
                      <View style={{margin: 15}}>
                        <Text
                          style={{
                            color: 'black',

                            fontSize: 18,
                            fontFamily: 'Poppins-Medium',
                          }}>
                          Select the Date
                        </Text>
                        <View style={{flexDirection: 'row', marginTop: 20}}>
                          <TouchableOpacity
                            style={[
                              styles.box,
                              isTabActive(today.format('YYYY-MM-DD')) && {
                                backgroundColor: 'darkred',
                              },
                            ]}
                            onPress={() => handleTabClick(today)}>
                            <Text
                              style={[
                                styles.box3,
                                isTabActive(today.format('YYYY-MM-DD')) && {
                                  color: 'white',
                                  fontFamily: 'Poppins-Medium',
                                },
                              ]}>
                              {today.format('ddd, D')}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              styles.box,
                              isTabActive(tomorrow.format('YYYY-MM-DD')) && {
                                backgroundColor: 'darkred',
                              },
                            ]}
                            onPress={() => handleTabClick(tomorrow)}>
                            <Text
                              style={[
                                styles.box3,
                                isTabActive(tomorrow.format('YYYY-MM-DD')) && {
                                  color: 'white',
                                  fontFamily: 'Poppins-Medium',
                                },
                              ]}>
                              {tomorrow.format('ddd, D')}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              styles.box,
                              isTabActive(nextTwoDays.format('YYYY-MM-DD')) && {
                                backgroundColor: 'darkred',
                              },
                            ]}
                            onPress={() => handleTabClick(nextTwoDays)}>
                            <Text
                              style={[
                                styles.box3,
                                isTabActive(
                                  nextTwoDays.format('YYYY-MM-DD'),
                                ) && {
                                  color: 'white',
                                  fontFamily: 'Poppins-Medium',
                                },
                              ]}>
                              {nextTwoDays.format('ddd, D')}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={{margin: 15, flexDirection: 'row'}}>
                        <TouchableOpacity
                          style={[
                            styles.box,
                            isTabActive(nextthreeDays.format('YYYY-MM-DD')) && {
                              backgroundColor: 'darkred',
                            },
                          ]}
                          onPress={() => handleTabClick(nextthreeDays)}>
                          <Text
                            style={[
                              styles.box3,
                              isTabActive(
                                nextthreeDays.format('YYYY-MM-DD'),
                              ) && {
                                color: 'white',
                                fontFamily: 'Poppins-Medium',
                              },
                            ]}>
                            {nextthreeDays.format('ddd, D')}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{flex: 0.7, padding: 0}}
                          onPress={openCalendar}>
                          <View>
                            {!date ? (
                              <View style={styles.date}>
                                <Feather
                                  name="calendar"
                                  size={20}
                                  color="black"
                                  style={{paddingRight: 10}}
                                />
                                <Text> Select a date</Text>
                              </View>
                            ) : (
                              <View style={styles.date}>
                                <Text
                                  style={{
                                    fontFamily: 'Poppins-Bold',
                                    color: 'white',
                                  }}>
                                  {selectedDate}
                                </Text>
                              </View>
                            )}
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={{padding: 10}}>
                        {selectedDate ? (
                          <View>
                            <Text
                              style={{
                                color: 'black',
                                // backgroundColor: '#41f4ee',
                                // width: 150,
                                // borderTopRightRadius: 80,
                                // padding: 3,
                                fontSize: 18,
                                fontFamily: 'Poppins-Medium',
                                marginBottom: 10,
                              }}>
                              {' '}
                              Select the Time
                            </Text>
                            {renderSlots().length > 0 ? (
                              // setModalVisible(true),
                              renderSlots()
                            ) : (
                              <Text
                                style={{
                                  marginLeft: 10,
                                  color: 'black',
                                  marginTop: 10,
                                  fontFamily: 'Poppins-Medium',
                                  fontSize: 16,
                                }}>
                                No slots available for the date -Please try next
                                date
                              </Text>
                            )}
                          </View>
                        ) : (
                          <></>
                        )}
                      </View>
                      <View style={{paddingLeft: 15}}>
                        <Text
                          style={{
                            color: 'black',
                            // backgroundColor: '#41f4ee',
                            // width: 180,
                            // borderTopRightRadius: 80,
                            // padding: 3,
                            fontSize: 18,
                            fontFamily: 'Poppins-Medium',
                          }}>
                          {' '}
                          Select the address
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.address}
                        onPress={() => {
                          // handleAddressSelection();
                          setModalVisible(true);
                        }}>
                        <View style={{flex: 0.9}}>
                          <Text numberOfLines={1} style={{color: 'black'}}>
                            {Fulladd.address ||
                            Fulladd.platNo ||
                            Fulladd.landmark
                              ? `${Fulladd.address}, `
                              : 'Select the address'}
                          </Text>
                        </View>
                        <View style={{flex: 0.1}}>
                          <Entypo name="location-pin" size={20} />
                        </View>
                      </TouchableOpacity>

                      {user?.customerName || user?.email ? (
                        <></>
                      ) : (
                        <View>
                          <View style={{paddingLeft: 15}}>
                            <Text
                              style={{
                                color: 'black',
                                // backgroundColor: '#41f4ee',
                                // width: 180,
                                // borderTopRightRadius: 80,
                                // padding: 3,
                                fontSize: 18,
                                fontFamily: 'Poppins-Medium',
                              }}>
                              {' '}
                              Customer details
                            </Text>
                          </View>

                          <View style={{margin: 15}}>
                            <TextInput
                              placeholder="Customer Name "
                              placeholderTextColor={'grey'}
                              style={{
                                elevation: 15,
                                backgroundColor: 'white',
                                borderWidth: 1,
                                borderColor: 'white',
                                paddingLeft: 10,
                                color: 'black',
                                padding: 10,
                              }}
                              value={customerName}
                              underlineColorAndroid={
                                Platform.OS === 'android' ? 'white' : null
                              }
                              onChangeText={handlecustomer}
                            />
                            <TextInput
                              placeholder="Email "
                              placeholderTextColor={'grey'}
                              style={{
                                elevation: 15,
                                backgroundColor: 'white',
                                borderWidth: 1,
                                borderColor: 'white',
                                paddingLeft: 10,
                                marginTop: 15,
                                color: 'black',
                                padding: 10,
                              }}
                              value={email}
                              onChangeText={handleemail}
                              underlineColorAndroid={
                                Platform.OS === 'android' ? 'white' : null
                              }
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
                          margin: 15,
                        }}>
                        <Text
                          style={{
                            color: 'black',
                            // backgroundColor: '#41f4ee',
                            // width: 180,
                            // borderTopRightRadius: 80,
                            // padding: 3,
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
                              }}
                              onChangeText={text => setVoucherCode(text)}
                              placeholder="Enter Voucher Code"
                              placeholderTextColor={'grey'}
                              underlineColorAndroid={
                                Platform.OS === 'android' ? 'white' : null
                              }
                            />
                            <Text style={{color: 'red'}}>
                              {validationMessage}
                            </Text>
                          </View>
                          <View style={{flex: 0.1}}></View>
                          <View style={{flex: 0.45}}>
                            <TouchableOpacity
                              onPress={() => {
                                const result = applyCouponCode();
                                setDiscountedTotal(result);

                                // setCouponDiscountShow(true)
                              }}
                              style={{
                                backgroundColor: 'darkred',
                                padding: 10,
                                borderRadius: 5,
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
                    <View>
                      <Text
                        style={{
                          color: '#387ADF',
                          fontFamily: 'Poppins-Medium',
                          marginLeft: 10,
                        }}>
                        {' '}
                        *Book over Rs 1500 to use wallet !
                      </Text>
                      <Text
                        style={{
                          color: '#387ADF',
                          fontFamily: 'Poppins-Medium',
                          marginLeft: 10,
                        }}>
                        {' '}
                        *Book over Rs 1500 to use wallet,upto10% From your
                        wallet Account !
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: 'white',
                        marginTop: 10,
                        paddingLeft: 15,
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          backgroundColor: 'rgb(214, 202, 140)',
                          width: 180,
                          borderTopRightRadius: 80,
                          padding: 3,
                          fontSize: 18,
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
                              {total
                                ? parseFloat(plan.pPrice) + parseFloat(total)
                                : plan.pPrice}
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
                              {couponDiscount !== GrandTotal && appliedCoupon
                                ? `${appliedCoupon.discountPercentage}%`
                                : '0%'}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={{flexDirection: 'row', margin: 10}}>
                        <View style={{flex: 0.8}}>
                          <Text style={styles.summarytext}>Taxes and Fees</Text>
                        </View>
                        <View style={{flex: 0.2, alignItems: 'flex-end'}}>
                          <View style={{flexDirection: 'row'}}>
                            <Text style={styles.summarytext}>
                              {Number(GST).toFixed(2)}
                            </Text>
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
                              {discAmt
                                ? savedAmt + FreqensaveAmt + discAmt
                                : savedAmt + FreqensaveAmt}
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

                      {discountAmount && GrandTotal > 1500 ? (
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
                              Use wallet{' '}
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
                                {discountAmount
                                  ? -discountAmount.toFixed(0)
                                  : ''}
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
                          // elevation: 3,
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

                  <Modal isVisible={ModalVisible1}>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: 'white',
                        padding: 15,
                      }}>
                      <ActivityIndicator size="large" />
                      <Text
                        style={{color: 'black', fontSize: 23, marginLeft: 10}}>
                        Please wait.....
                      </Text>
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
                          // padding: 5,
                          marginBottom: 20,
                        }}>
                        <Feather name="x" color="grey" size={25} />
                      </TouchableOpacity>
                      <Text style={styles.title}>
                        Vijay Home Services Cancellation Policy
                      </Text>
                      <Text style={styles.subtitle}>
                        At Vijay Home Services, we understand that plans can
                        change. Our cancellation policy is designed to be fair
                        and transparent for all our customers.
                      </Text>
                      <Text style={styles.sectionTitle}>
                        No Cancellation Charges !!
                      </Text>
                      <Text style={styles.sectionText}>
                        Before 4 Hours: If you cancel your service more than 4
                        hours before the scheduled slot, there will be no
                        cancellation charges.
                      </Text>
                      <Text style={styles.sectionTitle}>
                        Cancellation Charges !!
                      </Text>
                      <Text style={styles.sectionText}>
                        Within 4 Hours to 1 Hour Before Scheduled Slot:
                        {'\n'}- Full House Cleaning: ₹500
                        {'\n'}- Sofa/Kitchen/Bathroom/Mini-Services Cleaning:
                        ₹100
                        {'\n'}- Home Repair Services: ₹200
                        {'\n'}- Appliances Services: ₹200
                      </Text>
                      <Text style={styles.sectionText}>
                        Within 1 Hour and After Scheduled Slot:
                        {'\n'}- Full House Cleaning: ₹700
                        {'\n'}- Sofa/Kitchen/Bathroom/Mini-Services Cleaning:
                        ₹150
                      </Text>
                      <Text style={styles.sectionText}>
                        We appreciate your understanding and cooperation. Please
                        contact us as soon as possible if you need to cancel or
                        reschedule your service to avoid any charges.
                      </Text>
                      <TouchableOpacity>
                        <Text></Text>
                      </TouchableOpacity>
                    </View>
                  </Modal>

                  <Modal isVisible={LoginModal}>
                    <View style={styles.modalContainer}>
                      <View style={styles.modalContent}>
                        <TouchableOpacity
                          style={styles.closeButton}
                          onPress={() => setLoginModal(false)}>
                          <AntDesign name="close" size={20} color="lightgrey" />
                        </TouchableOpacity>
                        <Text style={styles.title}>MOBILE NUMBER</Text>
                        <Text style={styles.subtitle}>
                          Please enter your mobile number
                        </Text>
                        <TextInput
                          style={[styles.input, {color: 'black'}]}
                          keyboardType="numeric"
                          maxLength={10}
                          onChangeText={text => setmainContact(text)}
                          value={mainContact}
                          placeholder="00000 00000"
                          underlineColorAndroid="transparent"
                        />
                        <TouchableOpacity
                          style={styles.submitButton}
                          onPress={sendOTP}>
                          <Text style={styles.submitButtonText}>SUBMIT</Text>
                        </TouchableOpacity>
                      </View>
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
                        minDate={today.toISOString().split('T')[0]} // Allow selection from the 10th day of the current month
                        onDayPress={handleDayPress} // Use the handleDayPress function
                        current={
                          selectedDate || new Date().toISOString().split('T')[0]
                        } // Use selectedDate or today's date if it's not set
                        markedDates={{
                          [selectedDate]: {
                            selected: true,
                            disableTouchEvent: true,
                            selectedDotColor: 'orange',
                          },
                        }}
                      />
                    </View>
                  </Modal>

                  {selectedDate && selectedSlotText ? (
                    <View onPress={() => setModalVisible(true)}></View>
                  ) : (
                    ''
                  )}

                  {selectedDate && selectedSlotText ? (
                    <TouchableOpacity
                      onPress={() => {
                        if (!Fulladd.address) {
                          alert('Please select the address');
                        } else {
                          bottomSheet.current.show();
                        }
                      }}
                      style={{
                        flexDirection: 'row',
                        backgroundColor: 'darkred',

                        padding: 10,
                        borderRadius: 5,
                        width: '90%',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        alignContent: 'center',
                      }}>
                      <View>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 16,
                            fontFamily: 'Poppins-Medium',
                          }}>
                          Book Now
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <Pressable
                      style={{
                        flexDirection: 'row',
                        backgroundColor: '#8b00005e',

                        padding: 10,
                        borderRadius: 5,
                        width: '90%',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        alignContent: 'center',
                      }}>
                      <View>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 16,
                            fontFamily: 'Poppins-Medium',
                          }}>
                          Book Now
                        </Text>
                      </View>
                    </Pressable>
                  )}

                  <View>
                    <BottomSheet
                      hasDraggableIcon
                      ref={bottomSheet}
                      height={200}>
                      <View style={{margin: 10}}>
                        <Text
                          style={{
                            color: 'black',
                            fontSize: 18,
                            fontFamily: 'Poppins-Medium',
                            textAlign: 'center',
                            marginTop: 10,
                            borderBottomWidth: 1,
                            borderColor: '#eee',
                            paddingBottom: 15,
                          }}>
                          Select Payment Type
                        </Text>

                        <View
                          style={{
                            flexDirection: 'row',
                            margin: 10,
                          }}>
                          <TouchableOpacity
                            style={styles.paymentrow}
                            onPress={handleSubmit1}>
                            <Image
                              source={require('../../../assets/mastercard.png')}
                              style={styles.mastercardimg}
                            />
                            <Text style={styles.mastercardtext}>Pay now</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.paymentrow}
                            onPress={() => booking('cash')}>
                            <Image
                              source={require('../../../assets/cash.png')}
                              style={styles.mastercardimg}
                            />
                            <Text style={styles.mastercardtext}>
                              After Service
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </BottomSheet>
                  </View>

                  <View style={styles.centeredView}>
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalVisible}
                      onRequestClose={() => {
                        setModalVisible(false);
                      }}>
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          backgroundColor: 'white',
                          width: '100%',
                          elevation: 15,
                          borderRadius: 10,
                          height: 'auto',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            setModalVisible(false);
                          }}
                          style={{
                            alignSelf: 'flex-end',
                            backgroundColor: '',
                            borderWidth: 1,
                            borderRadius: 50,
                            borderColor: 'gray',
                            padding: 5,
                          }}>
                          <Feather name="x" color="black" size={29} />
                        </TouchableOpacity>
                        <View style={{margin: 15}}>
                          <View>
                            <Text style={styles.bd}>Select your address</Text>
                          </View>
                          <View
                            style={{
                              height: 1,
                              backgroundColor: 'lightgray',
                              marginTop: 15,
                            }}
                          />
                          {customeraddress.map(i => (
                            <TouchableOpacity
                              style={{flexDirection: 'row', marginTop: 15}}
                              onPress={() => {
                                setChecked(i);

                                handleSelectedAddress(i);
                                bottomSheet.current.show();
                                setModalVisible(false);
                              }}>
                              <View style={{flex: 0.15}}>
                                <RadioButton
                                  value={i}
                                  status={
                                    checked === i ? 'checked' : 'unchecked'
                                  }
                                  onPress={() => {
                                    setChecked(i);
                                    bottomSheet.current.show();
                                    handleSelectedAddress(i);
                                    setModalVisible(false);
                                  }}
                                />
                              </View>

                              <View style={{flex: 0.85}}>
                                <View style={{flexDirection: 'row'}}>
                                  <Text
                                    style={{
                                      color: 'black',
                                      fontFamily: 'Poppins-Medium',
                                      fontSize: 17,
                                    }}>
                                    {i.saveAs === 'other'
                                      ? i.otherData
                                      : i.saveAs}
                                  </Text>
                                </View>
                                <Text style={{fontSize: 13, color: 'black'}}>
                                  {i.platNo},{i.landmark},{i.address}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          ))}
                          <View
                            style={{
                              height: 1,
                              backgroundColor: 'lightgray',
                              marginTop: 15,
                            }}
                          />
                          <TouchableOpacity
                            onPress={mapModal}
                            style={{
                              flexDirection: 'row',
                              marginRight: 10,
                              marginTop: 15,
                            }}>
                            <AntDesign
                              name="plus"
                              size={16}
                              style={{color: 'darkred', marginTop: 2}}
                            />

                            <Text
                              style={{
                                marginLeft: 10,
                                color: 'darkred',
                                fontFamily: 'Poppins-Bold',
                                fontSize: 15,
                              }}>
                              Add new address
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            if (checked && Fulladd) {
                              setModalVisible(false);
                              bottomSheet.current.show();
                            } else {
                              alert('Please select an address');
                            }
                          }}
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              padding: 10,
                              textAlign: 'center',
                              backgroundColor: 'darkred',
                              marginTop: 30,
                              width: '90%',
                              borderRadius: 7,
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginBottom: 10,
                            }}>
                            Proceed
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </Modal>
                  </View>
                  <View style={styles.centeredView}>
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={locationModalVisible}
                      onRequestClose={() => {
                        setlocationModalVisible(false);
                      }}>
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          backgroundColor: 'white',
                          width: '100%',
                          elevation: 15,
                          borderRadius: 10,
                          height: 'auto',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            setlocationModalVisible(false);
                          }}
                          style={{
                            alignSelf: 'flex-end',
                            backgroundColor: '',
                            borderWidth: 1,
                            borderRadius: 50,
                            borderColor: 'gray',
                            padding: 5,
                          }}>
                          <Feather name="x" color="black" size={29} />
                        </TouchableOpacity>
                        <View style={{margin: 15}}>
                          <View>
                            <Text
                              style={{
                                color: 'black',
                                fontSize: 17,
                                fontFamily: 'Poppins-Medium',
                              }}>
                              Confirm your location
                            </Text>
                          </View>
                          <View
                            style={{
                              height: 1,
                              backgroundColor: 'lightgray',
                              marginTop: 15,
                            }}
                          />

                          <View style={{flex: 0.85}}>
                            <View style={{flexDirection: 'row'}}>
                              <Text
                                style={{
                                  color: 'black',
                                  marginTop: 20,
                                  fontSize: 13,
                                  fontFamily: 'Poppins-Medium',
                                }}>
                                {Fulladd?.address}
                              </Text>
                            </View>
                          </View>

                          <View
                            style={{
                              height: 1,
                              backgroundColor: 'lightgray',
                              marginTop: 15,
                            }}
                          />
                          <TouchableOpacity
                            onPress={mapModal}
                            style={{
                              flexDirection: 'row',
                              marginRight: 10,
                              marginTop: 15,
                            }}>
                            <AntDesign
                              name="plus"
                              size={16}
                              style={{color: 'darkred', marginTop: 2}}
                            />

                            <Text
                              style={{
                                marginLeft: 10,
                                color: 'darkred',
                                fontFamily: 'Poppins-Bold',
                                fontSize: 15,
                              }}>
                              Add new address
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            bottomSheet.current.show();
                          }}
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              padding: 10,
                              textAlign: 'center',
                              backgroundColor: 'darkred',
                              marginTop: 30,
                              width: '90%',
                              borderRadius: 7,
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginBottom: 10,
                            }}>
                            Proceed
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </Modal>
                  </View>
                  <View style={{flex: 1, backgroundColor: 'red'}}>
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
                        <AntDesign
                          name="closecircle"
                          color="darkred"
                          size={35}
                        />
                      </TouchableOpacity>
                      <View style={{flex: 1, backgroundColor: 'white'}}>
                        <View style={{flex: 1}}>
                          <View
                            style={{
                              position: 'absolute',
                              zIndex: 1111,
                              marginTop: 10,
                              paddingLeft: 10,
                            }}>
                            {/* <EvilIcons name="search" color="black" size={25} /> */}
                          </View>

                          <GooglePlacesAutocomplete
                            placeholder="Search location..."
                            placeholderTextColor={'grey'}
                            onPress={(data, details = null) => {
                              // 'details' is provided when fetchDetails = true
                              if (details) {
                                console.log('Latitude:', JSON.stringify(data));
                                console.log(
                                  'Longitude:',
                                  JSON.stringify(details?.geometry?.location),
                                );
                              }
                              searchLocation(data.description); // Update the selected location
                            }}
                            query={{
                              key: 'AIzaSyBF48uqsKVyp9P2NlDX-heBJksvvT_8Cqk', // Replace with your API key
                              language: 'en',
                            }}
                            onFail={error => console.log(error)}
                            fetchDetails={true} // Important: Enables fetching details including coordinates
                            styles={{
                              container: {
                                // backgroundColor: "darkred",
                                elevation: 15,
                                borderColor: 'orange',
                                position: 'absolute',
                                width: '100%',
                                height: 'auto',
                                zIndex: 11,
                                padding: 10,
                                color: 'black',
                              },
                              textInput: {
                                color: 'black', // Text color for input text
                              },
                              listView: {
                                backgroundColor: 'darkgrey', // Background color for the dropdown list
                              },
                              description: {color: 'black'},
                            }}
                          />

                          <View style={{flex: 1, zIndex: 1}}>
                            <MapView
                              ref={mapRef}
                              style={{width: '100%', height: 400}}
                              followsUserLocation={true}
                              onRegionChange={region =>
                                debouncedRegionChange(region)
                              }>
                              {/* <Marker
                                coordinate={markerCoordinate}
                                pinColor="green"
                                style={{width: 50, height: 50}}>
                                <View>
                                  <Image
                                    source={require('../../../assets/location.png')}
                                    style={{width: 45, height: '100%'}}
                                  />
                                </View>
                              </Marker> */}
                            </MapView>
                            <View style={styles.markerContent}>
                              <FontAwesome
                                name="map-pin"
                                color={'green'}
                                size={25}
                              />
                            </View>

                            <View
                              style={{
                                position: 'absolute',
                                bottom: 0,
                                zIndex: 1111,
                                backgroundColor: 'white',
                                padding: 8,
                                width: '100%',
                              }}>
                              <View>
                                <View>
                                  <TouchableOpacity
                                    onPress={() => getLocation()}
                                    style={{
                                      position: 'absolute',
                                      bottom: 5,
                                      zIndex: 1111,
                                      // right: 0,
                                      backgroundColor: 'orange',
                                      padding: 8,
                                    }}>
                                    <Text style={{color: 'white'}}>
                                      Use my current location
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                                <Text
                                  style={{
                                    fontSize: 15,
                                    color: 'black',
                                    fontFamily: 'Poppins-Medium',
                                  }}>
                                  Address:
                                </Text>
                                <Text style={{color: 'black', fontSize: 14}}>
                                  {address}
                                </Text>

                                <View style={{marginTop: 10}}>
                                  <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.label}>
                                      House /Flat/ Block No
                                    </Text>
                                    <Text style={{color: 'red'}}> *</Text>
                                  </View>

                                  <TextInput
                                    style={styles.input}
                                    value={platNo}
                                    onChangeText={text => setPlatNo(text)}
                                    underlineColorAndroid={
                                      Platform.OS === 'android' ? 'white' : null
                                    }
                                  />
                                </View>

                                <View style={{marginTop: 10}}>
                                  <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.label}>
                                      Landmark / Society name
                                    </Text>
                                    <Text style={{color: 'red'}}> *</Text>
                                  </View>

                                  <TextInput
                                    style={styles.input}
                                    value={landmark}
                                    onChangeText={text => setLandmark(text)}
                                    underlineColorAndroid={
                                      Platform.OS === 'android' ? 'white' : null
                                    }
                                  />
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    marginTop: 10,
                                  }}>
                                  <Text style={styles.label}>Save as</Text>
                                  <Text style={{color: 'red'}}> *</Text>
                                </View>

                                <View style={{flexDirection: 'row'}}>
                                  <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity
                                      onPress={handleHomePress}
                                      style={homeButtonStyle}>
                                      <Text
                                        style={{
                                          color: 'black',
                                          fontSize: 14,
                                          marginLeft: 0,
                                          backgroundColor: 'white',
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
                                          marginLeft: 0,
                                        }}>
                                        Others
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>

                                {isOthersClicked ? (
                                  <View style={{marginTop: 10}}>
                                    <TextInput
                                      style={styles.input}
                                      value={otherData}
                                      onChangeText={text => setotherData(text)}
                                      underlineColorAndroid={
                                        Platform.OS === 'android'
                                          ? 'white'
                                          : null
                                      }
                                    />
                                  </View>
                                ) : (
                                  <></>
                                )}

                                <TouchableOpacity
                                  onPress={addcustomeraddresss}
                                  style={{
                                    backgroundColor: 'darkred',
                                    padding: 8,
                                    borderRadius: 5,
                                    marginTop: 20,
                                  }}>
                                  <Text
                                    style={{
                                      textAlign: 'center',
                                      color: 'white',
                                      fontSize: 14,
                                      fontFamily: 'Poppins-Bold',
                                    }}>
                                    Save
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </Modal>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  },
  summarytext: {
    color: 'black',
    fontSize: 14,
    // marginLeft: 5,
    fontFamily: 'Poppins-Medium',
  },
  textinput: {
    borderRadius: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    fontSize: 16,
    flex: 0.3,
  },
  shead: {
    color: 'black',
    backgroundColor: 'rgb(219, 236, 231)',
    width: 150,
    borderTopRightRadius: 80,
    padding: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  elevation: {
    elevation: 15,
    marginTop: 20,
  },
  textinput1: {
    borderRadius: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    fontSize: 16,
    flex: 0.4,
    marginLeft: 10,
  },
  elevation1: {
    elevation: 15,
    flex: 0.5,
  },
  footer: {
    backgroundColor: 'red',
  },
  textinput2: {
    borderRadius: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    fontSize: 16,
    marginTop: 5,
    width: '100%',
    padding: 20,
  },
  elevation2: {
    elevation: 15,
  },
  button1: {
    backgroundColor: 'blue',
    borderRadius: 5,
    // margin: 10,
  },
  modalView: {
    // margin: 20,
    backgroundColor: 'gray',
    // borderRadius: 20,
    // padding: 35,
    // alignItems: 'center',
    shadowColor: '#000',
    borderRadius: 0,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    // borderRadius: 20,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    width: '100%',
  },
  button: {
    height: 50,
    width: 150,
    backgroundColor: '#140078',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: '#8559da',
    shadowOpacity: 0.7,
    shadowOffset: {
      height: 4,
      width: 4,
    },
    shadowRadius: 5,
    elevation: 6,
  },
  text: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  box3: {
    fontFamily: 'Poppins-Medium',
    color: 'black',
  },
  mastercardimg: {
    width: 30,
    height: 30,
    resizeMode: 'cover',
  },
  mastercardtext: {
    color: 'black',
    fontSize: 16,
    marginLeft: 10,
  },
  paymentrow: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightgrey',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    elevation: 15,
    backgroundColor: 'white',
  },
  paymentrow1: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
    borderColor: 'grey',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  button1: {
    backgroundColor: 'darkred',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    marginTop: 20,
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
    padding: 25,
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
  textinput0: {
    // backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#eee',
    width: '100%',
    fontSize: 16,
    marginTop: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
  inc: {
    flexDirection: 'row',
    padding: 6,
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  textinput: {
    backgroundColor: '#eee',
    width: '100%',
    fontSize: 14,
    paddingLeft: 50,
    marginTop: 20,
    borderRadius: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'black',
    marginBottom: 10,
    fontFamily: 'Poppins-Medium',
  },
  bd: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },

  box: {
    flex: 0.33,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderWidth: 1,
    marginRight: 5,
    padding: 5,
    borderColor: 'lightgrey',
    borderRadius: 7,
    textAlign: 'center',
    height: 'auto',
    fontSize: 14,
    elevation: 15,
    color: 'black',
    fontFamily: 'Poppins-Medium',
    backgroundColor: 'lightblue',
  },
  box1: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderWidth: 1,
    marginRight: 5,
    padding: 6,
    borderColor: 'gray',
    borderRadius: 7,
    textAlign: 'center',
    height: 'auto',
    flex: 0.3,
    height: 35,
  },
  date: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderWidth: 1,

    padding: 6,
    borderColor: 'lightgrey',
    borderRadius: 7,
    textAlign: 'center',
    height: 'auto',
    elevation: 15,
    backgroundColor: 'lightblue',
  },
  date1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderWidth: 1,

    padding: 6,
    borderColor: 'lightgrey',
    borderRadius: 7,
    textAlign: 'center',
    height: 'auto',
    elevation: 15,
    backgroundColor: 'darkred',
  },
  textinputicon: {
    position: 'absolute',
    top: 20,
    left: 16,
  },
  bd: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  address: {
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 1,
    margin: 15,
    borderRadius: 10,
    flexDirection: 'row',
    elevation: 15,
    borderColor: 'lightgrey',
  },
  slotRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  slotBox: {
    flex: 1,
    // flexBasis: "33%",
    borderWidth: 1,
    padding: 6,
    fontSize: 12,
    borderColor: 'skyblue',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    backgroundColor: 'skyblue',
    elevation: 15,
    borderRadius: 5,
  },
  boxText: {
    fontSize: 14,
  },
  textinputicon: {
    position: 'absolute',
    top: 20,
    left: 16,
  },
  modalContainer: {
    // flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
  },
  label: {
    color: 'black',
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    paddingBottom: 5,
  },
  input: {
    height: 45,
    borderRadius: 5,
    backgroundColor: 'white',
    color: 'black',
    paddingLeft: 15,
    elevation: 16,
  },
  title: {
    fontSize: 18,
    color: 'black',
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
  },
  separator: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
    color: 'black',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
    marginTop: 20,
    fontFamily: 'Poppins-Light',
  },
  submitButton: {
    backgroundColor: 'darkred',
    width: '100%',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    // fontWeight: "bold",
    fontFamily: 'Poppins-Bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  markerContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 150, // Adjust as needed
    left: '50%',
    marginLeft: -25, // Half the size of the FontAwesome icon (25px)
    textAlign: 'center',
    marginBottom: 10,
  },
  content: {
    flexGrow: 1,
    margin: 15,
  },
  title: {
    fontSize: 15,
    // fontWeight: "bold",
    marginBottom: 10,
    color: 'black',
    fontFamily: 'Poppins-ExtraBold',
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 10,
    color: 'black',
    fontFamily: 'Poppins-Medium',
  },
  sectionTitle: {
    fontSize: 14,
    // fontWeight: "bold",
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
});

export default Summary;
