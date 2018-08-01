$.getJSON('/home/gender.json',function(result){
    let ctx = document.getElementById('gen');
    new Chart(ctx,{
        type: 'doughnut',
        data: {
            labels: ['Laki','Perempuan'],
            datasets: [{
                label: 'Jumlah',
                data: result,
                backgroundColor: [
                    "rgb(5, 155, 255)",
                    "rgb(255, 99, 132)"
                ]
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
    });
})