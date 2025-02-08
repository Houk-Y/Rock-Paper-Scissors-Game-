const readline = require('readline');

// Initialize readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Promisify readline.question
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Game state using object literals
const gameState = {
    userScore: 0,
    computerScore: 0,
    roundsPlayed: 0
};

// Game choices as a constant
const CHOICES = Object.freeze({
    ROCK: 'rock',
    PAPER: 'paper',
    SCISSORS: 'scissors'
});

// Display menu options
const displayMenu = () => {
    console.log("\nEnter your choice:");
    console.log("1. Rock");
    console.log("2. Paper");
    console.log("3. Scissors");
    console.log("0. Exit");
};

// Get user input with validation
const getUserChoice = async () => {
    try {
        displayMenu();
        const input = await question('Your choice (0-3): ');
        const choice = parseInt(input);

        if (isNaN(choice)) {
            throw new Error("Please enter a valid number");
        }

        if (choice === 0) return null;

        if (choice >= 1 && choice <= 3) {
            return Object.values(CHOICES)[choice - 1];
        }

        throw new Error("Invalid choice");
    } catch (error) {
        console.log(`Error: ${error.message}. Please enter a number between 0 and 3.`);
        return getUserChoice();
    }
};

// Get computer's choice using array destructuring
const getComputerChoice = () => {
    const choices = Object.values(CHOICES);
    return choices[Math.floor(Math.random() * choices.length)];
};

// Determine winner using object literals and arrow function
const determineWinner = (userChoice, computerChoice) => {
    if (userChoice === computerChoice) return "tie";

    const winningCombinations = {
        [CHOICES.ROCK]: CHOICES.SCISSORS,
        [CHOICES.PAPER]: CHOICES.ROCK,
        [CHOICES.SCISSORS]: CHOICES.PAPER
    };

    return winningCombinations[userChoice] === computerChoice ? "user" : "computer";
};

// Display score using template literals
const displayScore = () => {
    console.log(`
Score after ${gameState.roundsPlayed} rounds:
You: ${gameState.userScore}
Computer: ${gameState.computerScore}
`);
};

// Play a single round using async/await
const playRound = async () => {
    try {
        const userChoice = await getUserChoice();
        
        if (userChoice === null) {
            return false;
        }

        const computerChoice = getComputerChoice();

        console.log(`
-----------------------------------------------------------------------------------
Your choice: ${userChoice}
Computer's choice: ${computerChoice}
-----------------------------------------------------------------------------------
`);

        const winner = determineWinner(userChoice, computerChoice);

        switch (winner) {
            case "tie":
                console.log("It's a tie!");
                return true;
            case "user":
                console.log("You win! 🎉");
                gameState.userScore++;
                break;
            case "computer":
                console.log("Computer wins! 🤖");
                gameState.computerScore++;
                break;
        }

        gameState.roundsPlayed++;
        displayScore();
        return true;

    } catch (error) {
        console.error("Round error:", error);
        return false;
    }
};

// Main game loop using async/await
const playGame = async () => {
    console.log("🎮 Welcome to Rock, Paper, Scissors!");
    
    try {
        while (await playRound()) {
            // Continue playing until user exits or error occurs
        }

        if (gameState.roundsPlayed > 0) {
            console.log(`
-----------------------------------------------------------------------------------
🏁 Final Score:
You: ${gameState.userScore}
Computer: ${gameState.computerScore}
Thanks for playing!
-----------------------------------------------------------------------------------
`);
        }
    } catch (error) {
        console.error("Game error:", error);
    } finally {
        rl.close();
    }
};

// Start the game using modern error handling
playGame().catch(error => {
    console.error("Fatal error:", error);
    rl.close();
});