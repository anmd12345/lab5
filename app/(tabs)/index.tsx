import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useNavigation, NavigationProp } from "@react-navigation/native";

type RootStackParamList = {
  login: undefined;
  home: undefined;
};

export default function ServiceListScreen() {
  const [services, setServices] = useState<
    { id: string; name: string; price: string }[]
  >([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = false; 
      setIsLoggedIn(loggedIn);

      if (!loggedIn) {
        navigation.navigate("home");
      }
    };

    checkLoginStatus();
  }, [navigation]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "services"));
        const servicesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as { id: string; name: string; price: string }[];
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const renderItem = ({ item }: { item: { name: string; price: string } }) => (
    <View style={styles.serviceItem}>
      <Text style={styles.serviceName}>{item.name}</Text>
      <Text style={styles.servicePrice}>{item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/logo.webp")}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>Danh sách dịch vụ</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={services}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f8d7da",
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: "contain",
    left: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d63384",
  },
  addButton: {
    backgroundColor: "#d63384",
    borderRadius: 50,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  listContainer: {
    padding: 16,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  serviceName: {
    fontSize: 16,
    color: "#333",
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#d63384",
  },
});
