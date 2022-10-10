import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MovieList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const fetchMoviesHandler = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try { //try is use to handling errors when we work with async & await
        const response = await fetch('https://react-http-656df-default-rtdb.firebaseio.com/movies.json'); 
        if (!response.ok) {
          throw new Error('Something went wrong!');
        }
        const data = await response.json();
        
        //to get/show the added movies by user in the browser

        const loadedMovies = [];

        for (const key in data) {  //for loop
          loadedMovies.push({
            id: key,
            title: data[key].title,
            openingText: data[key].openingText,
            releaseDate: data[key].releaseDate,
          });
        }
        
        setMovies(loadedMovies); 
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);//we should add our dependencies array for useCallback aswell
    }, []);//list any dependencies this fun might have,but this fun has no external dependencies,here api is global api  
            
      
  useEffect(() => {
    fetchMoviesHandler();//if this fun changes this effect should be reexecuted so we added as dependency
  }, [fetchMoviesHandler]);//but it could introduce certain bugs if our fun using some external states so better solution to use useCallback hook & wrap the fetchMoviesHandler with it

  async function addMovieHandler(movie) {
    const response = await fetch('https://react-http-656df-default-rtdb.firebaseio.com/movies.json', { //the url should be same for both to get data and to send data
      method: 'POST', // by default its 'GET' request, but here we need to send data so we use 'POST'
      body: JSON.stringify(movie), //this takes javascript object/array & turns it into JSON formate
      headers: {
        'Content-Type': 'application/json'  //without headers here this will also work but in most app it will require 
      }
    });  
    const data = await response.json(); //firebase also sends back data in JSON formate  
    console.log(data);          
  }

  let content = <p>Found no Movies</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

    return (
      <React.Fragment>
        <section>
          <AddMovie onAddMovie={addMovieHandler} />
        </section>
        <section>
          <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        </section>
        <section>{content}</section>
      </React.Fragment>
  );
}

export default App;


//fetch('https://swapi.dev/api/films/')
    //  .then((response) => { //default method will be GET, fetch returns a promice which then allow us to responce
    //    return response.json(); //response itself returns a promise , response object has a builtin method i.e = response.json, which automatically translate this JSON response body to a real javascript object which we can use in our code
    //  })
    //  .then((data) => { //this data we get after it transformed from json to javascript code
    //when working with then => use catch() for handling errors