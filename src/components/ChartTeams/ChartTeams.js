import React,{ useEffect, useState} from 'react'
import axios from 'axios'
import './index.scss'
import { ChartsFunc } from '../util/class/ChartsFunc'
import {Chart as ChartJS} from 'chart.js/auto'
import { Line, Scatter } from 'react-chartjs-2'
import ChartLoading from '../ChartLoading/ChartLoading'
import { teamPlayerStatKeys } from '../util/teamPlayerStatKey'
import { logoObject } from '../images/teamlogo'

const ChartTeams = ({player, setPlayer, setLoading, loading, selectedTeam}) => {

    const [teamPlayersSeasonTable, setTeamPlayersSeasonTable] = useState([]);
    const [teamPlayersSeasonChart, setTeamPlayersSeasonChart] = useState([]);
    const [playerStatArr, setPlayerStatArr] = useState([]);
    const [category, setCategory] = useState("avg");
    const [chartForm, setChartForm] = useState({
        datasets:[
        ]
    })
    const yMaxRange = {
        avg: .4,
        obp: .5,
        ops: 1.1
    }
    const yMinRange = {
        avg: .1,
        obp: .2,
        ops: .5
    }

    const options = {
        scales: {
          x: {
            type: 'category',
            position: 'bottom'
          },
          y: {
            beginAtZero: true,
            max: yMaxRange[category],
            min: yMinRange[category]
          }
        },
        datasets: {
            line:{
                spanGaps: true
            }
        },
      };

    useEffect(() => {
        fetchTeamData();
    },[])

    const fetchTeamData = () => {
        try{
            axios.get(`https://bdfed.stitch.mlbinfra.com/bdfed/stats/player?stitch_env=prod&season=2023&sportId=1&stats=season&group=hitting&gameType=R&limit=25&offset=0&sortStat=homeRuns&order=desc&teamId=${selectedTeam.id}`)
            .then(response => {
                console.log(response.data)
                const chartPlayerArray = []
                const players = response.data.stats
                response.data.stats.map(player => {
                    if(player.gamesPlayed > 100){

                        const person = {
                            id: player.playerId
                        }
                        chartPlayerArray.push(person);
                    }
                })
                setTeamPlayersSeasonChart(chartPlayerArray);
                setTeamPlayersSeasonTable(players)
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchYearData();
    },[teamPlayersSeasonChart, category])

    useEffect(() => {
        fetchTeamData();
    },[selectedTeam])


    async function fetchYearData(){
        setLoading(true)
        const data = []
        
        await Promise.all(teamPlayersSeasonChart.map(person => {
          try{
            return new Promise((resolve, reject) => {
              axios.get(`https://statsapi.mlb.com/api/v1/people/${person.id}/stats?stats=gameLog,statSplits,statsSingleSeason&leagueListId=mlb_hist&group=hitting&gameType=R&sitCodes=1,2,3,4,5,6,7,8,9,10,11,12&hydrate=team&season=2023`)
              .then(response => {
                data.push(response.data.stats[0].splits)
                resolve();
              })
              .catch(err => {
                reject();
              })
            })
            }
            catch{
              console.error("There was an error fetching the data!");
            }
        }))
        setPlayerStatArr(data)
        const dataset = ChartsFunc.buildComparePlayerDataset(data, category)
        setChartForm(dataset)
        console.log(dataset)
        setLoading(false)
    }

    const handleRadioClick = (e) => {
        console.log(e.target.value)
          setCategory(e.target.value)
      }
  return (
    <div className='chart'>
                {loading ? <ChartLoading/> : null}
        <div className='chart-header'>
            <div className='title'>
                <img src={logoObject[selectedTeam.id]} alt="" />
                <h2>{selectedTeam.name}</h2>
            </div>
            <div className='season-selector'>
            <label htmlFor="category-selector">Select Category to Compare: </label>
            <select className='category-selector' onChange={handleRadioClick} value={category}>
                <option value="avg">AVG</option>
                <option value="obp">OBP</option>
                <option value="ops">OPS</option>
                <option value="slg">SLG</option>
                <option value="rbi">RBI</option>
                <option value="homeRuns">Home Runs</option>
                <option value="hits">Hits</option>
                <option value="doubles">Doubles</option>
                <option value="triples">Triples</option>
                <option value="runs">Runs</option>
                <option value="baseOnBalls">Walks</option>
                <option value="intentionalWalks">Intentional Walks</option>
                <option value="atBats">At Bats</option>
                <option value="stolenBases">Stolen Bases</option>
                <option value="strikeOuts">Strike Outs</option>
                <option value="plateAppearances">Plate Appearances</option>
            </select>
            </div>
        </div>
        <Line data={chartForm} options={options}/>
      <div className='stat-table-section'>
        <table className="stat-table">
            <tr>
                <th>Player</th>
                <th>Team</th>
                <th>G</th>
                <th>AB</th>
                <th>R</th>
                <th>H</th>
                <th>2B</th>
                <th>3B</th>
                <th>HR</th>
                <th>RBI</th>
                <th>BB</th>
                <th>SO</th>
                <th>SB</th>
                <th>CS</th>
                <th>AVG</th>
                <th>OBP</th>
                <th>SLG</th>
                <th>OPS</th>
            </tr>
            {teamPlayersSeasonTable.map((player, i) => {
                return(
                    <tr>
                        {teamPlayerStatKeys.map((key, i) => {
                            return(
                                <td>{player[key.api]}</td>
                            )
                        })}
                    </tr>
                )
            })}
        </table>
      </div>
    </div>
  )
}

export default ChartTeams
