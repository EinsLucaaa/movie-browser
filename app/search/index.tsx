import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useLocalSearchParams } from "expo-router";
import Loader from "../components/Loader";

const MovieDetailScreen = () => {
    const { search: search } = useLocalSearchParams();
    const searchJson = JSON.parse(search);
    const [movieDetails, setMovieDetails] = useState<any>(null);
    const API_KEY = process.env.OMDB_API_KEY;


    // Funktion zum Laden der Filmdetails
    const fetchMovieDetails = async () => {
        try {
            const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${searchJson.imdbID}`);
            const data = await response.json();
            setMovieDetails(data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    };

    useEffect(() => {
        fetchMovieDetails(); // nur einmalig beim ersten Rendern ausführen
    }, []); // leere Abhängigkeitsliste, um Endlosschleife zu vermeiden

    const openIMDB = () => {
        if (movieDetails && movieDetails.imdbID) {
            Linking.openURL(`https://www.imdb.com/title/${movieDetails.imdbID}/`);
        }
    };

    if (!movieDetails) {
        return (
            <View style={styles.container}>
                <Loader/>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.posterContainer}>
                <Image source={{ uri: movieDetails.Poster }} style={styles.posterImage} resizeMode="contain" />
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.title}>{movieDetails.Title} ({movieDetails.Year})</Text>
                <Text style={styles.detailText}>Director: {movieDetails.Director}</Text>
                <Text style={styles.detailText}>Actors: {movieDetails.Actors}</Text>
                <Text style={styles.detailText}>Genre: {movieDetails.Genre}</Text>
                <Text style={styles.detailText}>Rated: {movieDetails.Rated}</Text>
                <Text style={styles.detailText}>Runtime: {movieDetails.Runtime}</Text>
                <Text style={styles.detailText}>Released: {movieDetails.Released}</Text>
                <Text style={styles.detailText}>Plot: {movieDetails.Plot}</Text>
                <Text style={styles.detailText}>Language: {movieDetails.Language}</Text>
                <Text style={styles.detailText}>Country: {movieDetails.Country}</Text>
                <Text style={styles.detailText}>IMDb Rating: {movieDetails.imdbRating} ({movieDetails.imdbVotes} votes)</Text>
                <Text style={styles.detailText}>Rotten Tomatoes: {movieDetails.Ratings.find(rating => rating.Source === "Rotten Tomatoes")?.Value}</Text>
                <Text style={styles.detailText}>Metacritic Score: {movieDetails.Metascore}</Text>
                <TouchableOpacity style={styles.imdbButton} onPress={openIMDB}>
                    <Text style={styles.buttonText}>Auf IMDb ansehen</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2b2d42',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    loadingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#EDF2F4',
        textAlign: 'center',
    },
    posterContainer: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 50, // Margin Top von 50 hinzugefügt
    },
    posterImage: {
        width: 200,
        height: 300,
        borderRadius: 10,
    },
    detailsContainer: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#EDF2F4',
        textAlign: 'center',
        marginBottom: 10,
    },
    detailText: {
        fontSize: 16,
        color: '#EDF2F4',
        marginBottom: 5,
    },
    imdbButton: {
        backgroundColor: '#f5c518', // IMDb-Farbe
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#2b2d42',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MovieDetailScreen;
