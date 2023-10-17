import React, { useEffect, createRef } from 'react'
import './index.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faAngleUp, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import {logoObject} from "../images/teamlogo/index"
import american from "../images/teamlogo/american.png"
import national from "../images/teamlogo/national.png"

import SearchBar from '../SearchBar/SearchBar'

//Need to import player
const ChartMenu = ({currentCategory, setCurrentCategory, player, setPlayer, hitterArray, pitcherArray, allTeams}) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log(player)
  },[])

  function handleClick(){
    setPlayer([])
    navigate('/')
  }

  function removePlayer(item){
    console.log(player)
    let newArray = player;
    for(let i = 0; i < newArray.length; i++){
      if(newArray[i].fullName === item.fullName){
        newArray.splice(i,i);
        setPlayer(newArray);
      }
    }
  }
  
  return (
    <motion.div className='chart-menu'
        initial={{ x: -1000 }}
        animate={{ x: 0}}
        transition={{
          duration: 1, // Duration of 2 seconds
          ease: [0.23, 1, 0.32, 1] // cubic-bezier(0.23, 1, 0.32, 1)
        }}
        exit={{ x: -1000}}
    >
        <div className='return-section'>
          <div className='return-button' onClick={handleClick}>
            <FontAwesomeIcon icon={faChevronLeft}/>
            <p>Return</p>
          </div>
        </div>


        <motion.div className='menu-item'
          initial={{ height: 50 }}
          animate={{ height: currentCategory === 'single' ? 260 :  50}}
        >
          <div className='menu-title' onClick={() => setCurrentCategory("single")}>
            <h1>Single</h1>
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: currentCategory === 'single' ? 180 :  0}}
              transition={{
                duration: .3
              }}
            >
              <FontAwesomeIcon icon={faAngleUp} size="xl"/>
            </motion.div>
          </div>
          <AnimatePresence>
            {currentCategory === 'single' ?
                <motion.div className='one-player'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0}}
                >
                  <div className='player-name'>
                    <div>
                      <h2>{player[0].fullName}</h2>
                      <p>{player[0].primaryPosition.name} | #{player[0].primaryNumber}</p>
                    </div>
                    <img src={logoObject[player[0].currentTeam.id]} alt={player[0].id} />
                  </div>
                    <div className='player-bio'>
                      <p>Height: {player[0].height}</p>
                      <p>Weight: {player[0].weight}lbs</p>
                      <p>Birthday: {player[0].birthDate}</p>
                    </div>
                    <div>
                      <SearchBar playersArray={hitterArray} setPlayer={setPlayer} currentCategor={currentCategory}/>
                    </div>
                </motion.div>
            : null}
          </AnimatePresence>
        </motion.div>

        <motion.div className="menu-item"
          initial={{ height: 50 }}
          animate={{ height: currentCategory === 'compare' ? (player.length * 51 + 110) :  50}}
        >
          <div className='menu-title' onClick={() => setCurrentCategory("compare")}>
            <h1>Compare</h1>
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: currentCategory === 'compare' ? 180 :  0}}
              transition={{
                duration: .3
              }}
              >
                <FontAwesomeIcon icon={faAngleUp} size="xl"/>
            </motion.div>
          </div>
          <AnimatePresence>
            {currentCategory === 'compare' ?
                <motion.div className='compare-player'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0}}
                >
                  {player.map((item, i) => { 
                    console.log(item)
                    return(
                      <div key={i} className='compare-player-single'>
                        <div className='player-card'>
                          <img src={logoObject[item.currentTeam.id]} alt={item.id} />
                          <h2>{item.fullName}</h2>
                        </div>
                        <FontAwesomeIcon icon={faCircleXmark} size='lg' onClick={() => {
                        if(player.length > 1){
                          setPlayer(
                            player.filter(a => 
                              a.id !== item.id
                              )
                            )
                        }
                      }}/>
                      </div>
                    )
                  })}
                    <div className='search-bar-section'>
                    <SearchBar playersArray={hitterArray} setPlayer={setPlayer} currentCategory={currentCategory} players={player}/>
                  </div>

                </motion.div>
            : null}
          </AnimatePresence>
        </motion.div>

        <motion.div className="menu-item"
          initial={{ height: 50 }}
          animate={{ height: currentCategory === 'team' ? 260 :  50}}
        >


          <div className='menu-title' onClick={() => setCurrentCategory("team")}>
            <h1>Team</h1>
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: currentCategory === 'team' ? 180 :  0}}
              transition={{
                duration: .3
              }}
              >
                <FontAwesomeIcon icon={faAngleUp} size="xl"/>
            </motion.div>
          </div>


          <AnimatePresence>
            {currentCategory === 'team' ?
                <motion.div className='team'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0}}
                >
                  <div>
                    <div className='league-name national'><p>National League</p><img src={national} alt={national} /></div>
                      <ul>
                      <li className='division-name nl'>NL West</li>
                      {allTeams[104][203].map(team => {
                        return(
                          <li className='team-name'><img src={logoObject[team.id]} alt={team.id} />{team.name}</li>
                        )
                      })}
                      </ul>
                      <ul>
                        <li className='division-name nl'>NL Central</li>
                        {allTeams[104][205].map(team => {
                        return(
                          <li className='team-name'><img src={logoObject[team.id]} alt={team.id} />{team.name}</li>
                        )
                      })}
                      </ul>
                      <ul>
                        <li className='division-name nl'>NL East</li>
                        {allTeams[104][204].map(team => {
                        return(
                          <li className='team-name'><img src={logoObject[team.id]} alt={team.id} />{team.name}</li>
                        )
                      })}
                      </ul>
                      <div className='league-name american'><p>American League</p><img src={american} alt={american} /></div>
                      <ul>
                      <li className='division-name al'>AL West</li>
                      {allTeams[103][200].map(team => {
                        return(
                          <li className='team-name'><img src={logoObject[team.id]} alt={team.id} />{team.name}</li>
                        )
                      })}
                      </ul>
                      <ul>
                        <li className='division-name al'>AL Central</li>
                        {allTeams[103][202].map(team => {
                        return(
                          <li className='team-name'><img src={logoObject[team.id]} alt={team.id} />{team.name}</li>
                        )
                      })}
                      </ul>
                      <ul>
                        <li className='division-name al'>AL East</li>
                        {allTeams[103][201].map(team => {
                        return(
                          <li className='team-name'><img src={logoObject[team.id]} alt={team.id} />{team.name}</li>
                        )
                      })}
                      </ul>
                  </div>
                </motion.div>
            : null}
          </AnimatePresence>
        </motion.div>

      </motion.div>
  )
}

export default ChartMenu
