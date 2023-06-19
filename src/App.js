import React from 'react'
import { nanoid } from 'nanoid'
import StartPage from './components/pages/Start'
import PlayPage from './components/pages/Play'
import GameOverPage from './components/pages/GameOver'
import Question from './components/Question'
import './css/App.css'

// HTML Entity Decoder helper function
function decodeHTMLEntities(text) {
  var textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}

function App() {

  // Game State
  const [gameState, setGameState] = React.useState('start')

  // API Data held in state
  const [data, setData] = React.useState([])

  // Question and answer data
  const [questions, setQuestions] = React.useState([])

  // Get questions from API
  React.useEffect(() => {
    const fetchData = async() => {
      try {
        const response = await fetch('https://opentdb.com/api.php?amount=5&category=20&difficulty=easy&type=multiple')
        const apiData = await response.json()
        setData(apiData.results)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  },[])

  React.useEffect(() => {
    getQuestions()
  }, [data])

  // Display quiz page
  function startGame() {
    // Remove animation so transition can be triggered
    document.querySelector('.ring-of-power').classList.remove('animated')
    setGameState('play')
  }
  
  // Display answer page
  function gameOver() {
    console.log('game over')
    setGameState('check')
  }

  // Display start page
  function resetGame() {
    setGameState('start')
    // Restart animation after transition
    setTimeout(() => {
      document.querySelector('.ring-of-power').classList.add('animated')
    }, 500);
    // Get new questions
    getQuestions().then(questions => {
      setQuestions(questions)
    })
  }

  async function getQuestions() {
    if (data.length === 0) return
    console.log('Reloaded questions')

    const newQuestions = []

    // Loop through questions
    for (let i = 0; i < data.length; i++) {
      newQuestions[i] = data[i]
      
      // Decode HTML entities
      newQuestions[i].question = decodeHTMLEntities(data[i].question)

      // Add unique ID to each question
      newQuestions[i].id = nanoid()

      // Set up answers
      newQuestions[i].answers = [ data[i].correct_answer, ...data[i].incorrect_answers ]
        .sort()
        .map(a => {
          return {
            id      : nanoid(),
            answer  : a,
            correct : a === data[i].correct_answer,
            selected: false,
            disabled: false,
            onChange: (e) => { changeAnswer(e) },
          }
        })
    }
    setQuestions(newQuestions)
  }

  function getQuestionElements() {
    const questionElements = questions.map(q => {
      return <Question 
                key       = { q.id       }
                id        = { q.id       }
                gameState = { gameState  }
                question  = { q.question }
                answers   = { q.answers  }
              />
    })
    return questionElements
  }

  // Runs when an answer is selected
  function changeAnswer(e) {
    let newQuestions = []

    // Loop through questions and answers to find the selected answer
    for (let i = 0; i < questions.length; i++) {

      // If the question ID matches the question ID of the selected answer
      if (questions[i].id === e.target.parentNode.parentNode.parentNode.id) {
        console.log('Matched question ID for ', questions[i].question)
        newQuestions.push({
          ...questions[i],
          answers: questions[i].answers.map(a =>
            (a.answer === e.target.value) ? { ...a, selected: true  }
                                          : { ...a, selected: false }
          )
        }) 
      }

      // If the question ID does not match the question ID of the selected answer
      else {
        newQuestions.push({ ...questions[i] })
      }
    } 
    console.log(newQuestions)
    setQuestions(newQuestions)
    console.log(questions)
}

  const questionElements = getQuestionElements()
  
  return (
    <div className={"app " + gameState}>
      <div className="ring-of-power animated"></div>
        <article className={"page " + gameState + "-page"}>
          { gameState === 'start'  && <StartPage    startGame={startGame}      /> }
          { gameState === 'play'   && <PlayPage   checkAnswers={gameOver} questions={questionElements} /> }
          { gameState === 'check'  && <GameOverPage resetGame={resetGame} questions={questionElements} /> }
        </article>
    </div>
  )
}

export default App