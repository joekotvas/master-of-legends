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
  const [game, setGame] = React.useState({
    state: 'start',
    score: 0,
  })
  const [questions, setQuestions] = React.useState([])

  function startGame() {
    // Remove animation so transition can be triggered
    document.querySelector('.ring-of-power').classList.remove('animated')
    setGame({
      state: 'play',
      score: 0,
    })
  }
  
  function gameOver() {
    console.log('game over')
    setGame(
      game => ({
        state: 'check',
        score: questions.reduce((acc, q) => {
          return acc + q.answers.filter(a => a.selected && a.correct).length
        }, 0)
    })
    )
  }

  function resetGame() {
    setGame({
      state: 'start',
      score: 0,
    })
    // Restart animation after transition
    setTimeout(() => {
      document.querySelector('.ring-of-power').classList.add('animated')
    }, 500);
    getQuestions()
  }

  const getQuestions = React.useCallback(async () => {
    console.log('getting questions')
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
            questionID: q.id,
            answer  : greekify(decodeHTMLEntities(a)),
            correct : a === q.correct_answer,
            selected: false,
            disabled: false,
            onChange: (e) => { changeAnswer(e) },
          }
        })
    })
    console.log(questions)
    setQuestions(questions)
  }, [setQuestions])
  
  // Get questions from API
  React.useEffect(() => {
    getQuestions()
  },[getQuestions])

  // Runs when an answer is selected
  function changeAnswer(e) {
    setQuestions(questions => questions.map(
      q => {
        if (q.id === e.target.dataset.questionId) {
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

  const questionElements = questions.map(q => {
    return <Question 
              key       = { q.id       }
              id        = { q.id       }
              gameState = { game.state }
              question  = { q.question }
              answers   = { q.answers  }
            />
  })
  
  return (
    <div className={"app " + game.state}>
      <div className="ring-of-power animated"></div>
        <article className={"page " + game.state + "-page"}>
          { game.state === 'start'  && <StartPage    startGame={startGame}      /> }
          { game.state === 'play'   && <PlayPage   checkAnswers={gameOver} questions={questionElements} /> }
          { game.state === 'check'  && <GameOverPage resetGame={resetGame} questions={questionElements} game={game} /> }
        </article>
    </div>
  )
}

export default App