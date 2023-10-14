const { api } = require('./api.js')

const DataExtactor = {
    getAllGamePkOfTeam: async function(teamCode){
            const gamePk = []
            const games = await api.game.getGamesPlayedByTeam(teamCode);
            games.dates.map((game, i) => {
                console.log(game.games[0].gamePk)
                currPk = game.games[0].gamePk;
                gamePk.push(currPk)
            })
            return gamePk;
    },
    getAllActive: function(playerArray){
        let hitterArray = [];
        playerArray.map((player) => {
            if(player.active){
                hitterArray.push(player);
            }
        })
        return hitterArray
    }
}

module.exports = DataExtactor