import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import { TextInput, SafeAreaView, Button, StyleSheet, Text, View, FlatList} from 'react-native';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDGmtIDL8EtBSZ0ZFnTWmDaNIQj-Owyq6A",
    authDomain: "list-9b404.firebaseapp.com",
    databaseURL: "https://list-9b404-default-rtdb.firebaseio.com",
    projectId: "list-9b404",
    storageBucket: "list-9b404.appspot.com",
    messagingSenderId: "984354373058",
    appId: "1:984354373058:web:eb7aa7f064aeb926a5ea5b"
};


const app = initializeApp(firebaseConfig);


import { getDatabase, ref, onValue, set, orderByChild, query } from 'firebase/database';


export default function App() {
    const text1 = useRef(null);

    const [text, setText] = useState('');
    const [data, setData] = useState('');

    function delData(key) {
        const db = getDatabase();
        const reference = ref(db, 'users/' + key);
        set(reference, null);
    }

    function saveData() {
        var key = Math.random().toString(16).replace(".","");
        var data = text;

        const db = getDatabase();
        const reference = ref(db, 'users/' + key);
        set(reference, {
            data: data,
            regdate: new Date().toString()
        });

        text1.current.clear();
    }

    const renderItem = ({ item }) => {
        return (
            <View style={{ padding: 15, borderBottomColor: '#aaa', borderBottomWidth: 1, flexDirection: 'row', }}>
                <Text style={{ flex: 1, fontSize:16}}>
                    {item.data}
                </Text>
                <Button  title="삭제" color='red' onPress={() => delData(item.key)} />
            </View>
        )
    }

    useEffect(() => {

        const db = getDatabase();
        const reference = query(ref(db, 'users'), orderByChild('regdate'));
       
        onValue(reference, (snapshot) => {
            console.log(snapshot);

            const tmp = [];

            snapshot.forEach((child) => {
                tmp.unshift({
                    key: child.key,
                    data: child.val().data,
                    regdate: child.val().regdate,
                });
            });

            console.log(tmp);
            setData(tmp);
        });

    }, [])

    return (
      <View style={{ backgroundColor: "darkgreen", flex:1 }}>
          <StatusBar style="auto" />
          <SafeAreaView style={{ flex: 1 }}>
              <View style={{padding:15}}>
                  <Text style={{ textAlign: 'center', fontSize: 24, color:'white' }}>Hyundai / KIA 시뮬레이션 부품</Text>
              </View>
                <View style={{ backgroundColor: "white", flex: 1 }}>
                    <View style={{flexDirection:'row', padding:10}}>
                        <TextInput style={{ backgroundColor: "lightgray", padding: 5, flex: 1 }}
                            ref={text1}
                            onChangeText={text => setText(text)} placeholder="부품을 입력하세요." />
                        <Button title="저장" onPress={() => saveData()}/>
                    </View>
                    <View>
                        <FlatList data={data} renderItem={renderItem} style={{ padding: 15}}/>
                    </View>
                </View>

          </SafeAreaView>
      </View>
  );
}