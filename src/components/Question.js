import React from 'react'
import styles from '../css/components/question.module.css'
import Answer from './Answer'

function Question(props) {

    const answerElements = props.answers.map(a => {
        return <Answer key={a.id} config={a} gameState={props.gameState} />
    })

    return (
        <div className={styles.container} id={props.id}>
            <h2 className={styles.title}>{props.question}</h2>
            <div className={styles.answers}>
                {answerElements}
            </div>
        </div>
    )
}

export default Question