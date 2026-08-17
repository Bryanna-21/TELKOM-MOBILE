import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function PayBillScreen({ navigation }) {{
  const [value, setValue] = useState('');
  const submit = () => {{
    if (!value.trim()) return Alert.alert('Required', 'Please enter the requested details.');
    Alert.alert('Ready', 'The app shell is working. Backend integration comes next.');
  }};
  return (
    <SafeAreaView style={{styles.container}}>
      <View style={{styles.header}}>
        <TouchableOpacity onPress={{() => navigation.goBack()}}><Icon name="arrow-back" size={{26}} color="#fff" /></TouchableOpacity>
        <Text style={{styles.headerTitle}}>Pay Bill</Text><View style={{width:26}} />
      </View>
      <View style={{styles.content}}>
        <Icon name="receipt-long" size={{56}} color={{COLORS.primary}} />
        <Text style={{styles.title}}>Pay Bill</Text>
        <Text style={{styles.subtitle}}>Secure, simple and ready for backend integration.</Text>
        <TextInput style={{styles.input}} value={{value}} onChangeText={{setValue}}
          placeholder="Bill or account number" placeholderTextColor="#999" keyboardType="default" />
        <TouchableOpacity style={{styles.button}} onPress={{submit}}>
          <Text style={{styles.buttonText}}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}}

const styles = StyleSheet.create({{
  container: {{flex:1,backgroundColor:'#F7F9FC'}},
  header: {{height:64,backgroundColor:COLORS.primary,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:18}},
  headerTitle: {{color:'#fff',fontSize:19,fontWeight:'700'}},
  content: {{flex:1,alignItems:'center',padding:28,paddingTop:60}},
  title: {{fontSize:26,fontWeight:'800',color:'#152238',marginTop:18}},
  subtitle: {{color:'#667085',textAlign:'center',marginTop:8,marginBottom:28}},
  input: {{width:'100%',backgroundColor:'#fff',borderWidth:1,borderColor:'#D0D5DD',borderRadius:12,padding:15,fontSize:16,marginBottom:16}},
  button: {{width:'100%',backgroundColor:COLORS.primary,borderRadius:12,padding:16,alignItems:'center'}},
  buttonText: {{color:'#fff',fontSize:16,fontWeight:'700'}}
}});
