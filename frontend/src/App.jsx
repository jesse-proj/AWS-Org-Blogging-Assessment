import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import BlogSection from './components/BlogSection';
import Footer from './components/Footer';
import SinglePost from './components/SinglePost';

function Home() {
  return (
    <div className='app-container'>
      <Hero />
      <BlogSection />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/post/:id' element={<SinglePost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
