import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import List from './components/List';
import Api from './components/Api';

function App() {
    return (
        <div className="app">
            <BrowserRouter>
            <Header />
            <main className="main">
                <Routes>
                    <Route path="/" exact element={<List />} />
                    <Route path="/api" element={<Api />} />
                </Routes>
            </main>
            <Footer />
            </BrowserRouter>

        </div>
    );
}

export default App;
