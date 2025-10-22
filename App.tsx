   import React, { useState } from "react";
import {
  SafeAreaView,
  View

  Text,

  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  const [screen, setScreen] = useState<"splash" | "auth" | "menu" | "cart">("splash");
  const [role, setRole] = useState<"chef" | "user" | null>(null);
  const [category, setCategory] = useState<"All" | "Brunch" | "Lunch" | "Dinner">("All");
  const [cart, setCart] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState([
    { id: "1", name: "Chicken Pasta", price: 104, desc: "grilled chicken, parsley, creamy sauce", image: require("./assets/pasta.jpg"), category: "Lunch" },
    { id: "2", name: "Pepperoni Pizza", price: 95, desc: "cheese, tomato, pepperoni, olives", image: require("./assets/pizza.jpg"), category: "Lunch" },
    { id: "3", name: "Sticky Wings & Fries", price: 88, desc: "bbq sauce, chicken, potato fries, jalapeño", image: require("./assets/wings.jpg"), category: "Dinner" },
    { id: "4", name: "Burger & Fries", price: 65, desc: "beef patty, lettuce, cheese, tomato, fries", image: require("./assets/burger.jpg"), category: "Lunch" },
    { id: "5", name: "Ribs & Fries", price: 104, desc: "pork ribs and potato chips", image: require("./assets/ribs.jpg"), category: "Dinner" },
    { id: "6", name: "Chicken Nuggets", price: 50, desc: "chicken nuggets, creamy jalapeño sauce, fries", image: require("./assets/nuggets.jpg"), category: "Brunch" },
    { id: "7", name: "Lambchops & Mash", price: 176, desc: "lamb chops, creamy mash", image: require("./assets/lamb.jpg"), category: "Dinner" },
    { id: "8", name: "Rice & Chicken", price: 210, desc: "rice, creamy chicken curry", image: require("./assets/rice.jpg"), category: "Dinner" },
    { id: "9", name: "Pancake Platter", price: 350, desc: "pancakes, berries, maple syrup", image: require("./assets/pancake.jpg"), category: "Brunch" },
    { id: "10", name: "Fruit Platter", price: 250, desc: "grapes, sausage, banana, apple", image: require("./assets/fruit.jpg"), category: "Brunch" },
    { id: "11", name: "Garlic Bread & Sauces", price: 250, desc: "garlic bread, jalapeño sauce, bbq sauce", image: require("./assets/garlic.jpg"), category: "Brunch" },
    { id: "12", name: "Vegetable Wrap", price: 140, desc: "vegetables, hummus, whole wheat wrap", image: require("./assets/Wrap.jpg"), category: "Lunch" },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // CART FUNCTIONS
  const addToCart = (item: any) => {
    const existing = cart.find((x) => x.id === item.id);
    if (existing) {
      setCart(cart.map((x) => (x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x)));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    const existing = cart.find((x) => x.id === itemId);
    if (existing.quantity > 1) {
      setCart(cart.map((x) => (x.id === itemId ? { ...x, quantity: x.quantity - 1 } : x)));
    } else {
      setCart(cart.filter((x) => x.id !== itemId));
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // MENU EDIT FUNCTIONS
  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsEditing(true);
  };

  const handleDelete = (itemId: string) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => setMenuItems(menuItems.filter(item => item.id !== itemId)) },
      ]
    );
  };

  const handleAdd = () => {
    setEditingItem({ id: Date.now().toString(), name: "", price: 0, desc: "", category: "Lunch", image: require("./assets/pasta.jpg") });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editingItem.id && menuItems.find(item => item.id === editingItem.id)) {
      setMenuItems(menuItems.map(item => item.id === editingItem.id ? editingItem : item));
    } else {
      setMenuItems([...menuItems, editingItem]);
    }
    setIsEditing(false);
    setEditingItem(null);
  };

  // SPLASH SCREEN
  if (screen === "splash") {
    return (
      <ImageBackground
        source={require("./assets/chef.jpg")}
        style={styles.splashContainer}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Menu Maestro</Text>
          <TouchableOpacity style={styles.button} onPress={() => setScreen("auth")}>
            <Text style={styles.buttonText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  // AUTH SCREEN
  if (screen === "auth") {
    return (
      <SafeAreaView style={styles.authContainer}>
        <ScrollView contentContainerStyle={styles.authInner}>
          <Text style={styles.menuTitle}>Welcome to Menu Maestro</Text>

          <TouchableOpacity style={styles.button} onPress={() => { setRole("user"); setScreen("menu"); }}>
            <Text style={styles.buttonText}>Login as User</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { marginTop: 10 }]} onPress={() => { setRole("chef"); setScreen("menu"); }}>
            <Text style={styles.buttonText}>Login as Chef</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // CART SCREEN
  if (screen === "cart") {
    return (
      <SafeAreaView style={styles.menuContainer}>
        <Text style={styles.menuTitle}>Your Cart</Text>

        {cart.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Your cart is empty.</Text>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Image source={item.image} style={styles.menuImage} />
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                  <Text style={styles.menuName}>{item.name}</Text>
                  <Text style={styles.menuDesc}>
                    Qty: {item.quantity} | R{item.price * item.quantity}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Ionicons name="remove-circle-outline" size={24} color="#000" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        <Text style={styles.totalText}>Total: R{total}</Text>

        <TouchableOpacity style={[styles.button, { marginTop: 10 }]} onPress={() => setScreen("menu")}>
          <Text style={styles.buttonText}>Back to Menu</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // MENU SCREEN
  const filteredMenu =
    category === "All" ? menuItems : menuItems.filter((item) => item.category === category);

  return (
    <SafeAreaView style={styles.menuContainer}>
      {/* Header with title, add button, cart, and logout */}
      <View style={styles.headerRow}>
        <Text style={styles.menuTitle}>MENU</Text>
        <View style={styles.headerActions}>
          {role === "chef" && (
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Ionicons name="add-circle-outline" size={30} color="#4CAF50" />
            </TouchableOpacity>
          )}
          {role === "user" && (
            <TouchableOpacity style={styles.cartButton} onPress={() => setScreen("cart")}>
              <Ionicons name="cart-outline" size={30} color="#000" />
              {cart.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cart.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.logoutButton} onPress={() => { setScreen("auth"); setRole(null); }}>
            <Ionicons name="log-out-outline" size={30} color="#FF0000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Buttons */}
      <View style={styles.categoryContainer}>
        {["All", "Brunch", "Lunch", "Dinner"].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryButton, category === cat && styles.categoryActive]}
            onPress={() => setCategory(cat as any)}
          >
            <Text
              style={[styles.categoryText, category === cat && styles.categoryTextActive]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredMenu}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Image source={item.image} style={styles.menuImage} />
            <View style={styles.menuInfo}>
              <Text style={styles.menuName}>
                {item.name} : R{item.price}
              </Text>
              <Text style={styles.menuDesc}>{item.desc}</Text>
            </View>

            {role === "chef" ? (
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => handleEdit(item)}>
                  <Ionicons name="create-outline" size={22} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash-outline" size={22} color="#000" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => addToCart(item)} style={{ padding: 10 }}>
                <Ionicons name="add-circle-outline" size={28} color="#4CAF50" />
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {/* Edit Modal */}
      <Modal visible={isEditing} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingItem?.id && menuItems.find(item => item.id === editingItem.id) ? "Edit Item" : "Add Item"}</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editingItem?.name || ""}
              onChangeText={(text) => setEditingItem({ ...editingItem, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={editingItem?.price?.toString() || ""}
              onChangeText={(text) => setEditingItem({ ...editingItem, price: parseFloat(text) || 0 })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={editingItem?.desc || ""}
              onChangeText={(text) => setEditingItem({ ...editingItem, desc: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Category"
              value={editingItem?.category || ""}
              onChangeText={(text) => setEditingItem({ ...editingItem, category: text })}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.button, { backgroundColor: "#ccc" }]} onPress={() => { setIsEditing(false); setEditingItem(null); }}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  splashContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  overlay: { backgroundColor: "rgba(0,0,0,0.5)", padding: 25, borderRadius: 10, alignItems: "center" },
  title: { fontSize: 36, fontWeight: "bold", color: "white", marginBottom: 20 },
  button: { backgroundColor: "#000", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  authContainer: { flex: 1, backgroundColor: "#f5f5f5" },
  authInner: { padding: 20 },

  input: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 15 },
  menuContainer: { flex: 1, backgroundColor: "#fff", padding: 20 },
  menuTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 5 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  cartButton: { position: "relative", padding: 5 },
  cartBadge: { position: "absolute", top: 2, right: 2, backgroundColor: "red", borderRadius: 10, minWidth: 16, height: 16, alignItems: "center", justifyContent: "center" },
  cartBadgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  categoryContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 15 },
  categoryButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: "#eee" },
  categoryActive: { backgroundColor: "#000" },
  categoryText: { color: "#000" },
  categoryTextActive: { color: "#fff" },
  listContainer: { paddingBottom: 60 },
  menuItem: { flexDirection: "row", alignItems: "center", marginBottom: 15, backgroundColor: "#f8f8f8", borderRadius: 10, overflow: "hidden", padding: 8 },
  menuImage: { width: 80, height: 80, borderRadius: 8 },
  menuInfo: { flex: 1, paddingHorizontal: 10 },
  menuName: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  menuDesc: { color: "#555" },
  iconContainer: { flexDirection: "row", gap: 8 },
  cartItem: { flexDirection: "row", alignItems: "center", marginBottom: 15, backgroundColor: "#f0f0f0", padding: 10, borderRadius: 8 },
  totalText: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  headerActions: { flexDirection: "row", alignItems: "center" },
  addButton: { marginRight: 10 },
  logoutButton: { marginLeft: 10 },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: "80%" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
})
