import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {Alert} from './components/alert/Alert';
import Footer from './components/global/Footer';
import Header from './components/global/Header';
import PageRender from './PageRender';
import { refesh_token } from './redux/actions/authAction';

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(refesh_token())
  }, [dispatch])

  return (
    <div className="container">
      <Router>
        <Alert />
      <Header/> 
        <Routes>
          <Route path="/" caseSensitive={false} element={<PageRender />} />
          <Route path="/:page" caseSensitive={false} element={<PageRender />} />
          <Route path="/:page/:slug" caseSensitive={false} element={<PageRender />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
