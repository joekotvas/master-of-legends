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

// Replace latin letters with greek equivalents
function greekify(text) {
  return text.replace(/[aeit]/g, match => 'αειτ'['aeit'.indexOf(match)]);
}

function App() {

  // Game State
  const [gameState, setGameState] = React.useState('start')

  // Question and answer data
  const [questions, setQuestions] = React.useState([])

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
    getQuestions()
  }

  const getQuestions = React.useCallback(async () => {
    let questions = []
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=5&category=20&difficulty=easy&type=multiple')
      const data     = await response.json()
      questions      = [ ...data.results ]
    } catch (error) {
      console.log(error)
    }
    questions.forEach(q => {
      q.question = greekify(decodeHTMLEntities(q.question))
      q.id = nanoid()
      q.answers = [ q.correct_answer, ...q.incorrect_answers ]
        .sort()
        .map(a => {
          return {
            id      : nanoid(),
            answer  : greekify(decodeHTMLEntities(a)),
            correct : a === q.correct_answer,
            selected: false,
            disabled: false,
            onChange: (e) => { changeAnswer(e) },
          }
        })
    })
    setQuestions(questions)
  }, [setQuestions])
  
  // Get questions from API
  React.useEffect(() => {
    getQuestions()
  },[getQuestions])

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
    setQuestions(questions => questions.map(
      q => {
        if (q.id === e.target.parentNode.parentNode.parentNode.id) {
          return {
            ...q,
            answers: q.answers.map(a => ({
                ...a, 
                selected: a.answer === e.target.value 
            }))
          }
        }
        else return { ...q }
      })
    )
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