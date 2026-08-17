import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { COLORS, SHADOWS } from '../constants/theme';

const MerchantLocatorScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState({
    lat: -1.286389,
    lng: 36.817223,
  });

  // Mock merchants data
  const merchants = [
    {
      id: '1',
      name: 'Telkom Shop - CBD',
      category: 'telkom',
      address: 'Kencom House, Moi Avenue',
      distance: '0.3 km',
      lat: -1.2835,
      lng: 36.8215,
      rating: 4.5,
    },
    {
      id: '2',
      name: 'T-Kash Agent - Westlands',
      category: 'tkash',
      address: 'Westgate Mall, Muthangari Rd',
      distance: '1.2 km',
      lat: -1.2715,
      lng: 36.8095,
      rating: 4.2,
    },
    {
      id: '3',
      name: 'Telkom Plus Store',
      category: 'telkom',
      address: 'Junction Mall, Ngong Rd',
      distance: '2.1 km',
      lat: -1.2975,
      lng: 36.7935,
      rating: 4.8,
    },
    {
      id: '4',
      name: 'T-Kash Agent - Kilimani',
      category: 'tkash',
      address: 'Yaya Centre, Argwings Kodhek Rd',
      distance: '2.5 km',
      lat: -1.3015,
      lng: 36.7935,
      rating: 4.0,
    },
    {
      id: '5',
      name: 'Telkom Authorized Dealer',
      category: 'telkom',
      address: 'Valley Arcade, Gitanga Rd',
      distance: '3.1 km',
      lat: -1.3085,
      lng: 36.7815,
      rating: 4.3,
    },
    {
      id: '6',
      name: 'T-Kash Express - Hurlingham',
      category: 'tkash',
      address: 'Hurlingham Plaza, Ngong Rd',
      distance: '3.2 km',
      lat: -1.3105,
      lng: 36.7785,
      rating: 4.1,
    },
  ];

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'telkom', label: 'Telkom Shop' },
    { id: 'tkash', label: 'T-Kash Agent' },
  ];

  const filteredMerchants = merchants.filter(merchant => {
    const matchesSearch = merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          merchant.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || merchant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'telkom':
        return 'store';
      case 'tkash':
        return 'payment';
      default:
        return 'location-on';
    }
  };

  const handleMerchantPress = (merchant) => {
    Alert.alert(
      merchant.name,
      `${merchant.address}\n${merchant.distance} away • Rating: ${merchant.rating}⭐`,
      [
        { text: 'Close' },
        { 
          text: 'Navigate',
          onPress: () => {
            // Open maps with directions
            const url = `https://www.google.com/maps/dir/?api=1&destination=${merchant.lat},${merchant.lng}`;
            // Open URL in browser
            Alert.alert('Directions', 'Opening maps...');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find Merchants</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryBtn,
              selectedCategory === category.id && styles.categoryBtnActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextActive
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {filteredMerchants.map(merchant => (
          <Marker
            key={merchant.id}
            coordinate={{
              latitude: merchant.lat,
              longitude: merchant.lng,
            }}
            title={merchant.name}
            description={merchant.address}
            onPress={() => handleMerchantPress(merchant)}
          >
            <View style={styles.markerContainer}>
              <Icon 
                name={getCategoryIcon(merchant.category)} 
                size={20} 
                color={COLORS.primary} 
              />
              <View style={styles.markerPulse} />
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={styles.bottomSheet}>
        <View style={styles.bottomSheetHeader}>
          <Text style={styles.bottomSheetTitle}>
            {filteredMerchants.length} Merchants Found
          </Text>
          <TouchableOpacity style={styles.listViewBtn}>
            <Icon name="list" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.merchantList}
        >
          {filteredMerchants.map(merchant => (
            <TouchableOpacity
              key={merchant.id}
              style={styles.merchantCard}
              onPress={() => handleMerchantPress(merchant)}
            >
              <View style={styles.merchantCardHeader}>
                <Icon 
                  name={getCategoryIcon(merchant.category)} 
                  size={20} 
                  color={COLORS.primary} 
                />
                <Text style={styles.merchantCardName}>{merchant.name}</Text>
              </View>
              <Text style={styles.merchantCardAddress}>{merchant.address}</Text>
              <View style={styles.merchantCardFooter}>
                <Text style={styles.merchantCardDistance}>{merchant.distance}</Text>
                <View style={styles.ratingContainer}>
                  <Icon name="star" size={14} color="#FFD700" />
                  <Text style={styles.merchantCardRating}>{merchant.rating}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 16,
    paddingTop: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    ...SHADOWS.small,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  categoryContainer: {
    maxHeight: 44,
    marginBottom: 8,
  },
  categoryContent: {
    paddingHorizontal: 16,
  },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
  },
  map: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  markerContainer: {
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  markerPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    opacity: 0.2,
    top: -10,
    left: -10,
  },
  bottomSheet: {
    height: 160,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    ...SHADOWS.medium,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bottomSheetTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  listViewBtn: {
    padding: 4,
  },
  merchantList: {
    paddingVertical: 4,
  },
  merchantCard: {
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    width: 180,
    ...SHADOWS.small,
  },
  merchantCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  merchantCardName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  merchantCardAddress: {
    fontSize: 11,
    color: COLORS.gray,
    marginBottom: 4,
  },
  merchantCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  merchantCardDistance: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  merchantCardRating: {
    fontSize: 12,
    color: '#1a1a1a',
    fontWeight: '500',
  },
});

export default MerchantLocatorScreen;
