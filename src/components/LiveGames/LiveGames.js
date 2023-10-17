import React, { useEffect } from 'react'
import axios from 'axios'


import './index.scss'
const LiveGames = () => {
    useEffect(() => {
        axios.get("https://statsapi.mlb.com/api/v1/schedule?sportId=1&startDate=2023-10-15&endDate=2023-10-21&gameType=&language=en&leagueId=&hydrate=team,linescore,xrefId,flags,review,broadcasts(all),game(content(media(epg),summary),tickets),seriesStatus(useOverride=true),statusFlags&sortBy=gameDate,gameType,gameStatus&timeZone=America/New_York")
        .then(response => {
            console.log(response.data)
        })
        axios.get("https://baseballsavant.mlb.com/schedule?date=2023-10-16")
        .then(response => {
            console.log(response.data)
        })
    },[])
  return (
    <div>
      
    </div>
  )
}

export default LiveGames
