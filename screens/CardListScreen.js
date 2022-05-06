import React from 'react';
import {View, Text, Button, FlatList, StyleSheet} from 'react-native';

const CardListScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>Sudhanshu</Text>
    </View>
  );
};

export default CardListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
  },
});
