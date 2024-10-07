import { useState, useEffect } from 'react';
import './App.css';
import wordList from './wordlist.js';
import isDictionaryWord from 'check-dictionary-word';

export default function App() {
  const [words, setWords] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [shuffled, setShuffled] = useState([]);

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
    return subsetArray.every((element) => parentArray.includes(element));
  };

  const submitWord = async () => {
    const inputLetters = inputValue.split('');

    if (
      checkSubset(shuffled, inputLetters) &&
      await isDictionaryWord(inputValue) &&
      !words.includes(inputValue)
    ) {
      setWords((prevWords) => [...prevWords, inputValue]);
    } else {
      console.log("Invalid word or word already used");
    }

    setInputValue('');
  };

  const listItems = () => {
    return shuffled.map((letter, index) => (
      <li className="letter" key={index}>{letter}</li>
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
  
  const combinedWords = randWord1 + randWord2;
  
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