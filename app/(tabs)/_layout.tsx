import React from 'react';
import { Tabs } from 'expo-router';
import { ChefHat, Camera, Heart, Settings } from 'lucide-react-native';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';

export default function TabLayout() {
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0F766E',
        tabBarInactiveTintColor: '#8A9C93',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E6EBE8',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingTop: 6,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.discover'),
          tabBarIcon: ({ color, focused }) => (
            <ChefHat size={22} color={color} strokeWidth={focused ? 2.4 : 1.8} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: '', // Empty to prevent text overlap with center action button
          tabBarLabel: () => null, // Completely hide label for the center floating button
          tabBarIcon: ({ focused }) => (
            <View style={[styles.scanFabWrapper, focused && styles.scanFabFocused]}>
              <View style={styles.scanFabInner}>
                <Camera size={22} color="#FFFFFF" strokeWidth={2.2} />
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: t('nav.saved'),
          tabBarIcon: ({ color, focused }) => (
            <Heart size={21} color={color} strokeWidth={focused ? 2.4 : 1.8} fill={focused ? '#0F766E' : 'transparent'} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('nav.settings'),
          tabBarIcon: ({ color, focused }) => (
            <Settings size={21} color={color} strokeWidth={focused ? 2.4 : 1.8} />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  scanFabWrapper: {
    top: Platform.OS === 'ios' ? -12 : -10,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  scanFabInner: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: '#0F766E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFabFocused: {
    transform: [{ scale: 1.05 }],
    shadowOpacity: 0.45,
  },
});
