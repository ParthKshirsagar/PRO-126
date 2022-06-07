import React from 'react'
import { Button, Image, View, Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'

export default class PickImage extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            image: null
        }
    }

    render(){
        return(
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Button title="Pick an image from camera roll" onPress={this._pickImage}></Button>
            </View>
        )
    }

    componentDidMount(){
        this.getPermissionsAsync()
    }

    getPermissionsAsync = async () => {
        if(Platform.OS != "web"){
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if(status != "granted"){
                alert("Sorry, we need camera roll permissions to make this work!")
            }
        }
    }

    uploadImage = async (uri) => {
        const data = new FormData()
        let filename = uri.split('/')[uri.split('/').length - 1]
        let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
        const fileToUpload = {
            uri: uri,
            name: filename,
            type: type
        }
        data.append("digit", fileToUpload)
        fetch("https://35f0-2405-201-1c-4ccb-e9f0-8d0-705c-5760.in.ngrok.io/predict-alphabets", {
            method: "POST",
            body: data,
            headers: {
                "content-type": "multipart/form-data"
            }
        })
        .then( (response) => { response.json() } )
        .then( (result) => {
            console.log(`Success: ${result}`)
        })
        .catch((error) => {
            console.log(`Error: ${error}`)
        })
    }

    _pickImage = async () => {
        try{
            let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All, allowsEditing: true, aspect: [4,3], quality: 1 })
            if(!result.cancelled){
                this.setState({ image: result.data })
                console.log(result.uri)
                this.uploadImage(result.uri)
            }
        }
        catch(E){
            console.log(E)
        }
    }
}