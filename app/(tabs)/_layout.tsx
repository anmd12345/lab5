import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons"; // Sử dụng thư viện biểu tượng

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#d63384",
        tabBarInactiveTintColor: "#999",
        headerShown: false,
        tabBarStyle: 
        Platform.select({
         
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          title: "Transaction",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="credit-card" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="customer"
        options={{
          title: "Customer",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "Setting",
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
