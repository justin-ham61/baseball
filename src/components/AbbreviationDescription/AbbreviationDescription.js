import React from 'react'
import './index.scss'
import { motion } from 'framer-motion'
const AbbreviationDescription = ({descriptionData}) => {
  return (
    <motion.div className='description' style={{ position: 'fixed', top: `${descriptionData.location.top - 40}px`, left: `${descriptionData.location.left -10}px` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1}}
      transition={{
        duration: .4
      }}
      exit={{ opacity: 0}}
    >
      <p>{descriptionData.id}</p>
    </motion.div>
  )
}

export default AbbreviationDescription
