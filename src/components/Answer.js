import React from 'react'
import { nanoid } from 'nanoid'
import styles from '../css/components/answer.module.css'

function Answer(props) {
    const a = props.config
    let classList = [styles.answer]

    if ( a.selected ) classList.push( styles.selected )
    if ( props.gameState === 'check' ) {
        classList.push( styles.disabled )
        if ( a.correct )  classList.push( styles.correct  )
        else if ( a.selected ) classList.push( styles.incorrect )
    }

    classList = classList.join(' ')

    return (
        <label 
            key={nanoid()} 
            className={classList}
        >
            {a.answer}
            <input 
                type="radio" 
                value={a.answer}
                id={a.id}
                name={a.id}
                data-question-id={a.questionID}
                className={styles.answerInput}
                checked={a.selected}
                onChange={a.onChange}
                disabled={props.gameState === 'check'}
            />
        </label>
    )
}

export default Answer 