import { StatusBar } from "expo-status-bar";
import react, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
//테스트1
// const STORAGE_KEY = "@toDos";
export default function App() {
  const [text, setText] = useState("");
  // const [toDos, setToDos] = useState({});
  // useEffect(() => {
  //   loadToDos();
  // }, []);
  // const onChangeText = (payload) => setText(payload);
  // //saveToDos는 @toDos와 함께 AsyncStorage에 저장
  // const saveToDos = async (toSave) => {
  //   await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)); //저장할 saveToDos를 string으로 바꿔서 저장
  // };
  // const loadToDos = async () => {
  //   const s = await AsyncStorage.getItem(STORAGE_KEY);
  //   setToDos(JSON.parse(s));
  // };
  const addToDo = async () => {
    if (text === "") {
      return;
    }
    //   const newToDos = { ...toDos, [Date.now()]: { text } };
    //   setToDos(newToDos);
    //   await saveToDos(newToDos);
    //   setText("");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text>To do</Text>
      </View>
      <TextInput
        // onSubmitEditing={addToDo}
        // onChangeText={onChangeText}
        value={text}
        placeholder={"+ To Do List"}
        style={styles.input}
      />
      {/* <ScrollView>
        {Object.keys(toDos).map((key) => (
          <View style={styles.toDo} key={key}>
            <Text style={styles.toDoText}>{toDos[key].text}</Text>
          </View>
        ))}
      </ScrollView> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
    paddingHorizontal: 20,
  },

  input: {
    backgroundColor: "gray",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
    fontSize: 18,
  },

  toDo: {
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 40,
  },

  toDoText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
