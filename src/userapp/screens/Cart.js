import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {addToCart1, removeMyCartItem, clearCart} from './Redux1/MyCartSlice';
import {deleteMyCartItem} from './Redux1/MyCartSlice'; // Adjust the path as needed
import {WebView} from 'react-native-webview';
import Video from 'react-native-video';

function Cart({navigation}) {
  const dispatch = useDispatch();

  const handle = item => {
    dispatch(addToCart1(item));
  };

  const MyCartItmes = useSelector(state => state.cart);
  console.log(MyCartItmes.lenght);

  const Carttotal = MyCartItmes.reduce((accumulator, item) => {
    const offerPrice = parseFloat(item?.offerprice);
    const quantity = parseInt(item?.qty);

    if (!isNaN(offerPrice) && !isNaN(quantity)) {
      const subtotal = offerPrice * quantity;

      return accumulator + subtotal;
    } else {
      return accumulator;
    }
  }, 0);

  const clear = () => {
    dispatch(clearCart());
  };

  const webViewRef = useRef(null);

  const [loading, setLoading] = useState(true);

  // URL for the video
  const videoUrl =
    'https://iframe.mediadelivery.net/play/212658/47f4ad74-ee8e-4541-b3d1-ea462987e39b';

  // Log WebView loading events
  const handleLoadStart = () => {
    console.log('WebView started loading');
    setLoading(true);
  };

  const handleLoad = () => {
    console.log('WebView loaded successfully');
    setLoading(false);
  };

  const handleError = error => {
    console.log('WebView error: ', error);
    setLoading(false);
  };

  const handleHttpError = error => {
    console.log('WebView HTTP error: ', error);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {MyCartItmes ? (
        <View>
          <ScrollView>
            {MyCartItmes.map(item => (
              <View style={styles.card}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 0.7}}>
                    <View style={{marginLeft: 5}}>
                      <View></View>

                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: 'Roboto',
                          fontWeight: 'bold',
                          color: '#36454F',
                        }}>
                        {item.service?.serviceName}
                      </Text>
                        <Text
                        style={{
                          fontSize: 16,
                          fontFamily: 'Roboto-Bold',
                          color: 'grey',
                        }}>
                        {item.planName}
                      </Text>

                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            marginLeft: 0,
                            color: 'grey',
                            textDecorationLine: 'line-through',
                            fontFamily: 'Roboto-Bold',
                            fontSize: 16,
                          }}>
                          
                          {item.planPrice}
                        </Text>
                        <Text style={{marginLeft: 10, color: 'black', fontFamily: 'Roboto-Bold', fontSize: 16, fontWeight: 'bold'}}>
                          <FontAwesome name="rupee" size={14} />{' '}
                          {item.offerprice}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{flex: 0.3}}>
                    <View
                      style={{flexDirection: 'row', justifyContent: 'center',}}>
                      <FontAwesome
                        name="rupee"
                        size={14}
                        color="#191970"
                        style={{marginTop: 8}}
                      />

                      <Text
                        style={{
                          textAlign: 'center',
                          marginLeft: 2,
                          color: '#191970',
                          fontSize: 16,
                          fontFamily: 'Roboto-Medium',
                          fontWeight: 'bold',
                          marginTop: 4
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
      ) : (
        <View
          style={{justifyContent: 'center', alignItems: 'center', top: '50%'}}>
          <Text
            style={{color: 'black', fontFamily: 'Poppins-Bold', fontSize: 15}}>
            {' '}
            No data found! Please add service
          </Text>
        </View>
      )}

      <View style={{marginTop: 50, alignItems: 'center'}}>
        <View
          style={{
            backgroundColor: 'darkred',
            paddingVertical: 10,
            paddingHorizontal: 20,

            marginBottom: 0,
            width: 400,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontFamily: 'Poppins-Medium',
              textAlign: 'center',
            }}>
            YEAR END SALE IS NOW LIVE!
          </Text>
        </View>

        <Video
          source={require('../../../assets/painting.webm')}
          ref={ref => {
            this.player = ref;
          }}
          onBuffer={this.onBuffer}
          onError={this.videoError}
          style={{width: 400, height: 224}}
          controls={false}
          resizeMode="contain"
          muted={true}
        />
      </View>
      {/* <TouchableOpacity onPress={clear}>
<Text>clear</Text>
      </TouchableOpacity > */}
      <View style={styles.btm}>
        <View style={{flexDirection: 'row',alignItems: 'center'}}>
          <Text
            style={{color: '#343434', fontSize: 18, fontFamily: 'Roboto-Bold', fontWeight: 'bold',paddingLeft: 10}}>
            Total :
          </Text>
          <Text
            style={{fontSize: 18, fontFamily: 'Roboto-Bold', color: '#343434', fontWeight: 'bold',paddingLeft: 5}}>
            {Carttotal}
          </Text>
        </View>
        {MyCartItmes !== undefined ? (
          <TouchableOpacity
            style={{
              backgroundColor: '#5D3FD3',
              padding: 10,
              borderRadius: 5,
              width: 190,

            }}
            onPress={() => navigation.navigate('cartbook')}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Poppins-Medium',
                fontSize: 17,
                textAlign: 'center',
              }}>
              Book Your Slot
            </Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flex: 1,
  },
  card: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'white',
    elevation: 5,
    marginTop: 10,
  },
  remove: {
    padding: 5,
    borderWidth: 1,
    borderColor: 'green',
    color: 'green',
    borderRadius: 5,
    // width: 100,
    textAlign: 'center',
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
});

export default Cart;
