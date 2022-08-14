import { useState, useEffect } from 'react';
import { auth } from "./Firebase";
import { Routes, Route } from "react-router-dom";
import { doc, setDoc } from 'firebase/firestore';
import { db } from './Firebase';
import Login from "../components/auth/Login";
import ShoppingListOverview from '../components/shoppingListOverview/ShoppingListOverview';
import ShoppingList from '../components/shoppingList/ShoppingList';
import Layout from '../components/layout/Layout';
import NotFound from '../components/NotFound';
import AcceptListInvite from '../components/AcceptListInvite';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('user') !== null) {
      setUser(localStorage.getItem('user'));
    }
    auth.onAuthStateChanged(user => {
      setUser(user);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        if (user.metadata.lastSignInTime === user.metadata.creationTime) {
          // First login
          setDoc(doc(db, "user", user.uid), {
            rooms: []
          });
        }
      } else {
        // Logout
        localStorage.removeItem('user');
      }
    })
  }, [])

  if (!user) {
    return <Login />
  }

  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<ShoppingListOverview user={user} />} />
        <Route path="/list/:id" element={<ShoppingList user={user} />} />
        <Route path="/list/:id/:pw" element={<AcceptListInvite user={user} />} />
      </Route>
    </Routes>
  );
}
