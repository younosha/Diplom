import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import "materialize-css";
import { useRoutes } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Routes />
      </UserProvider>
    </AuthProvider>
  );
  }

function Routes() {
  const routes = useRoutes(false);
  return (
    <Router>
      <div className="container">{routes}</div>
    </Router>
  );
}

export default App;
