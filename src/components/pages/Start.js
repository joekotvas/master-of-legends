import React from 'react'
import mtOlympus from '../../img/mt-olympus.svg'
import '../../css/pages/Start.css'

function StartPage(props) {
    return (
        <div className="wrapper">
            <h1 className="title"><b>Master</b> of Legends</h1>
            <div className="description">
                <p className="description-text">
                    Arε you vεrsεd ιn τhε myτhos of τhε αnciεnτ orαclεs?
                </p>
            </div>
            <button className="btn start-game" onClick={props.startGame}>Sταrτ quιz</button>
            <img className="mt-olympus" src={mtOlympus} alt="hero" />
        </div>
    )
}

export default StartPage