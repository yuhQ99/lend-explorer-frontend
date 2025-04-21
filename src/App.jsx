import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout';
import Dashboard from './components/dashboard';
import CoinDetails from './components/coin-details';
import './App.css';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/coin" element={<CoinDetails />} />
        {/* Add more routes here as needed */}
      </Route>
    </Routes>
  );
}

export default App;
