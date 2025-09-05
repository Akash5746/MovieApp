import { StyleSheet, Text, View, Image, TextInput } from "react-native";
import { icons } from "@/constants/icons";
import React from "react";

interface Props {
  placeholder: string;
  onPress?: () => void;
  value: string;
  onChangeText: (text: string) => void; // it is a function that doesnt return anything
}

const SearchBar = ({ placeholder, onPress, value, onChangeText }: Props) => {
  return (
    <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
      <Image
        source={icons.search}
        className="size-5"
        resizeMode="contain"
        tintColor="#ab8bff"
      />
      <TextInput
        onPress={onPress} // this a empty callback function and this is just to remove the warning
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#A8B5DB"
        className="flex-1 ml-2 text-white "
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({});
