import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Pressable } from 'react-native';
import { withAuthenticator } from 'aws-amplify-react-native';
import { Amplify, Auth } from 'aws-amplify';
// import Amplify from 'aws-amplify';
import config from './aws-exports';
import React, { useState, useEffect } from 'react';
import { FlatList, TextInput, TouchableOpacity } from 'react-native';
import TodoItem from './TodoItem';
import { addTodo, deleteTodo, updateTodo } from "./src/graphql/mutations";
import { getTodos } from "./src/graphql/queries";
import { useRef } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import { API, graphqlOperation } from "aws-amplify";
import shortid from "shortid";



Amplify.configure(config);
Auth.configure(config)

interface Todo {
  id: string;
  title: string;
  done: boolean;
}

interface title {
  title: string
  id: string
  done: boolean
}

interface incomingData {
  data: {
    getTodos: title[]
  }
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      textAlign: "center",
    },
    parent: {
      textAlign: "center",
    },
    dataDisplay: {
      backgroundColor: "#eeeeee",
      marginBottom: "10px",
    },
    textField: {
      width: "100%",
      textAlign: "center",
    },
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
)



function App() {

  const [loading, setLoading] = useState(true)
  const [todoData, setTodoData] = useState<incomingData | null>(null)
  const todoTitleRef = useRef<any>("")

  const addTodoMutation = async () => {
    try {
      const todo = {
        id: shortid.generate(),
        title: todoTitleRef.current.value,
        done: false,
      }
      const data = await API.graphql({
        query: addTodo,
        variables: {
          todo: todo,
        },
      })
      todoTitleRef.current.value = ""
      fetchTodos()
    } catch (e) {
      console.log(e)
    }
  }

  const deleteTodoMutation = async (id: string) => {
    try {
      const todoId = id

      const data = await API.graphql({
        query: deleteTodo,
        variables: {
          todoId: todoId,
        },
      })
      fetchTodos()
    } catch (e) {
      console.log(e)
    }
  }

  const updateTodoMutation = async (item: any) => {
    try {
      const todo = {
        id: item.id,
        title: item.title,
        done: item.done,
      }
      var val = prompt("Enter Updated Value", todo.title)
      todo.title = val

      const data = await API.graphql({
        query: updateTodo,
        variables: {
          todo: todo,
        },
      })
      fetchTodos()
    } catch (e) {
      console.log(e)
    }
  }

  const fetchTodos = async () => {
    try {
      const data = await API.graphql({
        query: getTodos,
      })
      console.log("fdata", data)

      setTodoData(data as incomingData)
      setLoading(false)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  console.log("todoData=>", todoData);



  return (
    <View style={styles.container}>
      <Text>Serverless TodoApp Using RN and AWS!</Text>
      {
        todoData?.data?.getTodos?.map((myData: any) => {
          return (
            <View>

              <Text key={myData.id}>{myData.title}
                {/* <Pressable onPress={() => deleteTodoMutation(myData.id)}>
                  <Text>X</Text>
                </Pressable> */}

              </Text>
              <Pressable>
                <Text>X</Text>
              </Pressable>
            </View>

          )
        })
      }
    </View>


    // <View style={styles.container}>
    //   <Text style={styles.title}>Todo App</Text>
    //   <View style={styles.inputContainer}>
    //     <TextInput
    //       style={styles.input}
    //       value={inputText}
    //       onChangeText={setInputText}
    //       placeholder="Enter todo item"
    //     />
    //     <TouchableOpacity onPress={handleAddTodo} style={styles.addButton}>
    //       <Text style={styles.addButtonText}>Add</Text>
    //     </TouchableOpacity>
    //   </View>
    //   <FlatList
    //     data={todos}
    //     renderItem={({ item }) => (
    //       <TodoItem item={item} onDelete={handleDeleteTodo} onToggle={handleToggleTodo} />
    //     )}
    //     keyExtractor={(item) => item.id.toString()}
    //     style={styles.list}
    //   />
    //   <StatusBar style="auto" />
    // </View>
  ); 
}

export default withAuthenticator(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
