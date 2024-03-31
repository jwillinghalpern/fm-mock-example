import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import fmLogo from './assets/filemaker.png';
import './App.css';
import { Counter } from './components/Counter';

function App() {
  return (
    <>
      <div>
        <span>
          <img src={fmLogo} className="logo react" alt="FileMaker logo" />
        </span>
        <span>
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </span>
        <span>
          <img src={reactLogo} className="logo react" alt="React logo" />
        </span>
      </div>
      <h1>FM + Vite + React</h1>
      <div className="card">
        <Counter />
      </div>
      <ToastContainer theme="colored" autoClose={1000} />
    </>
  );
}

export default App;
