import { useState } from 'react';
import './App.css';
import wordList from './wordlist.js';

export default function App() {
  const list = shuffledList();

  return (
    <>
      <h1>{list}</h1>
      <form onSubmit={handleSubmit()}>
        <input type="text" />
      </form>
      <ul>
        <li></li>
      </ul>
    </>
  );
}
function handleSubmit() {

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