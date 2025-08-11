import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import axios, {all} from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebView from 'react-native-webview';
import Video from 'react-native-video';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Loader from './Loader';
import moment from 'moment';
import BottomSheet from 'react-native-gesture-bottom-sheet';
function Upcomingdetail({navigation}) {
  const [serviceDate, setserviceDate] = useState('');

  const formatDate = dateString => {
    const options = {year: 'numeric', month: 'long', day: 'numeric'};

    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const route = useRoute();
  const {allorder} = route.params;
  const [technisian, setTechnisian] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState('');
  const [showWebView, setShowWebView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [paymentMode, setpaymentMode] = useState('');
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [Transaction, setTransaction] = useState('');

  useEffect(() => {
    // Fetch user data from AsyncStorage and parse it
    const fetchData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setValue(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchData();
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  console.log('allorder?.vendor_id', allorder?.vendor_id);

  useEffect(() => {
    if (allorder?.vendor_id) {
      getallserviceorder();
    }
    fetchData();
  }, [value]);

  const getallserviceorder = async () => {
    try {
      const res = await axios.get(
        `https://newapi.vijayhomeservicebengaluru.in/api/vendors/${allorder?.vendor_id}`,
      );
      if (res.status === 200) {
        setTechnisian(res.data);
      } else {
        alert('Something went wrong');
      }
    } catch (error) {
      console.error('Error fetching service orders: ', error);
    }
  };
  const [Data, setData] = useState({});

  const fetchData = async () => {
    if (!allorder?.id) return;
    try {
      const res = await axios.get(
        `https://newapi.vijayhomeservicebengaluru.in/api/bookingService/service/${allorder?.id}`,
      );
      setData(res.data);
    } catch (error) {
      console.error('Error fetching orders: ', error);
    }
  };

  const [paymentsstatus, setpaymentsstatus] = useState([]);

  useEffect(() => {
    getPayment();
  }, []);

  const getPayment = async () => {
    try {
      const res = await axios.get(
        'https://api.vijayhomeservicebengaluru.in/api/payment/service/getservicePayments',
      );
      if (res.status === 200) {
        setpaymentsstatus(res.data?.success);
      } else {
        console.error('Failed to fetch payment data.');
      }
    } catch (error) {
      console.error('Error fetching payment data: ', error);
    }
  };

  const {payments} = paymentsstatus;

  const bottomSheet = useRef();
  const handleBookNowClick = () => {
    // if (isAddressSelected) {
    bottomSheet.current.show();
    // } else {
    // alert('Please select an address before booking.');
    // }
  };

  const handleSubmit1 = async e => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://newapi.vijayhomeservicebengaluru.in/api/customerPG/customer-payment-after-booking',
        {
          serviceId: Data?.Booking?._id,
          customer_id: value?.id,
          amount: allorder?.service_charge,
          service_date: allorder?.service_date,
        },
      );

      if (response && response.data && response.data.url) {
        setShowWebView(true);
        setPaymentUrl(response.data.url);
      }
    } catch (error) {
      console.error(
        'Error initiating payment:',
        error.response || error.message || error,
      );
    }
  };
  return (
    <View style={{flex: 1}}>
      {showWebView ? (
        <WebView source={{uri: paymentUrl}} style={{flex: 1}} />
      ) : (
        <View style={styles.container}>
          <ScrollView
            style={{marginBottom: 50}}
            contentInsetAdjustmentBehavior="automatic">
            <View
              style={{
                flexDirection: 'row',
                marginTop: 5,
                margin: 10,
                flexWrap: 'wrap',
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 18,
                  fontFamily: 'Poppins-Medium',
                }}>
                {Data?.Booking?.category}
              </Text>
            </View>

            {Data?.Booking && Data?.Booking.payment_mode === 'online' ? (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    padding: 15,
                    elevation: 3,
                    backgroundColor: 'white',
                    margin: 10,
                    borderRadius: 5,
                  }}>
                  <View style={{flex: 0.7}}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 15,
                        fontFamily: 'Poppins-Bold',
                      }}>
                      Thanks for Choosing Vijay Home Servicess
                    </Text>

                    <TouchableOpacity
                      style={{flexDirection: 'row', marginTop: 5}}>
                      <Text style={{color: 'green', fontSize: 17}}>
                        {' '}
                        ● Paid
                      </Text>
                      {allorder?.service_charge ? (
                        <Text
                          style={{color: 'green', fontSize: 17, marginLeft: 5}}>
                          ₹ {allorder?.service_charge}
                        </Text>
                      ) : (
                        <Text
                          style={{color: 'green', fontSize: 17, marginLeft: 5}}>
                          ₹ {allorder.service_charge}
                        </Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={toggleModal}
                      style={{
                        borderWidth: 1,
                        borderColor: 'grey',
                        padding: 8,
                        borderRadius: 5,
                        width: 130,
                        marginTop: 10,
                        borderWidth: 1,
                        borderColor: 'green',
                      }}>
                      <Text style={{textAlign: 'center', color: 'black'}}>
                        View Receipt
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flex: 0.3,
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                    }}>
                    <Video
                      source={require('../../../assets/a.mp4')}
                      style={{
                        width: 80,
                        height: 80,
                      }}
                      muted={false}
                      repeat={true}
                      resizeMode="contain"
                      paused={false}
                    />
                  </View>
                </View>
              </>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  padding: 15,
                  elevation: 3,
                  backgroundColor: 'white',
                  margin: 10,
                  borderRadius: 5,
                }}>
                <View style={{flex: 0.7}}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 15,
                      fontFamily: 'Poppins-Bold',
                    }}>
                    Thanks for Choosing Vijay Home Servicess
                  </Text>

                  <TouchableOpacity
                    style={{flexDirection: 'row', marginTop: 5}}>
                    <Text style={{color: 'black'}}> ● Service Charge</Text>

                    {Data?.service_charge ? (
                      <Text style={{color: 'black', marginLeft: 5}}>
                        ₹ {Data?.service_charge}
                      </Text>
                    ) : (
                      <Text style={{color: 'black', marginLeft: 5}}>
                        ₹ {Data?.service_charge}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 0.3,
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={require('../../../assets/vhs.png')}
                    style={{width: 40, height: 40}}
                  />
                </View>
              </View>
            )}
            {technisian.vhsname ? (
              <View
                style={{
                  backgroundColor: 'white',
                  elevation: 3,
                  borderRadius: 5,
                  padding: 15,
                  margin: 10,
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'darkred',
                    fontFamily: 'Poppins-Bold',
                  }}>
                  Technician Details
                </Text>

                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  <Text style={{color: 'black'}}>Name : </Text>

                  <Text style={{color: 'grey', fontSize: 14}}>
                    {technisian?.vhsname}
                  </Text>
                </View>

                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  <Text style={{color: 'black'}}>Exp : </Text>
                  <Text style={{color: 'grey', fontSize: 14}}>
                    {technisian?.experiance}
                  </Text>
                </View>

                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  <Text style={{color: 'black'}}>Languages know : </Text>
                  <Text style={{color: 'grey', fontSize: 14}}>
                    {technisian?.languagesknow}
                  </Text>
                </View>
              </View>
            ) : (
              <></>
            )}

            <View
              style={{
                backgroundColor: 'white',
                elevation: 3,
                borderRadius: 5,
                padding: 15,
                margin: 10,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  color: 'darkred',
                  fontFamily: 'Poppins-Bold',
                }}>
                Service Dates
              </Text>

              <Text style={{color: 'grey', fontSize: 14, marginTop: 5}}>
                {Data.service_date}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: 'white',
                elevation: 3,
                borderRadius: 5,
                padding: 15,
                margin: 10,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  color: 'darkred',
                  fontFamily: 'Poppins-Bold',
                }}>
                Service slot
              </Text>

              <Text style={{color: 'grey', fontSize: 14, marginTop: 5}}>
                {Data?.Booking?.selected_slot_text}
              </Text>
            </View>

            {Data ? (
              <>
                <View
                  style={{
                    backgroundColor: 'white',
                    elevation: 3,
                    borderRadius: 5,
                    padding: 15,
                    margin: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: 'darkred',
                      fontFamily: 'Poppins-Bold',
                    }}>
                    Services details
                  </Text>
                  <View style={{flexDirection: 'row', marginTop: 7}}>
                    <View>
                      <Text style={styles.text}>
                        {Data?.Booking?.description.replace(/,/g, '\n')}
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            ) : (
              ''
            )}

            <View
              style={{
                backgroundColor: 'white',
                elevation: 3,
                borderRadius: 5,
                padding: 15,
                margin: 10,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  color: 'darkred',
                  fontFamily: 'Poppins-Bold',
                }}>
                Payment Summary
              </Text>

              {/* {allorder && allorder.service_charge ? (
                <>
                  <View style={{flexDirection: 'row', marginTop: 7}}>
                    <View style={{flex: 0.7}}>
                      <Text style={styles.text}>Total Amount</Text>
                    </View>
                    <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 14,
                          textDecorationLine: 'line-through',
                        }}>
                        ₹{' '}
                        {parseInt(allorder?.service_charge) +
                          parseInt(allorder?.service_charge)}
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                ''
              )} */}

              {allorder && allorder.Booking?.discount_amount ? (
                <>
                  <View style={{flexDirection: 'row', marginTop: 7}}>
                    <View style={{flex: 0.7}}>
                      <Text style={styles.text}>Discount</Text>
                    </View>
                    <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                      <Text style={{color: 'black', fontSize: 14}}>
                        ₹ {allorder?.Booking?.discount_amount}
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                ''
              )}
              {/* {allorder ? (
                <>
                  <View style={{flexDirection: 'row', marginTop: 7}}>
                    <View style={{flex: 0.7}}>
                      <Text style={styles.text}>GST</Text>
                    </View>
                    <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                      <Text style={{color: 'black', fontSize: 14}}>
                        ₹ {allorder?.grand_total - allorder?.total_amount}
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                ''
              )} */}

              {allorder && allorder.total_saved ? (
                <>
                  <View style={{flexDirection: 'row', marginTop: 7}}>
                    <View style={{flex: 0.7}}>
                      <Text style={styles.text1}>Saved</Text>
                    </View>
                    <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                      <Text style={styles.text1}>
                        ₹ {allorder?.total_saved}
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                ''
              )}

              {allorder && allorder.Booking?.coupon_code ? (
                <>
                  <View style={{flexDirection: 'row', marginTop: 7}}>
                    <View style={{flex: 0.7}}>
                      <Text style={{color: 'rgb(1, 107, 248)'}}>Coupons</Text>
                    </View>
                    <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                      <Text style={{color: 'rgb(1, 107, 248)', fontSize: 12}}>
                        {allorder?.Booking?.coupon_code}
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                ''
              )}

              {allorder?.Booking?.grand_total ? (
                <View style={{flexDirection: 'row', marginTop: 7}}>
                  <View style={{flex: 0.7}}>
                    <Text style={styles.text2}>GrandTotal</Text>
                  </View>
                  <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                    <Text style={styles.text2}>
                      ₹ {allorder?.Booking?.grand_total}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={{flexDirection: 'row', marginTop: 7}}>
                  <View style={{flex: 0.7}}>
                    <Text style={styles.text2}>GrandTotal</Text>
                  </View>
                  <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                    <Text style={styles.text2}>
                      ₹ {allorder?.service_charge}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View
              style={{
                backgroundColor: 'white',
                elevation: 3,
                borderRadius: 5,
                padding: 15,
                margin: 10,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  color: 'darkred',
                  fontFamily: 'Poppins-Bold',
                }}>
                Booking Details
              </Text>

              <TouchableOpacity
                onPress={() => setIsModalVisible(true)}
                style={{flexDirection: 'row', marginTop: 10}}>
                <View style={{flex: 0.1}}>
                  <MaterialCommunityIcons name="cash" color="black" size={28} />
                </View>
                <View
                  style={{
                    flex: 0.8,
                    justifyContent: 'center',
                    marginLeft: 10,
                  }}>
                  {allorder?.service_charge ? (
                    <Text style={{color: 'black'}}>
                      Amount : ₹ {allorder?.service_charge}
                    </Text>
                  ) : (
                    <Text style={{color: 'black'}}>
                      Amount : ₹ {allorder?.service_charge}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    flex: 0.1,
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}>
                  {/* <AntDesign name="right" color="grey" size={15} /> */}
                </View>
              </TouchableOpacity>

              <View style={{flexDirection: 'row', marginTop: 20}}>
                <View style={{flex: 0.1}}>
                  <Entypo name="location-pin" color="black" size={28} />
                </View>
                <View
                  style={{
                    flex: 0.9,

                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    padding: 10,
                    marginTop: -5,
                  }}>
                  <Text style={{color: 'black', fontSize: 13}}>
                    {Data?.Booking?.delivery_address?.platno}
                  </Text>
                  <Text style={{color: 'black', fontSize: 13}}>
                    ,{Data?.Booking?.delivery_address?.landmark}
                  </Text>
                  <Text style={{color: 'black', fontSize: 13}}>
                    ,{Data?.Booking?.delivery_address?.address}
                  </Text>
                </View>
              </View>

              <View style={{flexDirection: 'row', marginTop: 20}}>
                <View style={{flex: 0.1}}>
                  <AntDesign name="clockcircleo" color="black" size={20} />
                </View>
                <View
                  style={{
                    flex: 0.9,
                    justifyContent: 'center',
                    marginLeft: 10,
                  }}>
                  <Text style={{color: 'black', fontSize: 13}}>
                    {allorder?.service_date}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: 'white',
                elevation: 3,
                borderRadius: 5,
                padding: 15,
                margin: 10,
              }}
              onPress={handleBookNowClick}>
              <Text
                style={{
                  fontSize: 15,
                  color: 'darkred',
                  fontFamily: 'Poppins-Bold',
                }}>
                Cancellation Policy
              </Text>
            </TouchableOpacity>

            <View>
              <BottomSheet
                hasDraggableIcon
                ref={bottomSheet}
                height={560}
                style={{backgroundColor: 'white'}}>
                <View style={styles.content}>
                  <Text style={styles.title}>
                    Vijay Home Services Cancellation Policy
                  </Text>
                  <Text style={styles.subtitle}>
                    At Vijay Home Services, we understand that plans can change.
                    Our cancellation policy is designed to be fair and
                    transparent for all our customers.
                  </Text>
                  <Text style={styles.sectionTitle}>
                    No Cancellation Charges !!
                  </Text>
                  <Text style={styles.sectionText}>
                    Before 4 Hours: If you cancel your service more than 4 hours
                    before the scheduled slot, there will be no cancellation
                    charges.
                  </Text>
                  <Text style={styles.sectionTitle}>
                    Cancellation Charges !!
                  </Text>
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
                    We appreciate your understanding and cooperation. Please
                    contact us as soon as possible if you need to cancel or
                    reschedule your service to avoid any charges.
                  </Text>
                </View>
              </BottomSheet>
            </View>
          </ScrollView>

          {/* Modal */}

          {allorder && allorder.paymentMode === 'cash' ? (
            <>
              <Modal isVisible={isModalVisible}>
                <View
                  style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: 'darkred',
                      fontFamily: 'Poppins-Bold',
                    }}>
                    Payment Summary
                  </Text>

                  {allorder && allorder.TotalAmt ? (
                    <>
                      <View style={{flexDirection: 'row', marginTop: 20}}>
                        <View style={{flex: 0.7}}>
                          <Text style={styles.text}>Total Amount</Text>
                        </View>
                        <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                          <Text
                            style={{
                              color: 'black',
                              fontSize: 14,
                              textDecorationLine: 'line-through',
                            }}>
                            ₹
                            {parseInt(allorder?.TotalAmt) +
                              parseInt(allorder?.totalSaved)}
                          </Text>
                        </View>
                      </View>
                    </>
                  ) : (
                    ''
                  )}

                  {allorder && allorder.discAmt ? (
                    <>
                      <View style={{flexDirection: 'row', marginTop: 7}}>
                        <View style={{flex: 0.7}}>
                          <Text style={styles.text}>Discount</Text>
                        </View>
                        <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                          <Text style={{color: 'black', fontSize: 14}}>
                            ₹ {allorder.discAmt}
                          </Text>
                        </View>
                      </View>
                    </>
                  ) : (
                    ''
                  )}
                  {allorder ? (
                    <>
                      <View style={{flexDirection: 'row', marginTop: 7}}>
                        <View style={{flex: 0.7}}>
                          <Text style={styles.text}>GST</Text>
                        </View>
                        <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                          <Text style={{color: 'black', fontSize: 14}}>
                            ₹ {allorder?.GrandTotal - allorder?.TotalAmt}
                          </Text>
                        </View>
                      </View>
                    </>
                  ) : (
                    ''
                  )}

                  {allorder && allorder.totalSaved ? (
                    <>
                      <View style={{flexDirection: 'row', marginTop: 7}}>
                        <View style={{flex: 0.7}}>
                          <Text style={styles.text1}>Saved</Text>
                        </View>
                        <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                          <Text style={styles.text1}>
                            ₹ {allorder.totalSaved}
                          </Text>
                        </View>
                      </View>
                    </>
                  ) : (
                    ''
                  )}

                  {allorder && allorder.couponCode ? (
                    <>
                      <View style={{flexDirection: 'row', marginTop: 7}}>
                        <View style={{flex: 0.7}}>
                          <Text style={{color: 'rgb(1, 107, 248)'}}>
                            Coupons
                          </Text>
                        </View>
                        <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                          <Text
                            style={{
                              color: 'rgb(1, 107, 248)',
                              fontSize: 12,
                            }}>
                            ₹ {allorder.couponCode}
                          </Text>
                        </View>
                      </View>
                    </>
                  ) : (
                    ''
                  )}

                  <View style={{flexDirection: 'row', marginTop: 7}}>
                    <View style={{flex: 0.7}}>
                      <Text style={{color: 'black'}}>Payment Mode</Text>
                    </View>
                    <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                      <Text style={{color: 'black', fontSize: 12}}>
                        {allorder?.paymentMode}
                      </Text>
                    </View>
                  </View>
                  <Text style={{borderBottomWidth: 1}}></Text>
                  <View style={{flexDirection: 'row', marginTop: 7}}>
                    <View style={{flex: 0.7}}>
                      <Text
                        style={{color: 'black', fontFamily: 'Poppins-Bold'}}>
                        GrandTotal
                      </Text>
                    </View>
                    <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                      <Text
                        style={{
                          color: 'black',
                          fontFamily: 'Poppins-Medium',
                          fontSize: 14,
                        }}>
                        ₹ {allorder?.GrandTotal}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={toggleModal}
                    style={{
                      backgroundColor: 'darkred',
                      padding: 10,
                      marginTop: 20,
                      borderRadius: 5,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 14,
                        fontFamily: 'Poppins-Bold',
                        textAlign: 'center',
                      }}>
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </>
          ) : (
            <Modal isVisible={isModalVisible}>
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 20,
                  borderRadius: 5,
                }}>
                {payments && payments.length > 0 && (
                  <View style={{marginTop: 10}}>
                    <Text style={styles.text2}>Payment Details</Text>
                    {payments.map((payment, index) => (
                      <View
                        key={index}
                        style={{flexDirection: 'row', marginTop: 7}}>
                        <View style={{flex: 0.7}}>
                          <Text style={styles.text}>Transaction ID</Text>
                        </View>
                        <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                          <Text style={{color: 'black', fontSize: 14}}>
                            {payment.data && payment.data.transactionId}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                <Text
                  style={{
                    fontSize: 15,
                    color: 'darkred',
                    fontFamily: 'Poppins-Bold',
                  }}>
                  Payment Summary
                </Text>

                {allorder && allorder.TotalAmt ? (
                  <>
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                      <View style={{flex: 0.7}}>
                        <Text style={styles.text}>Total Amount11</Text>
                      </View>
                      <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                        <Text
                          style={{
                            color: 'black',
                            fontSize: 14,
                            textDecorationLine: 'line-through',
                          }}>
                          ₹{' '}
                          {parseInt(allorder?.TotalAmt) +
                            parseInt(allorder?.totalSaved)}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : (
                  ''
                )}

                {allorder && allorder.discAmt ? (
                  <>
                    <View style={{flexDirection: 'row', marginTop: 7}}>
                      <View style={{flex: 0.7}}>
                        <Text style={styles.text}>Discount</Text>
                      </View>
                      <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                        <Text style={{color: 'black', fontSize: 14}}>
                          ₹ {allorder.discAmt}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : (
                  ''
                )}
                {allorder ? (
                  <>
                    <View style={{flexDirection: 'row', marginTop: 7}}>
                      <View style={{flex: 0.7}}>
                        <Text style={styles.text}>GST</Text>
                      </View>
                      <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                        <Text style={{color: 'black', fontSize: 14}}>
                          ₹ {allorder?.GrandTotal - allorder?.TotalAmt}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : (
                  ''
                )}

                {allorder && allorder.totalSaved ? (
                  <>
                    <View style={{flexDirection: 'row', marginTop: 7}}>
                      <View style={{flex: 0.7}}>
                        <Text style={styles.text1}>Saved</Text>
                      </View>
                      <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                        <Text style={styles.text1}>
                          ₹ {allorder.totalSaved}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : (
                  ''
                )}

                {allorder && allorder.couponCode ? (
                  <>
                    <View style={{flexDirection: 'row', marginTop: 7}}>
                      <View style={{flex: 0.8}}>
                        <Text style={styles.text}>Coupons</Text>
                      </View>
                      <View style={{flex: 0.2, alignItems: 'center'}}>
                        <Text style={{color: 'black', fontSize: 12}}>
                          ₹ {allorder.couponCode}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : (
                  ''
                )}

                {/* <View style={{flexDirection: 'row', marginTop: 7}}>
                  <View style={{flex: 0.7}}>
                    <Text style={styles.text2}>GrandTotal</Text>
                  </View>
                  <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                    <Text
                      style={{color: 'black', fontSize: 14, fontFamily: 'Poppins-Medium',}}>
                      ₹ {allorder.GrandTotal}
                    </Text>
                  </View>
                </View> */}

                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 7,
                    borderTopWidth: 1,
                    borderColor: 'grey',
                    paddingTop: 10,
                    marginTop: 10,
                  }}>
                  <View style={{flex: 0.7}}>
                    <Text style={styles.text2}>Payment Mode</Text>
                  </View>
                  <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                    <Text style={{color: 'green', fontSize: 17}}>
                      {allorder.paymentMode}
                    </Text>
                  </View>
                </View>
                <View></View>
                <TouchableOpacity
                  onPress={toggleModal}
                  style={{
                    backgroundColor: 'darkred',
                    padding: 10,
                    marginTop: 20,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 14,
                      fontFamily: 'Poppins-Bold',
                      textAlign: 'center',
                    }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </Modal>
          )}
          {Data.Booking?.payment_mode === 'online' ? (
            <></>
          ) : (
            <TouchableOpacity
              onPress={handleSubmit1}
              style={{
                position: 'absolute',
                bottom: 0,
                backgroundColor: 'darkred',
                alignSelf: 'center',
                width: '90%',
                padding: 8,
                textAlign: 'center',
                borderRadius: 5,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 18,
                  textAlign: 'center',
                }}>
                Pay now
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    color: 'black',
    fontSize: 14,
  },
  text1: {
    color: 'green',
    fontSize: 14,
  },
  text2: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
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
export default Upcomingdetail;
