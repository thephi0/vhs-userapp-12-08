import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const imageURLs = [
  'https://vijayahomeservices.b-cdn.net/packers1/packers3.png',
  'https://vijayahomeservices.b-cdn.net/packers1/packers1.png',
  'https://vijayahomeservices.b-cdn.net/packers1/packers2.png',
];

const packersMoversServiceData = {
    _id: 'packers-movers-static',
    servicename: 'Packers and Movers',
    desc: 'Professional packing and moving services for a smooth relocation.',
};

export default function Servicedetails({ navigation }) {

  const handleImagePress = () => {
    navigation.navigate('Booking', {
      data: packersMoversServiceData,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>

        <View style={styles.imageStackContainer}>
          {imageURLs.map((url, index) => (
            <TouchableOpacity
              key={index}
              style={styles.imageTouchable}
              onPress={handleImagePress}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: url }}
                style={styles.serviceImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 30,
    paddingBottom: 20,
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
     paddingHorizontal: 15,
     paddingTop: 20,
     paddingBottom: 20,
  },
  imageStackContainer: {

  },
  imageTouchable: {
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'white',
  },
  serviceImage: {
    width: '100%',
    height: (width - 30) * (9 / 16),
  },
});