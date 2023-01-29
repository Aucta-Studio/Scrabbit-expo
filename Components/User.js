import { View, Text } from 'react-native'
import React from 'react'

export default function User({id}) {
  return (
    <View>
      <Text>User: {id}</Text>
    </View>
  )
}