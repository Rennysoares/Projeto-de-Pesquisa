import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RouteMain from './src/routes/RouteMain';

export default function App() {
  return (
      <NavigationContainer>
        <RouteMain/>
      </NavigationContainer>
  );
}