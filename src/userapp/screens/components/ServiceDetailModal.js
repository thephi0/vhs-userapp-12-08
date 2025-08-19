// components/ServiceDetailModal.js

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather';
import { styles } from '../RepairingStyles';

const ServiceDetailModal = ({ isVisible, onClose, selectedItem }) => {
  if (!selectedItem) return null;

  return (
    <Modal isVisible={isVisible} onRequestClose={onClose} style={{ margin: 0 }}>
      <View style={styles.detailModalContainer}>
        <TouchableOpacity onPress={onClose} style={styles.detailModalCloseButton}>
          <Feather name="x" color="white" size={22} />
        </TouchableOpacity>
        <ScrollView>
          <View style={styles.detailModalHeader}>
            {selectedItem.servicetitle && <Text style={styles.serviceTypeText}>{selectedItem.servicetitle}</Text>}
            <Text style={styles.detailModalTitle}>{selectedItem.serviceName}</Text>
            {selectedItem.servicebelow && <Text style={styles.detailModalSubtitle}>{selectedItem.servicebelow}</Text>}
          </View>
          
          {selectedItem.serviceDesc?.length > 0 && (
            <>
              <Text style={styles.detailModalSectionTitle}>Service Description</Text>
              {selectedItem.serviceDesc.map((item, index) => (
                <View key={index} style={styles.detailListItem}>
                  <Feather name="check" size={16} color="#38b2ac" style={styles.detailListIcon} />
                  <Text style={styles.detailListText}>{item.text}</Text>
                </View>
              ))}
            </>
          )}

          {selectedItem.serviceIncludes?.length > 0 && (
            <>
              <Text style={styles.detailModalSectionTitle}>Service Includes</Text>
              {selectedItem.serviceIncludes.map((item, index) => (
                <View key={index} style={styles.detailListItem}>
                  <Feather name="check" size={16} color="#38b2ac" style={styles.detailListIcon} />
                  <Text style={styles.detailListText}>{item.text}</Text>
                </View>
              ))}
            </>
          )}

          {selectedItem.serviceExcludes?.length > 0 && (
            <>
              <Text style={styles.detailModalSectionTitle}>Service Excludes</Text>
              {selectedItem.serviceExcludes.map((item, index) => (
                <View key={index} style={styles.detailListItem}>
                  <Feather name="x" size={16} color="#e53e3e" style={styles.detailListIcon} />
                  <Text style={styles.detailListText}>{item.text}</Text>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default ServiceDetailModal;