import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const Subcategory_Component = ({ subcategory, scrollToService }) => {
  // Titles and images for each subcategory
  const bathroomCleaning = [
    { title: 'Manual Cleaning', image: '/assets/manual_cleaning.jpg' },
    { title: 'Machine Cleaning', image: '/assets/machine_cleaning.jpg' },
    { title: 'Grouting', image: '/assets/grouting.jpg' },
  ];

  const occupiedHomeCleaning = [
    { title: 'Occupied Flats', image: '/assets/occupiedflat.png' },
    { title: 'Occupied Villa', image: '/assets/occupiedvilla.png' },
  ];

  const vacantHomeCleaning = [
    { title: 'Vacant Flats', image: '/assets/vacantflat.png' },
    { title: 'Vacant Villa', image: '/assets/vacantvilla.png' },
  ];

  const kitchenCleaning = [
    { title: 'Without Cabinet', image: '/assets/withoutcabinet.png' },
    { title: 'Vacant Kitchen', image: '/assets/vacantkitchen.png' },
    { title: 'Occupied Kitchen', image: '/assets/occupiedkitchen.png' },
  ];

  const sofaCleaning = [
    { title: 'Fabric Sofa Cleaning', image: '/assets/fabricsofa.png' },
    { title: 'Leather Sofa Cleaning', image: '/assets/leathersofa.png' },
  ];

  const afterInteriorCleaning = [
    { title: 'Flat Project Cleaning', image: '/assets/flatprojectcleaning.png' },
    { title: 'Duplex Project Cleaning', image: '/assets/duplexprojectcleaning.png' },
    { title: 'Villa Project Cleaning', image: '/assets/villaprojectcleaning.png' },
  ];

  const officeCleaning = [
    { title: 'Office Carpet Cleaning', image: '/assets/officecarpetcleaning.png' },
    { title: 'Vacant Office Cleaning', image: '/assets/vacantofficecleaning.png' },
    { title: 'Occupied Office Cleaning', image: '/assets/occupiedofficecleaning.png' },
  ];

  // Other categories go here, same structure...

  // Determine which titles and images to render based on the subcategory
  let titlesAndImages = [];
  if (subcategory.toLowerCase().includes('bathroom')) {
    titlesAndImages = bathroomCleaning;
  } else if (subcategory.toLowerCase().includes('occupied')) {
    titlesAndImages = occupiedHomeCleaning;
  } else if (subcategory.toLowerCase().includes('vacant')) {
    titlesAndImages = vacantHomeCleaning;
  } else if (subcategory.toLowerCase().includes('kitchen')) {
    titlesAndImages = kitchenCleaning;
  } else if (subcategory.toLowerCase().includes('sofa')) {
    titlesAndImages = sofaCleaning;
  } else if (subcategory.toLowerCase().includes('after')) {
    titlesAndImages = afterInteriorCleaning;
  } else if (subcategory.toLowerCase().includes('office')) {
    titlesAndImages = officeCleaning;
  }
  // Add other conditions here for the rest of the categories...

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.row}>
          {titlesAndImages.slice(0, 3).map((data, index) => (
            <TouchableOpacity
              key={index}
              style={styles.itemContainer}
              onPress={() => scrollToService(index)}
            >
              <Image
                source={{ uri: data.image }}
                style={styles.image}
              />
              <Text style={styles.text}>{data.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  text: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    color: 'black',
  },
 
});

export default Subcategory_Component;
