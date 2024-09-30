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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkSubset(shuffled, inputValue.split('')) && isDictionaryWord(inputValue) && !words.includes(inputValue)) {
      setWords((prevWords) => [...prevWords, inputValue]);
      setInputValue('');
    }
  };

  const checkSubset = (parentArray, subsetArray) => {
    return subsetArray.every((element) => parentArray.includes(element));
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <h1>{shuffled.join(' ')}</h1>
      <form onSubmit={handleSubmit}>
        <input 
          value={inputValue} 
          onChange={handleChange} 
          placeholder="Enter a word" 
        />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {words.map((word, index) => <li key={index}>{word}</li>)}
      </ul>
    </>
  );
}

function shuffledList() {
  const randWord1 = wordList[Math.floor(Math.random() * wordList.length)];
  const randWord2 = wordList[Math.floor(Math.random() * wordList.length)];
  
  // Combine the two random words into a single string
  const combinedWords = randWord1 + randWord2;
  
  // Create an array from the combined words
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
