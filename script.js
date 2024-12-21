const startButton = document.getElementById('start')
const stopButton = document.getElementById('stop')
const resetButton= document.getElementById('restart')
const typingArea = document.getElementById('typing-area')
const textToType = document.getElementById('text-to-type')
const wpmDisplay = document.getElementById('wpm')
const accuracyDisplay = document.getElementById('accuracy')


let timer = null;
let startTime = null;
let timeLimit = 60;
let sampleTexts =[
    "Life is a journey filled with challenges and opportunities. Every step you take, whether small or large, shapes the path ahead. Embrace the lessons learned from failures, as they often lead to greater success. Stay determined, and never underestimate the power of persistence.",
     "Nature offers a serene escape from the noise of daily life. The rustling of leaves, the chirping of birds, and the gentle breeze remind us of the beauty that surrounds us. Taking time to appreciate these moments can bring peace and clarity to our minds.",
    "Technology continues to revolutionize the world at an incredible pace. From artificial intelligence to renewable energy, innovations are transforming industries and improving lives. As we move forward, it’s essential to balance progress with responsibility to create a sustainable future.",
    "Education is the foundation of personal and professional growth. It equips individuals with the knowledge and skills needed to navigate an ever-changing world. Continuous learning, whether through formal education or self-directed efforts, is the key to staying ahead in a competitive environment.",
    "Traveling allows us to explore new cultures, meet diverse people, and gain fresh perspectives. Each destination offers unique experiences that enrich our understanding of the world. Whether it's a bustling city or a quiet countryside, there is always something to learn and appreciate.",
    "The human mind is a powerful tool capable of remarkable creativity and innovation. With focus and determination, even the most complex problems can be solved. Great achievements often begin with small ideas, nurtured by curiosity and the willingness to take risks.",
    "Healthy habits are the cornerstone of a fulfilling life. Regular exercise, a balanced diet, and sufficient rest contribute to physical well-being. Equally important is taking care of mental health through mindfulness, hobbies, and maintaining strong social connections."

];

let currentText= "";
let typingPaused = false;

//initialization of text
function initializeText() {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    currentText = sampleTexts[randomIndex];
    textToType.innerHTML = currentText.split("").map(char => `<span>${char}</span>`).join("");
}

//start typing

function start(){
    initializeText();
    typingArea.value = "";
    typingArea.disabled = false;
    typingArea.focus();
    startButton.disabled = true;
    stopButton.disabled = false;
    typingPaused = false;
    startTime = new Date().getTime();


    let remainingTime = timeLimit;
    document.getElementById('time').textContent = `${remainingTime}s`;

    timer = setInterval(() =>{
        const elapsedTime = Math.floor((new Date().getTime() - startTime)/1000);
        remainingTime = timeLimit - elapsedTime;
        document.getElementById('time').textContent =  `${remainingTime}s`;

        if(remainingTime <= 0){
            end();
        }
    },1000);
}


function update(){
    const typedText = typingArea.value;
    const textSpans = textToType.querySelectorAll('span');
    let correct = 0;
    
    typingPaused = false;


    typedText.split("").forEach((char, index)=>{
        if(index < textSpans.length){
            if(char===currentText[index]){
                textSpans[index].style.color="green";
                textSpans[index].classList.add('correct');
                textSpans[index].classList.remove('incorrect');
                correct++;
            } else {
                textSpans[index].style.color="red";
                textSpans[index].classList.add('correct')
                textSpans[index].classList.remove('incorrect');
                typingPaused = true;
            }
        }
    });


    if (typingPaused) {
        typingArea.disabled = true;

        setTimeout(()=> {
            typingArea.disabled = false;
            typingArea.focus();
        },100);
    }


    const wordsdone = typedText.split(" ").filter(word => word.length > 0).length;
const elapsedTime = Math.floor((new Date().getTime() - startTime)/1000);
    const wpm = Math.round((wordsdone /elapsedTime)*60);


    const accuracy = Math.round((correct /currentText.length)* 100);


    wpmDisplay.textContent = isNaN(wpm) || elapsedTime === 0 ? 0 : wpm;
    accuracyDisplay.textContent = isNaN(accuracy) ? 0 : `${accuracy}%`;


    if (typedText.length >= currentText.length){
        Popup(wpm, accuracy);
        end();
    }
}





function end() {
    clearInterval(timer);
    typingArea.disabled = true;
    startButton.disabled= false;
    stopButton.disabled = true;
    update();
    const wpm= wpmDisplay.textContent;
    const accuracy = accuracyDisplay.textContent;
    Popup(wpm, accuracy);
}

function stop (){
    clearInterval(timer);
    typingArea.disabled = true;
    startButton.disabled= false;
    stopButton.disabled = true;
    update();
    

    const wpm = wpmDisplay.textContent
    const accuracy = accuracyDisplay.textContent
    Popup(wpm, accuracy);
}

function restart(){
start()
}



startButton.addEventListener('click',() =>{
    start();
});

stopButton.addEventListener('click',() => {
    stop();
});

resetButton.addEventListener('click', () =>{
    restart();
});


typingArea.addEventListener('input',() =>{
    if(!startTime){
        startTime();
    }
});

typingArea.addEventListener('input',update);

const restartButton = document.getElementById('restart');



const result = document.getElementById('result');
const closebutton = document.getElementById('close');
const modalwpm = document.getElementById('modal-wpm');
const modalaccuracy = document.getElementById('modal-accuracy');


function Popup (wpm, accuracy){
    result.style.display = 'flex';

    modalaccuracy.textContent =  `${accuracy}`;
    modalwpm.textContent =`${wpm}`;
}

closebutton.addEventListener('click',() =>{
    result.style.display = 'none';

});