import React, {useEffect, useState} from 'react'
import "./index.scss"
import axios from 'axios'
import SearchBar from '../SearchBar/SearchBar'
import TypeToggle from '../TypeToggle/TypeToggle'
import ChartHero from '../ChartHero/ChartHero'
import { Func } from '../../util/script/main'
import NavBar from '../NavBar/NavBar'
import { AnimatePresence, motion } from 'framer-motion'

const Main = () => {
  //Prop for type toggle
  const [active, setActive] = useState('hitter')
  const [hitterArray, setHitterArray] = useState([])
  const [pitcherArray, setPitcherArray] = useState([])
  const [chartPlayer, setChartPlayer] = useState([])
  
  //Retrieves data on load
  useEffect(() => {
    async function fetchData() {
      try {
        axios.get('https://statsapi.mlb.com/api/v1/sports/1/players')
        .then(response => {
          console.log(response.data);
          const playerArray = getAllActive(response.data.people)
          Func.main.splitData(setHitterArray, setPitcherArray, playerArray)
        })
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    }
    fetchData();
  }, []);

  function getAllActive(playerArray){
    let hitterArray = [];
    playerArray.map((player) => {
        if(player.active){
            hitterArray.push(player);
        }
    })
    return hitterArray
  }

  return (
    <AnimatePresence>

    <motion.div className='main'
    initial={{ opacity:0 }}
    animate={{ opacity:1 }}
    transition={{
      duration: 1, // Duration of 2 seconds
      ease: [0.23, 1, 0.32, 1] // cubic-bezier(0.23, 1, 0.32, 1)
    }}
    exit={{ opacity:0 }}
    >
      <div className="top">
        <NavBar/>
      </div>
      <div className='search-section'>
        <div className='background-image'></div>
        <div className='background-filter'>
        </div>
        <div className='search-bar-box'>
          <h1>BASEBALL STATS</h1>
          <TypeToggle active={active} setActive={setActive}/>
          <SearchBar playersArray={active === 'hitter' ? hitterArray : pitcherArray} active={active} currentCategory="main"/>
        </div>
      </div>
      <div className="bottom"></div>
    </motion.div>
    </AnimatePresence>
  )
}

export default Main
