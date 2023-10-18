import React, {useEffect, useState} from 'react'
import "./index.scss"
import {logoObject} from "../images/teamlogo/index"
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

const SearchBar = ({playersArray, active, setPlayer, currentCategory, players}) => {
    let navigate = useNavigate();
    const location = useLocation();
    const [searchField, setSearchField] = useState("")
    const [filteredList, setFilteredList] = useState([])
    const [searchBarType, setSearchBarType] = useState("empty")

    //Update search field on user keystroke
    const handleInputChange = (e) => {
        const search = e.target.value;
        setSearchField(search);
    }

    //Handle player search click
    const handleClick = (player) => {
      if(currentCategory === "compare"){
        setPlayer([...players, player])
        setFilteredList([]);
        setSearchField("")
      } else {
        if(location.pathname == '/ChartHero'){
          const playerArr = [player]
          setPlayer(playerArr)
          setFilteredList([]);
          setSearchField("")
        }
        navigate('/ChartHero', { state: player})
      }

    }

    useEffect(() => {
      axios.get("https://baseballsavant.mlb.com/savant/api/v1/trending-players")
      .then(response => {
        console.log(response.data);
      })
      axios.get("https://statsapi.mlb.com/api/v1/schedule?sportId=1&startDate=2023-10-17&endDate=2023-10-23&gameType=&language=en&leagueId=&hydrate=team,linescore,xrefId,flags,review,broadcasts(all),game(content(media(epg),summary),tickets),seriesStatus(useOverride=true),statusFlags&sortBy=gameDate,gameType,gameStatus&timeZone=America/New_York")
      .then(response => {
        console.log(response.data);
      })
      axios.get("https://baseballsavant.mlb.com/schedule?date=2023-10-18")
      .then(response => {
        console.log(response.data);
      })
    },[])

    //Updates filteredData when searchField is updated
    useEffect(() => {
        if(searchField.length >= 1){
            const filteredData = playersArray.filter(item => 
              item.fullName.toLowerCase()
              .includes(searchField.toLowerCase()))

            setFilteredList(filteredData);
            if(filteredData.length > 0){
              setSearchBarType("filled")
            } else {
              setSearchBarType('empty')
            }
        } else {
            setFilteredList([])  
            setSearchBarType("empty")      
        }
    },[searchField])

    useEffect(() => {
      setSearchField("");
      setFilteredList([]);
    },[active])

    
  return (
    <div className='search-bar'>
        <input className={searchBarType} type="text" onChange={handleInputChange} value={searchField} placeholder="Search Players" />
        <ul className='search-suggestions'>
        {filteredList.map((item, i) => (
          <li key={i}>
            <div className='player-suggestion' onClick={() => handleClick(item)}>
              <div className='player-info'>
                <p>{item.fullName}</p>
                <p className='small-info'>{item.primaryPosition.name} | #{item.primaryNumber}</p>
              </div>
              <img src={logoObject[item.currentTeam.id]} alt={item.currentTeam.id} />
            </div>
          </li>
          ))}
        </ul>
    </div>
  )
}

export default SearchBar
