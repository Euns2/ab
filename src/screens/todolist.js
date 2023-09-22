import { StatusBar } from "expo-status-bar";
import react, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@toDos";
export default function App() {
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  useEffect(() => {
    loadToDos();
  }, []);
  const onChangeText = (payload) => setText(payload);
  // //saveToDos는 @toDos와 함께 AsyncStorage에 저장
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)); //저장할 saveToDos를 string으로 바꿔서 저장
  };
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s) || {});    //초기 상태가 빈 객체인 경우, loadToDos 함수에서 null 대신에 빈 객체를 반환하도록 처리
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


  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text>To do</Text>
      </View>
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
          <Text style={styles.toDoText}>{toDos[key].text}</Text>
          </View>
        ))}
      </ScrollView>
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
    marginTop: 20,
    marginLeft: 5
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
    marginBottom: 8,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomColor: "#868686",
    borderBottomWidth: 2,
    // width: "80%",
  },

  checkbox: {
    width: 24,
    height: 24,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  toDoText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
