import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './core/Header';
import Matches from './components/Matches';
import Standings from './components/Standings';
import Rankings from './components/Rankings';
import ApiUsageMonitor from './ApiUsageMonitor';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <main>
                    <Routes>
                        <Route path="/score" element={<Matches />} />
                        <Route path="/standings" element={<Standings />} />
                        <Route path="/ranking" element={<Rankings />} />
                        <Route path="/api-usage" element={<ApiUsageMonitor />} />
                        <Route path="/" element={<Matches />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
