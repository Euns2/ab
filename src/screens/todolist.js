import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import {KeyboardAvoidingView, Platform, StyleSheet, Text, View, Modal, TextInput, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/FontAwesome';

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
      <Text style={{...styles.header, fontSize:20, paddingTop:50}}>To Do List</Text>
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
          <View style={styles.iconTextContainer}>
            <Icon name="check" size={20} color="#000" />
            <Text style={{ fontSize: 18 }}>  확인</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => startEdit(selectedToDo)} style={styles.menuItem}>
        <View style={styles.iconTextContainer}>
          <Icon name="edit" size={20} color="#000" />
          <Text style={{ fontSize: 18 }}>  수정</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteToDo(selectedToDo)} style={styles.menuItem}>
          <View style={styles.iconTextContainer}>
            <Icon name="trash" size={20} color="#000" />
            <Text style={{ fontSize: 18 }}>   삭제</Text>
          </View>
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
        style={styles.input_edit}
      />
      <TouchableOpacity onPress={() => finishEdit(selectedToDo)} style={styles.menuItem_edit}>
        <Text style={{ fontSize: 18 }} >저장</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.menuItem_edit}>
        <Text style={{ fontSize: 18 }}>취소</Text>
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
    fontSize: 18
  },
  input_edit: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 10,
    fontSize: 18,
    marginHorizontal: 20 // 이 부분을 추가
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
    paddingBottom:15,
    paddingTop:15
  },

  checkBox: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: "#868686",
    marginBottom: -23,
    marginLeft: -60,
    borderRadius: 3,
    justifyContent: 'center', 
    alignItems: 'center',     
  },

  checkedBox: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: "#868686",
    marginBottom: -23,
    marginLeft: -60,
    borderRadius: 3,
    justifyContent: 'center', 
    alignItems: 'center',     
  },

  checkMark: {
    fontSize: 20,
    color: "#868686"
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start' // 아이콘과 텍스트를 왼쪽으로 붙임
  },

  menuItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start', // 왼쪽 정렬
    paddingHorizontal: 40  // 좌우 간격을 조금 추가하여 아이콘과 텍스트가 너무 가장자리에 붙지 않도록 함
  },
  menuItem_edit: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // 왼쪽 정렬
    paddingHorizontal: 40  // 좌우 간격을 조금 추가하여 아이콘과 텍스트가 너무 가장자리에 붙지 않도록 함
    
  }

});
