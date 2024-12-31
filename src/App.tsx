import React, { KeyboardEvent, useEffect, useState, useRef } from 'react';
import { generate } from 'random-words';

const NUMBER_OF_WORDS = 200;
const SECONDS = 60;

const App = () => {
  const [words, setWords] = useState<string[]>([]);
  const [countDown, setCountDown] = useState(SECONDS);
  const [currentInput, setCurrentInput] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(-1);
  const [currentChar, setCurrentChar] = useState('');
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [status, setStatus] = useState("waiting");

  const textInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setWords(generateWords());
  }, []);

  useEffect(() => {
    if (status === 'started') {
      textInput.current?.focus();
    }
  }, [status]);

  const generateWords = (): string[] => {
    return generate(NUMBER_OF_WORDS) as string[];
  };

  const start = () => {
    if (status === 'finished') {
      setWords(generateWords());
      setCurrentWordIndex(0);
      setCorrect(0);
      setIncorrect(0);
      setCurrentCharIndex(-1);
      setCurrentChar('');
    }

    if (status !== 'started') {
      setStatus('started');
      const interval = setInterval(() => {
        setCountDown((prevCountDown: number) => {
          if (prevCountDown === 0) {
            clearInterval(interval);
            setStatus('finished');
            setCurrentInput('');
            return SECONDS;
          } else {
            return prevCountDown - 1;
          }
        });
      }, 1000);
    }
  };

  const handleKeyDown = ({ key }: KeyboardEvent<HTMLInputElement>) => {
    console.log('...');
    if (key === ' ') {
      checkMatch();
      setCurrentInput('');
      setCurrentWordIndex(currentWordIndex + 1);
      setCurrentCharIndex(-1);
    } else if (key === 'Backspace') {
      setCurrentCharIndex(currentCharIndex - 1);
      setCurrentChar('');
    } else {
      setCurrentCharIndex(currentCharIndex + 1);
      setCurrentChar(key);
    }
  };

  const checkMatch = () => {
    const wordToCompare = words[currentWordIndex];
    const isMatch = wordToCompare === currentInput.trim();
    if (isMatch) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1);
    }
  };

  const getCharClass = (wordIdx: number, charIdx: number, char: string) => {
    if (wordIdx === currentWordIndex && charIdx === currentCharIndex && currentChar && status !== 'finished') {
      if (char === currentChar) {
        return 'has-background-success';
      } else {
        return 'has-background-danger';
      }
    } else if (wordIdx === currentCharIndex && currentCharIndex >= words[currentCharIndex].length) {
      return 'has-background-danger';
    } else {
      return '';
    }
  };

  return (
    <div>
      <div className="section">
        <div className="is-size-1 has-text-centered has-text-primary">
          <h2>{countDown}</h2>
        </div>
      </div>
      <div className="control is-expanded section">
        <input ref={textInput} disabled={status !== "started"} type="text" className='input' onKeyDown={handleKeyDown} value={currentInput} onChange={(e) => setCurrentInput(e.target.value)} />
      </div>
      <div className="section">
        <button className="button is-info is-fullwidth" onClick={start}>
          Start
        </button>
      </div>

      {status === 'started' && (
        <div className='section'>
          <div className="card">
            <div className="card-content">
              <div className="content">
                {words.map((word, wordIdx) => (
                  <React.Fragment key={wordIdx}>
                    <span>
                      {word.split("").map((char, charIdx) => (
                        <span className={getCharClass(wordIdx, charIdx, char)} key={charIdx}>{char}</span>
                      ))}
                    </span>
                    <span> </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {status === 'finished' && (
        <div className="section">
          <div className="columns">
            <div className="column has-text-centered">
              <p className="is-size-5">Words per minute:</p>
              <p className="has-text-primary is-size-1">
                {correct}
              </p>
            </div>
            <div className="column has-text-centered">
              <div className="is-size-5">Accurarcy:</div>
              {correct !== 0 ? (
                <p className="has-text-info is-size-1">
                  {Math.round((correct / (correct + incorrect)) * 100)} %
                </p>
              ) : (
                <p className="has-text-info is-size-1">0%</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
