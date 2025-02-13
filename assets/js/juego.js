
(() => {

    'use strict'

    // Constantes iniciales del juego
    const specialCards = ['A', 'J', 'Q', 'K'],
          cardTypes    = ['C', 'D', 'H', 'S'];
    
    let deck = [],
        playersScore = [],
        playersNumber = 0,
        turn = 0;
    
    
    // Referencias al HTML
    const requestCardButton     = document.querySelector('#request-card-button'),
          stopGameButton        = document.querySelector('#stop-game-button'),
          newGameButton         = document.querySelector('#new-game-button'),
          parentDecksElement    = document.querySelector('section'); 

    // Función principal para iniciar el juego
    function initilizeGame() {
        turn = 0;
        playersScore = [];
        while (parentDecksElement.firstChild) {
            parentDecksElement.removeChild(parentDecksElement.firstChild);
        }

        askPlayersNumber();
        initializePlayersScore();
        createDeck();
        createVisualDecks();
    
        stopGameButton.disabled = false;
        requestCardButton.disabled = false;
    }

    // Genera un alert que pregunta el número de jugadores que desean entrar al juego
    const askPlayersNumber = () => {
        do {
            playersNumber = prompt('Escribe la cantidad de jugadores que desean jugar') * 1;
            if(isNaN(playersNumber)) {
                alert('Lo diento, valor erronéo. Debes escribir en números la cantidad de personas que desan jugar');
            }
        } while (isNaN(playersNumber));
    }

    // Crea los elementos html necesarios para renerizar las barajas de los jugadores
    const createVisualDecks = () => {
        for(let i = 0; i <= playersNumber; i++) {

            const row     = document.createElement('div');
            const col     = document.createElement('div');
            const h1      = document.createElement('h1');
            const small   = document.createElement('small');
            const deckDiv = document.createElement('div');

            row.classList.add('row');
            row.classList.add('container');
            col.classList.add('col');
            deckDiv.classList.add('div-player-cards');

            if(i === playersNumber) {
                small.innerText = '';
                h1.innerText = 'Computador - ';
            } else {

                small.innerText = i + 1;
                h1.innerText = 'Jugador - '
            }

            h1.append(small);
            col.append(h1);
            col.append(deckDiv);
            row.append(col);
            parentDecksElement.append(row);

        }
        
    }

    // Inicializa el arreglo playersScore para almacenar los puntajes de cada jugador
    const initializePlayersScore = () => {
        for(let i = 0; i <= playersNumber; i++) {
            playersScore[i] = 0; 
        }

    }
    
    // Crea el arreglo de cartas y lo organiza de forma aleatoria (Crea la baraja)
    const createDeck = () => {
        deck = [];
        for(let i = 2; i <= 10; i++) {
            for(let cardType of cardTypes) {
                deck.push(i + cardType);
            }
        }
    
        for(let specialCard of specialCards) {
            for(let cardType of cardTypes) {
                deck.push(specialCard + cardType);
            }
        }

        deck = _.shuffle(deck);
    }
    
    
    // Función devuelve una carta y la remueve de la baraja
    const requestCard = () => deck.pop();
    
    
    // Función que determina el valor númerico de la carta a partir del String obtenido de la baraja.
    const getNumericCardValue = ( card ) => {
    
        let value = card.substring(0, card.length - 1); 
        let numericValue = value * 1;
        
        return !isNaN(numericValue) ? numericValue : value === 'A' ? 11 : 10;
    }

    // Función que se encarga de renderizar las cartas de cada jugador
    const drawCardOnDeck = ( imageCard ) => {
        const visualDecks = document.querySelectorAll('.div-player-cards');
        visualDecks[turn].append(imageCard);
    }

    // Función que se encarga de renderizar el puntaje de cada jugador
    const drawScoreOnDeck = () => {
        const smalls = document.querySelectorAll('small');
        smalls[turn].innerText = playersScore[turn];
    }

    // Función que se encarga de validar el puntaje de cada jugador y evaluar si pierde
    const validateScore = () => {
        if (playersScore[turn] >= 21) {
            playersScore[turn] === 21 ? 
                console.warn('21, Genial') : 
                console.warn('Perdiste, te pasaste de 21');
            
            stopGameButton.disabled = true;
            requestCardButton.disabled = true;
            return true;
        } 
        return false;
    } 

    const validateNextPlayer = () => {
        turn += 1;

        if(turn === playersScore.length - 1) {
            alert('Es el turno del computador');
            computerTurn();
        } else if (turn < playersScore.length - 1) {
            alert(`Es el turno del jugador ${turn + 1}`);
            requestCardButton.disabled = false;
            stopGameButton.disabled = false;
        }
    }
    
    
    // Eventos 
    requestCardButton.addEventListener('click', () => {
        
        let [value, imageCard] = requestCardProcess();
        drawCardOnDeck(imageCard);
        playersScore[turn] += value;
        drawScoreOnDeck();
        let isScoreEqualOrAbove21 = validateScore();

        if(isScoreEqualOrAbove21) setTimeout(() => {
            validateNextPlayer();
        }, 100);
    });
    
    stopGameButton.addEventListener('click', () => {
        requestCardButton.disabled = true;
        stopGameButton.disabled = true;
        validateNextPlayer();
    });
    
    newGameButton.addEventListener('click', () => {
        initilizeGame();
    });
    
    
    // Encapsula el comportamiento común de solicitar carta
    const requestCardProcess = () => {
        let card = requestCard();
        let value = getNumericCardValue(card);
        const imageCard = document.createElement('img');
        imageCard.src = 'assets/img/' + card + '.png';
        imageCard.classList.add('black-jack-card');
        return [value, imageCard];
    }
    
    // Contiene la lógica automática del juego que hace el computador
    const computerTurn = () => {
        
        do {
            let [value, imageCard] = requestCardProcess(); 

            drawCardOnDeck(imageCard);
            playersScore[turn] += value;
            drawScoreOnDeck();
            
            let allPlayersLose = validatePlayersScore();
    
            if(allPlayersLose) {
                alertWinner(allPlayersLose);
                break;
            }
    
        } while (playersScore[turn] <= 21 && 21 > playersScore[turn]);
    
        setTimeout(() => {
            alertWinner(false);
        }, 100); 
    
    }

    const validatePlayersScore = () => {
        let isAnyScore21 = playersScore.includes(21);
        if (isAnyScore21) return false;

        let onlyPreviousScores = [...playersScore];
        onlyPreviousScores.pop();
        

        let losers = 0;
        for(let playerScore of onlyPreviousScores) {
            if(playerScore > 21) {
                losers += 1;
            }
        }

        if (onlyPreviousScores.length === losers) return true;

        return false;
    }
    
    // Contiene la lógica que determina si hay empate o el ganador del juego
    const alertWinner = ( allPlayersLose ) => {
    
        if(allPlayersLose) {
            setTimeout(() => {
                alert('Gana la computadora');
            }, 100);    
            return;
        }

        validateTie();

        // if (isATie) {
        //     alert('empate');
        //     return;
        // }

        
    }

    const validateTie = () => {
        let copyPlayersScore = [...playersScore];

        if(playersScore.includes(21)) {
            let winner1 = playersScore.indexOf(21);
            copyPlayersScore.splice(winner1, 1);
            if(copyPlayersScore.includes(21)) {
                alert('empate')
            } else if (winner1 === playersScore.length - 1) {
                alert('Gana el computador');
            } else {
                alert(`Gana el jugador ${winner1 + 1}`);
            }   
        } /* else if() { */

        // }
    }
})();


