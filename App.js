import React, {useEffect} from 'react';
import Navigations from './src/Navigations';
import 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {mystore} from './src/userapp/screens/Redux1/Mystore';
import {OneSignal} from 'react-native-onesignal';

export default function App() {
  useEffect(() => {
    // OneSignal v5 Initialization
    OneSignal.initialize('63ff3a3e-5cb1-44ae-9609-2b6ee55c7675');
    
    // Request notification permission
    OneSignal.Notifications.requestPermission(true);

    // Method for listening for notification clicks
    OneSignal.Notifications.addEventListener('click', (event) => {
      console.log('OneSignal: notification clicked:', event);
    });

    // Method for listening for foreground notifications
    OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
      console.log('OneSignal: notification will display in foreground:', event);
      
      // Complete with null means don't show a notification
      // event.preventDefault(); // To prevent the notification from displaying
      
      // Or let it display normally by not calling preventDefault()
    });
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={mystore}>
        <Navigations />
      </Provider>
    </SafeAreaProvider>
  );
}
