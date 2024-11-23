import './App.css';
import Footer from "./components/layouts/Footer";
import Header from "./components/layouts/Header";
import Home from "./components/layouts/Home";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ProductDetail from './components/product/ProductDetail';
import ProductSearch from './components/product/ProductSearch';  // Make sure to import ProductSearch

function App() {
  return (
    <Router>
      <div className="App">
        <HelmetProvider>
          <Header />
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            theme="dark"
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/search/:keyword" element={<ProductSearch />} /> {/* Fixed this line */}
          </Routes>
          <Footer />
        </HelmetProvider>
      </div>
    </Router>
  );
}

export default App;
