// components/LoginModal.js

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { styles } from '../RepairingStyles';

const LoginModal = ({
  isVisible,
  onClose,
  customerName,
  setCustomerName,
  mainContact,
  setMainContact,
  onSubmit,
  isLoading,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={{ justifyContent: 'center', alignItems: 'center' }}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0.5}
      avoidKeyboard
    >
      <View style={styles.loginModalContainer}>
        <TouchableOpacity style={styles.loginCloseButton} onPress={onClose}>
          <AntDesign name="close" size={24} color="#888" />
        </TouchableOpacity>

        <Text style={styles.loginTitle}>Login to Continue</Text>
        <Text style={styles.loginSubtitle}>
          Enter your details to unlock all features and book services.
        </Text>

        <View style={styles.loginInputContainer}>
          <FontAwesome name="user-o" size={20} color="#888" style={styles.loginInputIcon} />
          <TextInput
            style={styles.loginInput}
            onChangeText={setCustomerName}
            value={customerName}
            placeholder="Enter Your Name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.loginInputContainer}>
          <FontAwesome name="phone" size={20} color="#888" style={styles.loginInputIcon} />
          <TextInput
            style={styles.loginInput}
            keyboardType="numeric"
            maxLength={10}
            onChangeText={setMainContact}
            value={mainContact}
            placeholder="Enter 10-digit Phone Number"
            placeholderTextColor="#999"
          />
        </View>

        {/* --- MODIFICATION START --- */}
        <TouchableOpacity
          onPress={onSubmit}
          disabled={isLoading}
          // Apply a conditional style when loading
          style={[styles.loginButton, isLoading && styles.loginButtonLoading]} 
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.loginButtonText}>Continue</Text>
          )}
        </TouchableOpacity>
        {/* --- MODIFICATION END --- */}

        <View style={styles.whyChooseUsContainer}>
          <Text style={styles.whyChooseUsTitle}>
            Why choose <Text style={{ color: 'darkred' }}>Our Services?</Text>
          </Text>
          <View style={styles.whyChooseUsPoints}>
            <View style={styles.pointRow}>
                <FontAwesome name="check-circle" size={14} color="green" />
                <Text style={styles.pointText}>Lowest Price Guaranteed</Text>
            </View>
            <View style={styles.pointRow}>
                <FontAwesome name="check-circle" size={14} color="green" />
                <Text style={styles.pointText}>Free Reschedule</Text>
            </View>
            <View style={styles.pointRow}>
                <FontAwesome name="check-circle" size={14} color="green" />
                <Text style={styles.pointText}>5 Star Rated Team</Text>
            </View>
            <View style={styles.pointRow}>
                <FontAwesome name="check-circle" size={14} color="green" />
                <Text style={styles.pointText}>Dedicated Customer Support</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};


export default LoginModal;