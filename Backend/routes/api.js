const express = require('express');
const router = express.Router();

const { api } = require('../util/class/api.js')
const  DataExtractor = require('../util/class/DataExtractor.js')

router.get('/person', async(req, res) => {
    const stats = await api.driver.getAllPlayers()
    const hitterArray = DataExtractor.getAllActive(stats.people)
    res.send(hitterArray)
})



router.post('/person/stats', async(req, res) => {
    //stats is an array of every game the player has played in
    //box score can be accessed through [i].stat
    const {player, season} = req.body;
    console.log(player)
    try{
        const stats = await api.stats.getBoxScore(player[0].id, season)
        const resData = [stats]
        res.send(resData)
    } catch (error){
        console.log(error)
        res.status(401).json({ error: "Failed API Call"})
    }
})
router.post('/person/comparestats', async(req, res) => {
    //stats is an array of every game the player has played in
    //box score can be accessed through [i].stat
    const {player, season} = req.body;
    console.log(player)
    const dataSet = []
    await Promise.all(player.map(async (item) => {
        const stats = await api.stats.getBoxScore(item.id, season)
        dataSet.push(stats)
    }))
    console.log(dataSet)
    res.send(dataSet)
})


module.exports = router;