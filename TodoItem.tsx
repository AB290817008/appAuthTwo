import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  item: Todo;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ item, onDelete, onToggle }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onToggle(item.id)}>
        <Text style={item.completed ? styles.completedText : styles.normalText}>{item.text}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(item.id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  normalText: {
    fontSize: 16,
  },
  completedText: {
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  deleteText: {
    color: 'red',
  },
});

export default TodoItem;
