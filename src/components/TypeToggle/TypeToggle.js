import React from 'react'
import { useState } from 'react'
import { motion, AnimatePresence} from "framer-motion"
import "./index.scss"


const TypeToggle = ({active, setActive}) => {
    
  return (
    <div className='type-toggle'>
      <div className={active == 'hitter' ? 'left active' : 'left'} onClick={() => setActive('hitter')}>
        <p>Hitters</p>
        {active === 'hitter' ? <motion.div className='animation' layoutId="underline"></motion.div> : null}
        </div>
      <div className={active == 'pitcher' ? 'right active' : 'right'} onClick={() => setActive('pitcher')}>
        <p>Pitchers</p>
        {active === 'pitcher' ? <motion.div className='animation' layoutId="underline"></motion.div> : null}
        </div>
    </div>
  )
}

export default TypeToggle
