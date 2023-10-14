export const Func = {
    main: {
        splitData: function(setHitter, setPitcher, players){
            const hitters = [];
            const pitchers = [];
            players.map((player) => {
              if(player.primaryPosition.code != 1){
                hitters.push(player)
              } else {
                pitchers.push(player)
              }
            })
            setHitter(hitters)
            setPitcher(pitchers)
        }
    }
}