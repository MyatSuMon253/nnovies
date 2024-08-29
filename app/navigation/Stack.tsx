import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Tabs from "./Tabs";

const Stack = createStackNavigator();

export default () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "black",
        borderBottomColor: "black",
        shadowColor: "black",
      },
      headerTintColor: "#FFFFFF",
      headerBackTitleVisible: false,
      headerBackImage: () => (
        <Ionicons name="arrow-back" color={"white"} size={26} />
      ),
    }}
  >
    <Stack.Screen name="Tab" component={Tabs} />
    {/* <Stack.Screen name="Detail" component={Detail} /> */}
  </Stack.Navigator>
);
