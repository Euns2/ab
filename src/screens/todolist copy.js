import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Modal, TextInput, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@toDos";

export default function App({navigation}) {
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [selectedToDo, setSelectedToDo] = useState(null);
  const [editingText, setEditingText] = useState(""); // 수정 중인 텍스트
  const [isEditing, setIsEditing] = useState(false); // 수정 모드인지 확인

  useEffect(() => {
    loadToDos();
  }, []);

  const onChangeText = (payload) => setText(payload);

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s) || {});
  };

  const addToDo = async () => {
    if (text === "") {
      return;
    }
    const newToDos = { ...toDos, [Date.now()]: { text } };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };

  const showMenu = (key) => {
    setSelectedToDo(key);
    setMenuVisible(true);
  };

  const hideMenu = () => {
    setSelectedToDo(null);
    setMenuVisible(false);
  };

  const deleteToDo = async (key) => {
    const newToDos = { ...toDos };
    delete newToDos[key];
    setToDos(newToDos);
    await saveToDos(newToDos);
    hideMenu();
  };

  const toggleCheck = (key) => {
    const newToDos = { ...toDos };
    const currentToDo = newToDos[key];
    currentToDo.checked = !currentToDo.checked; // 체크 상태 토글
    setToDos(newToDos);
    saveToDos(newToDos);
  };

  const startEdit = (key) => {
    setEditingText(toDos[key].text);
    setSelectedToDo(key);
    setIsEditing(true);
  };

  const finishEdit = (key) => {
    const newToDos = { ...toDos };
    newToDos[key].text = editingText;
    setToDos(newToDos);
    saveToDos(newToDos);
    setIsEditing(false);
    setEditingText("");
    hideMenu();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>To Do List</Text>
      <TextInput
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        value={text}
        placeholder={"+ To Do List"}
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) => (
          <View style={styles.toDo} key={key}>
            <TouchableOpacity 
              style={toDos[key].checked ? styles.checkedBox : styles.checkBox} 
              onPress={() => showMenu(key)}>
            </TouchableOpacity>
            <Text style={styles.toDoText}>{toDos[key].text}</Text>
          </View>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={hideMenu}
      >
			<View style={styles.modalOverlay}>
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={() => {
            toggleCheck(selectedToDo);
            hideMenu();
          	}} style={styles.menuItem}>
            <Text>확인</Text>
          </TouchableOpacity>
          {isEditing ? (
            <View style={styles.menuItem}>
              <TextInput
                value={editingText}
                onChangeText={setEditingText}
                style={{ borderBottomWidth: 1, width: "80%" }}
              />
              <TouchableOpacity onPress={() => finishEdit(selectedToDo)}>
                <Text>완료</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => startEdit(selectedToDo)} style={styles.menuItem}>
              <Text>수정</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => deleteToDo(selectedToDo)} style={styles.menuItem}>
            <Text>삭제</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
  },

  header: {

  },

  input: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 20,
    fontSize: 18,
  },

  toDo: {
    marginTop: 12,
    marginLeft: 50,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomColor: "#868686",
    borderBottomWidth: 2,
    width: "85%",
  },

  toDoText: {
    marginLeft: -10,
    marginVertical: -3,
    fontSize: 16,
    fontWeight: "500",
  },

  checkBox: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: "#868686",
    marginBottom: -23,
    marginLeft: -60,
    borderRadius: 3,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  menuContainer: {
    height: Dimensions.get('window').height / 4,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: 'space-evenly',
  },

  menuItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkBox: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: "#868686",
    marginBottom: -23,
    marginLeft: -60,
    borderRadius: 3,
  },

  checkedBox: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: "#868686",
    marginBottom: -23,
    marginLeft: -60,
    borderRadius: 3,
    backgroundColor: '#868686', // 체크된 상태의 배경색
  },
});
