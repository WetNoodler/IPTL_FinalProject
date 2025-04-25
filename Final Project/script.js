const text = document.getElementById('text');
let obj1 = "";
let obj2 = "";

const optionsUrl = "https://rps101.pythonanywhere.com/api/v1/objects/all"
const compareUrl = "https://rps101.pythonanywhere.com/api/v1/match";

function rng() {
    return Math.floor(Math.random() * 101);
}

function test() {
    console.clear();
    fetch(optionsUrl)
    .then((res) => res.json())
    .then((data) => {
        obj1 = data[rng()].toLowerCase();
        obj2 = data[rng()].toLowerCase();
        console.log(`${obj1} and ${obj2}`);
        return fetch(`${compareUrl}?object_one=${obj1}&object_two=${obj2}`)
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        text.textContent = `${data.winner} ${data.outcome} ${data.loser}`;
    })
}