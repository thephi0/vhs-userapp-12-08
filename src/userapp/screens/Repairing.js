import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Pressable,
  RefreshControl,
  SafeAreaView,
  Dimensions,
  UIManager,
  TextInput,
  BackHandler,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import {addToCart, clearCart, deleteMyCartItem} from './Redux1/MyCartSlice';
import {useFCMToken} from '../../ApiServices/FCMtoken';
import {useDispatch, useSelector} from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';
import {Linking} from 'react-native';
import Video from 'react-native-video';
import Loader from './Loader';
import ContentLoader from 'react-native-easy-content-loader';
import moment from 'moment';
import YoutubeIframe from 'react-native-youtube-iframe';
import Shimmer from 'react-native-shimmer';
import Icon from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper';


function Repairing({navigation}) {
  const dispatch = useDispatch();
  const fcmtoken = useFCMToken();
  const MyCartItmes = useSelector(state => state.cart);

  const Carttotal = MyCartItmes.reduce((accumulator, item) => {
    const offerPrice = parseFloat(item?.offerprice || item?.pofferprice);
    const quantity = parseInt(item?.qty);
    if (!isNaN(offerPrice) && !isNaN(quantity)) {
      const subtotal = offerPrice * quantity;
      return accumulator + subtotal;
    }
    return accumulator;
  }, 0);

  const CartSavedtotal = MyCartItmes.reduce((accumulator, item) => {
    const offerPrice = parseFloat(item?.offerprice || item?.pofferprice);
    const planPrice = parseFloat(item?.planPrice || item?.pPrice);
    const quantity = parseInt(item?.qty);
    if (!isNaN(offerPrice) && !isNaN(planPrice) && !isNaN(quantity)) {
      const subtotal = planPrice * quantity - offerPrice * quantity;
      return accumulator + subtotal;
    }
    return accumulator;
  }, 0);

  const [isPlaying1, setIsPlaying1] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);
  const [isPlaying2, setIsPlaying2] = useState(true);

  const handlePress1 = () => setIsPlaying1(!isPlaying1);
  const handlePress2 = () => setIsPlaying2(!isPlaying2);

  const isItemInCart = itemId =>
    MyCartItmes.some(cartItem => cartItem.id === itemId || cartItem._id === itemId);
  const getItemQuantityById = itemId => {
    const cartItem = MyCartItmes.find(
      item => item.id === itemId || item._id === itemId,
    );
    return cartItem ? cartItem.qty : 0;
  };

  const [address, setaddress] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const bottomSheet = useRef();
  const route = useRoute();
  const {cdata} = route.params || {};
  const [time, setTime] = useState(true);
  const [Servicedata, setServicedata] = useState([]);
  const [postsubdata, setpostsubdata] = useState([]);
  const [feqdata, setfeqdata] = useState([]);
  const [offerBannerdata, setofferBannerdata] = useState([]);
  const [catservicedata, setcatservicedata] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showratecard, setshowratecard] = useState(false);
  const toggleModal = () => setModalVisible(!isModalVisible);
  const [selectedItem, setSelectedItem] = useState(null);
  const [numberData, setNumbersData] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [showSelectedPrice, setShowSelectedPrice] = useState(false);
  const scrollViewRef = useRef(null);
  const [ITEM_HEIGHT, setItemHeight] = useState(400);
  const screenWidth = Dimensions.get('window').width - 20;
  const itemsPerRow = 2;
  const marginWidth = 20;
  const itemWidth = (screenWidth - marginWidth) / itemsPerRow;
  const [Vdata, setVdata] = useState('');
  const [pricesdata, setpricesdata] = useState([]);
  const [Item, setItem] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedPlan, setselectedPlan] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [ratingData, setratingData] = useState([]);
  const [isBuffering, setIsBuffering] = useState(true);
  const [savecity, setsavecity] = useState('');
  const [rateCarddata, setrateCarddata] = useState([]);

  const [user, setuser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [LoginModal, setLoginModal] = useState(false);
  const [mainContact, setmainContact] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [otpLoader, setotpLoader] = useState(false);

  // New states for Painting Enquiry Modal
  const [enquiryModalVisible, setEnquiryModalVisible] = useState(false);
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItemForEnquiry, setSelectedItemForEnquiry] = useState(null);

  useEffect(() => {
    if (user) {
      setEnquiryName(user.customerName || '');
      setEnquiryPhone(user.mainContact || '');
    }
  }, [user, enquiryModalVisible]);

  useEffect(() => {
    const loadUserData = async () => {
      setIsUserLoading(true);
      try {
        const userDataString = await AsyncStorage.getItem('user');
        if (userDataString) {
          const parsedUser = JSON.parse(userDataString);
          setuser(parsedUser);
        } else {
          setuser(null);
        }
      } catch (error) {
        setuser(null);
      }
      setIsUserLoading(false);
    };
    loadUserData();
  }, []);

  useEffect(() => {
    if (isUserLoading) {
      return;
    }
    if (!user || !user.id) {
      setLoginModal(true);
    } else {
      setLoginModal(false);
    }
  }, [user, isUserLoading]);

  useEffect(() => {
    AsyncStorage.getItem('savecity').then(value => {
      setsavecity(value);
    });
    getrateCard();
    getAllNumbers();
    getbannerimg();
    getwhyneed();
    getbannerdatamiddle();
    getReviewsVideos();
    getservicemanagement1();
  }, []);

  useEffect(() => {
    if (cdata) {
      getservicemanagement();
      getsubcategory();
      if (!Servicedata.length && !isUserLoading && !isLoading) {
        getservicemanagement1();
      }
    }
  }, [cdata, isUserLoading, isLoading]);

  useEffect(() => {
    if (selectedItem?.serviceName) {
      getsvideo();
    }
  }, [selectedItem]);

  const [svideodata, setsvideodata] = useState([]);

  const getsvideo = async () => {
    if (!selectedItem?.serviceName) return;
    try {
      let res = await axios.get(
        'https://api.vijayhomesuperadmin.in/api/userapp/getservicevideo',
      );
      if (res.status === 200) {
        setsvideodata(
          res.data?.serviceName.filter(
            i => i.serviceName === selectedItem?.serviceName,
          ),
        );
      }
    } catch (error) {
      console.error('Error fetching service video:', error);
    }
  };

  const getrateCard = async () => {
    try {
      let res = await axios.get(
        'https://api.vijayhomesuperadmin.in/api/userapp/getRateCard',
      );
      if (res.status === 200) {
        setrateCarddata(res.data?.RateCard);
      }
    } catch (error) {
      console.error('Error fetching rate card:', error);
    }
  };

  const getservicemanagement = async () => {
    if (!cdata) return;
    try {
      const res = await axios.get(
        'https://api.vijayhomesuperadmin.in/api/userapp/getservices',
      );
      if (res.status === 200) {
        const filteredBySubcategory = res.data?.service.filter(
          i => i.Subcategory === cdata?.subcategory,
        );
        const filteredByCategory = res.data?.service.filter(i => {
          return (
            i.category === cdata?.category &&
            !filteredBySubcategory.some(subItem => subItem._id === i._id)
          );
        });
        const othServiceNames = cdata.othservice?.map(item => item.name) || [];
        const filteredData = filteredByCategory.filter(item =>
          othServiceNames.some(name => item.serviceName === name),
        );
        setcatservicedata(filteredData);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const getservicemanagement1 = async () => {
    if (!cdata?.subcategory) return;
    try {
      const res = await axios.post(
        `https://api.vijayhomesuperadmin.in/api/userapp/postsubcatservice/`,
        {Subcategory: cdata?.subcategory},
      );
      if (res.status === 200) {
        const servicesWithImgLink = res.data?.subcatdata.map(service => ({
          ...service,
          imglink: service.imglink,
        }));
        setServicedata(servicesWithImgLink);
      }
    } catch (error) {
      console.error('Error fetching services (postsubcatservice):', error);
    }
  };

  useEffect(() => {
    AsyncStorage.getItem('address').then(value => {
      setaddress(value);
    });
  }, []);

  const handleViewDetails = item => {
    setSelectedItem(item);
    setShowModal(true); // Changed from !showModal to prevent accidental closing
  };

  const handleViewDetails1 = item => {
    setSelectedItem(item);
    navigation.navigate('summary', {plan: item, sdata: Item});
  };
  const handleViewDetails2 = item => {
    navigation.navigate('summary', {plan: item, sdata: selectedItem});
    setShowModal(false);
    setVdata('');
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, []);

  useEffect(() => {
    setTimeout(() => setTime(false), 2000);
  }, []);

  const getsubcategory = async () => {
    if (!cdata?.subcategory) return;
    try {
      let res = await axios.post(
        `https://api.vijayhomesuperadmin.in/api/userapp/postappresubcat/`,
        {subcategory: cdata?.subcategory},
      );
      if (res.status === 200) {
        setpostsubdata(res.data?.subcategory);
      }
    } catch (error) {
      console.error('Error fetching subcategory details:', error);
    }
  };

  const [ReviewVideodata, setReviewVideodata] = useState([]);
  const getbannerimg = async () => {
    if (!cdata?.subcategory) return;
    try {
      let res = await axios.get(
        'https://api.vijayhomesuperadmin.in/api/userapp/getallofferbanner',
      );
      if (res.status === 200) {
        setofferBannerdata(
          res.data?.offerbanner.filter(
            i => i.subcategory === cdata?.subcategory,
          ),
        );
      }
    } catch (error) {
      console.error('Error fetching offer banners:', error);
    }
  };

  const getReviewsVideos = async () => {
    if (!cdata?.subcategory) return;
    try {
      let res = await axios.get(
        'https://api.vijayhomesuperadmin.in/api/userapp/getallReviewVideos',
      );
      if (res.status === 200) {
        setReviewVideodata(
          res.data?.ReviewVideos.filter(
            i => i.Subcategory === cdata?.subcategory,
          ),
        );
      }
    } catch (error) {
      console.error('Error fetching review videos:', error);
    }
  };

  const [Bannermidledata, setBannermidledata] = useState([]);
  const getbannerdatamiddle = async () => {
    if (!cdata?.subcategory) return;
    try {
      let res = await axios.get(
        'https://api.vijayhomesuperadmin.in/api/userapp/getallSpotlightSP',
      );
      if (res.status === 200) {
        setBannermidledata(
          res.data?.SpotlightSP.filter(i => i?.service === cdata?.subcategory),
        );
      }
    } catch (error)
    {
        console.error("Error fetching spotlight SP:", error);
    }
  };

  const handleCategoryClick = clickedItem => {
    setpricesdata(
      clickedItem?.morepriceData.filter(i => i.pricecity === savecity),
    );
    setItem(clickedItem);
    setShowModal1(true); // Changed from !showModal1
  };

  const handleviewselect = selectedItemFromList =>
    setItem(selectedItemFromList);
  const settheservice = itemToSet => setItem(itemToSet);

  const handleItemClick = (item, index) => {
    setSelectedItemIndex(index);
    setselectedPlan(item);
    const itemToAdd = {
      id: item._id,
      _id: item._id,
      category: cdata?.category,
      service: Item,
      pName: item.pName,
      pPrice: item.pPrice,
      pofferprice: item.pofferprice,
      pservices: item.pservices,
      qty: 1,
      offerprice: item.pofferprice,
      planPrice: item.pPrice,
    };
    if (!item.pservices) {
      // Always add to cart, Redux slice logic will handle incrementing quantity
      dispatch(addToCart(itemToAdd));
    } else {
      navigation.navigate('summary', {plan: item, sdata: Item});
      setShowModal1(false); // Close modal on navigation
    }
  };
  
  const handleItemClick1 = (item, index) => {
    setSelectedItemIndex(index);
    setselectedPlan(item);
    const itemToAdd = {
      id: item._id,
      _id: item._id,
      category: cdata?.category,
      service: selectedItem,
      pName: item.pName,
      pPrice: item.pPrice,
      pofferprice: item.pofferprice,
      pservices: item.pservices,
      qty: 1,
      offerprice: item.pofferprice,
      planPrice: item.pPrice,
    };
    if (!item.pservices) {
        // Always add to cart, Redux slice logic will handle incrementing quantity
        dispatch(addToCart(itemToAdd));
    } else {
        navigation.navigate('summary', {plan: item, sdata: selectedItem});
        setShowModal(false); // Close modal on navigation
    }
  };

  useEffect(() => {
    if (pricesdata && pricesdata?.length > 0 && !selectedPlan) {
      setselectedPlan(pricesdata[0]);
    }
  }, [pricesdata, selectedPlan]);

  const getAllNumbers = async () => {
    if (!cdata?.category) return;
    try {
      let res = await axios.get(
        'https://api.vijayhomesuperadmin.in/api/userapp/getwhatsNumbers',
      );
      if (res.status === 200) {
        setNumbersData(
          res.data?.numbersData.filter(i => i.numbersCategory === cdata.category),
        );
      }
    } catch (error) {
      console.error('Error fetching numbers:', error);
    }
  };

  const getwhyneed = async () => {
    if (!cdata?.category) return;
    try {
      let res = await axios.get(
        'https://api.vijayhomesuperadmin.in/api/userapp/getallfeq',
      );
      if (res.status === 200) {
        setfeqdata(res.data?.feq.filter(i => i.category === cdata.category));
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  // Modified contact functions
   // Modified contact functions
  const getWhatsappNumber = () => {
    // This will return the same number for every category.
    return '8453748478';
  };

  const getPhoneNumber = () => {
    switch (cdata?.category) {
      case 'Painting':
        return '8147167340';
      case 'Cleaning':
        return '9901252953';
      case 'Pest control':
        return '7975811487';
      case 'Appliances & Repair':
        return '9036925672';
      case 'Packers and Movers':
        return '8722572257';
      default:
        return numberData[0]?.phoneNumber;
    }
  };

  const handlePhoneCall = () => {
    const phoneNumber = getPhoneNumber();
    if (phoneNumber) Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWhatsAppCall = () => {
    const whatsappNumber = getWhatsappNumber();
    if (whatsappNumber) Linking.openURL(`whatsapp://send?phone=91${whatsappNumber}`);
  };

  const servicesRef = useRef(null);
  const scrollToService = (index, sub_subcategory) => {
    const yOffset = index * ITEM_HEIGHT;
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({y: yOffset, animated: true});
    }
  };

  const handleBackButton = useCallback(() => {
    if (enquiryModalVisible) {
      setEnquiryModalVisible(false);
      return true;
    }
    if (LoginModal) {
      setLoginModal(false);
      navigation.goBack();
      return true;
    }
    if (showModal) {
      setShowModal(false);
      return true;
    } else if (showModal1) {
      setShowModal1(false);
      return true;
    } else if (showratecard) {
      setshowratecard(false);
      return true;
    } else {
      navigation.navigate('tab');
      return true;
    }
  }, [showModal, showModal1, showratecard, LoginModal, enquiryModalVisible, navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );
    return () => backHandler.remove();
  }, [handleBackButton]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (cdata) {
      getservicemanagement();
      getsubcategory();
      getservicemanagement1();
    }
    getrateCard();
    getAllNumbers();
    getbannerimg();
    getwhyneed();
    getbannerdatamiddle();
    getReviewsVideos();
    setTimeout(() => setRefreshing(false), 2000);
  }, [cdata]);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const onLoad = () => setIsBuffering(false);
  const getVideoIdFromLink = youtubeLink => {
    try {
      const videoIdMatch = youtubeLink?.match(/[?&]v=([^&]+)/);
      return videoIdMatch && videoIdMatch[1];
    } catch (error) {
      console.error('Error extracting video ID:', error);
      return null;
    }
  };

  const sendOTP = async () => {
    const isValidMobile = /^\d{10}$/.test(mainContact);
    if (!customerName.trim()) {
      Alert.alert('Error', 'Please enter your name.');
      return;
    }
    if (!isValidMobile) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    try {
      setotpLoader(true);
      const response = await axios.post(
        'https://newapi.vijayhomeservicebengaluru.in/api/customers/registerorlogin',
        {
          mainContact: mainContact,
          customerName: customerName,
          fcmtoken: fcmtoken,
          service: cdata?.subcategory,
          reference: 'userapp',
        },
      );
      if (response.status === 200) {
        const loggedInUser = {
          ...response.data.customer,
          customerName:
            response.data.customer.customerName || customerName,
        };
        setuser(loggedInUser);
        await AsyncStorage.setItem('user', JSON.stringify(loggedInUser));
        setLoginModal(false);
      } else {
        Alert.alert(
          'Error',
          response.data.message || 'Login failed. Please try again.',
        );
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        Alert.alert('Error', error.response.data.error);
      } else {
        console.error('Error sending OTP:', error);
        Alert.alert('Error', 'An error occurred. Please try again later.');
      }
    } finally {
      setotpLoader(false);
    }
  };

  // New functions for Painting Enquiry
  const addPaintingEnquiryFollowup = async (edata, serviceItem) => {
    try {
      const config = {
        url: `/followups`,
        method: 'post',
        baseURL: 'https://newapi.vijayhomeservicebengaluru.in/api',
        headers: {'content-type': 'application/json'},
        data: {
          enquiryId: edata?.enquiryId,
          category: cdata?.category,
          date: moment().format('llll'),
          response: 'Survey', // For painting, response is Survey
          description: serviceItem?.serviceName || cdata?.subcategory,
          next_followup_date: moment().format('YYYY-MM-DD'),
          appo_time: null,
          appo_date: moment().format('YYYY-MM-DD'),
          city: savecity,
          type: 'userapp',
          userid: user.id,
        },
      };
      await axios(config);
    } catch (error) {
      console.error('Error adding followup:', error);
    }
  };

  const handlePaintingEnquirySubmit = async () => {
    if (!enquiryName || !enquiryPhone) {
      Alert.alert('Validation Error', 'Please enter both name and phone number.');
      return;
    }
    if (!/^\d{10}$/.test(enquiryPhone)) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const config = {
        url: '/enquiries/create',
        method: 'post',
        baseURL: 'https://newapi.vijayhomeservicebengaluru.in/api',
        headers: {'content-type': 'application/json'},
        data: {
          date: moment().format('YYYY-MM-DD'),
          name: enquiryName,
          time: moment().format('h:mm:ss a'),
          mobile: enquiryPhone,
          email: user?.email || '',
          address: '', // No address from this modal
          category: cdata?.category,
          reference1: 'userapp',
          city: savecity,
          comment: selectedItemForEnquiry?.serviceName || cdata?.subcategory,
          interested_for: selectedItemForEnquiry?.serviceName || cdata?.subcategory,
          user_id: user?.id,
          executive: 'userapp',
        },
      };
      const response = await axios(config);
      if (response.status === 201) {
        await addPaintingEnquiryFollowup(response.data.data, selectedItemForEnquiry);
        Alert.alert(
          'Success',
          'Thank you for your enquiry. Our team will contact you shortly.',
        );
        setEnquiryModalVisible(false);
        setSelectedItemForEnquiry(null);
      } else {
        throw new Error('Enquiry creation failed');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to submit enquiry. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subcategoryMapping = {
    'Bathroom Cleaning': [
      {
        title: 'Manual Cleaning',
        image: require('../../../assets/subComponent/manual_cleaning.jpg'),
      },
      {
        title: 'Machine Cleaning',
        image: require('../../../assets/subComponent/machine_cleaning.jpg'),
      },
      {
        title: 'Grouting',
        image: require('../../../assets/subComponent/grouting.jpg'),
      },
    ],
    'Occupied Home Deep Cleaning': [
      {
        title: 'Occupied Flats',
        image: require('../../../assets/subComponent/occupiedflat.png'),
      },
      {
        title: 'Occupied Villa',
        image: require('../../../assets/subComponent/occupiedvilla.png'),
      },
    ],
    'Vacant Home Deep Cleaning': [
      {
        title: 'Vacant Flats',
        image: require('../../../assets/subComponent/vacantflat.png'),
      },
      {
        title: 'Vacant Villa',
        image: require('../../../assets/subComponent/vacantvilla.png'),
      },
    ],
    'Kitchen Cleaning': [
      {
        title: 'Without Cabinet',
        image: require('../../../assets/subComponent/withoutcabinet.png'),
      },
      {
        title: 'Vacant Kitchen',
        image: require('../../../assets/subComponent/vacantkitchen.png'),
      },
      {
        title: 'Occupied Kitchen',
        image: require('../../../assets/subComponent/occupiedkitchen.png'),
      },
    ],
    'Sofa Cleaning': [
      {
        title: 'Fabric Sofa Cleaning',
        image: require('../../../assets/subComponent/fabricsofa.png'),
      },
      {
        title: 'Leather Sofa Cleaning',
        image: require('../../../assets/subComponent/leathersofa.png'),
      },
    ],
    'After Interior Deep Cleaning': [
      {
        title: 'Flat Project Cleaning',
        image: require('../../../assets/subComponent/flatprojectcleaning.png'),
      },
      {
        title: 'Duplex Project Cleaning',
        image: require('../../../assets/subComponent/duplexprojectcleaning.png'),
      },
      {
        title: 'Villa Project Cleaning',
        image: require('../../../assets/subComponent/villaprojectcleaning.png'),
      },
    ],
    'Office Cleaning': [
      {
        title: 'Office Carpet Cleaning',
        image: require('../../../assets/subComponent/officecarpetcleaning.png'),
      },
      {
        title: 'Vacant Office Cleaning',
        image: require('../../../assets/subComponent/vacantofficecleaning.png'),
      },
      {
        title: 'Occupied Office Cleaning',
        image: require('../../../assets/subComponent/occupiedofficecleaning.png'),
      },
    ],
    ' Mattress Cleaning': [
      {
        title: 'Carpet Cleaning',
        image: require('../../../assets/subComponent/carpetcleaning.png'),
      },
      {
        title: 'Mattress Cleaning',
        image: require('../../../assets/subComponent/mattresscleaning.png'),
      },
      {
        title: 'Dining Chair Cleaning',
        image: require('../../../assets/subComponent/diningchaircleaning.png'),
      },
    ],
    'Mini Cleaning Services': [
      {
        title: 'Kitchen Appliance Cleaning',
        image: require('../../../assets/subComponent/kitchenappliancecleaning.png'),
      },
      {
        title: 'Other Appliance Cleaning',
        image: require('../../../assets/subComponent/otherappliancecleaning.png'),
      },
    ],
    'Floor Cleaning': [
      {
        title: 'Floor Cleaning - Manual',
        image: require('../../../assets/subComponent/floormanual.png'),
      },
      {
        title: 'Floor Cleaning - Machine',
        image: require('../../../assets/subComponent/floormachine.png'),
      },
    ],
    'Terrace Cleaning': [
      {
        title: 'Terrace Cleaning',
        image: require('../../../assets/subComponent/terrace.png'),
      },
    ],
    'Tank and Sump Cleaning': [
      {
        title: 'Tank Cleaning',
        image: require('../../../assets/subComponent/tankcleaning.png'),
      },
      {
        title: 'Sump Cleaning',
        image: require('../../../assets/subComponent/sumpcleaning.png'),
      },
    ],
    'Cockroach Control': [
      {
        title: 'Cockroach Control - Standard',
        image: require('../../../assets/subComponent/cockroachstandard.png'),
      },
      {
        title: 'Cockroach Control - Premium',
        image: require('../../../assets/subComponent/cockroachpremium.png'),
      },
    ],
    'General Pest Control': [
      {
        title: 'General Pest Control Standard',
        image: require('../../../assets/subComponent/generalpest.png'),
      },
      {
        title: 'General Pest Control AMC',
        image: require('../../../assets/subComponent/generalpestamc.png'),
      },
    ],
    'Bedbugs Control': [
      {
        title: 'Bedbugs',
        image: require('../../../assets/subComponent/generalpest.png'),
      },
      {
        title: 'General Pest Control AMC',
        image: require('../../../assets/subComponent/generalpestamc.png'),
      },
    ],
    'Mosquitoes Control': [
      {
        title: 'Mosquito Control - Indoor',
        image: require('../../../assets/subComponent/mosquitoindoor.png'),
      },
      {
        title: 'Mosquito Control - Outdoor',
        image: require('../../../assets/subComponent/mosquitooutdoor.png'),
      },
    ],
    'Termite Control': [
      {
        title: 'Termite Control (Post Construction)',
        image: require('../../../assets/subComponent/termitepost.png'),
      },
      {
        title: 'Termite Control (Pre-Construction)',
        image: require('../../../assets/subComponent/termitepre.png'),
      },
    ],
    'Woodborer Control': [
      {
        title: 'Wood Borer - Standard',
        image: require('../../../assets/subComponent/woodborerstandard.png'),
      },
      {
        title: 'Wood Borer - Premium',
        image: require('../../../assets/subComponent/woodborerpremium.png'),
      },
    ],
  };
  const swiperRef = useRef(null);
  useEffect(() => {
    if (offerBannerdata?.length > 0) {
      const interval = setInterval(() => {
        if (swiperRef.current) {
          const currentIndex = swiperRef.current.state.index;
          const totalSlides = offerBannerdata.length;
          if (currentIndex + 1 >= totalSlides) {
            swiperRef.current.scrollBy(-currentIndex);
          } else {
            swiperRef.current.scrollBy(1);
          }
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [offerBannerdata]);

  if (!cdata && !isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>
          No data available. Please check your connection or try again later.
        </Text>
      </View>
    );
  }
  if (!cdata) {
    return <Loader />;
  }

  const closeModalAndReset = () => {
    setShowModal(false);
    setVdata('');
    setSelectedPrice(null);
    setShowSelectedPrice(false);
    setSelectedItemId(null);
  };

  return (
    <View style={styles.container}>
      {isLoading || isUserLoading ? (
        <Loader />
      ) : (
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <ScrollView
            ref={scrollViewRef}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{ paddingBottom: cdata?.category === 'Painting' ? 70 : 0 }}
            >
            {cdata?.videolink && (
              <Video
                ref={videoRef}
                source={{uri: cdata.videolink}}
                resizeMode="cover"
                repeat
                shouldPlay={true}
                isMuted={true}
                style={{width: '100%', height: 150}}
                onLoad={onLoad}
                onError={e => console.log('Video Error: ', e)}
              />
            )}

            <View style={{margin: 20, marginTop: 10,}}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 22,
                  fontFamily: 'Segoe UI',
                  fontWeight: 'bold',
                
                }}>
                {cdata.subcategory?.replace(/Varalakshmi\s*/gi, '')}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{flexDirection: 'row', marginTop: 4}}>
                  <View style={{flexDirection: 'row'}}>
                    <AntDesign name="star" color="#36454F" size={14} />
                    <Text
                      style={{
                        color: '#36454F',
                        fontSize: 14,
                        marginTop: -1,
                        paddingRight: 5,
                      }}>
                      {' '}
                      4.9
                    </Text>
                  </View>
                  <Text style={{color: '#36454F', fontSize: 14, marginTop: -2}}>
                    {' '}
                    (9.1 thousand)
                  </Text>
                </View>

               <View style={{flex: 0.2, marginTop: 2}}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handlePhoneCall}>
          <Icon name="phone" size={28} color="#1B1212" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleWhatsAppCall}>
          <Icon name="whatsapp" size={28} color="#1B1212" />
        </TouchableOpacity>
      </View>
    </View>
              </View>
            </View>

            

            {subcategoryMapping[cdata.subcategory] ? (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    paddingLeft: 15,
                    backgroundColor: 'white',
                    paddingBottom: 10,
                    borderRadius: 10,
                    paddingTop: 15,
                    marginBottom: 10,
                    borderTopColor: '#f5f5f5',
                    borderTopWidth: 10,
                    borderBottomColor: '#f5f5f5',
                    borderBottomWidth: 10,
                  }}>
                  {subcategoryMapping[cdata.subcategory].map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '30%',
                        padding: 0,
                        borderColor: 'transparent',
                        paddingRight: 5,
                        paddingLeft: 20,
                      }}
                      onPress={() => scrollToService(index + 1, item.title)}>
                      <Image
                        source={item.image}
                        style={{
                          width: 80,
                          height: 80,
                          resizeMode: 'cover',
                          borderRadius: 5,
                          padding: 0,
                          paddingRight: 20,
                          paddingLeft: 15,
                        }}
                      />
                      <Text style={styles.servicestext}>{item.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : postsubdata?.length > 0 ? (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}>
                  {postsubdata
                    .sort((a, b) => parseInt(a.order) - parseInt(b.order))
                    .map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '25%',
                          padding: 5,
                          borderColor:
                            selectedItemIndex === index
                              ? 'transparent'
                              : 'transparent',
                          borderWidth: 2,
                        }}
                        onPress={() =>
                          scrollToService(index + 1, item?.sub_subcategory)
                        }>
                        <Image
                          source={{
                            uri: `https://api.vijayhomesuperadmin.in/resubcat/${item.resubcatimg}`,
                          }}
                          style={{
                            width: 60,
                            height: 60,
                            resizeMode: 'cover',
                            borderRadius: 5,
                          }}
                        />
                        <Text style={styles.servicestext}>
                          {item.sub_subcategory}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </View>
              </>
            ) : (
              ''
            )}

            <View>
              {Servicedata.length > 0 ? (
                <View style={{margin: 20, borderColor: '#eee'}}>
                  {Servicedata.sort(
                    (a, b) => parseInt(a.order) - parseInt(b.order),
                  ).map((item, index) => {
                    const hasServiceTitle =
                      item.servicetitle?.includes('Essential') ||
                      item.servicetitle?.includes('Standard') ||
                      item.servicetitle?.includes('Premium');

                    return (
                      <View key={index}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <View style={{flex: 0.7, paddingLeft: 0}}>
                            {item.servicetitle ? (
                              <View>
                                {(() => {
                                  let tierText = null;
    if (item.servicetitle.includes('Essential')) {
      tierText = 'Essential';
    } else if (item.servicetitle.includes('Standard')) {
      tierText = 'Standard';
    } else if (item.servicetitle.includes('Premium')) {
      tierText = 'Premium';
    }

    // Render Text if a tier was found, otherwise render nothing
    return tierText ? (
      <Text style={styles.someTextStyle}>{tierText}</Text>
                                  ) : (
                                    <View />
                                  );
                                })()}
                              </View>
                            ) : null}

                            <Text
                              style={{
                                fontSize: 18,
                                color: '#343434',
                                fontFamily: 'Poppins-Bold',
                                marginTop: 5,
                              }}>
                              {item.serviceName}
                            </Text>
                            

                            <View style={{flexDirection: 'row', marginTop: 0}}>
                              <Entypo name="star" color="#36454F" size={16} />
                              <Text
                                style={{
                                  fontSize: 13,
                                  marginLeft: 5,
                                  color: '#36454F',
                                  fontFamily: 'Poppins-Medium',
                                }}>
                                4.9 (328.8k reviews) 
                              </Text>
                            </View>

                            {item.morepriceData.length > 0 ? (
                              
                               <View style={{ marginTop: 5, paddingBottom: 20 }}>
  
    {/* Price Row */}
    <View style={{ flexDirection: 'row'}}>
                                <Text
                                  style={{
                                    color: 'black',
                                    fontFamily: 'Poppins-Medium',
                                    fontSize: 15,
                                  }}>
                                 
                                </Text>
                                <Text style={styles.originalPrice}>
                                  ₹
                                  {Math.min(
                                    ...item.morepriceData
                                      .filter(i => i.pricecity === savecity)
                                      .map(i => i.pPrice),
                                    Infinity,
                                  )}
                                </Text>
                                <Text
                                  style={{
                                    color: 'black',
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                  }}>
                                  ₹
                                  {Math.min(
                                    ...item.morepriceData
                                      .filter(i => i.pricecity === savecity)
                                      .map(i => i.pofferprice),
                                    Infinity,
                                  )}
                                </Text>
                               

                              </View>
                              {(cdata?.subcategory === 'Bathroom Cleaning' || cdata?.subcategory === 'Varalakshmi Bathroom Deals') && (
      <Text style={{
        fontSize: 12,           // A bit smaller for a sub-text
        marginTop: 2,           // Adds a small space below the price line
        color: 'grey',          // Subtler color
        fontFamily: 'Poppins-Regular',
        
      }}>
        (for 2 Bathrooms)
      </Text>
    )}
                              
                             </View>
                            ) : null}
                          </View>
                          <View
                            style={{flex: 0.3, alignItems: 'flex-end'}}>
                            <TouchableOpacity
                              style={[
                                styles.textinput1,
                                styles.elevation1,
                                {marginTop: hasServiceTitle ? 30 : 15},
                              ]}
                              onPress={() => {
                                if (cdata?.category === 'Painting') {
                                  setSelectedItemForEnquiry(item);
                                  setEnquiryModalVisible(true);
                                } else {
                                  if (item.morepriceData.length > 0) {
                                    handleCategoryClick(item);
                                  } else {
                                    navigation.navigate('ESpage', {sdata: item});
                                  }
                                }
                              }}>
                              <Image
                                source={{uri: item.imglink}}
                                style={styles.servicesimg}
                              />
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontSize: cdata?.category === 'Painting' ? 12 : 14,
                                  width: 80,
                                  color: '#1434A4',
                                  fontFamily: 'Poppins-Bold',
                                  backgroundColor: 'white',
                                  borderRadius: 8,
                                  borderColor: '#1434A4',
                                  borderWidth: 1,
                                  padding: 3,
                                  marginTop: -10,
                                }}>
                                {cdata?.category === 'Painting'
                                  ? 'Free Inspection'
                                  : 'Add'}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View style={{width: '100%', marginTop: 7}}>
                          {item.serviceDesc?.slice(0, 2).map((desc, idx) => {
  return (
    <View
      key={idx}
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom:
          idx === item.serviceDesc.length - 1 ? 0 : 3,
      }}>
      <View
        style={{
          width: 6,
          height: 6,
          backgroundColor: 'grey',
          borderRadius: 5,
          marginRight: 6,
          marginTop: 5,
        }}
      />
      <Text
        style={{
          fontSize: 12,
          color: 'black',
          fontFamily: 'Poppins-Regular',
        }}
        numberOfLines={4}
        ellipsizeMode="tail">
        {desc?.text}
      </Text>
    </View>
  );
})}

                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 5,
                          }}>
                          <TouchableOpacity
  onPress={() => {
    if (cdata?.category === 'Painting') {
      setSelectedItemForEnquiry(item);
      setEnquiryModalVisible(true);
    } else {
      handleViewDetails(item);
    }
  }}
  style={{ marginTop: 0 }}
>
  <Text
    style={{
      fontSize: 16,
      color: '#1434A4',
      marginBottom: 20,
      textDecorationStyle: 'dashed',
      fontWeight: '600',
    }}
  >
    View Details
  </Text>
</TouchableOpacity>


                          {cdata?.category === 'Appliance Service' ? (
                            <Shimmer
                              duration={1500}
                              pauseDuration={1000}
                              tilt={60}>
                              <TouchableOpacity
                                onPress={() => setshowratecard(true)}>
                                <Text
                                  style={{
                                    color: '#1434A4',
                                    fontSize: 16,
                                    fontFamily: 'Poppins-Medium',
                                    marginTop: 0,
                                    paddingBottom: 120,
                                    
                                  }}>
                                  Spare Parts RateCard
                                </Text>
                              </TouchableOpacity>
                            </Shimmer>
                          ) : null}
                        </View>
                        <View style={styles.hrtag} />
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View>
                  <ContentLoader
                    pRows={3}
                    avatar
                    aShape="square"
                    reverse={true}
                    tHeight={20}
                    active={true}
                    animationDuration={500}
                    loading={true}
                    aSize={80}
                    containerStyles={{padding: 19, marginTop: 40}}
                  />
                </View>
              )}
              {Bannermidledata[0]?.img && (
                <View style={{margin: 10}}>
                  <Image
                    source={{
                      uri: `https://api.vijayhomesuperadmin.in/spotlightSP/${Bannermidledata[0]?.img}`,
                    }}
                    style={{
                      width: '100%',
                      height: 120,
                      resizeMode: 'cover',
                    }}
                  />
                </View>
              )}
            </View>

            {cdata?.category !== 'Painting' ? (
              <ScrollView ref={servicesRef}>
                {catservicedata?.length > 0 ? (
                  <View>
                    <View>
                      <Text
                        style={{
                          marginLeft: 15,
                          color: 'black',
                          fontFamily: 'Poppins-Bold',
                          fontSize: 18,
                        }}>
                        Other Services
                      </Text>
                    </View>

                    <View
                      style={{
                        margin: 20,
                        borderBottomWidth: 1,
                        borderColor: '#eee',
                        paddingBottom: 20,
                      }}>
                      {catservicedata.map((item, index) => (
                        <View style={{flexDirection: 'row'}} key={index}>
                          <View style={{flex: 0.7, marginTop: 20}}>
                            {item.servicetitle ? (
                              <View>
                                {(() => {
                                  let imageSource;
                                  if (
                                    item.servicetitle.includes('Essential')
                                  ) {
                                    imageSource = require('../../../assets/essential.png');
                                  } else if (
                                    item.servicetitle.includes('Standard')
                                  ) {
                                    imageSource = require('../../../assets/standard.png');
                                  } else if (
                                    item.servicetitle.includes('Premium')
                                  ) {
                                    imageSource = require('../../../assets/premium.png');
                                  }
                                  return imageSource ? (
                                    <Image
                                      source={imageSource}
                                      style={styles.image}
                                    />
                                  ) : null;
                                })()}
                              </View>
                            ) : null}
                            <Text
                              style={{
                                fontSize: 18,
                                color: 'black',
                                fontFamily: 'Poppins-Medium',
                                marginTop: 5,
                              }}>
                              {item.serviceName}
                            </Text>
                            {item.servicebelow ? (
                              <Text style={styles.sbelow}>
                                {item.servicebelow}
                              </Text>
                            ) : (
                              ''
                            )}

                            <View style={{flexDirection: 'row', marginTop: 5}}>
                              <Entypo name="star" color="gold" size={20} />
                              <Text
                                style={{
                                  fontSize: 15,
                                  marginLeft: 5,
                                  color: 'black',
                                }}>
                                4.9 (328.8k)
                              </Text>
                            </View>

                            <View
                              style={{
                                flexDirection: 'row',
                                marginTop: 5,
                                paddingBottom: 25,
                              }}>
                              {item?.serviceDirection === 'Survey' ? (
                                <Text
                                  style={{
                                    color: 'black',
                                    fontFamily: 'Poppins-Bold',
                                  }}>
                                  Free Estimation
                                </Text>
                              ) : item?.serviceDirection === 'Enquiry' ? (
                                <Text
                                  style={{
                                    color: 'black',
                                    fontFamily: 'Poppins-Bold',
                                  }}>
                                  Free Consultancy
                                </Text>
                              ) : (
                                item.morepriceData &&
                                item.morepriceData.length > 0 && (
                                  <>
                                    <Text
                                      style={{
                                        color: 'black',
                                        fontFamily: 'Poppins-Medium',
                                        paddingTop: 10,
                                      }}>
                                      Start price
                                    </Text>
                                    <Text style={styles.originalPrice}>
                                      ₹{item.morepriceData[0]?.pPrice}
                                    </Text>
                                    <Text
                                      style={{
                                        color: 'black',
                                        fontFamily: 'Poppins-Medium',
                                        fontWeight: 'bold',
                                      }}>
                                      ₹{item.morepriceData[0]?.pofferprice}
                                    </Text>
                                  </>
                                )
                              )}
                            </View>
                            {item.serviceDesc && item.serviceDesc[0]?.text && (
                              <Text
                                numberOfLines={4}
                                ellipsizeMode="tail"
                                style={{
                                  fontSize: 14,
                                  color: 'black',
                                  fontFamily: 'Poppins-Medium',
                                }}>
                                {item.serviceDesc[0]?.text}
                              </Text>
                            )}
                            <TouchableOpacity
                              onPress={() => {
                                  if (cdata?.category === 'Painting') {
                                    setSelectedItemForEnquiry(item);
                                    setEnquiryModalVisible(true);
                                } else {
                                    handleViewDetails(item);
                                }
                              }}
                              >
                              <Text
                                style={{
                                  color: 'violet',
                                  fontSize: 14,
                                  fontFamily: 'Poppins-Medium',
                                  marginTop: 16,
                                }}>
                                View Price
                              </Text>
                            </TouchableOpacity>
                            <View style={styles.hrtag} />
                          </View>

                          <View
                            style={{
                              flex: 0.3,
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingTop: 25,
                            }}>
                            <TouchableOpacity
                              style={[styles.textinput1, styles.elevation1]}
                              onPress={() => {
                                if (cdata?.category === 'Painting') {
                                  setSelectedItemForEnquiry(item);
                                  setEnquiryModalVisible(true);
                                } else {
                                    if (item.morepriceData.length > 0) {
                                      handleCategoryClick(item);
                                    } else {
                                      navigation.navigate('ESpage', {
                                        sdata: item,
                                      });
                                    }
                                }
                              }}>
                              <Image
                                source={{
                                  uri: `https://api.vijayhomesuperadmin.in/service/${item.serviceImg}`,
                                }}
                                style={styles.servicesimg}
                              />
                              <View
                                style={{
                                  flex: 0.2,
                                  alignItems: 'flex-end',
                                  paddingTop: -2,
                                }}>
                                <Text
                                  style={{
                                    textAlign: 'center',
                                    fontSize: 15,
                                    width: 80,
                                    color: 'white',
                                    fontFamily: 'Poppins-Bold',
                                    backgroundColor: 'darkred',
                                    borderRadius: 8,
                                    padding: 3,
                                    marginTop: -10,
                                  }}>
                                  {cdata?.category === 'Painting'
                                    ? 'Book Free Inspection'
                                    : 'Book Now'}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : (
                  ''
                )}
              </ScrollView>
            ) : (
              <></>
            )}
          </ScrollView>

          {cdata?.category === 'Painting' && (
             <View style={styles.paintingFooter}>
             <TouchableOpacity
               style={styles.paintingFooterButton}
               onPress={() => {
                 setSelectedItemForEnquiry(null); // No specific service from footer
                 setEnquiryModalVisible(true);
               }}>
               <Text style={styles.paintingFooterButtonText}>
                 Get Free Estimate
               </Text>
             </TouchableOpacity>
           </View>
          )}

          {cdata?.category !== 'Painting' && Carttotal > 0 && !LoginModal && (
            <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#00A36C',
                  padding: 8,
                  marginTop: 5,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  width: '100%',
                }}>
                <View style={{flexDirection: 'row'}}>
                  <MaterialIcons
                    name="local-offer"
                    size={15}
                    color="white"
                    style={{
                      marginTop: 3,
                      paddingRight: 3,
                      fontFamily: 'Poppins-Medium',
                    }}
                  />
                  <Text style={{color: 'white', fontFamily: 'Roboto-Bold'}}>
                    Congratulations!
                  </Text>
                </View>
                <Text
                  style={{
                    color: 'white',
                    marginLeft: 10,
                    fontFamily: 'Poppins-Bold',
                  }}>
                  <FontAwesome name="rupee" size={12} color="white" />{' '}
                  {CartSavedtotal.toFixed(2)}
                </Text>
                <Text
                  style={{
                    color: 'white',
                    marginLeft: 4,
                    fontFamily: 'Roboto-Bold',
                  }}>
                  {' '}
                  saved so far!
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  style={{
                    flex: 0.5,
                    backgroundColor: 'white',
                    color: 'white',
                    padding: 10,
                    width: '100%',
                    textAlign: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => navigation.navigate('cartbook')}>
                  <View style={{flexDirection: 'row', paddingTop: 10,marginLeft: 10}}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 16,
                        fontFamily: 'Roboto-Bold',
                      }}>
                      Total
                    </Text>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 16,
                        fontFamily: 'Roboto-Bold',
                      }}>
                      {' '}
                      {'  '}
                      <FontAwesome name="rupee" size={13} color="black" />{' '}
                      {Carttotal.toFixed(2)}
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: 'white',
                      fontFamily: 'Roboto-Bold',
                      backgroundColor: '#5D3FD3',
                      padding: 15,
                      paddingLeft: 50,
                      paddingRight: 50,
                      borderRadius: 5,
                      fontSize: 16,
                    }}>
                    {' '}
                    View Cart
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <Modal
            animationType={'slide'}
            transparent={true}
            visible={showModal}
            onRequestClose={closeModalAndReset}>
            <View
              style={{
                backgroundColor: 'white',
                width: '100%',
                height: '100%',
                borderRadius: 10,
                padding: 15,
                borderWidth: 1,
                borderColor: '#DCDCDC',
              }}>
              <TouchableOpacity
                onPress={closeModalAndReset}
                style={[styles.textinput, styles.elevation]}>
                <Feather name="x" color="white" size={14} />
              </TouchableOpacity>

              {showSelectedPrice && (
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: 'white',
                    position: 'absolute',
                    width: '100%',
                    bottom: 0,
                    zIndex: 10,
                    borderTopWidth: 1,
                    borderColor: '#DCDCDC',
                    top: 0,
                  }}>
                  <View style={{flex: 0.7}}>
                    <Text style={{color: 'darkred', fontSize: 15}}>
                      {selectedPrice.pName}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          textDecorationLine: 'line-through',
                          color: 'black',
                          fontSize: 14,
                          fontFamily: 'Poppins-Medium',
                        }}>
                        {selectedPrice.pPrice}
                      </Text>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 14,
                          marginLeft: 5,
                        }}>
                        {selectedPrice.pofferprice}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={{flex: 0.3, justifyContent: 'center'}}
                    onPress={() => handleViewDetails2(Vdata)}>
                    <Text
                      style={{
                        backgroundColor: 'darkred',
                        color: 'white',
                        padding: 10,
                        width: '100%',
                        textAlign: 'center',
                        borderRadius: 5,
                      }}>
                      View Cart
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              <ScrollView
                contentContainerStyle={{
                  paddingBottom:
                    Carttotal > 0 || selectedItem?.serviceDirection ? 80 : 20,
                }}
                showsVerticalScrollIndicator={false}>
                <View style={styles.modal}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View style={{flex: 1}}>
                      <Text style={{color: 'green', fontSize: 12, marginTop: 20, marginLeft: 10}}>
                        {selectedItem?.servicetitle}
                      </Text>
                      <Text
                        style={{
                          color: '#36454F',
                          fontFamily: 'Poppins-Bold',
                          fontSize: 20,
                          marginLeft: 10,
                        }}>
                        {selectedItem?.serviceName}
                      </Text>
                    </View>
                  </View>
                  {selectedItem?.servicebelow && (
                    <Text style={{color: 'black', fontSize: 12, marginLeft: 10 }}>
                      {selectedItem?.servicebelow}
                    </Text>
                  )}
                  {selectedItem?.serviceHours && (
                    <Text style={{marginLeft: 10, color: 'grey'}}>
                      Service Hours {selectedItem?.serviceHours}
                    </Text>
                  )}
                  <View>
                    <Text
                      style={{
                        color: '#36454F',
                        fontFamily: 'Roboto',
                        marginTop: 20,
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginLeft: 10,
                      }}>
                      Service Description
                    </Text>
                    <View style={{padding: 10, marginTop: -8}}>
                      {selectedItem?.serviceDesc?.map((i, index) => (
                        <View key={index} style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              flexWrap: 'wrap',
                              marginLeft: 0,
                              fontSize: 14,
                              color: 'grey',
                              fontFamily: 'Roboto',
                            }}>
                            {i.text}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  {selectedItem?.morepriceData?.filter(
                    i => i.pricecity === savecity,
                  ).length > 0 && (
                    <View style={styles.modalPlansContainerOuter}>
                      <Text style={styles.modalSectionTitle}> Choose Plan </Text>
                                        <View style={{width: '100%'}}>
                                          {selectedItem?.morepriceData
                                            ?.filter(i => i.pricecity === savecity)
                                            .sort((a, b) => parseFloat(a.pPrice) - parseFloat(b.pPrice))
                                            .map((plan, index) => (
                                              <View
                                                style={{
                                                  flexDirection: 'row',
                                                  alignItems: 'center',
                                                  justifyContent: 'space-between',
                                                  backgroundColor: '#fff',
                                                  borderRadius: 8,
                                                  marginBottom: 12,
                                                  padding: 14,
                                                  borderWidth: 1,
                                                  borderColor: '#eee',
                                                }}
                                                key={plan._id || index}
                                              >
                                                <View style={{flex: 1}}>
                                                  <Text style={{fontFamily: 'Roboto',fontWeight: 'bold', fontSize: 16, color: '#343434'}}>{plan.pName}</Text>
                                                  <View style={{flexDirection: 'row', alignItems: 'baseline', marginTop: 2}}>
                                                    <Text style={{textDecorationLine: 'line-through', color: '#888', fontSize: 14, fontFamily: 'Roboto-Medium'}}>
                                                      ₹{plan.pPrice}
                                                    </Text>
                                                    <Text style={{color: '#0047AB', fontSize: 16, fontFamily: 'Roboto-Bold', marginLeft: 8}}>
                                                      ₹{plan.pofferprice}
                                                    </Text>
                                                  </View>
                                                  <Text style={{color: '#008000', fontSize: 13, fontFamily: 'Roboto-Medium', marginTop: 2}}>
                                                    {(
                                                      ((plan.pPrice - plan.pofferprice) /
                                                        plan.pPrice) *
                                                      100
                                                    ).toFixed(0)}% off
                                                  </Text>
                                                  {plan?.pservices && (
                                                    <Text style={{color: '#555', fontSize: 13, fontFamily: 'Roboto-Medium', marginTop: 2}}>
                                                      Services - {plan.pservices}
                                                    </Text>
                                                  )}
                                                </View>
                                                {isItemInCart(plan._id) ? (
                                                  <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    backgroundColor: 'white',
                                                    borderRadius: 5,
                                                    padding: 4,
                                                    borderWidth: 1,
                                                    borderColor: '#0047AB',
                                                    shadowColor: '#0047AB',
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: 0.3,
                                                    shadowRadius: 4,
                                                    elevation: 4,
                                                    paddingHorizontal: 4,
                                                   
                                                    marginRight: 18
                                                  }}>
                                                    <TouchableOpacity
                                                      onPress={() => {
                                                        dispatch(deleteMyCartItem(plan._id));
                                                      }}>
                                                      <AntDesign
                                                        name="minus"
                                                        size={14}
                                                        color="#0047AB"
                                                        marginLeft={4}
                                                      />
                                                    </TouchableOpacity>
                                                    <Text style={{color: '#0047AB', fontFamily: 'Roboto-Bold', fontSize: 16, paddingLeft: 12, paddingRight: 12}}>
                                                      {getItemQuantityById(plan._id)}
                                                    </Text>
                                                    <TouchableOpacity
                                                      onPress={() => handleItemClick1(plan, index)}>
                                                      <AntDesign
                                                        name="plus"
                                                        size={14}
                                                        color="#0047AB"
                                                        marginRight={4}
                                                      />
                                                    </TouchableOpacity>
                                                  </View>
                                                ) : (
                                                  <TouchableOpacity
                                                    onPress={() => handleItemClick1(plan, index)}
                                                    style={{backgroundColor: 'white', borderRadius: 5, paddingVertical: 8, paddingHorizontal: 18, marginLeft: 10}}>
                                                    <Text style={{color: '#0047AB', fontFamily: 'Roboto-Bold', fontSize: 15, borderColor: '#0047AB', borderWidth: 1, padding: 4, paddingHorizontal: 20, borderRadius: 5}}>
                                                      Book
                                                    </Text>
                                                  </TouchableOpacity>
                                                )}
                                              </View>
                                            ))}
                                        </View>
                    </View>
                  )}
                  <View>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Poppins-Medium',
                        marginTop: 20,
                        fontSize: 17,
                      }}>
                      Service Includes
                    </Text>
                    <View style={{padding: 10}}>
                      {selectedItem?.serviceIncludes?.map((i, index) => (
                        <View key={index} style={{flexDirection: 'row'}}>
                          <Image
                            source={{
                              uri: `https://api.vijayhomesuperadmin.in/service/1703875909934_images.png`,
                            }}
                            style={{width: 16, height: 16, marginTop: 7}}
                          />
                          <Text
                            style={{
                              flexWrap: 'wrap',
                              marginLeft: 5,
                              fontSize: 15,
                              marginTop: 3,
                              color: 'grey',
                            }}>
                            {i.text}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  {selectedItem?.serviceExcludes?.length > 0 && (
                    <View>
                      <Text
                        style={{
                          color: 'black',
                          fontFamily: 'Poppins-Medium',
                          marginTop: 20,
                          fontSize: 16,
                        }}>
                        Service Excludes
                      </Text>
                      <View style={{padding: 10}}>
                        {selectedItem?.serviceExcludes?.map((i, index) => (
                          <View key={index} style={{flexDirection: 'row'}}>
                            <Image
                              source={{
                                uri: `https://api.vijayhomesuperadmin.in/service/1703878308605_images%20(1).png`,
                              }}
                              style={{width: 16, height: 16, marginTop: 5}}
                            />
                            <Text
                              style={{
                                flexWrap: 'wrap',
                                marginLeft: 5,
                                fontSize: 15,
                                marginTop: 3,
                                color: 'grey',
                              }}>
                              {i.text}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              </ScrollView>
              {selectedItem?.serviceDirection === 'Enquiry' ||
              selectedItem?.serviceDirection === 'Survey' ? (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    width: '106%',
                    paddingHorizontal: '3%',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowModal(false);
                      navigation.navigate('ESpage', {sdata: selectedItem});
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: 'darkred',
                        padding: 10,
                        marginTop: 5,
                        alignSelf: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        width: '100%',
                        borderRadius: 5,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontFamily: 'Poppins-Medium',
                          fontSize: 16,
                        }}>
                        {selectedItem?.serviceDirection === 'Survey'
                          ? 'Schedule Inspection'
                          : 'Schedule Callback'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : Carttotal > 0 ? (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '111%',
                    
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: '#00A36C',
                      padding: 8,
                      marginTop: 5,
                      alignSelf: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      width: '100%',
                      marginRight: 2

                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <MaterialIcons
                        name="local-offer"
                        size={15}
                        color="white"
                        style={{
                          marginTop: 3,
                          paddingRight: 3,
                          fontFamily: 'Roboto-Medium',
                        }}
                      />
                      <Text style={{color: 'white', fontFamily: 'Roboto-Bold'}}>
                        Congratulations!
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: 'white',
                        marginLeft: 10,
                        fontFamily: 'Poppins-Medium',
                      }}>
                      <FontAwesome name="rupee" size={12} color="white" />{' '}
                      {CartSavedtotal.toFixed(2)}
                    </Text>
                    <Text
                      style={{
                        color: 'white',
                        marginLeft: 4,
                        fontFamily: 'Poppins-Medium',
                      }}>
                      {' '}
                      saved so far!
                    </Text>
                  </View>
                  <View>
                    <TouchableOpacity
                      style={{
                        flex: 0.5,
                        backgroundColor: 'white',
                        color: 'white',
                        padding: 10,
                        width: '100%',
                        textAlign: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                      onPress={() => {
                        setShowModal(false);
                        navigation.navigate('cartbook');
                      }}>
                      <View style={{flexDirection: 'row', paddingTop: 10}}>
                        <Text style={{color: 'black', fontFamily: 'Roboto-Bold',marginLeft: 10, fontSize: 16, marginRight: 5}}>
                          Total
                        </Text>
                        <Text style={{color: 'black', fontSize: 16}}>
                          {' '}
                          <FontAwesome name="rupee" size={14} color="black" />{' '}
                          {Carttotal.toFixed(2)}
                        </Text>
                      </View>
                      <Text
                        style={{
                          color: 'white',
                          fontFamily: 'Roboto',
                          backgroundColor: '#5D3FD3',
                          padding: 10,
                          paddingLeft: 40,
                          paddingRight: 40,
                          borderRadius: 5,
                          fontWeight: 'bold'

                        }}>
                        View Cart
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}
            </View>
          </Modal>

          <Modal
            animationType={'slide'}
            transparent={false}
            visible={showratecard}
            style={{backgroundColor: 'white'}}
            onRequestClose={() => {
              setshowratecard(false);
            }}>
            <TouchableOpacity
              onPress={() => {
                setshowratecard(!showratecard);
              }}
              style={[styles.rateclose, styles.elevation]}>
              <Feather name="x" color="white" size={29} />
            </TouchableOpacity>
            <ScrollView>
              <View style={{marginTop: 40}}>
                {rateCarddata.filter(i => i.city === savecity).length > 0 ? (
                  rateCarddata
                    .filter(i => i.city === savecity)
                    .map((i, index) => (
                      <View key={index} style={{margin: 10, marginTop: 5}}>
                        <Text
                          style={{
                            fontSize: 18,
                            fontFamily: 'Poppins-Medium',
                            backgroundColor: 'black',
                            color: 'white',
                            padding: 8,
                          }}>
                          {i.header}
                        </Text>
                        {i.desc.map((item, descIndex) => (
                          <View
                            key={descIndex}
                            style={{
                              flexDirection: 'row',
                              marginBottom: 2,
                              justifyContent: 'space-between',
                              backgroundColor: 'lightgrey',
                              padding: 5,
                            }}>
                            <Text style={{color: 'black'}}>{item.text}</Text>
                            <Text style={{color: 'black'}}>{item.cg}</Text>
                          </View>
                        ))}
                      </View>
                    ))
                ) : (
                  <Text
                    style={{
                      margin: 10,
                      marginTop: 5,
                      fontSize: 16,
                      color: 'black',
                      textAlign: 'center',
                    }}>
                    No data found !
                  </Text>
                )}
              </View>
            </ScrollView>
          </Modal>

          <Modal
            isVisible={LoginModal}
            onBackdropPress={() => {
              setLoginModal(false);
              navigation.goBack();
            }}
            onBackButtonPress={() => {
              setLoginModal(false);
              navigation.goBack();
            }}
            style={{justifyContent: 'center', alignItems: 'center'}}
            avoidKeyboard>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 20,
                width: 300,
              }}>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  padding: 5,
                }}
                onPress={() => {
                  setLoginModal(false);
                  navigation.goBack();
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
                Enter details to continue
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={text => setCustomerName(text)}
                value={customerName}
                placeholder="Enter Your Name"
                placeholderTextColor="#888"
              />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                maxLength={10}
                onChangeText={text => setmainContact(text)}
                value={mainContact}
                placeholder="Enter Mobile Number"
                placeholderTextColor="grey"
              />
              <TouchableOpacity
                onPress={sendOTP}
                disabled={otpLoader}
                style={styles.submitButton}>
                <Text style={styles.submitButtonText}>
                  {otpLoader ? (
                    <ActivityIndicator size="small" color={'white'} />
                  ) : (
                    'Continue'
                  )}
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  marginTop: 20,
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 14, color: '#999'}}>
                  Why to choose{' '}
                  <Text style={{color: 'darkred'}}>Our Services?</Text>
                </Text>
                <View style={{marginTop: 10, alignSelf: 'flex-start'}}>
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
          </Modal>

           {/* Painting Enquiry Modal */}
          <Modal
            isVisible={enquiryModalVisible}
            onBackdropPress={() => setEnquiryModalVisible(false)}
            onBackButtonPress={() => setEnquiryModalVisible(false)}
            style={{justifyContent: 'center', alignItems: 'center'}}
            avoidKeyboard>
            <View style={[styles.enquiryModalContainer, {
              shadowColor: 'black',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.18,
              shadowRadius: 12,
              elevation: 8,
              borderRadius: 18,
              padding: 30,
              backgroundColor: '#fff',
            }]}> 
              <TouchableOpacity
                style={[styles.closeButton, {backgroundColor: '#F0F4FF', borderRadius: 20}]}
                onPress={() => setEnquiryModalVisible(false)}>
                <AntDesign name="close" size={14} color="black" padding="10" />
              </TouchableOpacity>
              <Text style={[styles.enquiryModalTitle, {color: 'black', fontSize: 22, marginTop: 10}]}>Get a Free Inspection</Text>
              <Text style={[styles.enquiryModalSubtitle, {fontSize: 15, marginBottom: 24}]}>Please provide your details below. Our team will get in touch with you.</Text>
              <ScrollView style={{width: '100%'}} keyboardShouldPersistTaps="handled">
                <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F4FF', borderRadius: 8, marginBottom: 16, paddingHorizontal: 10, width: 250}}>
                  <AntDesign name="user" size={20} color="grey" style={{marginRight: 8}} />
                  <TextInput
                    style={[styles.enquiryInput, {
                      borderWidth: 0,
                      backgroundColor: 'transparent',
                      flex: 1,
                      fontSize: 16,
                      textAlignVertical: 'center',
                      paddingTop: 0,
                      paddingBottom: 0,
                    }]}
                    placeholder="Enter Your Name"
                    placeholderTextColor="#888"
                    value={enquiryName}
                    onChangeText={setEnquiryName}
                  />
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F4FF', borderRadius: 8, marginBottom: 16, paddingHorizontal: 10}}>
                  <AntDesign name="phone" size={20} color="grey" style={{marginRight: 8}} />
                  <TextInput
                    style={[styles.enquiryInput, {borderWidth: 0, backgroundColor: 'transparent', flex: 1,fontSize: 16, alignItems: 'center'}]}
                    placeholder="Enter Your 10-digit Phone Number"
                    placeholderTextColor="#888"
                    value={enquiryPhone}
                    onChangeText={setEnquiryPhone}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.submitButton, {backgroundColor: 'black', borderRadius: 8, marginTop: 10, shadowColor: '#0047AB', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3}]}
                  onPress={handlePaintingEnquirySubmit}
                  disabled={isSubmitting}>
                  {isSubmitting ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={[styles.submitButtonText, {fontFamily: 'Roboto-Bold', fontSize: 17}]}>Submit Enquiry</Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </Modal>

          <Modal
            isVisible={showModal1}
            style={styles.bottomSheetModal}
            onBackdropPress={() => setShowModal1(false)}
            onBackButtonPress={() => setShowModal1(false)}
            swipeDirection={['down']}
            onSwipeComplete={() => setShowModal1(false)}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            backdropOpacity={0.5}>
            <SafeAreaView style={styles.bottomSheetContainer}>
              <View style={styles.bottomSheetHeader}>
                <Text style={styles.bottomSheetTitle}>Select an Option</Text>
                <TouchableOpacity
                  onPress={() => setShowModal1(false)}
                  style={styles.bottomSheetCloseButton}>
                  <Feather name="x" color="grey" size={24} />
                </TouchableOpacity>
              </View>
              <ScrollView
                contentContainerStyle={styles.bottomSheetScrollContent}>
                <View style={{marginHorizontal: 10, marginTop: 10}}>
                  {pricesdata.length > 0 ? (
                    <View style={{width: '100%'}}>
                      {pricesdata
                        .slice()
                        .sort((a, b) => parseFloat(a.pPrice) - parseFloat(b.pPrice))
                        .map((item, index) => (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              backgroundColor: '#fff',
                              borderRadius: 8,
                              marginBottom: 10,
                              padding: 12,
                              borderWidth: 1,
                              borderColor: '#eee',
                            }}
                            key={item._id || index}>
                            <View style={{flex: 1}}>
                              <Text style={{fontFamily: 'Poppins-Bold', fontSize: 16, color: '#343434'}}>{item.pName}</Text>
                              <View style={{flexDirection: 'row', alignItems: 'baseline', marginTop: 0}}>
                                <Text style={{textDecorationLine: 'line-through', color: '#888', fontSize: 14, fontFamily: 'Roboto-Medium'}}>
                                  ₹{item.pPrice}
                                </Text>
                                <Text style={{color: '#0047AB', fontSize: 16, fontFamily: 'Roboto-Bold', marginLeft: 8}}>
                                  ₹{item.pofferprice}
                                </Text>
                              </View>
                              {item?.pservices && (
                                <Text style={{color: '#555', fontSize: 13, fontFamily: 'Roboto-Medium', marginTop: 2}}>
                                  Services - {item.pservices}
                                </Text>
                              )}
                            </View>
                            {isItemInCart(item._id) ? (
                              <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                borderRadius: 5,
                                padding: 4,
                                borderWidth: 1,
                                borderColor: '#0047AB',
                                shadowColor: '#0047AB',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.3,
                                shadowRadius: 4,
                                elevation: 4,
                                paddingHorizontal: 4,
                                marginRight: 20,
                              }}>
                                <TouchableOpacity
                                  onPress={() => {
                                    dispatch(deleteMyCartItem(item._id));
                                  }}>
                                  <AntDesign
                                    name="minus"
                                    size={12}
                                    color="#0047AB"
                                    paddingLeft={4}
                                  />
                                </TouchableOpacity>
                                <Text style={{
                                  color: '#0047AB',
                                  fontFamily: 'Roboto-Bold',
                                  fontSize: 16,
                                  paddingLeft: 12,
                                  paddingRight: 12,
                                }}>
                                  {getItemQuantityById(item._id)}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => handleItemClick(item, index)}>
                                  <AntDesign
                                    name="plus"
                                    size={12}
                                    color="#0047AB"
                                    paddingRight={4}
                                  />
                                </TouchableOpacity>
                              </View>
                            ) : (
                              <TouchableOpacity
                                onPress={() => handleItemClick(item, index)}
                                style={{backgroundColor: 'white', borderRadius: 5, paddingVertical: 8, paddingHorizontal: 18, marginLeft: 10}}>
                                <Text style={{color: '#0047AB', fontFamily: 'Roboto-Bold', fontSize: 15, borderColor: '#0047AB', borderWidth: 1, padding: 4, paddingHorizontal: 20, borderRadius: 5}}>
                                  Book
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                      ))}
                    </View>
                  ) : (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 50,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Poppins-Medium',
                          fontSize: 14,
                          color: 'black',
                        }}>
                        No data found !
                      </Text>
                    </View>
                  )}
                </View>
              </ScrollView>
              {Carttotal > 0 && (
                <View style={styles.bottomSheetFooter}>
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: '#00A36C',
                      padding: 8,
                      marginTop: 5,
                      alignSelf: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      width: '100%',
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <MaterialIcons
                        name="local-offer"
                        size={15}
                        style={{marginTop: 3, paddingRight: 5}}
                      />
                      <Text style={{color: 'white', fontFamily: 'Roboto'}}>
                        Congratulations!
                      </Text>
                    </View>
                    <Text
                      style={{color: 'white', marginLeft: 10, fontFamily: 'Roboto'}}>
                      <FontAwesome name="rupee" size={12} color="white" />{' '}
                      {CartSavedtotal.toFixed(2)} saved so far!
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'white',
                      padding: 10,
                      width: '100%',
                      textAlign: 'center',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                    onPress={() => {
                      navigation.navigate('cartbook');
                      setShowModal1(false);
                    }}>
                    <View style={{flexDirection: 'row', paddingTop: 10,marginLeft: 10}}>
                      <Text
                        style={{
                          color: 'black',
                          fontFamily: 'Roboto-Bold',
                          fontSize: 16,
                          marginRight: 5,
                        }}>
                        Total
                      </Text>
                      <Text style={{color: 'black', fontSize: 16}}>
                        {' '}
                        <FontAwesome name="rupee" size={16} color="black" />{' '}
                        <Text
                          style={{fontFamily: 'Roboto-Bold', fontSize: 16}}>
                          {Carttotal.toFixed(2)}
                        </Text>
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: 'Roboto-Bold',
                        backgroundColor: '#5D3FD3',
                        padding: 15,
                        paddingLeft: 50,
                        paddingRight: 50,
                        borderRadius: 5,
                        fontSize: 16,
                      }}>
                      View Cart
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </SafeAreaView>
          </Modal>
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
  minicon: {
    backgroundColor: 'white',
    margin: 10,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  textinput1: {
    borderRadius: 10,
    backgroundColor: 'white',
    fontSize: 16,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  elevation1: {
    elevation: 1,
  },
  textinput2: {
    backgroundColor: 'white',
    borderRadius: 5,
    fontSize: 16,
    padding: 10,
  },
  elevation2: {
    elevation: 15,
  },
  servicestext: {
    color: 'black',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 5,
    width: 70,
    minHeight: 30,
  },
  originalPrice: {
    color: 'gray',
    fontFamily: 'Poppins-Medium',
    textDecorationLine: 'line-through',
    marginRight: 5,
    marginLeft: 4,
    fontSize: 18
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    width: '100%',
    position: 'absolute',
    bottom: 100,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
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
  servicesimg: {
    width: 90,
    height: 90,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  modal: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 90,
  },
  text: {
    color: '#3f2949',
    marginTop: 10,
  },
  textinput: {
    borderRadius: 50,
    backgroundColor: '#36454F',
    padding: 5,
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 10,
  },

  rateclose: {
    borderRadius: 50,
    backgroundColor: 'black',
    padding: 5,
    position: 'absolute',
    right: 10,
    top: 20,
    zIndex: 10,
  },
  elevation: {
    elevation: 10,
  },
  acimg: {
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    marginTop: 5,
    paddingLeft: 15,
    color: 'black',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    width: '100%',
    height: 45,
    marginBottom: 15,
    fontFamily: 'Poppins-Regular',
  },
  label: {
    color: 'black',
    textAlign: 'left',
  },
  logintext: {
    backgroundColor: '#3A75F6',
    padding: 10,
    marginLeft: 130,
    marginRight: 130,
    borderRadius: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  hrtag: {
    height: 1,
    backgroundColor: 'lightgray',
    margin: 15,
  },
  shead: {
    color: 'green',
    backgroundColor: 'rgb(219, 236, 231)',
    width: 150,
    borderTopRightRadius: 80,
    padding: 1,
    fontSize: 11,
    paddingLeft: 5,
    fontFamily: 'Poppins-Medium',
  },
  sbelow: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#191970',
  },
  tb: {
    fontSize: 16,
    padding: 8,
    color: '#19c37d',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  tb1: {
    flex: 0.33,
    padding: 8,
    color: 'darkred',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  modalContainer: {
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    zIndex: 111,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
  },
  btm: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    color: 'black',
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 14,
    color: 'black',
    marginBottom: 10,
    fontFamily: 'Poppins-Medium',
  },
  separator: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
    color: 'black',
  },
  submitButton: {
    backgroundColor: 'darkred',
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    zIndex: 1,
  },
  image: {
    width: 130,
    height: 30,
    resizeMode: 'contain',
    marginBottom: 5,
    marginLeft: -8,
  },
  modalPlansContainerOuter: {
    marginHorizontal: 15,
    marginTop: 10,
  },
  modalSectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    color: 'black',
    marginBottom: 10,
  },
  modalPlansContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modalPlanItem: {
    width: '48%',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
    padding: 6,
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 15,
    // --- UNIFORM LAYOUT FIX ---
    height: 140, 
    justifyContent: 'space-between',
    paddingBottom: 10,
    // --- END FIX ---
  },
  modalPlanName: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#19c37d',
    textAlign: 'center',
    marginBottom: 3,
    paddingHorizontal: 4,
    // --- UNIFORM LAYOUT FIX ---
    minHeight: 38,
    // --- END FIX ---
  },
  modalPlanOriginalPrice: {
    textDecorationLine: 'line-through',
    color: 'black',
    fontSize: 12,
  },
  modalPlanOfferPrice: {
    fontFamily: 'Poppins-Medium',
    color: 'black',
    fontSize: 12,
    marginLeft: 8,
  },
  modalPlanDiscount: {
    color: 'orange',
    textAlign: 'center',
    fontSize: 11,
    marginVertical: 2,
  },
  modalPlanServices: {
    color: 'black',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    fontSize: 11,
    marginBottom: 5,
  },
  modalBookNowButtonPlan: {
    backgroundColor: 'darkred',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 3,
    marginTop: 8,
    width: '90%',
    alignItems: 'center',
  },
  modalBookNowButtonTextPlan: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    textAlign: 'center',
    width: '100%',
  },
  addedToCartContainerModal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'green',
    borderRadius: 5,
    paddingVertical: 4,
    marginTop: 8,
    width: '90%',
    elevation: 15,
    marginLeft: 0,
  },
  cartQuantityTextModal: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    marginHorizontal: 5,
  },
  bottomSheetModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  bottomSheetContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 0,
    paddingTop: 0,
    maxHeight: Dimensions.get('window').height * 0.7,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bottomSheetTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: 'black',
  },
  bottomSheetCloseButton: {
    padding: 5,
  },
  bottomSheetScrollContent: {
    paddingBottom: 20,
  },
  bottomSheetFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'white',
  },
  enquiryModalContainer: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
    alignItems: 'center',
  },
  enquiryModalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: 'black',
    marginBottom: 8,
    textAlign: 'center',
  },
  enquiryModalSubtitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: 'grey',
    textAlign: 'center',
    marginBottom: 20,
  },
  enquiryInput: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
   
    fontFamily: 'Poppins-Regular',
    color: 'black',
    alignItems: 'center',
  },
  paintingFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  paintingFooterButton: {
    backgroundColor: '#5D3FD3',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paintingFooterButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
  },

  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },

   someTextStyle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6495ED',
    },
});

export default Repairing;