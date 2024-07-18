import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    FlatList,
    Image,
    StatusBar,
    TouchableOpacity
} from 'react-native';
import {useRouter} from "expo-router";
import Loader from "./components/Loader";

const HomeScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [isLoaded, setIsLoaded] = useState(true);
    const API_KEY = process.env.OMDB_API_KEY;
    const router = useRouter();

    const handleSearch = async () => {
        try {
            console.log("searchQuery:", searchQuery);
            setIsLoaded(false);
            const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery.replace(' ', '+')}`);
            const data = await response.json();
            if (data.Search) {
                console.log(data.Search);
                setMovies(data.Search);
                setIsLoaded(true);
            } else {
                console.log(data);
                setMovies([]);
                setIsLoaded(true);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    if (isLoaded) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="light-content" backgroundColor="#2b2d42" />
                <View style={styles.container}>
                    <Text style={styles.title}>Willkommen</Text>
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Film suchen..."
                            placeholderTextColor="#8D99AE"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <Button title="Suchen" onPress={handleSearch} color="#8D99AE" />
                    </View>
                    <FlatList
                        data={movies}
                        keyExtractor={(item) => item.imdbID}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.movieCard} onPress={() => router.push({ pathname: '/search', params: { search: JSON.stringify(item) } })}>
                                <Image source={{ uri: item.Poster }} style={styles.movieImage} resizeMode="cover" />
                                <View style={styles.movieDetails}>
                                    <Text style={styles.movieTitle}>{item.Title}</Text>
                                    <Text style={styles.movieText}>Type: {item.Type}</Text>
                                    <Text style={styles.movieText}>Year: {item.Year}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </SafeAreaView>
        );
    } else {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="light-content" backgroundColor="#2b2d42" />
                <View style={styles.container}>
                    <Text style={styles.title}>Willkommen</Text>
                    <Loader/>
                </View>
            </SafeAreaView>
        );

    }
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#2b2d42',
    },
    container: {
        flex: 1,
        backgroundColor: '#2b2d42',
        paddingTop: StatusBar.currentHeight || 0,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#EDF2F4',
        marginBottom: 20,
        marginTop: 20,
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderColor: '#8D99AE',
        borderWidth: 1,
        paddingLeft: 8,
        marginRight: 10,
        color: '#EDF2F4',
        backgroundColor: '#3A3D56',
        borderRadius: 5,
    },
    movieCard: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#3A3D56',
        borderRadius: 10,
        overflow: 'hidden',
    },
    movieImage: {
        width: 100,
        height: 150,
        borderRadius: 10,
    },
    movieDetails: {
        flex: 1,
        padding: 10,
    },
    movieTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#EDF2F4',
        marginBottom: 5,
    },
    movieText: {
        color: '#EDF2F4',
        marginBottom: 2,
    },
});

export default HomeScreen;
