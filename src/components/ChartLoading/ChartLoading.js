import React from 'react'
import './index.scss'
import loading from '../images/loading.gif'
const ChartLoading = () => {
  return (
    <div className='loading'>
        <h2>Loading...</h2>
        <img src={loading} alt="" />
    </div>
  )
}

export default ChartLoading
