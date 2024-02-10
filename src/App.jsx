
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewsList from './NewsList';
import Login from './authentication/Login';
import Signup from './authentication/Signup';
import HiddenItems from './HiddenItems';
const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<NewsList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hidden-items" element={<HiddenItems />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;