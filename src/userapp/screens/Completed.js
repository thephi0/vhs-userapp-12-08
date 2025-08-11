import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Video from 'react-native-video';
import Loader from './Loader';
import AntDesign from 'react-native-vector-icons/AntDesign';

function Completed() {
  const [allorder, setAllorder] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const res = await axios.get(
          `https://newapi.vijayhomeservicebengaluru.in/api/bookingService/past/${user.id}`,
        );
        setAllorder(res.data);
      } catch (error) {
        console.error('Error fetching completed orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletedOrders();
  }, [user]);

  return (
    <View style={{flex: 1}}>
      {isLoading ? (
        <Loader />
      ) : (
        <View style={styles.container}>
          {!allorder.length ? (
            <View style={styles.emptyContainer}>
              <Video
                source={require('../../../assets/nodata.mp4')}
                style={styles.video}
                muted={false}
                repeat
                resizeMode="contain"
                paused={false}
              />
              <Text style={styles.emptyText}>
                Please Book Any Services and Come Back Later!
              </Text>
            </View>
          ) : (
            <ScrollView>
              {allorder.map(item => (
                <TouchableOpacity
                  key={item._id || item.id}
                  // onPress={() =>
                  //   navigation.navigate('completedetail', {allorder: item})
                  // }
                  style={[styles.textinput, styles.elevation]}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 0.85}}>
                      <Text style={styles.serviceName}>
                        {item.service_name}
                      </Text>

                      <View style={styles.row}>
                        <Text style={styles.greyText}>
                          ₹ {item.service_charge}
                        </Text>
                        <Text style={styles.separator}></Text>
                        <Text style={styles.greyText}>{item.service_date}</Text>
                      </View>

                      <Text style={styles.statusText}>Completed</Text>
                    </View>
                    <View style={styles.iconWrap}>
                      <AntDesign name="checkcircleo" size={22} color="green" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  video: {
    width: 200,
    height: 200,
  },
  emptyText: {
    fontFamily: 'Poppins-Medium',
    color: 'black',
    marginTop: 10,
  },
  textinput: {
    borderRadius: 5,
    backgroundColor: 'white',
    fontSize: 16,
    margin: 10,
    padding: 10,
  },
  elevation: {
    elevation: 5,
  },
  serviceName: {
    color: 'darkred',
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    marginTop: 5,
  },
  row: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
    alignItems: 'center',
  },
  greyText: {
    color: 'gray',
    fontSize: 14,
  },
  separator: {
    borderRightWidth: 1,
    borderColor: 'grey',
    marginHorizontal: 5,
    height: '100%',
  },
  statusText: {
    color: 'darkgreen',
    backgroundColor: 'rgb(190, 204, 196)',
    width: 90,
    padding: 2,
    textAlign: 'center',
    fontSize: 13,
    marginBottom: 5,
  },
  iconWrap: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Completed;
