import { useState, useEffect } from 'react';
import './App.css';
import wordList from './wordlist.js';
import isDictionaryWord from 'check-dictionary-word';

export default function App() {
  const [words, setWords] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [shuffled, setShuffled] = useState([]);
  const [correctLetters, setCorrectLetters] = useState(new Map());
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    setShuffled(shuffledList());
  }, []);

  useEffect(() => {
    const handleKeyPress = async (e) => {
      const key = e.key.toLowerCase();

      if (key.length === 1 && /^[a-zA-Z]$/.test(key)) {
        setInputValue((prev) => prev + key);
      }

      if (key === 'enter') {
        await submitWord();
      }

      if (key === 'backspace') {
        setInputValue((prev) => prev.slice(0, -1));
      }
    };

    window.addEventListener('keydown', handleKeyPress); 

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [inputValue, shuffled]);

function Remove({wordToRemove}) {
  const removeWord = async (word) => {
    setWords((prevWords) => prevWords.filter((w) => w !== word));
    setWordCount((prevCount) => prevCount -1)

    setCorrectLetters((prevCorrectLetters) => {
      const newCorrectLetters = new Map(prevCorrectLetters);
      
      const positionsToRemove = [];
      for (let i = 0; i < word.length; i++) {
          const letter = word[i];
          for (const [position, correctLetter] of prevCorrectLetters.entries()) {
              if (correctLetter === letter) {
                  positionsToRemove.push(position);
                  break;
              }
          }
      }
      positionsToRemove.forEach(position => newCorrectLetters.delete(position));
      
      return newCorrectLetters
    });
  };
  return(
    <button onClick={() => removeWord(wordToRemove)}>Remove</button>
  )
}

  const checkSubset = (parentArray, subsetArray) => {
    const parentMap = countLetters(parentArray);
    const subsetMap = countLetters(subsetArray);
    return Array.from(subsetMap.keys()).every((key) => (subsetMap.get(key) || 0) <= (parentMap.get(key) || 0));
  };

  const countLetters = (array) => {
    return array.reduce((map, letter) => map.set(letter, (map.get(letter) || 0) + 1) && map, new Map());
  };

  const submitWord = async () => {
    const inputLetters = inputValue.split('');

    if (checkIfAlreadyGreen(inputLetters)) {
      console.log("Invalid: word uses already green letters"); 
      setInputValue('');
    } else if (
      checkSubset(shuffled, inputLetters) &&
      await isDictionaryWord(inputValue) &&
      !words.includes(inputValue) 
    ) {
      setWords((prevWords) => [...prevWords, inputValue]);
      highlightCorrectLetters(inputLetters);
      setWordCount(wordCount + 1);
    } else {
      console.log("Invalid word or word already used");
    }

    setInputValue('');
  };

  
  const checkIfAlreadyGreen = (inputLetters) => {
    const correctLetterCounts = new Map();
    for (const letter of correctLetters.values()) {
      correctLetterCounts.set(letter, (correctLetterCounts.get(letter) || 0) + 1);
    }
    
    for(let i = 0; i < inputLetters.length; i++){
      const inputLetter = inputLetters[i];
      if(correctLetterCounts.has(inputLetter)){
        let countInWord = 0;
        for(const l of inputLetters){
          if(l === inputLetter) countInWord++;
        }

        let greenCount = correctLetterCounts.get(inputLetter);
        let shuffledCount = shuffled.filter(l => l === inputLetter).length;
        if(countInWord > (shuffledCount - greenCount)) return true
        }
      }
    return false;
  };

  const highlightCorrectLetters = (wordLetters) => {
    const correct = new Map(correctLetters);
    wordLetters.forEach((letter) => {
      for (let i = 0; i < shuffled.length; i++) {
        if (shuffled[i] === letter && (!correct.has(i) || correct.get(i) !== letter)) {
          correct.set(i, letter);
          break;
        }
      }
    });
    setCorrectLetters(correct);
  };

  const listItems = () => {
    return shuffled.map((letter, index) => (
      <li className={`letter ${correctLetters.has(index) ? 'correct' : ''}`} key={index}>{letter}</li>
    ));
  };

  return (
    <div className="wrapper">
      <div className="popup">asdgh</div>
      <div className="maincolumn">
        <div className="currentword">
          <h2 className="wordinput">{inputValue}</h2>
          <h2 className="wordcount">{wordCount}</h2>
        </div>
        <ul className="letters">{listItems()}</ul>
      </div>
      <ul className="words">
        {words.map((word, index) => (
          <li key={index} className="word-item">
            <span className="word-text">
            {word}
            </span>
            
            <Remove wordToRemove={word}/>
          </li>
        ))}
      </ul>
    </div>
  );
}

function shuffledList() {
  const randWord1 = wordList[Math.floor(Math.random() * wordList.length)];
  const randWord2 = wordList[Math.floor(Math.random() * wordList.length)];
  const randWord3 = wordList[Math.floor(Math.random() * wordList.length)];
  const randWord4 = wordList[Math.floor(Math.random() * wordList.length)];
  
  const combinedWords = randWord1 + randWord2 + randWord3 + randWord4;
  
  const list = combinedWords.split('');

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  return shuffle(list);
}
