import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

import ExpensesList from "./pages/ExpensesList";
import ExpensesNew from "./pages/ExpensesNew";
import EmailsList from "./pages/EmailsList";
import EmailsNew from "./pages/EmailsNew";
import CardsList from "./pages/CardsList";
import CardsNew from "./pages/CardsNew";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Gastos */}
        <Route path="/expenses/list" element={<ExpensesList />} />
        <Route path="/expenses/new" element={<ExpensesNew />} />

        {/* Correos */}
        <Route path="/emails/list" element={<EmailsList />} />
        <Route path="/emails/new" element={<EmailsNew />} />

        {/* Tarjetas */}
        <Route path="/cards/list" element={<CardsList />} />
        <Route path="/cards/new" element={<CardsNew />} />
      </Routes>
    </Router>
  );
}

export default App;

