// components/PlanSelectionModal.js

import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, deleteMyCartItem } from '../Redux1/MyCartSlice';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { styles } from '../RepairingStyles';

const PlanSelectionModal = ({ isVisible, onClose, serviceItem, onProceed, navigation, savecity }) => {
  const dispatch = useDispatch();
  const MyCartItmes = useSelector(state => state.cart);

  if (!serviceItem) return null;

  const handleItemClick = (plan) => {
    const itemToAdd = {
        id: plan._id, _id: plan._id, category: serviceItem.category, service: serviceItem,
        pName: plan.pName, pPrice: plan.pPrice, pofferprice: plan.pofferprice,
        pservices: plan.pservices, qty: 1, offerprice: plan.pofferprice, planPrice: plan.pPrice,
    };
    if (!plan.pservices) {
        dispatch(addToCart(itemToAdd));
    } else {
        navigation.navigate('summary', {plan, sdata: serviceItem});
        onClose();
    }
  };
    
  const handleQuantityChange = (item, change) => {
      if (change === 'inc') {
          dispatch(addToCart(item));
      } else if (change === 'dec') {
          dispatch(deleteMyCartItem(item._id));
      }
  };

  const plansForCity = serviceItem.morepriceData
      .filter(i => i.pricecity === savecity)
      .sort((a, b) => parseFloat(a.pPrice) - parseFloat(b.pPrice));

  return (
    <Modal isVisible={isVisible} style={styles.bottomSheetModal} onBackdropPress={onClose} onBackButtonPress={onClose} swipeDirection={['down']} onSwipeComplete={onClose} animationIn="slideInUp" animationOut="slideOutDown" backdropOpacity={0.5}>
      <SafeAreaView style={styles.bottomSheetContainer}>
        <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetTitle}>Select Options</Text>
            <TouchableOpacity onPress={onClose} style={styles.bottomSheetCloseButton}>
                <AntDesign name="close" size={24} color="#555" />
            </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.bottomSheetScrollContent}>
            {plansForCity.map((plan, index) => {
                const cartItem = MyCartItmes.find(ci => ci._id === plan._id);
                const quantity = cartItem ? cartItem.qty : 0;
                return (
                    <View key={plan._id || index} style={styles.optionsRow}>
                        <View style={styles.optionsInfo}>
                            <Text style={styles.optionsName}>{plan.pName}</Text>
                            <Text style={styles.optionsPrice}>₹{plan.pofferprice}</Text>
                        </View>
                        {quantity > 0 ? (
                            <View style={styles.optionsQuantityContainer}>
                                <TouchableOpacity onPress={() => handleQuantityChange(cartItem, 'dec')}>
                                    <AntDesign name="minus" size={18} color="white" />
                                </TouchableOpacity>
                                <Text style={styles.optionsQuantityText}>{quantity}</Text>
                                <TouchableOpacity onPress={() => handleQuantityChange(cartItem, 'inc')}>
                                    <AntDesign name="plus" size={18} color="white" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.optionsAddButton} onPress={() => handleItemClick(plan)}>
                                <Text style={styles.optionsAddButtonText}>ADD</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                );
            })}
        </ScrollView>
        {MyCartItmes.length > 0 && onProceed && (
             <View style={styles.bottomSheetFooter}>
                <TouchableOpacity style={styles.proceedButton} onPress={onProceed}>
                    <Text style={styles.proceedButtonText}>Proceed</Text>
                </TouchableOpacity>
             </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default PlanSelectionModal;