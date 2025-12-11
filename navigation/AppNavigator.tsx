// import React from 'react';
// import { NavigationContainer, DefaultTheme as NavLight, DarkTheme as NavDark } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { useTheme } from '../components/ThemeProvider';
// import { TabIcon } from '../components/TabIcon';
// import { useAuthUser } from '../state/authStore';

// // Main screens
// import HomeScreen from '../screens/HomeScreen';
// import BookingsScreen from '../screens/BookingsScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import HostScreen from '../screens/HostScreen';

// // Auth screens
// import SignInScreen from '../screens/auth/SignInScreen';
// import SignUpScreen from '../screens/auth/SignUpScreen';
// import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// function TabNavigator() {
//   const { theme } = useTheme();

//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerStyle: { 
//           backgroundColor: theme.colors.surface,
//         },
//         headerTintColor: theme.colors.textPrimary,
//         headerTitleStyle: {
//           fontWeight: '600',
//         },
//         tabBarActiveTintColor: theme.colors.primary,
//         tabBarInactiveTintColor: theme.colors.textSecondary,
//         tabBarStyle: {
//           backgroundColor: theme.colors.surface,
//           borderTopColor: theme.colors.border,
//           borderTopWidth: 1,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           fontWeight: '500',
//         },
//       })}
//     >
//       <Tab.Screen 
//         name="Home" 
//         component={HomeScreen}
//         options={{
//           title: 'Home',
//           tabBarLabel: 'Home',
//           tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
//         }}
//       />
//       <Tab.Screen 
//         name="Bookings" 
//         component={BookingsScreen}
//         options={{
//           title: 'My Bookings',
//           tabBarLabel: 'Bookings',
//           tabBarIcon: ({ focused }) => <TabIcon name="bookings" focused={focused} />,
//         }}
//       />
//       <Tab.Screen 
//         name="Profile" 
//         component={ProfileScreen}
//         options={{
//           title: 'Profile',
//           tabBarLabel: 'Profile',
//           tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} />,
//         }}
//       />
//       <Tab.Screen 
//         name="Host" 
//         component={HostScreen}
//         options={{
//           title: 'Host',
//           tabBarLabel: 'Host',
//           tabBarIcon: ({ focused }) => <TabIcon name="host" focused={focused} />,
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// export default function AppNavigator() {
//   const { theme } = useTheme();
//   const { user, loading } = useAuthUser();

//   const navTheme = (theme as any).mode === 'dark' ? {
//     ...NavDark,
//     colors: {
//       ...NavDark.colors,
//       primary: theme.colors.primary,
//       background: theme.colors.background,
//       card: theme.colors.surface,
//       text: theme.colors.textPrimary,
//       border: theme.colors.border,
//       notification: theme.colors.primary,
//     },
//   } : {
//     ...NavLight,
//     colors: {
//       ...NavLight.colors,
//       primary: theme.colors.primary,
//       background: theme.colors.background,
//       card: theme.colors.surface,
//       text: theme.colors.textPrimary,
//       border: theme.colors.border,
//       notification: theme.colors.primary,
//     },
//   };

//   if (loading) {
//     // You can show a splash screen here
//     return null;
//   }

//   return (
//     <NavigationContainer theme={navTheme}>
//       <Stack.Navigator
//         screenOptions={{
//           headerStyle: {
//             backgroundColor: theme.colors.surface,
//           },
//           headerTintColor: theme.colors.textPrimary,
//           headerTitleStyle: {
//             fontWeight: '600',
//           },
//         }}
//       >
//         {user ? (
//           <Stack.Screen 
//             name="Main" 
//             component={TabNavigator}
//             options={{ headerShown: false }}
//           />
//         ) : (
//           <>
//             <Stack.Screen 
//               name="SignIn" 
//               component={SignInScreen}
//               options={{ headerShown: false }}
//             />
//             <Stack.Screen 
//               name="SignUp" 
//               component={SignUpScreen}
//               options={{ headerShown: false }}
//             />
//             <Stack.Screen 
//               name="ForgotPassword" 
//               component={ForgotPasswordScreen}
//               options={{ 
//                 title: 'Reset Password',
//                 headerBackTitle: 'Back'
//               }}
//             />
//           </>
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }



import React from 'react';
import { NavigationContainer, DefaultTheme as NavLight, DarkTheme as NavDark } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../components/ThemeProvider';
import { TabIcon } from '../components/TabIcon';
import { useAuthUser } from '../state/authStore';

// Main screens
import HomeScreen from '../screens/HomeScreen';
import BookingsScreen from '../screens/BookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HostScreen from '../screens/HostScreen';

// Auth screens
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Add this line to hide headers for all tab screens
        headerStyle: { 
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tab.Screen 
        name="Bookings" 
        component={BookingsScreen}
        options={{
          title: 'My Bookings',
          tabBarLabel: 'Bookings',
          tabBarIcon: ({ focused }) => <TabIcon name="bookings" focused={focused} />,
        }}
      />
      
      <Tab.Screen 
        name="Host" 
        component={HostScreen}
        options={{
          title: 'Host',
          tabBarLabel: 'Host',
          tabBarIcon: ({ focused }) => <TabIcon name="host" focused={focused} />,
        }}
      />

<Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { theme } = useTheme();
  const { user, loading } = useAuthUser();

  const navTheme = (theme as any).mode === 'dark' ? {
    ...NavDark,
    colors: {
      ...NavDark.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.textPrimary,
      border: theme.colors.border,
      notification: theme.colors.primary,
    },
  } : {
    ...NavLight,
    colors: {
      ...NavLight.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.textPrimary,
      border: theme.colors.border,
      notification: theme.colors.primary,
    },
  };

  if (loading) {
    // You can show a splash screen here
    return null;
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.textPrimary,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        {user ? (
          <Stack.Screen 
            name="Main" 
            component={TabNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen 
              name="SignIn" 
              component={SignInScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="SignUp" 
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="ForgotPassword" 
              component={ForgotPasswordScreen}
              options={{ 
                title: 'Reset Password',
                headerBackTitle: 'Back'
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}