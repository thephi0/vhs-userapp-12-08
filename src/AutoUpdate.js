import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Linking,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from 'react-native';
import VersionCheck from 'react-native-version-check';

export default function AutoUpdate() {
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    checkAppUpdate();
  }, []);

  const checkAppUpdate = async () => {
    try {
      const res = await VersionCheck.needUpdate();
      // For testing, you can force the modal to show: setOpenModal(true);
      if (res && res.isNeeded) {
        setOpenModal(true);
      }
    } catch (error) {
      console.error('Error checking for app update:', error);
    }
  };

  const updateApp = () => {
    VersionCheck.getStoreUrl({
      appID: 'com.vhs1', // Your app's package name
      appName: 'Vijay Home Services', // Your app's name
    })
      .then(url => {
        if (url) {
          Linking.openURL(url).catch(err =>
            console.error('An error occurred opening the URL', err),
          );
        }
      })
      .catch(err => {
        console.log(`Error getting store URL: ${err}`);
      });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={openModal}
      // This prevents the user from closing the modal with the back button
      onRequestClose={() => {}}>
      {/* This hides the phone's status bar for a true full-screen experience */}
      <StatusBar hidden={true} />

      <ImageBackground
        // Make sure this path is correct for your project structure
        source={require('../assets/update_screen.jpeg')}
        style={styles.imageBackground}
        resizeMode="cover">
        {/* This is a transparent, clickable area positioned over the "UPDATE NOW" button in the image. */}
        <TouchableOpacity
          style={styles.updateButton}
          onPress={updateApp}
          activeOpacity={0.8}
        />
      </ImageBackground>
    </Modal>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButton: {
    position: 'absolute',
    bottom: '7%', // Adjust this percentage to perfectly align with the button on different screen sizes
    width: '65%', // Width of the clickable area
    height: '6%', // Height of the clickable area
    borderRadius: 50, // Matches the border radius of the button in the image
    // For debugging the position, you can uncomment the next line:
    // backgroundColor: 'rgba(0, 255, 0, 0.4)',
  },
});