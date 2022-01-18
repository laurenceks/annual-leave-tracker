import React, {createContext, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Main from "./components/Main";
import NotAuthorised from "./components/NotAuthorised";
import useInitialise from "./hooks/useInitialise";
import {useLocation} from "react-router-dom";

export const GlobalAppContext = createContext();

function App() {
  const [globalAppContext, setGlobalAppContext] = useState({loginCheckedOnce: false, isLoggedIn: false});
  const currentPath = useLocation().pathname;

  useInitialise(() => {
    fetch("./php/login/checkUserLogin.php", {
      method: "GET",
    }).then((x) => {
      x.json().then((x) => {
        setGlobalAppContext({
          ...globalAppContext,
          loginCheckedOnce: true,
          isLoggedIn: x.isLoggedIn,
          userId: x.user?.userId,
          user: x.user
        });
      })
    });
  });

  return (
      <GlobalAppContext.Provider value={[globalAppContext, setGlobalAppContext]}>
        <div className={"App"}>
          {currentPath === "/verify" || currentPath === "/reVerify" ? <NotAuthorised/> :
              (globalAppContext.loginCheckedOnce && globalAppContext.isLoggedIn) ?
                  < Main/> : globalAppContext.loginCheckedOnce && <NotAuthorised/>}
        </div>
      </GlobalAppContext.Provider>
  )
}

export default App;
