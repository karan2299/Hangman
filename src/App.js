import './App.css';
import React, {useEffect, useState} from "react";
import Skeleton from "./componenets/skeleton/skeleton";
import Questions from "./Questions";

const emptySpace = "___";
function App() {
    const [questionObj, setQuestionObj] =useState([])
    const [correctLetters, setCorrectLetters] = useState([])
    const [wrongGuesses, setWrongGuesses] = useState(0)
    const [wrongChars, setWrongChars] =useState([])
    const [gameStatus, setGameStatus] = useState('started')
    const [keyBoard, setKeyBoard] =useState([])
    const [gameOver, setGameOver] =useState(false)
    const pickRandomQuestionObj =(Ques) =>{
       return  Ques[Math.floor(Math.random() * Ques.length)];
    }
    const [timer, setTimer] = useState(59)
    const audio = new Audio('120063914.mp3')
    const bgm = new Audio('Vecna Grandfather ! Bgm ! Theme ! Remix.mp3')
    useEffect(()=>{
        const questObj = pickRandomQuestionObj(Questions)
        setQuestionObj(questObj)
        let result = [];

        for (let i = 65; i < 65 + 26; i++) {
            result.push(String.fromCharCode(i));
        }
        setKeyBoard(result)
        setInterval(()=>{
            setTimer(val => val === 0 ? val : val - 1)
        },1000)
            bgm.pause()


    },[])
 useEffect(()=>{
   if(timer === 0){
  setGameOver(true)
   }
   if(wrongGuesses === 6){
       setGameOver(true)
   }
 },[timer, wrongGuesses])
    const checkAnswer =(key) =>{
        if(questionObj.Answer.split('').includes(key.toLowerCase())){
           const count = questionObj.Answer.split('').reduce((total,x) => (x==key.toLowerCase() ? total+1 : total), 0)
            for(let i=1;i<=count;i++) {
                setCorrectLetters(current => [...current, key.toLowerCase()]);
            }
        }else{
            audio.play().then(r =>{} )
            setWrongChars(current => [...current, key])
            setWrongGuesses(val=> val !==6 ?val+ 1 : val)
        }
    }
    useEffect(()=>{
       if( questionObj && questionObj.Answer&& correctLetters?.length === questionObj.Answer.split('').length) {
           setGameStatus('won')

       }
    },[correctLetters])

    const newGame = () =>{
        setTimer(59)
        setWrongGuesses(0)
        setWrongChars([])
        setGameOver(false)
        setGameStatus('started')
        setCorrectLetters([])
        const questObj = pickRandomQuestionObj(Questions)
        setQuestionObj(questObj)

    }
  return (
    <div className="App">
      <div className="App-body">
          <div className="header d-flex flex-row justify-content-center mt-2"><span>Hangman Do (or) Die</span>
          </div>
          <div className="header d-flex flex-row justify-content-end mt-2 m-3">
              <span style={{
                  fontSize: "19px",
                  color: "#f10000",
                  fontWeight: "600"
              }
              }>Wrong Guesses: {wrongGuesses} /6</span>
          </div>
       <div className="mt-5">
           <Skeleton wrongGuesses={wrongGuesses} time={timer} gameStatus={gameStatus}/>

           <div className="question">
               <span style={{fontSize:"19px"}}>Hint:  {
                  questionObj.hint
               }</span>
           </div>
           { wrongGuesses !==6 && timer !== 0 ?
               <div className="answer">
                   {
                       correctLetters && questionObj?.Answer?.split('').map((space, i) => {
                           return (<h4 key={i}>{correctLetters.includes(space) ? space : emptySpace}</h4>)
                       })
                   }
               </div> : gameStatus !== 'won' || gameStatus !== 'won'&& timer === 0 ?
               <div className="loose">
                   <h2>Game over you lose...</h2>
               </div> :''
           }
           {
               gameStatus === 'won' ?   <div className="won">
                   <h2>Congrats, you won the Game...</h2>
               </div> :''
           }

           { gameStatus !== 'won'  && gameOver === false  ?
               <div className="keyboard key-container">
               {keyBoard.map((char, i) => {
                   return (<button
                       disabled={gameStatus === 'won' || wrongGuesses === 6 || wrongChars.includes(char) || correctLetters.includes(char.toLowerCase()) || timer === 0}
                       type="button" className="btn btn-dark" onClick={() => checkAnswer(char)} key={i}>{char}</button>)
               })}
           </div>
               :
               gameOver === true || gameStatus === 'won' ?
               <div className="reset-game">
                   <button className="btn btn-success" style={{width:"10rem"}} onClick={()=> newGame()}>New game</button>
               </div>
                   :''
           }
       </div>
      </div>
    </div>
  );
}

export default App;
