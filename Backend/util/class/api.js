const { default: axios } = require("axios")



const api = {
    team: {
        getAllConstructor: function(seasonYear){
            return new Promise((resolve, reject) => {
                axios.get(`http://ergast.com/api/f1/${seasonYear}/constructors.json`)
                .then(response => {
                    console.log(response.data.MRData.ConstructorTable.Constructors);
                    resolve(response.data.MRData.ConstructorTable.Constructors);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
            })
        },
        getAllTeams: function(){
            return new Promise((resolve, reject) => {
                axios.get("https://statsapi.mlb.com/api/v1/teams?sportId=1")
                .then(response => {
                    console.log(response.data);
                    resolve(response.data);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
            })
        }
    },
    driver: {
        getAllDrivers: function(seasonYear){
            return new Promise((resolve, reject) => {
                axios.get(`http://ergast.com/api/f1/${seasonYear}/drivers.json`)
                .then(response => {
                    console.log(response.data);
                    resolve(response.data);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
            })
        },
        getAllPlayers: function(){
            return new Promise((resolve, reject) => {
                axios.get(`https://statsapi.mlb.com/api/v1/sports/1/players`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
            })
        }
    },
    race: {
        getLapTime: function(season, round, driverId){
            return new Promise((resolve, reject) => {
                axios.get(`http://ergast.com/api/f1/${season}/${round}/drivers/${driverId}/laps.json?limit=100`)
                .then(response => {
                    console.log(response.data.MRData.RaceTable.Races[0].Laps);
                    resolve (response.data.MRData.RaceTable.Races[0].Laps);
                })
                .catch(err => {
                    console.log(error);
                    reject(error);
                })
            })
        }
    },
    stats: {
        getBoxScore: function(playerId, season){
            return new Promise((resolve, reject) => {
                console.log(playerId)
                const url = `https://statsapi.mlb.com/api/v1/people/${playerId}/stats?stats=gameLog,statSplits,statsSingleSeason&leagueListId=mlb_hist&group=hitting&gameType=R&sitCodes=1,2,3,4,5,6,7,8,9,10,11,12&hydrate=team&season=${season}`
                axios.get(url)
                .then(response => {
                    resolve (response.data.stats[0].splits);
                })
                .catch(err => {
                    console.log(error);
                    reject(error);
                })
            })
        },
        getCareerStats: function(playerId, gameType){
            return new Promise((resolve, reject) => {
                //const url = `https://statsapi.mlb.com/api/v1/people/${playerId}?hydrate=currentTeam,team,stats(type=[yearByYear,yearByYearAdvanced,careerRegularSeason,careerAdvanced,availableStats](team(league)),leagueListId=mlb_hist)&site=en`
                const url = `https://statsapi.mlb.com/api/v1/people/${playerId}/stats?stats=yearByYear,career,yearByYearAdvanced,careerAdvanced&gameType=${gameType}&leagueListId=mlb_hist&group=hitting&hydrate=team(league)&language=en`
                //const url = `https://statsapi.mlb.com/api/v1/people/${playerId}/stats?stats=yearByYear,career,yearByYearAdvanced,careerAdvanced&gameType=R&leagueListId=mlb_hist&group=pitching&hydrate=team(league)&language=en`
                console.log(url)
                axios.get(url)
                .then(response => {
                    console.log(response.data);            
                    //resolve(response.data.people[0].stats[0].splits)
                    resolve(response.data.stats[0].splits)
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
            })
        }
    }
}

module.exports = {
    api
}