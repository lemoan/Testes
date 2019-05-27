/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TextInput, Button, FlatList} from 'react-native';
import firebase from 'firebase';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = RNFetchBlob.polyfill.Blob;

export default class PrimeiroProjeto extends Component {
  constructor(props){
    super(props);
    this.state = {
      formAavatar:null,
      formNome:'',
      formEmail:'',
      formSenha:'',
      userUid:0,
      lista:[]
    };

    var firebaseConfig = {
      apiKey: "AIzaSyCzrF5c1XIfhWrCOQdwHVTxagJU2Okaqgw",
      authDomain: "projfire-7ea18.firebaseapp.com",
      databaseURL: "https://projfire-7ea18.firebaseio.com",
      projectId: "projfire-7ea18",
      storageBucket: "projfire-7ea18.appspot.com",
      messagingSenderId: "604327193165",
      appId: "1:604327193165:web:adb3637b3116ab9e"
    };
    
    firebase.initializeApp(firebaseConfig);

    this.cadastrar = this.cadastrar.bind(this);
    this.cadastrarFoto = this.carregarFoto.bind(this);
    this.saveAvatar = this.saveAvatar.bind(this);
    this.saveUser = this.saveUser.bind(this);
  }

  carregarFoto(){
    ImagePicker.showImagePicker({},(r)=>{
      if(r.uri){
        let state = this.state;
        state.formAavatar = {uri:r.uri};
        this.setState(state);
      }
    });

  }

  saveUser(){
    if(this.state.userUid != 0){
      firebase.database().ref('users').child(this.state.userUid).set({
        name:this.state.formNome
      });
    }
  }

  saveAvatar(){

  }

  cadastrar(){
    if(this.state.formAavatar != null &&
      this.state.formNome != '' &&
      this.state.formSenha != '' &&
      this.state.formEmail != ''){

      firebase.auth().onAuthStateChanged((user)=>{
        if(user) {
          let state = this.state;
          state.userUid = user.uid;
          this.setState(state);

          this.saveAvatar();
          this.saveUser();          
        }
      }); 

      firebase.auth().createUserWithEmailAndPassword(
        this.state.formEmail,
        this.state.formSenha
        ).catch((error)=>{
          alert(error.code);
        });
    }
  }


  remover(){

  }

  render(){
    return(
      <View style={styles.container}>

        <View style={styles.cadastroArea}> 
          <Text>Cadastre um Novo Usuário</Text>
          <View style={styles.form}>
            <View style={styles.formInfo}>
              <Image source={this.state.formAvatar} style={styles.formAvatar}/>            
              <Button title="Carregar foto" onPress={this.carregarFoto} />
            </View>
            <View style={styles.formInfo}>
              <TextInput style={styles.input} placeholder="Digite o nome" value={this.state.formNome} onChangeText={(formNome)=>this.setState({formNome})} />
              <TextInput style={styles.input} placeholder="Digite o E-mail" value={this.state.formEmail} onChangeText={(formEmail)=>this.setState({formEmail})} />
              <TextInput style={styles.input}  secureTextEntry={true} placeholder="Digite a senha" value={this.state.formSenha} onChangeText={(formSenha)=>this.setState({formSenha})} />
            </View>            
          </View>
          <Button title="Cadastrar" onPress={this.cadastrar} />
        </View>

        <View style={styles.listaArea}>
          <FlatList
            data={this.state.lista}
            renderItem={(item)=>{
              return(
                <View style={styles.itemArea}>
                  <Image source={item.avatar} style={styles.itemAvatar} />
                  <View style={styles.itemInfo}>
                    <Text>{item.nome}</Text>
                    <Text>{item.email}</Text>
                  </View>

                </View>

              );
            }}
          />
        </View>

      </View>
    );
  }




}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:20,
  },
  cadastroArea: {
    height:240,
    backgroundColor:'#EEEEEE',
    margin:10,
    padding:10
  },
  form: {
    flex:1,
    flexDirection:'row'
  },
  formAvatar:{
    width:100,
    height:100,
    backgroundColor:'#CCCCCC'
  },
  formInfo:{
    flex:1,
    flexDirection:'column'
  },
  input:{
    height:40,
    borderWidth:1,
    borderColor:'#000000',
    margin:5    
  },
  listaArea:{
    flex:1,
    backgroundColor:'#EEEEEE',
    margin:10
  },
  itemArea:{
    height:100,
    flex:1,
    flexDirection:'row'
  },
  itemAvatar:{
    width:80,
    height:80,
    margin:10
  },
  itemInfo:{
    flex:1,
    flexDirection:'column'
  }
  
});
