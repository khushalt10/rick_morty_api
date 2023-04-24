import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import ReactNativeModal from 'react-native-modal';

const HomeScreen = () => {

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [offset, setOffset] = useState(1);
    const [isVisible, setIsVisible] = useState(false);
    const [location, setLocation] = useState({});
    const [isVisible2, setIsVisible2] = useState(false);
    const [chapters, setChapters] = useState([]);

    const getCharacters = async () => {
       try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${offset}`);
        const json = await response.json();
        setData([...data, ...json.results]);
        setOffset(offset + 1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    const getLocation = async (path) => {
        try {
         const response = await fetch(path);
         const json = await response.json();
         setLocation(json);
         setIsVisible(true);
       } catch (error) {
         console.error(error);
       } finally {
         setLoading(false);
       }
     }

     const getChapter = async (episode) => {
        try {
         const episodes = await Promise.all(
            episode.map(async (item) => {
                const response = await fetch(item);
                const json = await response.json();
                return json;
            })
        );
         setChapters(episodes)   
         setIsVisible2(true);
       } catch (error) {
         console.error(error);
       } finally {
         setLoading(false);
       }
     }
  
  
    useEffect(() => {
        getCharacters();
    }, []);


    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Image source={{uri: item.image}} style={styles.image} />
            <View style={styles.details}>
                <Text style={styles.title}>Name: {item.name}</Text>
                <Text style={styles.title}>species: {item.species}</Text>
                <Text style={styles.title}>Gender: {item.gender}</Text>
            </View>
            <View style={styles.btns}>
                <Pressable onPress={() => getLocation(item.location.url)}>
                    <Text style={styles.btn}>Location</Text>
                </Pressable>
                <Pressable onPress={() => getChapter(item.episode)}>
                    <Text style={styles.btn}>Episodes</Text>
                </Pressable>
            </View>
        </View>
      );

    return (
        <View>
            {!isLoading && <FlatList
                data={data}
                numColumns={2}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                onEndReached={offset < 42 && getCharacters}
            />}
            {!isLoading && <ReactNativeModal onBackButtonPress={() => setIsVisible(false)} onBackdropPress={() => setIsVisible(false)} isVisible={isVisible}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Location: {location.name}</Text>
                    <Text style={styles.title}>Type: {location.type}</Text>
                    <Text style={styles.title}>Dimesion: {location.dimension}</Text>
                    <Text style={styles.title}>Residents: {location?.residents?.length}</Text>
                </View>
            </ReactNativeModal>}
            {!isLoading && <ReactNativeModal onBackButtonPress={() => setIsVisible2(false)} onBackdropPress={() => setIsVisible2(false)} isVisible={isVisible2}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.modal}>
                        {chapters.length > 0 && chapters.map(c => (
                        <Text key={c.id} style={styles.title}>{c.episode}: {c.name}</Text>
                        ))}
                    </View>
                </ScrollView>
            </ReactNativeModal>}
            {isLoading && <ActivityIndicator />}
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
      color: 'black'
    },
    item: {
        marginVertical: 8,
        marginHorizontal: 16,
        width: '42%',
        backgroundColor: 'rgb(202, 241, 222)',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
      },
      title: {
        fontSize: 14,
        color: 'black'
      },
      image: {
        width: '100%',
        height: 150
      },
      details: {
        padding: 10,
      },
      btns: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 10,
      },
      btn: {
        backgroundColor: '#34495E',
        color: 'white',
        padding: 5,
        borderRadius: 5,
        fontSize: 12,
        textAlign: 'center'
      },
      modal: {
        display: 'flex',
        alignSelf: 'center',
        backgroundColor: 'white',
        width: '80%',
        padding: 20,
        alignItems: 'flex-start',
      }
  });
  

export default HomeScreen