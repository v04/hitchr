import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
  TextInput,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const MapScreen = ({ navigation, route }) => {
  const mapRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState('');
  const [rideMode, setRideMode] = useState('rider'); // 'rider' or 'pilot'
  const [vehicleType, setVehicleType] = useState(route.params?.vehicleType || 'car');
  const [nearbyPilots, setNearbyPilots] = useState([]);
  const [rideStatus, setRideStatus] = useState('searching'); // 'searching', 'found', 'ongoing', 'completed'
  const [showBottomSheet, setShowBottomSheet] = useState(true);

  // Mock nearby pilots data
  const mockPilots = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      rating: 4.8,
      vehicle: 'Swift Dzire',
      eta: '2 min',
      coordinate: { latitude: 17.4399, longitude: 78.4983 },
    },
    {
      id: 2,
      name: 'Priya Sharma',
      rating: 4.9,
      vehicle: 'Honda City',
      eta: '5 min',
      coordinate: { latitude: 17.4450, longitude: 78.5010 },
    },
    {
      id: 3,
      name: 'Mohammed Ali',
      rating: 4.7,
      vehicle: 'Auto Rickshaw',
      eta: '3 min',
      coordinate: { latitude: 17.4420, longitude: 78.4950 },
    },
  ];

  useEffect(() => {
    getCurrentLocation();
    setNearbyPilots(mockPilots);
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Please enable location permissions');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      
      setLocation({ latitude, longitude });
      
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Could not get current location');
    }
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'car':
        return 'car-outline';
      case 'auto':
        return 'bus-outline';
      case 'bike':
        return 'bicycle-outline';
      default:
        return 'car-outline';
    }
  };

  const getVehicleColor = (type) => {
    switch (type) {
      case 'car':
        return '#6C63FF';
      case 'auto':
        return '#FF6B6B';
      case 'bike':
        return '#4ECDC4';
      default:
        return '#6C63FF';
    }
  };

  const handleRideRequest = () => {
    setRideStatus('found');
    Alert.alert('Ride Found!', 'Rajesh Kumar will pick you up in 2 minutes', [
      { text: 'OK', onPress: () => setRideStatus('ongoing') }
    ]);
  };

  const renderBottomSheet = () => {
    if (!showBottomSheet) return null;

    return (
      <Animatable.View
        animation="slideInUp"
        style={styles.bottomSheetContainer}
      >
        <BlurView intensity={95} style={styles.bottomSheet}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.dragHandle} />
            <View style={styles.modeToggle}>
              <TouchableOpacity
                style={[styles.modeButton, rideMode === 'rider' && styles.modeButtonActive]}
                onPress={() => setRideMode('rider')}
              >
                <Text style={[styles.modeText, rideMode === 'rider' && styles.modeTextActive]}>
                  Book Ride
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeButton, rideMode === 'pilot' && styles.modeButtonActive]}
                onPress={() => setRideMode('pilot')}
              >
                <Text style={[styles.modeText, rideMode === 'pilot' && styles.modeTextActive]}>
                  Pilot Mode
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {rideMode === 'rider' ? renderRiderMode() : renderPilotMode()}
        </BlurView>
      </Animatable.View>
    );
  };

  const renderRiderMode = () => (
    <View style={styles.riderContainer}>
      {/* Vehicle Selection */}
      <View style={styles.vehicleSelection}>
        {['car', 'auto', 'bike'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.vehicleOption,
              vehicleType === type && { borderColor: getVehicleColor(type), backgroundColor: getVehicleColor(type) + '15' }
            ]}
            onPress={() => setVehicleType(type)}
          >
            <Ionicons
              name={getVehicleIcon(type)}
              size={24}
              color={vehicleType === type ? getVehicleColor(type) : '#666'}
            />
            <Text style={[
              styles.vehicleText,
              vehicleType === type && { color: getVehicleColor(type), fontWeight: 'bold' }
            ]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Destination Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="location-outline" size={20} color="#6C63FF" style={styles.inputIcon} />
        <TextInput
          style={styles.destinationInput}
          placeholder="Where to?"
          placeholderTextColor="#999"
          value={destination}
          onChangeText={setDestination}
        />
      </View>

      {/* Ride Request Button */}
      <TouchableOpacity
        style={[styles.rideButton, { backgroundColor: getVehicleColor(vehicleType) }]}
        onPress={handleRideRequest}
      >
        <Text style={styles.rideButtonText}>
          {rideStatus === 'searching' ? 'Find Ride' : 'Cancel Ride'}
        </Text>
        <Text style={styles.rideButtonSubtext}>
          Earn 20 tokens per km
        </Text>
      </TouchableOpacity>

      {/* Nearby Pilots */}
      <View style={styles.nearbySection}>
        <Text style={styles.sectionTitle}>Nearby Pilots</Text>
        {nearbyPilots.slice(0, 2).map((pilot) => (
          <TouchableOpacity key={pilot.id} style={styles.pilotCard}>
            <View style={styles.pilotInfo}>
              <Text style={styles.pilotName}>{pilot.name}</Text>
              <Text style={styles.pilotDetails}>
                ⭐ {pilot.rating} • {pilot.vehicle} • {pilot.eta} away
              </Text>
            </View>
            <TouchableOpacity style={styles.selectPilotButton}>
              <Text style={styles.selectPilotText}>Select</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPilotMode = () => (
    <View style={styles.pilotContainer}>
      <View style={styles.pilotHeader}>
        <Text style={styles.pilotTitle}>🚗 Ready to Earn?</Text>
        <Text style={styles.pilotSubtitle}>Start accepting ride requests</Text>
      </View>

      <View style={styles.earningsCard}>
        <Text style={styles.earningsTitle}>Today's Earnings</Text>
        <View style={styles.earningsRow}>
          <View style={styles.earningsStat}>
            <Text style={styles.earningsNumber}>₹450</Text>
            <Text style={styles.earningsLabel}>Cash</Text>
          </View>
          <View style={styles.earningsStat}>
            <Text style={styles.earningsNumber}>120</Text>
            <Text style={styles.earningsLabel}>Tokens</Text>
          </View>
          <View style={styles.earningsStat}>
            <Text style={styles.earningsNumber}>8</Text>
            <Text style={styles.earningsLabel}>Rides</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.goOnlineButton}>
        <LinearGradient
          colors={['#4ECDC4', '#44A08D']}
          style={styles.goOnlineGradient}
        >
          <Text style={styles.goOnlineText}>Go Online</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={false}
        initialRegion={{
          latitude: 17.4399,
          longitude: 78.4983,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Nearby Pilots Markers */}
        {nearbyPilots.map((pilot) => (
          <Marker
            key={pilot.id}
            coordinate={pilot.coordinate}
            title={pilot.name}
            description={`${pilot.rating} ⭐ • ${pilot.eta} away`}
          >
            <View style={styles.markerContainer}>
              <Ionicons name="car" size={20} color="#FFFFFF" />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Top Controls */}
      <View style={styles.topControls}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
          <Ionicons name="locate" size={24} color="#6C63FF" />
        </TouchableOpacity>
      </View>

      {renderBottomSheet()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  topControls: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationButton: {
    backgroundColor: '#FFFFFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  markerContainer: {
    backgroundColor: '#6C63FF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  bottomSheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomSheet: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingBottom: 20,
    minHeight: height * 0.4,
  },
  sheetHeader: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 15,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    padding: 4,
  },
  modeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  modeButtonActive: {
    backgroundColor: '#6C63FF',
  },
  modeText: {
    color: '#666',
    fontWeight: '600',
  },
  modeTextActive: {
    color: '#FFFFFF',
  },
  riderContainer: {
    flex: 1,
  },
  vehicleSelection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  vehicleOption: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    minWidth: 80,
  },
  vehicleText: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  destinationInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  rideButton: {
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  rideButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rideButtonSubtext: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
    marginTop: 5,
  },
  nearbySection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  pilotCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  pilotInfo: {
    flex: 1,
  },
  pilotName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  pilotDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  selectPilotButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  selectPilotText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  pilotContainer: {
    flex: 1,
  },
  pilotHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pilotTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  pilotSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  earningsCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  earningsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  earningsStat: {
    alignItems: 'center',
  },
  earningsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  earningsLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  goOnlineButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  goOnlineGradient: {
    padding: 20,
    alignItems: 'center',
  },
  goOnlineText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MapScreen;