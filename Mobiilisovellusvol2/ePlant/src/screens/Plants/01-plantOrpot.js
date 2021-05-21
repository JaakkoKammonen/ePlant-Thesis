import React from "react";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";
import { Card } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

export default function PlantOrPot({ navigation }) {
  const { navigate } = navigation;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigate("Home")}>
                <Ionicons name="arrow-back-outline" size={30} style={styles.arrow} />
                </TouchableOpacity>
                    <View>
                        <Text style={styles.headerText}>Add a new plant or a pot</Text>
                    </View>
      <Card style={styles.card}>
        <Card.Title>PLANT</Card.Title>
        <Card.Divider />
        <Card.Image source={require("../../assets/selectplant.png")}
         onPress={() => navigate("SelectPlant")}
         style={styles.plantorpot}>
        </Card.Image>
      </Card>
      <Card>
        <Card.Title>POT</Card.Title>
        <Card.Divider />
        <Card.Image source={require("../../assets/selectpot.png")}
            onPress={() => navigate("SelectePlantModel")}
            style={styles.plantorpot}>
        </Card.Image>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
  },
  plantorpot: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 35,
    marginRight: 50,
    width: 250,
    height: 195,
  },
  headerText: {
    fontSize: 22,
    marginTop: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#63816D',
    alignSelf: 'center'
},
  arrow: {
    marginLeft: 20,
    marginTop: 10,
    color: 'grey'
},
});
