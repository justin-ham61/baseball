import React, {useEffect, useState} from 'react'
import "./index.scss"
import axios from 'axios'
import { Bar, Line } from 'react-chartjs-2';
import { Navigate, useNavigate } from 'react-router-dom';
import {Chart as ChartJS} from 'chart.js/auto'
import {ChartsFunc} from '../util/class/ChartsFunc.js';
import ChartLoading from '../ChartLoading/ChartLoading';
import AbbreviationDescription from '../AbbreviationDescription/AbbreviationDescription';
import {type} from '../util/gameTypeKey.js'
import { hittingStatKeys } from '../util/hittingStatKey';
import { gameLogKeys } from '../util/gameLogKeys';
import CareerStatSelector from '../CareerStatSelector/CareerStatSelector';
import { AnimatePresence } from 'framer-motion';
import InfoMessage from '../InfoMessage/InfoMessage';


const ChartSingle = ({player, setPlayer, setLoading, loading}) => {
    let navigate = useNavigate();
    const [careerStats, setCareerStats] = useState([])
    const [gameLogs, setGameLogs] = useState([])
    
    const [statType, setStatType] = useState('hitting')

    const [tableCategory, setTableCategory] = useState('season')
    
    const [currentSeason, setCurrentSeason] = useState("2023")
    const [gameLogSeason, setGameLogSeason] = useState("2023")
    const [gameLogSplit, setGameLogSplit] = useState("R")
    const [infoMessageBox, toggleInfoMessageBox] = useState(true);
    const [infoMessage, setInfoMessage] = useState("Click on Each Stat in the Header to Graph")
    const [involvedGameType, setInvolvedGameType] = useState([]);

    const [currentStatCategory, setCurrentStatCategory] = useState('R');

    const [error, setError] = useState(false)

    const [showDescription, toggleShowDescription] = useState(false)
    const [descriptionData, setDescriptionData] = useState(null);

    const [data1, setData] = useState({
        labels: [],
        datasets: [{
            label: "",
            data: [],
            hidden: true
        }],
        options: {
            onClick: (event)=> {
                console.log("hello")
                const points = this.current.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
                if (points.length) {
                    const index = points[0].index;
                    //const extraInfo = extraData[index];
                    handleChartClick("hello");
                }
            }
        }
    })

    const handleChartClick = (message) => {
console.log(message)
    }
    const [careerGraph, setCareerGraph] = useState(null);
    const [showCareerGraph, setShowCareerGraph] = useState(false);

    const monthKey = {
        "01": "Jan",
        "02": "Feb",
        "03": "Mar",
        "04": "Apr",
        "05": "May",
        "06": "Jun",
        "07": "Jul",
        "08": "Aug",
        "09": "Sep",
        "10": "Oct",
        "11": "Nov",
        "12": "Dec",     
    }

    useEffect(() => {
        setCurrentSeason("2023")
        setCurrentStatCategory("R")
        setStatType("hitting")
        setTableCategory('season')
        setGameLogSplit("R")
        setGameLogSeason("2023")
        setShowCareerGraph(false)
        setCareerGraph(null)
        fetchYearData();
        fetchSeasonData();
        fetchPlayerInfo(player[0].id);
    },[player])

    useEffect(() => {
        {tableCategory === 'season' ? fetchSeasonData() : fetchGameLog()}
        {tableCategory === 'season' ? setInfoMessage("Click on Each Stat in the Header to Graph") : setInfoMessage("Click on a game to see highlights")}
        toggleInfoMessageBox(true);
    },[tableCategory, gameLogSplit, gameLogSeason])

    useEffect(() => {
        setShowCareerGraph(false)
    }, [tableCategory])
    useEffect(() => {
        fetchSeasonData();
    },[statType])

    useEffect(() => {
        fetchYearData();
    },[currentSeason])

    useEffect(() => {
        fetchSeasonData();
    },[currentStatCategory])

    async function fetchYearData(){
        setLoading(true)
        const formData = {
            player: player,
            season: currentSeason,
            gameType: currentStatCategory
        }

        try{
            axios.get(`https://statsapi.mlb.com/api/v1/people/${player[0].id}/stats?stats=gameLog,statSplits,statsSingleSeason&leagueListId=mlb_hist&group=hitting&gameType=R&sitCodes=1,2,3,4,5,6,7,8,9,10,11,12&hydrate=team&season=${currentSeason}`)
            .then(response => {
                const data = ChartsFunc.buildSinglePlayerDataset(response.data.stats[0].splits);
                setData(data)
                setLoading(false)
            })
        } catch(err){
            setError(true)
            setLoading(false)
        }
    }
    async function fetchSeasonData(){
        try{
            axios.get(`https://statsapi.mlb.com/api/v1/people/${player[0].id}/stats?stats=yearByYear,career,yearByYearAdvanced,careerAdvanced&gameType=${currentStatCategory}&leagueListId=mlb_hist&group=${statType}&hydrate=team(league)&language=en`)
            .catch(error => {
                console.error("There was an error", error);
                setError(true);
              })
            .then(response => {
                if(response.data.stats.length > 0){
                    setError(false);
                    setCareerStats(response.data.stats[0].splits)
                } else {
                    setError(true)
                }
            })
        } catch (error){
            console.log(error)
        }
    }

    async function fetchPlayerInfo(playerId){
        try{
          axios.get(`https://statsapi.mlb.com/api/v1/people/${playerId}?hydrate=currentTeam,team,stats(type=[yearByYear,yearByYearAdvanced,careerRegularSeason,careerAdvanced,availableStats](team(league)),leagueListId=mlb_hist)&site=en`)
          .catch(error => {
            console.error("There was an error", error);
            setError(true);
          })
          .then(response => {
            setStatCategories(response.data.people[0]);
          })
          
        } catch (error){
          console.error("There was an error", error);
        }
    }

    async function fetchGameLog(){
        try{
            axios.get(`https://statsapi.mlb.com/api/v1/people/${player[0].id}/stats?stats=gameLog,statSplits,statsSingleSeason&leagueListId=mlb_hist&group=hitting&gameType=${gameLogSplit}&sitCodes=1,2,3,4,5,6,7,8,9,10,11,12&hydrate=team&season=${gameLogSeason}&language=en`)
            .then(response => {
                console.log(response.data.stats[0].splits)
                if(response.data.stats[0].splits.length > 0){
                    setError(false);
                    setGameLogs(response.data.stats[0].splits);
                } else {
                    setError(true);
                }
            })
        } catch (error){
            console.error(error);
        }
    }

    function setStatCategories(playerInfo){
        const splitArray = playerInfo.stats[6].splits
        let playerSplits = {}
        let totalArray = ['P']
        splitArray.map(split => {

            if(type[split.gameType] != null){
                if(playerSplits[split.season] == null){
                    playerSplits[split.season] = [split.gameType];
                } else {
                    playerSplits[split.season].push(split.gameType);
                }
            }

            if(totalArray.indexOf(split.gameType) === -1 && type[split.gameType] != null){
                totalArray.push(split.gameType)
            }
        })
        setInvolvedGameType(totalArray)
    }

    const graphCareerStat = (category) => {
        let dataset = ChartsFunc.buildCareerStatGraph(careerStats, category);
        setCareerGraph(dataset);
        setShowCareerGraph(true);
    }

    const getStory = (gamePk) => {
        console.log(gamePk)
        window.open(`https://stories.mlb.com/live/${gamePk}.html`, "_blank")
    }

    const handleSeasonChange = (e) => {
        const season = e.target.value;
        setCurrentSeason(season)
    }

    const handleStatCategoryChange = (e) => {
        const statCategory = e.target.value;
        setCurrentStatCategory(statCategory);
    }

    const handleGameLogSeason = (e) => {
        const year = e.target.value;
        setGameLogSeason(year);
    }

    const handleGameLogSplit = (e) => {
        const split = e.target.value;
        setGameLogSplit(split)
    }

    const toggleDescription = (e) => {
        console.log(e.target.id)
        const data = {
            location: e.target.getBoundingClientRect(),
            id: e.target.id
        }

        setDescriptionData(data);
        
        (showDescription ? toggleShowDescription(false) : toggleShowDescription(true))
    }
 
    //Data for graph solo


  return (
    <div className='chart'>
        <AnimatePresence>
        {showDescription ? 
            <AbbreviationDescription descriptionData={descriptionData}/>
            :
            null
        }
        </AnimatePresence>
        {loading ? <ChartLoading/> : null}
        <div className='chart-header'>
            <div className='chart-header-label'>
                <h2>{currentSeason} Season Stats</h2>
                <p>Games Played: {data1.labels.length} Games</p>
            </div>
            {/* {data1.datasets.length > 1 ?
            <form action="">
                    <input type="checkbox" id='0' name='stat' checked={data1.datasets[0].hidden ? false : true} onChange={handleCheckClick}/>
                    <label htmlFor="avg">AVG</label>
                    <input type="checkbox" id='1' name='stat' checked={data1.datasets[1].hidden ? false : true} onChange={handleCheckClick}/>
                    <label htmlFor="obp">OBP</label>
                    <input type="checkbox" id='2' name='stat' checked={data1.datasets[2].hidden ? false : true} onChange={handleCheckClick}/>
                    <label htmlFor="ops">OPS</label>
                </form>
                : null} */}
            <div className='season-selector'>
                <label htmlFor="season">Select a season: </label>
                <select name="" id="season" onChange={handleSeasonChange} value={currentSeason}>
                    {careerStats.map((split, i) => {
                        if(split.team){
                            return(
                                <option value={split.season} key={i}>{split.season}</option>
                                )
                            }
                        })}
                </select>
            </div>
        </div>
        <div className='graph'>
            <Line data={data1}/>
        </div>

        <div className='stat-selector'>
            <table>
                <tr className='type-selector'>
                    <td className={tableCategory === 'season' ? 'type left active' : 'type left'} onClick={() => setTableCategory('season')}>Career</td>
                    <td className={tableCategory === 'gamelogs' ? 'type right active' : 'type right'} onClick={() => setTableCategory('gamelogs')}>Game Log</td>
                </tr>
            </table>
        </div>

        {/* StatSelector */}
        {tableCategory === 'season' ? 
        <CareerStatSelector statType={statType} handleStatCategoryChange={handleStatCategoryChange} type={type} currentStatCategory={currentStatCategory} setStatType={setStatType} involvedGameType={involvedGameType}/>
        :
        <div className='stat-selector'>
            <select name="" id="" onChange={handleGameLogSplit} value={gameLogSplit}>
                <option value="P">Post Season Cumilative</option>
                <option value="R">Regular Season</option>
            </select>
            <select name="" id="year" onChange={handleGameLogSeason} value={gameLogSeason}>
            {careerStats.map((split, i) => {
                if(split.team){
                    return(
                        <option key={i} value={split.season}>{split.season}</option>
                        )
                    }
                })}
            </select>
        </div>
        }
        {tableCategory === 'season' ? 
        <div className='stat-table-section'>
            {infoMessageBox ? <InfoMessage toggleInfoMessageBox={toggleInfoMessageBox} message={infoMessage}/> : null}
            <h2>Career {statType==='hitting' ? "Hitting" : "Fielding"} Stats for the {type[currentStatCategory]}</h2>
            {!error ? (
                statType === 'hitting' ?
                <table className='stat-table'>
                    <tr>
                        <th>Season</th>
                        <th>Team</th>
                        <th>LG</th>
                        <th><p onMouseOver={toggleDescription} id="Games Played" onMouseLeave={() => toggleShowDescription(false)}>G</p></th>
                        {hittingStatKeys.map((item, i) => {
                            return(
                                <th key={i} onClick={() => graphCareerStat(item.api)}><p onMouseOver={toggleDescription} id={item.fullName} onMouseLeave={() => toggleShowDescription(false)}>{item.abbreviation}</p></th>
                                )
                        })}
                    </tr>
                    {careerStats.map((item, i) => {
                        if(item.team)
                        return(
                            <tr key={i}>
                                <td className='year'>{item.season}</td>
                                <td>{item.team.abbreviation}</td>
                                <td>{item.team.league.abbreviation}</td>
                                <td>{item.stat.gamesPlayed}</td>
                                {hittingStatKeys.map((key, i) => {
                                    return(
                                        <td key={i}>{item.stat[key.api]}</td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                    <tr>
                        <td className='year'>Career Total</td>
                        <td> - - </td>
                        <td> - - </td>
                        <td>{careerStats.reduce((accumulator, currentItem) => {
                            return accumulator + parseInt(currentItem.stat.gamesPlayed)
                        }, 0)}</td>
                        <td>{careerStats.reduce((accumulator, currentItem) => {
                            return accumulator + parseInt(currentItem.stat.atBats)
                        }, 0)}</td>
                        <td>{careerStats.reduce((accumulator, currentItem) => {
                            return accumulator + parseInt(currentItem.stat.runs)
                        }, 0)}</td>
                        <td>{careerStats.reduce((accumulator, currentItem) => {
                            return accumulator + parseInt(currentItem.stat.hits)
                        }, 0)}</td>
                        <td>{careerStats.reduce((accumulator, currentItem) => {
                            return accumulator + parseInt(currentItem.stat.totalBases)
                        }, 0)}</td>
                        <td>{careerStats.reduce((accumulator, currentItem) => {
                            return accumulator + parseInt(currentItem.stat.doubles)
                        }, 0)}</td>
                        <td>{careerStats.reduce((accumulator, currentItem) => {
                            return accumulator + parseInt(currentItem.stat.triples)
                        }, 0)}</td>
                        <td>{careerStats.reduce((accumulator, currentItem) => {
                            return accumulator + parseInt(currentItem.stat.homeRuns)
                        }, 0)}</td>
                        <td>{careerStats.reduce((accumulator, currentItem) => {
                            return accumulator + parseInt(currentItem.stat.rbi)
                        }, 0)}</td>
                        <td>{careerStats.reduce((accumulator, currentItem) => {
                            return accumulator + parseInt(currentItem.stat.baseOnBalls)
                        }, 0)}</td>
                        <td>{careerStats.reduce((accumulator, currentItem) => {
                            return accumulator + parseInt(currentItem.stat.intentionalWalks)
                        }, 0)}</td>
                        <td>{careerStats.reduce((accumulator, currentItem) => {
                            return accumulator + parseInt(currentItem.stat.strikeOuts)
                        }, 0)}</td>
                        <td>{careerStats.reduce((accumulator, currentItem) => {
                            return accumulator + parseInt(currentItem.stat.caughtStealing)
                        }, 0)}</td>
                        <td>{(careerStats.reduce((accumulator, currentItem) => {
                            return accumulator + parseFloat(currentItem.stat.avg)
                        }, 0)/careerStats.length).toFixed(3).toString().replace(/^0+/, '')}</td>
                        <td>{(careerStats.reduce((accumulator, currentItem) => {
                            return accumulator + parseFloat(currentItem.stat.obp)
                        }, 0)/careerStats.length).toFixed(3).toString().replace(/^0+/, '')}</td>
                        <td>{(careerStats.reduce((accumulator, currentItem) => {
                            return accumulator + parseFloat(currentItem.stat.slg)
                        }, 0)/careerStats.length).toFixed(3).toString().replace(/^0+/, '')}</td>
                        <td>{(careerStats.reduce((accumulator, currentItem) => {
                            return accumulator + parseFloat(currentItem.stat.ops)
                        }, 0)/careerStats.length).toFixed(3).toString().replace(/^0+/, '')}</td>
                        <td>{(careerStats.reduce((accumulator, currentItem) => {
                            return accumulator + parseFloat(currentItem.stat.groundOutsToAirouts)
                        }, 0)/careerStats.length).toFixed(2)}</td>

                    </tr>
                    <tr>
                        <th>Season</th>
                        <th>Team</th>
                        <th>LG</th>
                        <th onClick={() => graphCareerStat('gamesPlayed')}>G</th>
                        {hittingStatKeys.map((item, i) => {
                            return(
                                <th key={i} onClick={() => graphCareerStat(item.api)}><p onMouseOver={toggleDescription} id={item.fullName} onMouseLeave={() => toggleShowDescription(false)}>{item.abbreviation}</p></th>
                                )
                        })}
                    </tr>
                </table>
                :
                <table className='stat-table'>
                    <tr>
                        <th>Season</th>
                        <th>Team</th>
                        <th>LG</th>
                        <th>POS</th>
                        <th>G</th>
                        <th>GS</th>
                        <th>INN</th>
                        <th>TC</th>
                        <th>PO</th>
                        <th>A</th>
                        <th>E</th>
                        <th>DP</th>
                        <th>Fielding %</th>
                    </tr>
                    {careerStats.map((item, i) => {
                        if(item.position){
                        return(
                            <tr key={i}>
                                <td className='year'>{item.season}</td>
                                <td>{item.team.abbreviation}</td>
                                <td>{item.team.league.abbreviation}</td>
                                <td>{item.position.abbreviation}</td>
                                <td>{item.stat.gamesPlayed}</td>
                                <td>{item.stat.gamesStarted}</td>
                                <td>{item.stat.innings}</td>
                                <td>{item.stat.chances}</td>
                                <td>{item.stat.putOuts}</td>
                                <td>{item.stat.assists}</td>
                                <td>{item.stat.errors}</td>
                                <td>{item.stat.doublePlays}</td>
                                <td>{item.stat.fielding}</td>
                            </tr>
                        )
                        }
                    })}

                </table>
            ):
            <div>
                <p>There is no data available for the selected stat type</p>
            </div>
        }
        </div>
        : 
        <div className='stat-table-section'>
            {!error ? 
            <>
            <h2>Game Log</h2>
            {infoMessageBox ? <InfoMessage toggleInfoMessageBox={toggleInfoMessageBox} message={infoMessage}/> : null}
            <table className='stat-table'>
                <tr>
                    <th>Date</th>
                    <th>Team</th>
                    <th>OPP</th>
                    {gameLogKeys.map((item, i) => {
                        return(
                            <th key={i}>{item.abbreviation}</th>
                        )
                    })}
                </tr>
                {gameLogs.map((game, i)  => {
                    const date = game.date.split("-")
                    const betterDate = monthKey[date[1]] + " " + date[2];
                    console.log(date)
                    return(
                        <tr key={i} onClick={() => getStory(game.game.gamePk)} className="live-game">
                            <td>{betterDate}</td>
                            <td className={game.isWin ? "win" : "lose"}>{game.team.abbreviation}</td>
                            <td className={!game.isWin ? "win" : "lose"}>{game.opponent.abbreviation}</td>
                            {gameLogKeys.map((item, i) => {
                                return(
                                    <td key={i}>{game.stat[item.api]}</td>
                                )
                            })}
                        </tr>
                    )
                })}
            </table>
            </>
            :
            <div>
                <p>There is no data available for the selected stat type</p>
            </div>
            }
        </div>
        }
        {showCareerGraph ? 
        <>
        <Bar data={careerGraph}/>
        </>
        :
        null
        }
    </div>
  )
}

export default ChartSingle
