import { useState } from 'react';
import './App.css';
import wordList from './wordlist.js';

export default function App() {
  const givenWord = randWord();
  const givenWordTwo = randWord();

  return (
    <>
      <h1>{givenWord} to {givenWordTwo}</h1>
      <form>
        <input type="text" />
      </form>
    </>
  );
}

function randWord() {
  return wordList[Math.floor(Math.random() * wordList.length)];
}
