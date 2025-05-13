import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  TextInput,
} from "react-native";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";

export default function ServiceListScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [services, setServices] = useState<
    {
      id: string;
      name: string;
      price: string;
      creator: string;
      createdAt: string;
    }[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [userModalVisible, setUserModalVisible] = useState(false); 
  const [selectedService, setSelectedService] = useState<any>(null); 

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        router.replace("/login");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "services"));
        const servicesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as {
          id: string;
          name: string;
          price: string;
          creator: string;
          createdAt: string;
        }[];
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const handleAddService = async () => {
    if (!serviceName || !servicePrice) {
      alert("Hãy nhập đầy đủ thông tin dịch vụ!");
      return;
    }

    try {
      const newService = {
        name: serviceName,
        price: servicePrice,
        creator: user?.fullName || "Unknown",
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "services"), newService);

      await updateDoc(docRef, { id: docRef.id });

      const serviceWithId = { id: docRef.id, ...newService };

      setServices((prev) => [...prev, serviceWithId]);

      setModalVisible(false);
      setServiceName("");
      setServicePrice("");
    } catch (error) {
      console.error("Error adding service:", error);
    }
  };

  const handleUpdateService = async () => {
    if (!selectedService) return;

    try {
      const serviceRef = doc(db, "services", selectedService.id);

      await updateDoc(serviceRef, {
        name: serviceName,
        price: servicePrice,
      });

      setServices((prev) =>
        prev.map((service) =>
          service.id === selectedService.id
            ? { ...service, name: serviceName, price: servicePrice }
            : service
        )
      );

      setModalVisible(false);
      setSelectedService(null);
      setServiceName("");
      setServicePrice("");
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      router.replace("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleDeleteService = async () => {
    if (!selectedService) return;

    try {
      const serviceRef = doc(db, "services", selectedService.id);
      await deleteDoc(serviceRef);

      setServices((prev) =>
        prev.filter((service) => service.id !== selectedService.id)
      );

      setModalVisible(false);
      setSelectedService(null);
      setServiceName("");
      setServicePrice("");
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const handleSelectService = (service: any) => {
    setSelectedService(service);
    setServiceName(service.name);
    setServicePrice(service.price);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: { name: string; price: string } }) => (
    <TouchableOpacity onPress={() => handleSelectService(item)}>
      <View style={styles.serviceItem}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.servicePrice}>
          {parseInt(item.price).toLocaleString("vi-VN")}đ
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/logo.webp")}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>Danh sách dịch vụ</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setUserModalVisible(true)}
          >
            <Icon name="user" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setSelectedService(null);
              setServiceName("");
              setServicePrice("");
              setModalVisible(true);
            }}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={services}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={userModalVisible}
        onRequestClose={() => setUserModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thông tin người dùng</Text>
            {user && (
              <>
                <Text style={styles.userInfo}>Họ tên: {user.fullName}</Text>
                <Text style={styles.userInfo}>Số điện thoại: {user.phone}</Text>
              </>
            )}
            <TouchableOpacity
              style={[
                styles.addServiceButton,
                { backgroundColor: "red", marginTop: 20 },
              ]}
              onPress={handleLogout}
            >
              <Text style={styles.addServiceButtonText}>Đăng xuất</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setUserModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedService ? "Cập nhật dịch vụ" : "Thêm dịch vụ"}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Tên dịch vụ"
              value={serviceName}
              onChangeText={setServiceName}
            />
            <TextInput
              style={styles.input}
              placeholder="Giá"
              value={servicePrice}
              onChangeText={setServicePrice}
              keyboardType="numeric"
            />
            {selectedService && (
              <>
                <TextInput
                  style={[styles.input, { backgroundColor: "#f0f0f0" }]}
                  value={`Người tạo: ${selectedService.creator}`}
                  editable={false}
                />
                <TextInput
                  style={[styles.input, { backgroundColor: "#f0f0f0" }]}
                  value={`Ngày tạo: ${new Date(
                    selectedService.createdAt
                  ).toLocaleString("vi-VN")}`}
                  editable={false}
                />
              </>
            )}
            <TouchableOpacity
              style={styles.addServiceButton}
              onPress={selectedService ? handleUpdateService : handleAddService}
            >
              <Text style={styles.addServiceButtonText}>
                {selectedService ? "Cập nhật" : "Thêm"}
              </Text>
            </TouchableOpacity>
            {selectedService && (
              <TouchableOpacity
                style={[
                  styles.addServiceButton,
                  { backgroundColor: "red", marginTop: 10 },
                ]}
                onPress={handleDeleteService}
              >
                <Text style={styles.addServiceButtonText}>Xóa</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  userInfo: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  logo: {
    width: 200,
    height: 50,
    marginRight: 20,
  },
  headerTitle: {
    color: "#d63384",
    fontSize: 20,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f8d7da",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#d63384",
    borderRadius: 50,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  iconButton: {
    backgroundColor: "#d63384",
    borderRadius: 50,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  addServiceButton: {
    backgroundColor: "#d63384",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addServiceButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
