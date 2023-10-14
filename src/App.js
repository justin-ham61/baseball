import logo from './logo.svg';
import './App.css';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Main from './components/Main/Main';
import ChartHero from './components/ChartHero/ChartHero';
function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route exact path="/" element={<Main/>}/>
        <Route exact path="/ChartHero" element={<ChartHero/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
