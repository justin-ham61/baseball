import React from 'react'
import "./index.scss"
import { AnimatePresence, motion } from 'framer-motion'


const InfoMessage = ({message, toggleInfoMessageBox}) => {
const bounceAnimation = {
    y: ["0%", "-5%", "0%"], // Starting position, peak of bounce, and ending position
    transition: {
        duration: 2,  // 1 second for one bounce, adjust as needed
        repeat: Infinity,  // Repeats forever
        ease: "easeInOut"  // Ease in and out for a smooth bounce
    }
    };

    const handleClick = () => {
        toggleInfoMessageBox(false);
    }
  return (
    <AnimatePresence> 
      <motion.div className='info-message-box'
        animate={bounceAnimation}
        exit={{ opacity:0 }}
        >
        <p>{message}</p>
        <button onClick={handleClick}>OK</button>
      </motion.div>
    </AnimatePresence>
  )
}

export default InfoMessage
