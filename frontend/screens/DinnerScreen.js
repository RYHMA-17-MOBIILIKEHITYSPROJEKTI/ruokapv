import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../components/ThemeContext'; // Import the useTheme hook

const DinnerScreen = ({ navigation }) => {
  const { theme } = useTheme(); // Access the theme from context
 
  const [activeView, setActiveView] = useState('home');  

  
  const handleCreateMealPress = () => {
    setActiveView('createMeal');
  };

  const handleAddFoodPress = () => {
    setActiveView('addFood');
  };

  const handleBackToHome = () => {
    setActiveView('home');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.container.backgroundColor }]}>
      {/* Conditionally render different views based on activeView */}
      {activeView === 'home' && (
        <>
          <Text style={[styles.header, { color: theme.text.color }]}>Build Your dinner</Text>
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]}
            onPress={handleCreateMealPress} // This triggers the "Create meal" action
          >
            <Text style={[styles.buttonText, { color: theme.buttonText.color }]}>Create meal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]}
            onPress={handleAddFoodPress} // This triggers the "Add food" action
          >
            <Text style={[styles.buttonText, { color: theme.buttonText.color }]}>Add food</Text>
          </TouchableOpacity>
        </>
      )}

      {activeView === 'createMeal' && (
        <>
          <Text style={[styles.header, { color: theme.text.color }]}>Create Your Meal</Text>
          {/* Here, you can render your form or UI for creating a meal */}
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]}
            onPress={handleBackToHome} // Go back to the main screen
          >
            <Text style={[styles.buttonText, { color: theme.buttonText.color }]}>Back to Menu</Text>
          </TouchableOpacity>
        </>
      )}

      {activeView === 'addFood' && (
        <>
          <Text style={[styles.header, { color: theme.text.color }]}>Add Food Items</Text>
          {/* Here, you can render your form or UI for adding food */}
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]}
            onPress={handleBackToHome} // Go back to the main screen
          >
            <Text style={[styles.buttonText, { color: theme.buttonText.color }]}>Go back</Text>
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
  header: { 
    fontSize: 24, 
    marginTop: 40, 
    marginBottom: 20, 
    fontWeight: 'bold'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    marginVertical: 10, 
  },
  buttonText: {
    fontSize: 18,    
  }
})
export default DinnerScreen;
