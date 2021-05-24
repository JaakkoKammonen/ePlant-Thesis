import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from "moment";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import setImage from "../components/SetImage"
import FireBasemiddleware from '../components/Redux/03-middleware/FireBasemiddleware';
import swal from 'sweetalert';
import { ScrollView } from 'react-native-gesture-handler';

export default function MyPlant(props) {

    const [notifications, setNotifications] = useState("Loading...")
    const [updateDate, setUpdateDate] = useState("Loading...");

    let year = updateDate.slice(0, 4)
    let month = updateDate.slice(5, 7)
    let day = updateDate.slice(8, 10)
    let time = updateDate.slice(11, 19)

    const plant = props.navigation.state.params.plant[1];
    const plantID = props.navigation.state.params.plant[0];
    const channelId = plant.ePlantPot.channel_id;

    const [Field1, setField1] = useState({ 
        name: plant.ePlantPot.ePlantModel.Field1, 
        value: 0 
    });

    const [Field2, setField2] = useState({ 
        name: plant.ePlantPot.ePlantModel.Field2, 
        value: 0 
    });

    //console.log(plant)
    //console.log(Field1, Field2)
    
    const { navigate } = props.navigation;

    
    useEffect(() => {
        getData();
    }, []);

    
    // retrieving sensor statistics from the IoT device
    const getData = () => {
        const url = 'https://api.thingspeak.com/channels/' + channelId + '/feeds.json';
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                //console.log(responseJson.feeds)
                //console.log(responseJson.feeds[responseJson.feeds.length-1])
                if (responseJson.feeds[responseJson.feeds.length-1].field1 != null) {
                    //console.log(responseJson.feeds[99])
                    setUpdateDate(responseJson.feeds[responseJson.feeds.length-1].created_at)
                    setField1({...Field1, value: responseJson.feeds[responseJson.feeds.length-1].field1});
                    setNotifications(responseJson.feeds)
                } else {
                    setField1({...Field1, value: 0})
                }

                if (responseJson.feeds[responseJson.feeds.length-1].field2 != null) {
                    setField2({...Field2, value: responseJson.feeds[responseJson.feeds.length-1].field2});
                } else {
                    setField2({...Field2, value: 0})
                }
            })
            .catch((error) => {
                swal({
                title: "Error",
                text: "Something went wrong while getting plant data. Check that your Channel Id is correct!",
             })
             console.log(error)
            });
    }

    const DeletePlant = () => {

        swal({
            title: "Delete plant?",
            text: "Are you sure?",
            icon: "error",
            buttons: [true, "Do it!"],
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {

              FireBasemiddleware.DeleteUserMyPlant(plantID, navigate);  

              swal("Poof! Plant deleted!", {
                icon: "success",
                timer: 2000,
              });
            } else {
              swal("Your plant is safe!", {
                button: "Close",
                timer: 2000,
              });
            }
          });
    }

    const NotificationMaker = () => {
        
        let lastTen = notifications.slice(notifications.length-11, notifications.length-1)
        console.log(lastTen)

        const timeParser = (date) => {
            
            let year = date.slice(0, 4)
            let month = date.slice(5, 7)
            let day = date.slice(8, 10)
            let time = date.slice(11, 19)

            return( day + "." + month + "." + year + " at: " +time)
        }
        return(        
            <FlatList data={lastTen}
                marginLeft={15}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) =>
                    <View style={styles.bottomitem}>
                        <View>
                           <Image style={styles.circle} source={setImage(plant.species.toLowerCase())}/>
                        </View>
                            <View style={styles.bottomtext}>
                            <Text style={styles.bottomtext1}>{timeParser(item.created_at)}</Text>
                            <Text style={styles.bottomtext2}>{plant.plantName}'s value were updated</Text>
                            <Text style={styles.field01}>{Field1.name}:<Text style={styles.field01value}> {item.field1}</Text></Text>
                            <Text style={styles.field02}>{Field2.name}:<Text style={styles.field02value}> {item.field2}</Text></Text>
                        </View>
                    </View>
                }
            />
        )
    }
    return (
        <ScrollView style={styles.container}>
            <View style={styles.top}>
                <View>
                    <TouchableOpacity onPress={() => navigate('Home')}>
                        <Ionicons name="arrow-back-outline" size={30} style={styles.icon}/>
                    </TouchableOpacity>
                    <Text style={styles.plantname}>{plant.plantName}</Text>
                    <Text style={styles.plantheader}>{plant.species}</Text>
                    <Image style={styles.topimage} source={require('../assets/smile.png')} />
                </View>
                <View>
                    <Image style={styles.topimage2} source={setImage(plant.species.toLowerCase())} />
                </View>
            </View>
            <View style={styles.container2}>
                <View style={styles.date}>    
                    <Text style={styles.datetext1}>{moment(plant.paivays).format("DD.MM.YYYY")}</Text>
                    <View style={styles.moredetails}>
                <Ionicons 
                name="ios-trash" 
                size={24} 
                color="#63816D"
                buttonStyle={styles.btnmyplant}
                title= "Delete plant"
                onPress = {() => DeletePlant()}
                />
                </View>
                </View>
                <View style={styles.progress}>
                    <View style={styles.field1}>
                        <Text style={styles.field1Value}>{Field1.name}</Text>
                        <AnimatedCircularProgress
                        size={100}
                        width={10}
                        fill={Field1.value}
                        tintColor="#00e0ff"
                        //onAnimationComplete={() => console.log('onAnimationComplete')}
                        backgroundColor="#3d5875">
                            {
                                (fill) => (
                                <Text>
                                   {Field1.value}
                                </Text>
                                )
                            }
                            </AnimatedCircularProgress>
                    </View>
                    <View style={styles.field2}>
                        <Text style={styles.field2Value}>{Field2.name}</Text>
                        <View>
                        <AnimatedCircularProgress
                        size={100}
                        width={10}
                        fill={Field2.value}
                        tintColor="#00e0ff"
                        //onAnimationComplete={() => console.log('onAnimationComplete')}
                        backgroundColor="#3d5875">
                            {
                                (fill) => (
                                <Text>
                                   {Field2.value}
                                </Text>
                                )
                            }
                            </AnimatedCircularProgress>
                    </View>
                    </View>
                </View>
                <Text style={styles.value}>Last updated: <Text style={styles.updateformat}>{day}.{month}.{year} at: {time} </Text></Text>
                <View style={styles.bottomheader}>
                <Text style={styles.notifi}>Notifications</Text>
                </View>
                <ScrollView 
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={styles.scrollable}>
                <View style={styles.bottom}>

                {NotificationMaker()}

                </View>
                </ScrollView>
                </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 2,
        padding: 3,
        backgroundColor: '#F0F0F0',
    },
    top: {
        flexDirection: 'row',
        marginTop: 15,
        flex: 1
    },
    btnmyplant: {
        backgroundColor: "#63816D",
        borderRadius: 3,
        marginTop: 10,
        marginBottom: 10,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        width: 150,
        height: 30,
    },
    scrollable: {
        margin: 10, 
        maxHeight: 250,
    },
    buttonwrapper1: {
        marginTop: 10,
        marginLeft: 200,
    },
    plantname: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
        marginLeft: 30
    },
    plantheader: {
        fontSize: 16,
        color: '#63816D',
        marginLeft: 30,
        marginTop: 5,
        fontWeight: '600',
        fontStyle: 'italic'
    },
    value: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 30,
        marginLeft: 30
    },
    updateformat: {
        fontSize: 14,
        fontWeight: 'normal',
        marginTop: 30,
        marginLeft: 3
    },
    progress: {
        flexDirection: 'row',
        justifyContent: "center",
        alignContent: "center"
    },
    topimage: {
        width: 50,
        height: 50,
        marginLeft: 30,
        marginTop: 20,
        backgroundColor: 'white',
        borderRadius: 100
    },
    topimage2: {
        width: 200,
        height: 200,
        marginLeft: 40,
        marginTop: 10,
        borderRadius: 160
    },
    container2: {
        marginTop: 20,
        flex: 2,
        backgroundColor: 'white',
        height: 600,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    date: {
        flexDirection: 'row',
        justifyContent:"space-between",
        marginTop: 15,
        marginBottom: 15
    },
    datetext1: {
        fontSize: 12,
        color: '#63816D',
        marginLeft: 20,
        fontWeight: 'bold'
    },
    detailstext: {
        fontSize: 12,
        color: '#63816D',
        marginRight: 20,
        fontWeight: 'bold'
    },
    field1: {
        borderRightColor: 'lightgrey',
        borderRightWidth: 1,
        marginRight: 30,
        paddingLeft: 30,
        paddingRight: 30
    },
    field1Value: {
        fontSize: 16,
        marginTop: 20,
        marginBottom: 10,
        fontWeight: 'bold',
        marginRight: 50
    },
    field2Value: {
        fontSize: 16,
        marginTop: 20,
        marginBottom: 10,
        fontWeight: 'bold',
        marginRight: 50
    },
    phtext2: {
        fontSize: 22,
        color: '#63816D'
    },
    ectext2: {
        fontSize: 22,
        color: '#63816D'
    },
    header: {
        fontSize: 14,
        fontWeight: "bold",
        marginLeft: 10,
        marginBottom: 5
    },
    bottomheader: {
        justifyContent:"space-between",
        flexDirection: 'row',
        marginLeft: 10,
    },
    moredetails: {
        color: '#63816D',
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 20
    },
    bottom: {
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 10,
        marginTop: 5,
        flex: 4,
        shadowColor: 'rgba(0,0,0, .1)', // IOS
        shadowOffset: { height: 3, width: 2 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 3, // android
        backgroundColor: '#fbfbfb',
        borderRadius: 10
    },
    bottomitem: {
        flexDirection: "row",
        marginBottom: 5,
        marginTop: 10
    },
    bottomtext: {
        marginLeft: 10,
        marginBottom: 5,
        marginTop: 5,
    },
    bottomtext1: {
        marginLeft: 5,
        fontSize: 12,
        color: "#ACACAC",
        fontWeight: "bold"
    },
    bottomtext2: {
        marginLeft: 5,
        fontSize: 16
    },  
    icon: {
        marginLeft: 30,
        marginTop: "40%",
        color: 'grey'
    },
    circle: {
        width: 40,
        height: 40,
        marginTop: 30,
        marginLeft: 20,
        borderRadius: 100/2,
        backgroundColor: '#eaaf7e'
    },
    notifi: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 20,
    },
    field01: {
        fontSize: 12,
        fontWeight: "bold",
        marginLeft: 4,
    },
    field01value: {
        fontSize: 10,
        fontWeight: "normal",
        marginLeft: 3,
    },
    field02: {
        fontSize: 12,
        fontWeight: "bold",
        marginLeft: 4,
    },
    field02value: {
        fontSize: 10,
        fontWeight: "normal",
        marginLeft: 3,
    },
});