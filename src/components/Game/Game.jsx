import React, {useEffect} from 'react';
import {
    addToHistory, addWinnerToHistory, giveUp,
    setWinner, startNewGame, toggleModalOpener,
    toggleStartGame,
} from '../../reducers/gameReducer/gameActions';
import './Game.scss';
import Board from '../Board/Board';
import RadioSign from '../Board/RadioSign/RadioSign';
import {useGameStore} from '../../context/gameContext';
import {calculateWinner} from '../../utils/calculateWinner';
import StepHistory from './StepHistory/StepHistory';
import PlayerStatus from './PlayerStatus/PlayerStatus';
import {Box, Button} from '@material-ui/core';
import ModalWindow from '../ModalWindow/ModalWindow';
import WinnerHistory from './WinnerHistory/WinnerHistory';


const Game = () => {
    const [state, dispatch] = useGameStore()

    const currentStep = state.history[state.history.length - 1]

    const getSignTurn = () => currentStep.isXTurn ? 'X' : 'O'

    const handleClick = (i) => {
        const squares = [...currentStep.squares]
        squares[i] = getSignTurn()

        dispatch(setWinner(calculateWinner(squares)))
        dispatch(addToHistory(squares))
        dispatch(toggleStartGame(true))
    }

    useEffect(() => {
        if (state.winner) {
            if (state.winner !== 'Draw') {
                dispatch(addWinnerToHistory(new Date()))
            }
            dispatch(toggleStartGame(false))
        }
    }, [state.winner])

    return (
        <Box className="game">
            <WinnerHistory/>

            <Board squares={currentStep.squares} onClick={handleClick}/>

            <Box ml={3}>
                {
                    !state.isGameStarted &&
                    <Button variant='contained'
                            fullWidth
                            onClick={() => dispatch(toggleModalOpener())}
                    >
                        Add players nicknames
                    </Button>
                }
                {
                    state.modalIsOpen && <ModalWindow/>
                }
                {
                    !state.isGameStarted && <RadioSign/>
                }

                <PlayerStatus/>

                <Box mt={2}>
                    {
                        state.isGameStarted && <Button
                            style={{backgroundColor: '#dc6533', color: '#fff'}}
                            variant='contained'
                            fullWidth
                            onClick={() => dispatch(giveUp())}
                        >
                            Give up
                        </Button>
                    }
                </Box>

                <StepHistory/>

                {
                    state.winner && <Box mt={2}>
                        <Button
                            style={{backgroundColor: 'green', color: '#fff'}}
                            fullWidth
                            variant='contained'
                            onClick={() => dispatch(startNewGame())}
                        >
                            Start new Game
                        </Button>
                    </Box>
                }
            </Box>
        </Box>
    )
}

export default Game;
