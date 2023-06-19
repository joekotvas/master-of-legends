import React from 'react'
import '../../css/pages/Play.css'
import poseidon from '../../img/poseidon.svg'

function PlayPage(props) {

    setTimeout(() => {
        document.querySelector('.questions').classList.add('visible')
    }, 1);

    return (
        <div className="wrapper">
            <div className="questions">
                {props.questions}
            </div>
            <button className="btn check-answers" onClick={props.checkAnswers}>Check answers</button>
            <img className="poseidon" src={poseidon} alt="Poseidon" />
        </div>
    )
}

export default PlayPage