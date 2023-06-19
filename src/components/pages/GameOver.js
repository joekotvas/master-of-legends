import React from 'react'
import '../../css/pages/GameOver.css'
import poseidon from '../../img/poseidon.svg'

function GameOverPage(props) {

    setTimeout(() => {
        document.querySelector('.questions').classList.add('visible')
    }, 1);

    return (
        <div className="wrapper">
            <div className="questions">
                {props.questions}
            </div>
            <p className="score">You scored {props.game.score}/5 correct answers.</p>
            <button className="btn check-answers" onClick={props.resetGame}>Plαy Agαιn</button>
            <img className="poseidon" src={poseidon} alt="Poseidon" />
        </div>
    )
}

export default GameOverPage