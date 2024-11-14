import { useState, useEffect } from 'react';
import './App.css';
import wordList from './wordlist.js';
import isDictionaryWord from 'check-dictionary-word';

export default function App() {
  const [words, setWords] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [shuffled, setShuffled] = useState([]);
  const [correctLetters, setCorrectLetters] = useState(new Map());

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

  const checkSubset = (parentArray, subsetArray) => {
    const parentMap = countLetters(parentArray);
    const subsetMap = countLetters(subsetArray);
    return Array.from(subsetMap.keys()).every(
      (key) => subsetMap.get(key) <= parentMap.get(key)
    );
  };

  const countLetters = (array) => {
    return array.reduce((map, letter) => {
      map.set(letter, (map.get(letter) || 0) + 1);
      return map;
    }, new Map());
  };

  const submitWord = async () => {
    const inputLetters = inputValue.split('');

    if (checkIfAlreadyGreen(inputLetters)) {
      console.log("Invalid: word uses already green letters");
    } else if (
      checkSubset(shuffled, inputLetters) &&
      await isDictionaryWord(inputValue) &&
      !words.includes(inputValue)
    ) {
      setWords((prevWords) => [...prevWords, inputValue]);
      highlightCorrectLetters(inputLetters);
    } else {
      console.log("Invalid word or word already used");
    }

    setInputValue('');
  };

  const checkIfAlreadyGreen = (inputLetters) => {
    const inputLetterMap = countLetters(inputLetters);
    const correctLetterMap = countLetters(Array.from(correctLetters.keys()));
    return Array.from(inputLetterMap.keys()).some(
      (key) => (correctLetterMap.get(key) || 0) + inputLetterMap.get(key) > countLetters(shuffled).get(key)
    );
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
      <div className="maincolumn">
        <div className="current-word">
          <h2>{inputValue}</h2>
        </div>
        <ul className="letters">{listItems()}</ul>
      </div>
      <ul className="words">
        {words.map((word, index) => (
          <li key={index}>{word}</li>
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
