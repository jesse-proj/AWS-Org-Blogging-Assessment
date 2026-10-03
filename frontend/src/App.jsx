import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import BlogSection from './components/BlogSection';
import Footer from './components/Footer';
import SinglePost from './components/SinglePost';
import Login from './components/Login';
import PublishPost from './components/PublishPost';
import EditPost from './components/EditPost';
import ProtectedRoute from './components/ProtectedRoute';
import About from './components/About';
import { AuthProvider } from './context/AuthContext';

function Home() {
  return (
    <div className='app-container'>
      <Hero imageUrl='/home_hero.png' title = 'Blog posts' showEdit={false} showDelete={false} />
      <BlogSection />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route
            path='/publish'
            element={
              <ProtectedRoute>
                <PublishPost />
              </ProtectedRoute>
            }
          />
          <Route
            path='/edit/:id'
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            }
          />
          <Route path='/post/:id' element={<SinglePost />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
