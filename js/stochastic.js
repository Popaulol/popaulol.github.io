let red_probability = 0.75;
let blue_probability = 0.25;
let spinner_representation = null;
let absolute_results_bar = null;
let absolute_results_line = null;
let relative_results_pie = null;
let relative_results_line = null;


function update_spinner_representation() {
    spinner_representation.data.datasets[0].data = [red_probability, blue_probability];
    spinner_representation.update()
}

document.getElementById("red-probability").addEventListener("change", () => {
    red_probability = parseFloat(document.getElementById("red-probability").value);
    blue_probability = 1 - red_probability;
    document.getElementById("blue-probability").value = blue_probability;

    update_spinner_representation();
})

document.getElementById("blue-probability").addEventListener("change", () => {
    blue_probability = parseFloat(document.getElementById("blue-probability").value);
    red_probability = 1 - blue_probability;
    document.getElementById("red-probability").value = red_probability;

    update_spinner_representation();
})

document.getElementById("start-simulation").addEventListener("click", () => {
    let game_number = parseInt(document.getElementById("game-number").value);
    let progress_bar = document.getElementById("progress-bar");

    let absolute_counts = [0, 0, 0, 0];

    progress_bar.setAttribute("style",  "width: 0%");
    progress_bar.setAttribute("aria-valuenow",  "0");

    let f = (n) => {
        if (n === 0) {return}

        let first_roll = Math.random() < blue_probability;
        let second_roll = Math.random() < blue_probability;

        if (!first_roll && !second_roll) {
            absolute_counts[0] += 1;
        } else if (!first_roll && second_roll) {
            absolute_counts[1] += 1;
        } else if (first_roll && !second_roll) {
            absolute_counts[2] += 1;
        } else if (first_roll && second_roll) {
            absolute_counts[3] += 1;
        } else {
            alert("WTF");
        }

        absolute_results_bar.data.datasets[0].data = absolute_counts;
        absolute_results_bar.update();

        absolute_results_line.data.datasets[0].data.push(absolute_counts[0]);
        absolute_results_line.data.datasets[1].data.push(absolute_counts[1]);
        absolute_results_line.data.datasets[2].data.push(absolute_counts[2]);
        absolute_results_line.data.datasets[3].data.push(absolute_counts[3]);
        absolute_results_line.update();
        // console.log(absolute_results_line.data);

        let relative_counts = [
            absolute_counts[0] / game_number,
            absolute_counts[1] / game_number,
            absolute_counts[2] / game_number,
            absolute_counts[3] / game_number,
        ];

        relative_results_pie.data.datasets[0].data = relative_counts;
        relative_results_pie.update();

        relative_results_line.data.datasets[0].data.push(absolute_counts[0]);
        relative_results_line.data.datasets[1].data.push(absolute_counts[1]);
        relative_results_line.data.datasets[2].data.push(absolute_counts[2]);
        relative_results_line.data.datasets[3].data.push(absolute_counts[3]);
        relative_results_line.update();

        let percent_done = ((game_number - n) / game_number) * 100;

        progress_bar.setAttribute("style",  "width: " + percent_done + "%");
        progress_bar.setAttribute("aria-valuenow",  percent_done.toString());

        window.setTimeout(f, 1, n -1 )
    }

    f(game_number);
})


document.addEventListener("DOMContentLoaded", () => {
    let ctx = document.getElementById('spinner-representation');
    spinner_representation = new Chart(ctx, {
        type: 'pie',
        responsive: true,
        data: {
            labels: ['Rot', 'Blau'],
            datasets: [{
                data: [red_probability, blue_probability],
                borderWidth: 1,
                backgroundColor: [
                    'rgb(255,0,0)',
                    'rgb(0, 0, 255)'
                ],
            }]
        },
    });

    ctx = document.getElementById('absolute-results-bar');
    absolute_results_bar = new Chart(ctx, {
        type: 'bar',
        responsive: true,
        data: {
            labels: ['r-r', 'r-b', "b-r", "b-b"],
            datasets: [{
                data: [0, 0, 0, 0],
                borderWidth: 1,
                backgroundColor: [
                    'rgb(255,0,0)',
                    'rgb(255,0,125)',
                    'rgb(125, 0, 255)',
                    'rgb(0, 0, 255)'
                ],
            }]
        },
    });

    ctx = document.getElementById('absolute-results-line');
    absolute_results_line = new Chart(ctx, {
        type: 'line',
        responsive: true,
        data: {
            datasets: [{
                label: 'r-r',
                data: [0],
                borderWidth: 1,
                borderColor: 'rgb(255,0,0)',
            }, {
                label: 'r-b',
                data: [0],
                borderWidth: 1,
                borderColor: 'rgb(255,0, 125)',
            }, {
                label: 'b-r',
                data: [0],
                borderWidth: 1,
                borderColor: 'rgb(125,0,255)',
            }, {
                label: 'b-b',
                data: [0],
                borderWidth: 1,
                borderColor: 'rgb(0,0,255)',
            },

            ]
        },
    });

    ctx = document.getElementById('relative-results-pie');
    relative_results_pie = new Chart(ctx, {
        type: 'pie',
        responsive: true,
        data: {
            labels: ['r-r', 'r-b', 'b-r', 'b-b'],
            datasets: [{
                data: [0, 0, 0, 0],
                borderWidth: 1,
                backgroundColor: [
                    'rgb(255,0,0)',
                    'rgb(255,0,125)',
                    'rgb(125, 0, 255)',
                    'rgb(0, 0, 255)'
                ],
            }]
        },
    });

    ctx = document.getElementById('relative-results-line');
    relative_results_line = new Chart(ctx, {
        type: 'line',
        //responsive: true,
        labels: ['r-r', 'r-b', 'b-r', 'b-b'],
        data: {
            datasets: [{
                label: 'r-r',
                data: [3, 4, 5, 5],
                backgroundColor: 'rgb(255,0,0)',
                borderColor: 'rgb(255,0,0)',
            }/*  , {
                axis: "y",
                label: 'r-b',
                data: [0, 3, 5 ,6 ,3 ,5 ],
                borderWidth: 1,
                borderColor: 'rgb(255,0, 125)',
            }, {
                axis: "y",
                label: 'b-r',
                data: [0, 5, 3 , 5 ,6],
                borderWidth: 1,
                borderColor: 'rgb(125,0,255)',
            }, {
                axis: "y",
                label: 'b-b',
                data: [0, 5345, 44,4,4],
                borderWidth: 1,
                borderColor: 'rgb(0,0,255)',
            },
*/
            ]
        },
    });

    update_spinner_representation();
})
