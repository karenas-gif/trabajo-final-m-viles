import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import BateriaScreen from '../screens/BateriaScreen';
import Notificaciones from '../screens/Notificaciones';

const Tab = createBottomTabNavigator();

export default function StackNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bateria" component={BateriaScreen} />
      <Tab.Screen name="Notificaciones" component={Notificaciones} />
    </Tab.Navigator>
  );
}