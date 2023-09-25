import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import {KeyboardAvoidingView, Platform, StyleSheet, Text, View, Modal, TextInput, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@toDos";

export default function App({navigation}) {
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [selectedToDo, setSelectedToDo] = useState(null);
  const [editingText, setEditingText] = useState(""); // 수정 중인 텍스트
  const [isEditing, setIsEditing] = useState(false); // 수정 모드인지 확인
  const editingKeyRef = useRef(null);  // 선택된 항목의 키를 저장할 변수

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
    editingKeyRef.current = key
    // setSelectedToDo(key);
    setIsEditing(true);
    hideMenu();
  };
  
  const finishEdit = async () => {
    console.log("finishEdit 함수가 호출되었습니다.");
  
    if (editingText === "") {
      console.warn("텍스트가 없습니다.");
      return;
    }
    if (!editingKeyRef.current) {
      console.warn("선택된 항목이 없습니다.");
      return;
    }
    const newToDos = { ...toDos };
    if (!newToDos[editingKeyRef.current]) {
      console.warn("해당 항목을 찾을 수 없습니다.");
      return;
    }
    newToDos[editingKeyRef.current].text = editingText;
    setToDos(newToDos);
    await saveToDos(newToDos);
    setIsEditing(false);
    setEditingText("");
    editingKeyRef.current = null;  // 수정이 완료된 후 변수를 초기화
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
              {toDos[key].checked && <Text style={styles.checkMark}>✔</Text>}
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
            <TouchableOpacity onPress={() => startEdit(selectedToDo)} style={styles.menuItem}>
              <Text>수정</Text>
            </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteToDo(selectedToDo)} style={styles.menuItem}>
            <Text>삭제</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    <Modal
  animationType="slide"
  transparent={true}
  visible={isEditing}
  onRequestClose={() => setIsEditing(false)}
>
  <KeyboardAvoidingView 
    style={styles.modalOverlay} 
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
  >
    <View style={styles.menuContainer}>
      <TextInput
        value={editingText}
        onChangeText={setEditingText}
        style={styles.input}
      />
      <TouchableOpacity onPress={() => finishEdit(selectedToDo)} style={styles.menuItem}>
        <Text>저장</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.menuItem}>
        <Text>취소</Text>
      </TouchableOpacity>
    </View>
  </KeyboardAvoidingView>
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

  // checkBox: {
  //   width: 25,
  //   height: 25,
  //   borderWidth: 2,
  //   borderColor: "#868686",
  //   marginBottom: -23,
  //   marginLeft: -60,
  //   borderRadius: 3,
  // },

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
    justifyContent: 'center', // 텍스트 컴포넌트를 중앙에 배치하기 위해 추가
    alignItems: 'center',     // 텍스트 컴포넌트를 중앙에 배치하기 위해 추가
  },

  checkedBox: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: "#868686",
    marginBottom: -23,
    marginLeft: -60,
    borderRadius: 3,
    justifyContent: 'center', // 텍스트 컴포넌트를 중앙에 배치하기 위해 추가
    alignItems: 'center',     // 텍스트 컴포넌트를 중앙에 배치하기 위해 추가
  },

  checkMark: {
    fontSize: 20,
    color: "#868686"
  }
});
