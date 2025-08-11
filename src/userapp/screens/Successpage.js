import React from 'react';
import {Text, TouchableOpacity, Image} from 'react-native';
import {View} from 'react-native';
import Video from 'react-native-video';
import {useRoute} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

function Successpage({navigation}) {
  const route = useRoute();
  const {data} = route.params;

  const formatDate = dateString => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Video
        source={require('../../../assets/a.mp4')}
        style={{
          width: 200,
          height: 200,
          justifyContent: 'center',
          alignContent: 'center',

          alignSelf: 'center',
        }}
        muted={false}
        repeat={true}
        resizeMode="contain"
        paused={false}
      />

      <Text
        style={{
          backgroundColor: '',
          color: 'black',
          textAlign: 'center',
          fontSize: 20,
          fontFamily: 'Poppins-Bold',
        }}>
        Booking successfull
      </Text>
      <Text
        style={{
          textAlign: 'center',
          color: 'grey',
          marginBottom: 10,
          fontSize: 12,
        }}>
        {data?._id}
      </Text>

      <Text
        style={{
          borderBottomColor: 'lightgrey',
          fontSize: 18,
          borderBottomWidth: 1,
          marginBottom: 30,
        }}>
        {' '}
      </Text>

      <View style={{margin: 15}}>
        <View style={{flexDirection: 'row', padding: 4}}>
          <Text
            style={{
              color: 'black',
              fontFamily: 'Poppins-Bold',
              fontSize: 17,
              flex: 0.6,
            }}>
            Booking Details
          </Text>
        </View>
        <View style={{flexDirection: 'row', padding: 4}}>
          <Text style={{color: 'black', fontSize: 15, flex: 0.3}}>
            Service Name
          </Text>
          <Text style={{flex: 0.2, color: 'black'}}>:</Text>
          <Text style={{color: 'black', fontSize: 15, flex: 0.5}}>
            {data?.service}
          </Text>
        </View>

        <View style={{flexDirection: 'row', padding: 4}}>
          <Text style={{color: 'black', fontSize: 15, flex: 0.3}}>
            Category
          </Text>
          <Text style={{flex: 0.2, color: 'black'}}>:</Text>
          <Text style={{color: 'black', fontSize: 15, flex: 0.3}}>
            {data?.category}
          </Text>
        </View>

        <View style={{flexDirection: 'row', padding: 4}}>
          <Text style={{color: 'black', fontSize: 15, flex: 0.3}}>
            Service Dates
          </Text>
          <Text style={{flex: 0.2, color: 'black'}}>:</Text>

          <View style={{flexDirection: 'column', flex: 0.5}}>
            <Text style={{color: 'black', fontSize: 15}}>
              {formatDate(data?.start_date)}
            </Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', padding: 4}}>
          <Text style={{color: 'black', fontSize: 15, flex: 0.3}}>
            Selected Slot
          </Text>
          <Text style={{flex: 0.2, color: 'black'}}>:</Text>
          <Text style={{color: 'black', fontSize: 15, flex: 0.3}}>
            {data?.selected_slot_text}
          </Text>
        </View>

        <View style={{flexDirection: 'row', padding: 4}}>
          <Text style={{color: 'black', fontSize: 15, flex: 0.3}}>
            Payment Mode
          </Text>
          <Text style={{flex: 0.2, color: 'black'}}>:</Text>
          <Text style={{color: 'black', fontSize: 15, flex: 0.3}}>
            {data?.payment_mode}
          </Text>
        </View>

        <View style={{flexDirection: 'row', padding: 4}}>
          <Text style={{color: 'black', fontSize: 15, flex: 0.3}}>
            Grand Total
          </Text>
          <Text style={{flex: 0.2, color: 'black'}}>:</Text>
          <Text style={{color: 'black', fontSize: 15, flex: 0.3}}>
            <FontAwesome name="rupee" size={15} /> {data?.grand_total}
          </Text>
        </View>
      </View>
      {data?.grand_total >= 1500 ? (
        <View>
          <Text
            style={{
              textAlign: 'center',
              padding: 10,
              color: 'green',
              fontFamily: 'Poppins-Medium',
              fontSize: 15,
            }}>
            Congratulations !!! You won a reward of Rs
            {(data?.grand_total * 0.02).toFixed(2)}/- in your Wallet..!!
          </Text>
        </View>
      ) : (
        <></>
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('tab')}
        style={{
          backgroundColor: 'darkred',
          position: 'absolute',
          bottom: 10,
          width: '90%',
          padding: 8,
          justifyContent: 'center',
          alignContent: 'center',
          alignSelf: 'center',
          borderRadius: 5,
        }}>
        <Text
          style={{
            textAlign: 'center',
            color: 'white',
            fontSize: 20,
            fontFamily: 'Poppins-Medium',
          }}>
          Close
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default Successpage;
