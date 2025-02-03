
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import InitialAssessment from './components/InitialAssessment';
import GEFPT from "./GEFPT";
import Home from "./components/Home";
import SensoryAssessment from "./components/SensoryAssessment";
import KeyboardAssessment from "./components/KeyboardAssessment";
import PhysicalLimitation from './components/PhysicalLimitation';
import styles from './components/App.module.css';
import { CartProvider } from './contexts/CartContext';
import Cart from './components/Cart';

const App = () => {
  return (
    <CartProvider>
      <div className={styles.app}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/initial-assessment" element={<InitialAssessment />} />
          <Route path="/gefpt" element={<GEFPT />} />
          <Route path="/sensory-assessment" element={<SensoryAssessment />} />
          <Route path="/keyboard-assessment" element={<KeyboardAssessment />} />
          <Route path="/physical-limitation" element={<PhysicalLimitation />} />
        </Routes>
      </div>
      <Cart />
    </CartProvider>
  );
};

export default App;
