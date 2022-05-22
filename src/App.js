import { useState, useEffect } from 'react';
import { auth } from "./Firebase";
import { Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import ShoppingListOverview from './components/ShoppingListOverview';
import ShoppingList from './components/ShoppingList';
import Layout from './components/layout/Layout';
import NotFound from './components/NotFound';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      setUser(user);
    })
    document.addEventListener('DOMContentLoaded', () => {
      function openModal($el) {
        $el.classList.add('is-active');
      }
      function closeModal($el) {
        $el.classList.remove('is-active');
      }
      function closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach(($modal) => {
          closeModal($modal);
        });
      }
      (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);
        $trigger.addEventListener('click', () => {
          openModal($target);
        });
      });
      (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');
        $close.addEventListener('click', () => {
          closeModal($target);
        });
      });
      document.addEventListener('keydown', (event) => {
        const e = event || window.event;
        if (e.keyCode === 27) {
          closeAllModals();
        }
      });
    });
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
      </Route>
    </Routes>
  );
}
