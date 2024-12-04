import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Alert, TextInput } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { ActivityIndicator, Searchbar } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import Ionicons from '@expo/vector-icons/Ionicons';

import ServerIp from '../hooks/Global';

const LunchScreen = ({navigation}) => {
  const { theme } = useTheme(); // Access the theme from context
  const [activeTab, setActiveTab] = useState('addFood'); // Track the active tab
  const [searchLunch, setSearchLunch] = useState(''); // State for the search bar
  const [modalVisible, setModalVisible] = useState(false); // For Modal visibility
  const [selectedFood, setSelectedFood] = useState(null)
  const [ consumedAmount, setConsumedAmount] = useState('');

  // States for food results, loading, and error handling
  const [foodResults, setFoodResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch food data based on search query
  const searchFood = async (query) => {
    if (!query) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch(ServerIp + `/api/searchFood?query=${query}`);
      if (response.ok) {
        const data = await response.json();
        setFoodResults(data);
      } else {
        setError('No products found');
      }
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch food data');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchLunch.length > 2) {
      searchFood(searchLunch);
    } else {
      setFoodResults([]);
    }
  }, [searchLunch]);

  // State and logic to fetch previous meals
  const [previousMeals, setPreviousMeals] = useState([]);
  const getPreviousMeals = async () => {
    try {
      const response = await fetch(ServerIp + '/get-food');
      if (response.ok) {
        const data = await response.json();
        setPreviousMeals(data);
      } else {
        console.error('Failed to fetch food history');
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    getPreviousMeals();
  }, []);

  const saveFoodMeal = async (food) => {
    if (!consumedAmount || isNaN(consumedAmount) || consumedAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount in grams.");
      return;
    }
  
    // Lasketaan ravintosisältö per syötetty määrä
    const proteinPerGram = food.nutriments?.proteins_100g || 0;
    const carbsPerGram = food.nutriments?.carbohydrates_100g || 0;
    const fatPerGram = food.nutriments?.fat_100g || 0;
    const caloriesPerGram = food.nutriments?.['energy-kcal'] || 0;
  
    const proteinAmount = (proteinPerGram * consumedAmount) / 100;
    const carbsAmount = (carbsPerGram * consumedAmount) / 100;
    const fatAmount = (fatPerGram * consumedAmount) / 100;
    const caloriesAmount = (caloriesPerGram * consumedAmount) / 100;
  
    const foodData = {
      knimi: food.product_name, 
      ruokanimi: food.brands,
      maarag: consumedAmount,
      kalorit: caloriesAmount,
      proteiini: proteinAmount,
      hiilihydraatit: carbsAmount,
      rasvat: fatAmount,
    };
  
    try {
      // Lähetetään POST-pyyntö
      const response = await fetch(ServerIp + '/api/add-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(foodData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save food to the database');
      }
  
      const result = await response.json();
      Alert.alert("Success", result.message || "Food saved successfully!");
      setModalVisible(false);
      setConsumedAmount('');
    } catch (error) {
      console.error('Error saving food:', error);
      Alert.alert("Error", "Failed to save food to database.");
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: theme.container.backgroundColor }]}>
      {/* Top Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'addFood' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('addFood')}
        >
          <Text style={[styles.tabText, activeTab === 'addFood' && styles.activeTabText]}>
            Add Food
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'createMeal' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('createMeal')}
        >
          <Text style={[styles.tabText, activeTab === 'createMeal' && styles.activeTabText]}>
            Create Meal
          </Text>
        </TouchableOpacity>
      </View>

      {/* Render content based on the active tab */}
      {activeTab === 'addFood' && (
        <>
          <Text style={[styles.subHeader, { color: theme.text.color }]}>
          "Good food is the foundation of genuine happiness." 
          </Text>
          <Text style={[styles.header, { color: theme.text.color }]}>Build Your Lunch</Text>
          <Searchbar
            placeholder="Search food"
            onChangeText={setSearchLunch}
            value={searchLunch}
            style={styles.searchBar}
          />

          {/* Show loading indicator */}
          {loading && <ActivityIndicator size={50} color="#ff0" />}

          {/* Show error message if there is one */}
          {error && <Text style={{ color: 'red' }}>{error}</Text>}

          {/* Display the search results */}
          <FlatList
            data={foodResults}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Animatable.View animation="fadeIn" duration={400}>
              <TouchableOpacity
                style={styles.foodItem}
                onPress={() => {
                  setSelectedFood(item);
                  setModalVisible(true);
                }}
              >
                <Text style={{ color: theme.text.color }}>
                  {item.product_name || 'No name'}
                </Text>
                <Text style={{ color: theme.text.color }}>
                  {item.brands || 'No brand'}
                </Text>

                <Text style={{ color: theme.text.color }}>
                  Amount: {item.quantity || 'N/A'}
                </Text>

                <Text style={{ color: theme.text.color }}>
                  Protein: {item.nutriments?.proteins_100g || 'N/A'} g
                </Text>
                <Text style={{ color: theme.text.color }}>
                  Carbohydrates: {item.nutriments?.carbohydrates_100g || 'N/A'} g
                </Text>
                <Text style={{ color: theme.text.color }}>
                  Fat: {item.nutriments?.fat_100g || 'N/a'} g
                </Text>
                <Text style={{ color: theme.text.color }}>
                  Calories: {item.nutriments?.["energy-kcal"] || 'N/A'} kcal
                </Text>


              </TouchableOpacity>
              </Animatable.View>

            )}
          />

          {/* Modal for showing nutrition info */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {selectedFood ? (
                  <>
                    <Text style={styles.modalText}>
                      Name: {selectedFood.product_name || 'N/A'}
                    </Text>
                    <Text style={styles.modalText}>
                      Brand: {selectedFood.brands || 'N/A'}
                    </Text>
                    <Text style={styles.modalText}>
                      Quantity: {selectedFood.quantity || 'N/A'}
                    </Text>
                    <Text style={styles.modalText}>
                      Protein: {selectedFood.nutriments?.proteins_100g || 'N/A'}
                    </Text>
                    <Text style={styles.modalText}>
                      Carbohydrates: {selectedFood.nutriments?.carbohydrates_100g || 'N/A'}
                    </Text>
                    <Text style={styles.modalText}>
                      Fat: {selectedFood.nutriments?.fat_100g || 'N/A'}
                    </Text>

                    <Text style={styles.modalText}>
                      Calories: {selectedFood.nutriments?.['energy-kcal'] || 'N/A'} kcal
                    </Text>

                    <TextInput
                      style={styles.input}
                      placeholder="Enter amount (grams)"
                      keyboardType="numeric"
                      value={consumedAmount}
                      onChangeText={setConsumedAmount}
                    />

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => saveFoodMeal(selectedFood)}
                    >
                      <Text >Save food</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text style={styles.modalText}>No food selected</Text>
                )}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setModalVisible(false)}
                >
                  <Text>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}

    
{activeTab === 'createMeal' && (
  <>
    <Text style={[styles.header, { color: theme.text.color }]}> My Meals</Text>

    <Searchbar 
    placeholder='Search my meals'
    ></Searchbar>
    
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]} 
      onPress={() => navigation.navigate('Meals')}
    >
      <Text style={[styles.buttonText, { color: theme.buttonText.color }]}>Create a new meal</Text>
      <Ionicons name="fast-food" size={24} color={theme.iconColor} style={styles.icon} />
    </TouchableOpacity>

  </>
)}
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  tabBar: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF', // Active tab underline color
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    color: '#007AFF', // Active tab text color
    fontWeight: 'bold', 
  },

  subHeader: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  
  header: {
    fontSize: 24,
    marginTop: 40,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  searchBar: {
    marginHorizontal: 20,
    marginBottom: 20,
    width: '90%',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    marginVertical: 40,
    borderWidth: 2,
    borderColor: 'blue',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },

  foodItem: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: '80%',
    backgroundColor: '#f0f0f0',
  },
  mealItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#e9e9e9',
    borderRadius: 5,
    width: '80%',
  },
  mealText: {
    fontSize: 16,
    color: '#333',
  },
});

export default LunchScreen;
