$.getJSON('/home/usia.json',function(result){
    let ctx = document.getElementById('age');
    new Chart(ctx,{
        type: 'bar',
        data: {
            labels: ['0-5','6-11','12-16','17-25','26-35','36-45','46-55','55-65','Diatas 65'],
            datasets: [{
                label: 'Jumlah',
                data: result,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(255, 151, 172, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                    "rgba(255, 205, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(139, 243, 194, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(201, 203, 207, 0.2)"],
                "borderColor":[
                    "rgb(255, 99, 132)",
                    "rgb(255, 151, 172)",
                    "rgb(255, 159, 64)",
                    "rgb(255, 205, 86)",
                    "rgb(75, 192, 192)",
                    "rgb(54, 162, 235)",
                    "rgba(93, 239, 170)",
                    "rgb(153, 102, 255)",
                    "rgb(201, 203, 207)"
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                    gridLines: {
                        offsetGridLines: true
                    }
                }]
            }
        }
    })
});