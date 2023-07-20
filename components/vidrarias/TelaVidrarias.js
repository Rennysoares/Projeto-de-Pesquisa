import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Button, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DatabaseConnection } from '../../src/databases/DatabaseConnection';
import { fetchDados } from './FetchDados';
import { TextInput } from 'react-native-gesture-handler';

const dbglassware = DatabaseConnection.getConnectionDBGlassware();

const TelaVidrarias = ({ navigation }) => {
  return (
    <View>
        <Text>Tela Vidrarias</Text>
    </View>
  );
};

export default TelaVidrarias;

const styles = StyleSheet.create({
});