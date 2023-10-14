import React from 'react'
import "./index.scss"
import { useEffect, useState } from 'react'
import axios from 'axios'
import SearchBar from '../SearchBar/SearchBar'
const Hero = () => {

  //Array of players objects with every hitter
  const [playersArray, setPlayersArray] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        axios.get('http://localhost:5001/')
        .then(response => {
          console.log(response.data);
          setPlayersArray(response.data);
        })
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className='body'>
      <div className='top-hero'>
      </div>
      <div className='search-section'>
        <SearchBar playersArray={playersArray}/>
      </div>
      <div className='bottom-hero'>

      </div>
    </div>
  )
}

export default Hero
