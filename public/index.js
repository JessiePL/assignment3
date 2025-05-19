const matchedDisplay = document.getElementById('matchedPairs');
const clicksDisplay = document.getElementById('clickCount');
const remainingDisplay = document.getElementById('remainingPairs');
const totalPairs = document.getElementById('totalPairs');
const expectedPairs = parseInt(totalPairs.textContent);
let match = 0;
let clicks = 0;
let remaining = expectedPairs;


function setup() {
  let firstCard = undefined;
  let secondCard = undefined;
  let isBusy = false;

  $(".card").on("click", function () {
    if (isBusy || $(this).hasClass("flip")) return;

    clicks++;
    clicksDisplay.textContent = `${clicks}`;

    isBusy = true;
    $(this).addClass("flip").one("transitionend", () => {
      if (!firstCard) {
        firstCard = $(this).find(".front_face")[0];
        isBusy = false;
      } else {
        secondCard = $(this).find(".front_face")[0];
        console.log(firstCard, secondCard);

        if (firstCard.id === secondCard.id) {
          secondCard = undefined;
          isBusy = false;
          return;
        }

        if (firstCard.src === secondCard.src) {
          console.log("match");

          $(`#${firstCard.id}`).parent().off("click");
          $(`#${secondCard.id}`).parent().off("click");

          match++;
          matchedDisplay.textContent = `${match}`;

          remaining--;
          remainingDisplay.textContent = `${remaining}`;

          firstCard = undefined;
          secondCard = undefined;
          isBusy = false;
        } else {
          console.log("no match");

          setTimeout(() => {
            $(`#${firstCard.id}`).parent().removeClass("flip");
            $(`#${secondCard.id}`).parent().removeClass("flip");

            firstCard = undefined;
            secondCard = undefined;
            isBusy = false;
          }, 1050);
        }
      }
    });
  });
}



$(document).ready(setup)

document.addEventListener('DOMContentLoaded', () => {
  cardsShowUp();
  bindStartPopup();
  bindDifficultyButtons();
  setTimeout(()=>{
    setupCountdown();
  }, 1000);
  restartBtn();
  setUpTheme();
});

function bindStartPopup(){
  const startBtn = document.getElementById('startBtn');
  const difficultyModal = new bootstrap.Modal(document.getElementById('difficultyPopup'));

  if(startBtn){
    startBtn.addEventListener('click', () => {
      difficultyModal.show();
    });
  }
};

function bindDifficultyButtons(){
  document.querySelectorAll('.difficulty-option').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const level = btn.dataset.level;
      if(['easy', 'medium','hard'].includes(level)){
        window.location.href=`/play/${level}`;
      }
    })
  })
}

function setupCountdown(){
  const timerText = document.getElementById('timer');
  const remainingTime = document.getElementById('timeLeft');
  const loseRemainingPairs = document.getElementById('unmatched');
  if(!timerText) return;

  let timeLeft = parseInt(timerText.textContent.match(/\d+/)[0]);
  let counter = parseInt(timerText.textContent.match(/\d+/)[0]);

  let countdown = setInterval(()=>{
      timeLeft--;
      timerText.textContent =`Time: ${timeLeft}s`;
      const matchedNumber = parseInt(matchedDisplay.textContent);

      if(timeLeft <=0 )
      {
        clearInterval(countdown);
        let leftTime = counter - timeLeft;
        let remainPairs = parseInt(remainingDisplay.textContent);
        const loseModal = new bootstrap.Modal(document.getElementById('gamelose'));
        remainingTime.textContent=`${leftTime}s`;
        loseRemainingPairs.textContent=`${remainPairs}`;
        loseModal.show();
      }
      else if(matchedNumber===expectedPairs)
        {
          clearInterval(countdown);
          const winModal = new bootstrap.Modal(document.getElementById('gamewin'));
          winModal.show();
        }
      },1000);
}

function restartBtn(){
  const restartBtn = document.getElementById('restartBtn');
  if(restartBtn)
  {
    restartBtn.addEventListener('click', () => {
        window.location.href='/restart';
    })
  }
}

function cardsShowUp(){
    const cards = document.querySelectorAll('.card');
    setTimeout(()=>{
    cards.forEach(card=>{
      $(card).addClass('flip');
    });
    setTimeout(()=>{
      cards.forEach(card=>{
        $(card).removeClass('flip');
      });
    }, 1000);
  },50);
}

function setUpTheme(){
  const lightBtn = document.getElementById('lightTheme');
  const darkBtn= document.getElementById('darkTheme');

  lightBtn.addEventListener('click', ()=>{
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  })

  darkBtn.addEventListener('click', ()=>{
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  })

  const savedTheme = localStorage.getItem('theme');
  if(savedTheme){
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
}