const color = {
    0: "red",
    1: "blue",
    2: "orange",
    3: "green",
    4: "pink",
    5: "gray",
    6: "lime",
    7: "yellow",
    8: "cyan",
    9: "purple",
    10: "lavender"
}



export const ChartsFunc = {
    tester: function(){
        console.log('hello')
    },
    buildSinglePlayerDataset: function(data){
        const dataSet = {
            labels: data.map(item => item.date),
            datasets: [{
                label: "Batting Average",
                data: data.map(item => item.stat.avg),
                backgroundColor: "white",
                borderColor: "lightblue",
                borderWidth: 2,
                pointRadius: 0
            },{
                label: "OBP",
                data: data.map(item => item.stat.obp),
                backgroundColor: "white",
                borderColor: "red",
                borderWidth: 2,
                pointRadius: 0
            },{
                label: "OPS",
                data: data.map(item => item.stat.ops),
                backgroundColor: "white",
                borderColor: "orange",
                borderWidth: 2,
                pointRadius: 0
            }],
            options: {
                onClick: (event) => {
                    const points = this.current.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
                    if (points.length) {
                        console.log("hello")
                        const index = points[0].index;
                        //const extraInfo = extraData[index];
                    }
                }
            }
        }
        return dataSet;
    },
    buildComparePlayerDataset: function(dataset, type){
        console.log(type)
        const tally = ['homeRuns', 'hits', 'atBats', 'doubles', 'rbi', 'stolenBases', 'triples','runs','plateAppearances','intentionalWalks','baseOnBalls','strikeOuts']
        
        const returnData = []
        //Creates a the data array that Chartjs requires for each dataset
        //Each data is an array of objects containing x and y value
        for(let i = 0; i < dataset.length; i++){
            const data = [];

            if(tally.indexOf(type) != -1){
                dataset[i].map((game, i) => {
                    let dataPoint = {}
                    if(i == 0){
                        dataPoint.x = "2023-03-28"
                        dataPoint.y = 0 + game.stat[type]
                        data.push(dataPoint)
                    } else if (game.stat[type] > 0){
                        dataPoint.x = game.date
                        dataPoint.y = data[data.length - 1].y + game.stat[type]
                        data.push(dataPoint)
                    }
                })
            } else {
                dataset[i].map(game => {
                    let dataPoint = {
                        x: game.date,
                        y: game.stat[type]
                    }
                    data.push(dataPoint);
                })
            }

            const newDataSet = {
                label: dataset[i][0].player.fullName,
                data: data,
                backgroundColor: "white",
                borderColor: color[i],
                borderWidth: 2,
                pointRadius: 0,
            }
            returnData.push(newDataSet);
        }

        //joins all data points 
        let set = []
        for(let i = 0; i < returnData.length; i++){
            set = [...set, ...returnData[i].data]
        }

        //using the newly created set array, creates a new set and sorts it according to the x value (Date) in this case
        const allXValues = [...new Set(set.map(data => data.x))].sort();

        //Ensure Uniform X-Values
        //Looks through all the x values and returns a new {x: x value, y: null} data point if the corresponding x point does not exist.
        //returns original point if it does exist
        function ensureUniformXValues(dataset, allXValues) {
            return allXValues.map(xValue => {
                const match = dataset.find(data => data.x === xValue);
                return match ? match : { x: xValue, y: null };
            });
        }

        //runs the x value function on all datasets
        for(let i = 0; i < returnData.length; i++){
            returnData[i].data = ensureUniformXValues(returnData[i].data, allXValues);
        }


        const returnChart = {
                datasets: returnData
        }
        console.log(returnChart)
        return returnChart
    },
    buildCareerStatGraph: function(data, category){
        console.log(data)
        let returnChart = {
            datasets: [
                {
                    label: category,
                    data: [],
                    backgroundColor: 'pink',
                    borderWidth: '2',
                    pointRadius: '2'
                },
                /* {
                    label: `% of At Bats`,
                    data: [],
                    backgroundColor: 'lightblue',
                    borderWidth: '2',
                    pointRadius: '2'
                }, */
            ]
        }
        data.map(split => {
            const data = {x: split.season, y: split.stat[category]}
            console.log(split.stat[category], split.stat.atBats)
            const percentage = {x: split.season, y: (split.stat[category]/split.stat['atBats'] * 100)}
            returnChart.datasets[0].data.push(data);
            //returnChart.datasets[1].data.push(percentage);
        })
        console.log(returnChart)
        return returnChart;
    }
}
