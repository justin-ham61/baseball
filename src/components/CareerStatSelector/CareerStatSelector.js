import React from 'react'

const CareerStatSelector = ({statType, setStatType, handleStatCategoryChange, currentStatCategory, type, involvedGameType}) => {
  return (
    <div>
      <div className='stat-selector' >
            <table>
                <tr className='type-selector'>
                    <td className={statType === 'hitting' ? 'type left active' : 'type left'} onClick={() => setStatType('hitting')}>Batting</td>
                    <td className={statType === 'fielding' ? 'type right active' : 'type right'} onClick={() => setStatType('fielding')}>Fielding</td>
                </tr>
            </table>
            <select name="" id="" onChange={handleStatCategoryChange} value={currentStatCategory}>
            {involvedGameType.map(gameType => {
                return(
                    <option key={gameType} value={gameType}>{type[gameType]}</option>
                )
            })}
            </select>
        </div>
    </div>
  )
}

export default CareerStatSelector
