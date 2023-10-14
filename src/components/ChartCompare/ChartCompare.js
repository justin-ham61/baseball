import React, {useState, useEffect} from 'react'
import './index.scss'
import axios from 'axios'
import { ChartsFunc } from '../util/class/ChartsFunc'
import {Chart as ChartJS} from 'chart.js/auto'
import { Line, Scatter } from 'react-chartjs-2'
import ChartLoading from '../ChartLoading/ChartLoading'


const ChartCompare = ({player, setPlayer, setLoading, loading}) => {
    const [playersStatArr, setPlayerStatArr] = useState([])
    const [category, setCategory] = useState("avg");
    const [chartForm, setChartForm] = useState({
        datasets:[
        ]
    })
    const options = {
        scales: {
          x: {
            type: 'category',
            position: 'bottom'
          },
          y: {
            beginAtZero: true,
            min: 0,
          }
        },
        datasets: {
            line:{
                spanGaps: true
            }
        },
      };

    async function fetchYearData(){
        setLoading(true)
        const data = []
        
        await Promise.all(player.map(person => {
          try{
            return new Promise((resolve, reject) => {

              axios.get(`https://statsapi.mlb.com/api/v1/people/${person.id}/stats?stats=gameLog,statSplits,statsSingleSeason&leagueListId=mlb_hist&group=hitting&gameType=R&sitCodes=1,2,3,4,5,6,7,8,9,10,11,12&hydrate=team&season=2023`)
              .then(response => {
                console.log(response.data.stats[0].splits)
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

    useEffect(() => {
        fetchYearData();
    },[player])

    const handleRadioClick = (e) => {
      console.log(e.target.value)
        setCategory(e.target.value)
    }

    useEffect(() => {
        fetchYearData();
    },[category])

    

  return (
    <div className='chart'>
      <div className='chart-header'>
        <div>
          <h2>Player Comparison for 2023 Regular Season</h2>
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
        {loading ? <ChartLoading/> : null}
        {/* <form action="">
            <input type="radio" id='avg' name='stat' onChange={handleRadioClick} checked={category == "avg" ? "checked" : null}/>
            <label htmlFor="avg">AVG</label>
            <input type="radio" id='obp' name='stat' onChange={handleRadioClick} checked={category == "obp" ? "checked" : null}/>
            <label htmlFor="obp">OBP</label>
            <input type="radio" id='ops' name='stat' onChange={handleRadioClick} checked={category == "ops" ? "checked" : null}/>
            <label htmlFor="ops">OPS</label>
            <input type="radio" id='slg' name='stat' onChange={handleRadioClick} checked={category == "slg" ? "checked" : null}/>
            <label htmlFor="slg">SLG</label>
            <input type="radio" id='hr' name='stat' onChange={handleRadioClick} checked={category == "hr" ? "checked" : null}/>
            <label htmlFor="hr">Home Runs</label>
        </form> */}
      <Line data={chartForm} options={options}/>
    </div>
  )
}

export default ChartCompare
