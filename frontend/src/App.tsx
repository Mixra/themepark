// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import './assets/App.css';
import Register from './pages/Register';
//import themeparkBackground from '../images/backPic.jpeg';
import Navbar from './components/Navbar';
import MainPage from './pages/Home';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/test" element={<Navbar/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

