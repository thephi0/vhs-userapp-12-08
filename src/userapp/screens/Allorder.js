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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loader from './Loader';

function Allorder() {
  const [allorder, setAllorder] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const res = await axios.get(
          `https://newapi.vijayhomeservicebengaluru.in/api/bookingService/future/${user.id}`,
        );
        setAllorder(res.data);
      } catch (error) {
        console.error('Error fetching orders: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(); // Initial fetch
  }, [user]);

  return (
    <View style={{flex: 1}}>
      {isLoading ? (
        <Loader />
      ) : (
        <View style={styles.container}>
          {allorder?.length > 0 ? (
            <ScrollView>
              <View>
                {allorder.map(item => (
                  <TouchableOpacity
                    key={item._id || item.id}
                    onPress={() =>
                      navigation.navigate('upcomingdetail', {allorder: item})
                    }
                    style={[styles.textinput, styles.elevation]}>
                    <Text style={styles.serviceText}>{item.service_name}</Text>
                    <View style={styles.row}>
                      <MaterialIcons name="category" size={20} color="grey" />
                      <Text style={styles.categoryText}>
                        {item.service_date}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No data! Please book a service.
              </Text>
            </View>
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
  textinput: {
    borderRadius: 10,
    backgroundColor: 'white',
    fontSize: 16,
    margin: 10,
    padding: 10,
  },
  elevation: {
    elevation: 5,
  },
  serviceText: {
    color: 'darkred',
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    marginTop: 5,
  },
  categoryText: {
    color: 'black',
    fontSize: 14,
    marginLeft: 5,
    marginTop: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyText: {
    margin: 15,
    fontSize: 18,
    color: 'black',
  },
});

export default Allorder;
