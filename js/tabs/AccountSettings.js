import * as React from 'react';
import { sha256 } from 'react-native-sha256';
import {
    StyleSheet,
    View,
    Text,
    TextInput, Button, Alert, TouchableOpacity,
} from 'react-native';
import {useEffect, useState, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Styles from '../../StyleSheet';
import {UserContext} from '../UserContext';


export default function AccountSettings() {
    let [firstName, setFirstName] = useState();
    let [lastName, setLastName] = useState();
    let [userName, setUserName] = useState();
    let [password, setPassword] = useState();
    const userContext = useContext(UserContext);

    useEffect(() => {
        async function FetchData()
        {
            let userData =  await GetUserData("TestUser");

            if(userData) {
                let userObject = JSON.parse(userData);
                setFirstName(userObject.firstName);
                setLastName(userObject.lastName);
                setUserName(userObject.userName);
                setPassword(userObject.password);
            }
            else
            {
                Alert.alert("Error getting user data!")
            }
        }

        FetchData();
    }, []); //Only on initial click

    return (
        <View style={Styles.container}>
            <Text style={[Styles.title, styles.field]}>{"Hi " + userName}</Text>
            <Text style={Styles.subtitle}>Feel free to adjust your data below:</Text>
            <View style={[Styles.field, styles.itemRow]}>
                <View style={[Styles.field, styles.leftElement]}>
                    <Text style={Styles.inputHint}>First name:</Text>
                    <TextInput style={Styles.input}
                               placeholder="First Name"
                               value={firstName}
                               onChangeText={setFirstName}/>
                </View>
                <View style={[Styles.field, styles.rightElement]}>
                    <Text style={Styles.inputHint}>Last name:</Text>
                    <TextInput style={Styles.input}
                               placeholder="Last Name"
                               value={lastName}
                               onChangeText={setLastName}/>
                </View>
            </View>
            <View style={Styles.field}>
                <Text style={Styles.inputHint}>Password:</Text>
                <TextInput placeholder="Your password"
                           style={Styles.input}
                           secureTextEntry={true}
                           value={password}
                           onChangeText={setPassword}/>
            </View>
            <View style={[Styles.field, styles.fixToText]}>
                {/* Go to HomeScreen -->yet to be implemented */}
                <TouchableOpacity style={[Styles.buttonContainer, Styles.field]}
                                  onPress={() => console.log("Cancel changes")}>
                    <Text style={[Styles.button]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[Styles.buttonContainer, Styles.field]}
                                  onPress={() => UpdateUser(firstName, lastName, userName, password)}>
                    <Text style={[Styles.button]}>Save Changes</Text>
                </TouchableOpacity>
            </View>
        </View>);
}

async function GetUserData(userName)
{
    try
    {
        let result = await AsyncStorage.getItem(BuildUserId(userName));

        if(result !== null)
        {
            return result;
        }
        return null;
    }
    catch(e)
    {
        return null;
    }
}

async function UpdateUser(firstName, lastName, userName, password)
{
    let userObject = new Object();

    userObject.firstName = firstName;
    userObject.lastName = lastName;
    userObject.userName = userName;
    userObject.password = password;

    let result =  await StoreUpdatedUser(userObject);

    if(result)
    {
        Alert.alert("Successfully changed your data!")
    }
    else
    {
        Alert.alert("Error changing your data!")
    }
}

async function StoreUpdatedUser(user)
{
    try{
        let result = await AsyncStorage.setItem(BuildUserId(user.userName), JSON.stringify(user));
        return true;

    } catch(e)
    {
        return false;
    }
}

function BuildUserId(username)
{
    return "User_" + username;
}

const styles = StyleSheet.create({
    title1: {
        fontSize: 30,
        fontWeight: "600"
    },
    title2: {
        fontSize: 20,
        fontWeight: "500"
    },
    button: {
        backgroundColor: "purple"
    },
    field: {
        paddingTop: 15

    },
    inputHint: {
        paddingLeft: 3,
        paddingBottom: 5
    },
    input: {
        fontSize: 18,
        height: 45,
        padding: 10,
        borderRadius: 3,
        backgroundColor: "white",

    },
    container: {
        flex: 1,
        flexDirection: "column",
        paddingTop: 20,
        paddingHorizontal: 20
    },
    fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemRow: {
        flexDirection: "row"
    },
    leftElement: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 3
    },
    rightElement: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 3
    }
});

