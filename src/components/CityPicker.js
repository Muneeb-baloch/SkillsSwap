import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const CITIES = [
  // Pakistan
  'Abbottabad', 'Attock', 'Bahawalnagar', 'Bahawalpur', 'Bannu', 'Batkhela',
  'Bhimber', 'Chiniot', 'Chishtian', 'Chichawatni', 'Dadu', 'Dera Ghazi Khan',
  'Dera Ismail Khan', 'Faisalabad', 'Ghotki', 'Gilgit', 'Gojra', 'Gujranwala',
  'Gujrat', 'Hafizabad', 'Haripur', 'Hub', 'Hyderabad', 'Islamabad',
  'Jacobabad', 'Jhelum', 'Kamoke', 'Karachi', 'Kasur', 'Khanewal',
  'Kharian', 'Khuzdar', 'Kohat', 'Kot Addu', 'Lahore', 'Larkana',
  'Layyah', 'Lodhran', 'Mailsi', 'Mandi Bahauddin', 'Mansehra', 'Mardan',
  'Mingora', 'Mirpur', 'Mirpur Khas', 'Multan', 'Muridke', 'Muzaffarabad',
  'Muzaffargarh', 'Narowal', 'Nawabshah', 'Nowshera', 'Okara', 'Pakpattan',
  'Peshawar', 'Quetta', 'Rahim Yar Khan', 'Rawalpindi', 'Sadiqabad',
  'Sahiwal', 'Sargodha', 'Sheikhupura', 'Sialkot', 'Sibi', 'Sukkur',
  'Swabi', 'Tando Adam', 'Turbat', 'Vehari', 'Wah Cantonment', 'Zhob',

  // International
  'Abu Dhabi', 'Accra', 'Addis Ababa', 'Adelaide', 'Ahmedabad', 'Almaty',
  'Amsterdam', 'Ankara', 'Atlanta', 'Auckland', 'Austin', 'Baghdad',
  'Baku', 'Baltimore', 'Bangalore', 'Bangkok', 'Barcelona', 'Beijing',
  'Beirut', 'Belgrade', 'Berlin', 'Bogotá', 'Brisbane', 'Brussels',
  'Bucharest', 'Budapest', 'Buenos Aires', 'Cairo', 'Calgary', 'Cape Town',
  'Casablanca', 'Charlotte', 'Chennai', 'Chicago', 'Chongqing', 'Colombo',
  'Columbus', 'Copenhagen', 'Dakar', 'Dallas', 'Dar es Salaam', 'Delhi',
  'Denver', 'Detroit', 'Dhaka', 'Dubai', 'Dublin', 'Düsseldorf',
  'Edinburgh', 'Frankfurt', 'Glasgow', 'Guangzhou', 'Guatemala City',
  'Hamburg', 'Hanoi', 'Havana', 'Helsinki', 'Ho Chi Minh City', 'Hong Kong',
  'Houston', 'Indianapolis', 'Istanbul', 'Jakarta', 'Jeddah',
  'Johannesburg', 'Kabul', 'Kathmandu', 'Khartoum', 'Kiev',
  'Kinshasa', 'Kolkata', 'Kuala Lumpur', 'Kuwait City', 'Lagos',
  'Lima', 'Lisbon', 'London', 'Los Angeles', 'Luanda', 'Lyon',
  'Madrid', 'Manchester', 'Manila', 'Marseille', 'Medellín', 'Melbourne',
  'Mexico City', 'Miami', 'Milan', 'Minneapolis', 'Minsk', 'Mogadishu',
  'Montreal', 'Moscow', 'Mumbai', 'Munich', 'Nairobi', 'Nashville',
  'New York', 'Oslo', 'Ottawa', 'Paris', 'Perth', 'Philadelphia',
  'Phoenix', 'Portland', 'Prague', 'Pune', 'Riyadh', 'Rome',
  'San Antonio', 'San Diego', 'San Francisco', 'Santiago', 'São Paulo',
  'Seattle', 'Seoul', 'Shanghai', 'Shenzhen', 'Singapore', 'Sofia',
  'Stockholm', 'Surabaya', 'Sydney', 'Taipei', 'Tashkent', 'Tehran',
  'Tel Aviv', 'Tokyo', 'Toronto', 'Tunis', 'Vancouver', 'Vienna',
  'Warsaw', 'Washington DC', 'Yangon', 'Yokohama', 'Zagreb', 'Zürich',
];

const CityPicker = ({ value, onChange }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [visible, setVisible]   = useState(false);
  const [search, setSearch]     = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return CITIES;
    const q = search.toLowerCase();
    return CITIES.filter(c => c.toLowerCase().includes(q));
  }, [search]);

  const select = city => {
    onChange(city);
    setVisible(false);
    setSearch('');
  };

  return (
    <>
      <TouchableOpacity style={styles.trigger} onPress={() => setVisible(true)}>
        <Ionicons name="location-outline" size={18} color={value ? theme.purple : theme.textMuted} />
        <Text style={[styles.triggerText, !value && styles.placeholder]}>
          {value || 'Select your city'}
        </Text>
        <Ionicons name="chevron-down" size={16} color={theme.textMuted} />
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>

            <View style={styles.header}>
              <Text style={styles.title}>Select City</Text>
              <TouchableOpacity onPress={() => { setVisible(false); setSearch(''); }}>
                <Ionicons name="close" size={22} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={16} color={theme.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search city…"
                placeholderTextColor={theme.textMuted}
                value={search}
                onChangeText={setSearch}
                autoFocus
              />
              {!!search && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Ionicons name="close-circle" size={16} color={theme.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filtered}
              keyExtractor={(item, index) => `${item}-${index}`}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.item, item === value && styles.itemSelected]}
                  onPress={() => select(item)}
                >
                  <Text style={[styles.itemText, item === value && styles.itemTextSelected]}>
                    {item}
                  </Text>
                  {item === value && (
                    <Ionicons name="checkmark" size={18} color={theme.purple} />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={
                <Text style={styles.empty}>No cities found</Text>
              }
            />

          </View>
        </View>
      </Modal>
    </>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    trigger: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.inputBg,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: 'rgba(83,74,183,0.3)',
      height: 52,
      paddingHorizontal: 14,
      gap: 10,
    },
    triggerText: {
      flex: 1,
      color: theme.textPrimary,
      fontSize: 14,
    },
    placeholder: {
      color: theme.textMuted,
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: theme.cardBg,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '75%',
      paddingBottom: 32,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    title: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.inputBg,
      margin: 16,
      borderRadius: 10,
      paddingHorizontal: 12,
      height: 44,
      gap: 8,
    },
    searchInput: {
      flex: 1,
      color: theme.textPrimary,
      fontSize: 14,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 14,
    },
    itemSelected: {
      backgroundColor: 'rgba(83,74,183,0.12)',
    },
    itemText: {
      fontSize: 15,
      color: theme.textPrimary,
    },
    itemTextSelected: {
      color: theme.purple,
      fontWeight: '600',
    },
    separator: {
      height: 1,
      backgroundColor: theme.divider,
      marginHorizontal: 20,
    },
    empty: {
      textAlign: 'center',
      color: theme.textMuted,
      marginTop: 32,
      fontSize: 14,
    },
  });

export default CityPicker;
