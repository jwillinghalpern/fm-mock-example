import FMGofer, { GoferParam } from 'fm-gofer';
import { mockScript } from 'fm-mock';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import styles from './Counter.module.css';

// #############################################
// CONSTANTS
// #############################################
// names of scripts in filemaker
const UPDATE_COUNT = 'Update Count';
const GET_INITIAL_COUNT = 'Get Initial Count';

// #############################################
// MOCKS
// #############################################
// mock the fm scripts we will call from the webviewer
if (import.meta.env.DEV) {
  mockScript(GET_INITIAL_COUNT, (rawParam: string) => {
    const { callbackName, promiseID }: GoferParam = JSON.parse(rawParam);
    setTimeout(() => {
      window[callbackName](promiseID, String(17));
    }, 100);
  });

  mockScript(UPDATE_COUNT, (rawParam: string) => {
    const { callbackName, promiseID, parameter }: GoferParam =
      JSON.parse(rawParam);
    console.log('parameter', parameter);

    const isError = Math.random() > 0.8;

    // set timeout to simulate slow-ish fm script
    setTimeout(() => {
      window[callbackName](
        promiseID,
        // FM doesn't _have_ to return a value, but it can,
        // perhaps describing the nature of the error (record lock e.g.)
        JSON.stringify({ result: isError ? 'ERROR' : 'SUCCESS' }),
        isError
      );
    }, 300);
  });
}

// #############################################
// COUNTER COMPONENT
// #############################################
export function Counter() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ tries: 0, successes: 0 });

  // success as percent
  const successRate =
    stats.tries > 0 ? Math.round((stats.successes / stats.tries) * 100) : 100;

  // fetch the initial count from filemaker via useEffect
  useEffect(() => {
    (async () => {
      try {
        const initialCount = await FMGofer.PerformScript(GET_INITIAL_COUNT);
        setCount(Number(initialCount));
        toast.success('Initial count fetched from fm');
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error('Failed to get initial count from fm', { autoClose: 2000 });
      }
    })();
  }, []);

  // Expose functions to FM
  useEffect(() => {
    // this function is so that if the user edits the field in filemaker,
    // we can update the webviewer using an OnObjectModify trigger or similar
    window.fmSetCount = (newCount: string) => setCount(Number(newCount));

    // cleanup fn
    return () => {
      delete window.fmSetCount;
    };
  }, [setCount]);

  async function updateCount(action: 'increment' | 'decrement') {
    const oldCount = count;
    const newCount = action === 'increment' ? count + 1 : count - 1;

    // optimistically set count since it will likely work in fm
    // makes the webviewer UI feel snappier
    setLoading(true);
    setCount(newCount);

    // update record in filemaker, rolling back the update if the fm script fails or times out
    try {
      await FMGofer.PerformScript(UPDATE_COUNT, newCount);
      setStats({ tries: stats.tries + 1, successes: stats.successes + 1 });
      toast.success('Count updated in fm');
    } catch (error) {
      console.error(error);
      setCount(oldCount);
      setStats({ tries: stats.tries + 1, successes: stats.successes });
      toast.error('Failed to update count in fm');
    } finally {
      setLoading(false);
    }
  }

  const textStyle = styles.text + ' ' + (count < 0 ? styles.negative : '');
  const statsStyle =
    styles.stats + ' ' + (successRate < 80 ? styles.negative : styles.positive);

  return (
    <div className={styles.container}>
      <div className={textStyle}>Count: {count}</div>
      <div className={styles.buttonContainer}>
        <button disabled={loading} onClick={() => updateCount('increment')}>
          Increment
        </button>
        <button disabled={loading} onClick={() => updateCount('decrement')}>
          Decrement
        </button>
      </div>
      <div className={statsStyle}>Success Rate: {successRate}%</div>
    </div>
  );
}

// #############################################
// GLOBAL DECLARATION
// #############################################
declare global {
  interface Window {
    fmSetCount?: (newCount: string) => void;
  }
}
