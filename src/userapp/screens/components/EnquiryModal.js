// components/EnquiryModal.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { styles } from '../RepairingStyles';

const EnquiryModal = ({ isVisible, onClose, enquiryName, setEnquiryName, enquiryPhone, setEnquiryPhone, onSubmit, isSubmitting }) => {
    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose} onBackButtonPress={onClose} style={{justifyContent: 'center', alignItems: 'center'}} avoidKeyboard>
            <View style={styles.enquiryModalContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <AntDesign name="close" size={24} color="grey" />
              </TouchableOpacity>
              <Text style={styles.enquiryModalTitle}>Get a Free Inspection</Text>
              <Text style={styles.enquiryModalSubtitle}>
                Please provide your details below. Our team will get in touch.
              </Text>
              <ScrollView style={{width: '100%'}} keyboardShouldPersistTaps="handled">
                <TextInput
                  style={styles.enquiryInput}
                  placeholder="Enter Your Name"
                  placeholderTextColor="#888"
                  value={enquiryName}
                  onChangeText={setEnquiryName}
                />
                <TextInput
                  style={styles.enquiryInput}
                  placeholder="Enter Your 10-digit Phone Number"
                  placeholderTextColor="#888"
                  value={enquiryPhone}
                  onChangeText={setEnquiryPhone}
                  keyboardType="numeric"
                  maxLength={10}
                />
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={onSubmit}
                  disabled={isSubmitting}>
                  {isSubmitting ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit Enquiry</Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>
        </Modal>
    );
};
export default EnquiryModal;