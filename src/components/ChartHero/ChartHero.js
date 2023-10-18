import React, {useState, useEffect} from 'react'
import ChartSingle from '../ChartSingle/ChartSingle'
import axios from 'axios'
import "./index.scss"
import { useLocation } from 'react-router-dom'
import { Func } from '../../util/script/main'
import ChartMenu from '../ChartMenu/ChartMenu'
import ChartLoading from '../ChartLoading/ChartLoading'
import ChartCompare from '../ChartCompare/ChartCompare'
import ChartTeams from '../ChartTeams/ChartTeams'
import { AnimatePresence, motion } from 'framer-motion'

const ChartHero = () => {
  const {state} = useLocation();
  const playerData = state;

  const [currentCategory, setCurrentCategory] = useState('single');
  const [player, setPlayer] = useState([playerData]);
  const [loading, setLoading] = useState(true)
  const [hitterArray, setHitterArray] = useState([])
  const [pitcherArray, setPitcherArray] = useState([])
  const [allTeams, setAllTeams] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState(null)
  
  //Retrieves data on load
  useEffect(() => {
    fetchData();
    fetchTeams();
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

  async function fetchTeams(){
    try{
      axios.get('https://statsapi.mlb.com/api/v1/teams?sportId=1')
      .then(response => {
        const mlb = buildTeamTable(response.data.teams);
        console.log(mlb)
        setAllTeams(mlb);
      })
    } catch (error){
      console.error(error)
    }
  }

  function buildTeamTable(teams){
    const mlb = {
      103: {
        200: [],
        202: [],
        201: [],
      },
      104: {
        203: [],
        205: [],
        204: []
      }
    }

    teams.map((team) => {
      const league = team.league.id;
      const division = team.division.id;
      mlb[league][division].push(team);
    })

    return mlb;
  }

  return (
    <AnimatePresence>
    <motion.div className='chart-hero'
    
      initial={{ opacity:0 }}
      animate={{ opacity:1 }}
      transition={{
        duration: 1, // Duration of 2 seconds
        ease: [0.23, 1, 0.32, 1] // cubic-bezier(0.23, 1, 0.32, 1)
      }}
      exit={{ opacity:0 }}
    >
      <ChartMenu currentCategory={currentCategory} setCurrentCategory={setCurrentCategory} player={player} setPlayer={setPlayer} hitterArray={hitterArray} pitcherArray={pitcherArray} allTeams={allTeams} setSelectedTeam={setSelectedTeam}/>
      <motion.div className='chart-area'
        initial={{ x: 2000 }}
        animate={{ x: 0}}
        transition={{
          duration: 1, // Duration of 2 seconds
          ease: [0.23, 1, 0.32, 1] // cubic-bezier(0.23, 1, 0.32, 1)
        }}
        exit={{ x: 2000}}
      >
        {currentCategory === 'single' ? <ChartSingle player={player} setPlayer={setPlayer} setLoading={setLoading} loading={loading}/> : null}
        {currentCategory === 'compare' ? <ChartCompare player={player} setPlayer={setPlayer} setLoading={setLoading} loading={loading}/> : null}
        {currentCategory === 'team' && selectedTeam ? <ChartTeams player={player} setPlayer={setPlayer} setLoading={setLoading} loading={loading} selectedTeam={selectedTeam}/> : null}
        
      </motion.div>
    </motion.div>
    </AnimatePresence>
  )
}

export default ChartHero
