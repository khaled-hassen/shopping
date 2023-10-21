import React, { useEffect, useState } from "react";
import Layout from "./components/Layout.tsx";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Categories from "./pages/Categories.tsx";
import Subcategories from "./pages/Subcategories.tsx";
import NotFound from "./pages/NotFound.tsx";
import NewSubcategory from "./pages/NewSubcategory.tsx";
import EditSubcategory from "./pages/EditSubcategory.tsx";
import { getToken } from "./utils.ts";
import Login from "./pages/Login.tsx";
import { AuthContext } from "./store/auth.ts";

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getToken());
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
      <Layout>
        {loggedIn ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:id" element={<Subcategories />} />
            <Route path="/subcategory/:id/new" element={<NewSubcategory />} />
            <Route path="/subcategory/:id/edit" element={<EditSubcategory />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/*" element={<Login />} />
          </Routes>
        )}
      </Layout>
    </AuthContext.Provider>
  );
};

export default App;
