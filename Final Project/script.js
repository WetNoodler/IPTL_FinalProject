const fortuneDiv = document.getElementById("containFortune");
const answerDiv = document.getElementById("isCorrect");
const scoreDiv = document.getElementById("score");
const triviaDiv =  document.getElementById("containTrivia");
let score = 0;
let bonusEffect = 0;
let diff = "easy";
let category = "";
let category_val = 0;

function decode(str){
    const doc = new DOMParser().parseFromString(str, "text/html");
    return doc.documentElement.textContent;
}

function run() {
    triviaDiv.innerHTML = '';
    console.clear();
    tarot();
}

function tarot() {
    fetch('https://tarotapi.dev/api/v1/cards')
    .then((res) => res.json())
    .then((data) => {
        const cards = data.cards;
        const cardLength = function() {
            let x = 0;
            do {
                x = Math.floor(Math.random() * cards.length);
            } while (x <= 21);
            return x;
        }
        const card = cards[cardLength()];

        console.log(cards);
        console.log(card);
        let color = "";

        const isUp = Math.random() > 0.5
        const upText = isUp ? "Upright" : "Reversed";
        const upMeaning = isUp ? card.meaning_up : card.meaning_rev;

        if ((!isUp && card.value_int === 1) || (isUp && (card.value_int === 1 || card.value_int >= 9))) {
            diff = "easy";
            bonusEffect = 0;
            color = 'lime';
        } else if (isUp && (card.value_int >= 4 && card.value_int <= 8)) {
            diff = "medium";
            bonusEffect = 1;
            color = 'yellow';
        } else {
            diff = "hard";
            bonusEffect = 2;
            color = 'red'
        }

        switch (card.suit) {
            case "cups":
                category = "film"; 
                category_val = 11;
                break;
            case "pentacles":
                category = "history"; 
                category_val = 23;
                break;
            case "swords":
                category = "computer"; 
                category_val = 18;
                break;
            case "wands":
                category = "video games"; 
                category_val = 15;
                break;
        }
        category = String(category).charAt(0).toUpperCase() + String(category).slice(1);
        console.log(`${upText}\n${diff.toUpperCase()}\n${upMeaning}\nCategory: ${category}`);
        
        document.getElementById('card').classList.add("card");
        fortuneDiv.innerHTML = `
            <h2>${card.name} - <span style="color:${color};">${upText}</span></h2>
            <p><b>Trivia Difficulty:</b> <span style="color:${color};">${diff.toUpperCase()}</span></p>
            <p><i>${upMeaning}</i></p>
        `;
        trivia();
    })
    .catch((err) => {
        console.log(err)
    })
}

function trivia() {
    fetch(`https://opentdb.com/api.php?amount=1&category=${category_val}&difficulty=${diff}`)
    .then((res) => res.json())
    .then((data) => {
        console.log(data.results[0]);
        const triviaData = data.results[0];
        const triviaQ = decode(triviaData.question);
        const rightAns = decode(triviaData.correct_answer);
        const wrongAns = triviaData.incorrect_answers.map(decode);
        const allAns = [...wrongAns, rightAns].sort(() => Math.random() - 0.5);

        scoreDiv.innerHTML = `Score: ${score}`;
        triviaDiv.innerHTML = `<h3>${triviaQ}</h3>`;

        allAns.forEach(ans => {
            let btn = document.createElement("button");
            btn.innerHTML = ans;
            btn.onclick = () => checkAns(ans, rightAns);
            triviaDiv.appendChild(btn);
        });
    })
}

function checkAns(ans, correct) {
    let outcome = ``;
    let color = "";
    if (ans === correct){
        outcome = `Correct!`;
        color = 'lime';
        score += 1+bonusEffect;
    } else {
        outcome = `Wrong! The answer is <b>${correct}</b>`;
        color = 'red';
        score = (diff == "easy") ? score-1 : score;
    }

    scoreDiv.innerHTML = `Score: <b style="color:${color};">${score}</b>`;
    answerDiv.textContent = decode(outcome);
    setTimeout(() => {
        answerDiv.textContent = "";
        triviaDiv.textContent = "";
        setTimeout(() => {
            trivia();
        }, 1500);
    }, 1500);
}