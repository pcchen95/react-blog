import styled from "styled-components";
import { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  withRouter,
  useLocation,
} from "react-router-dom";
import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import HomePage from "../../pages/HomePage";
import ArchivePage from "../../pages/ArchivePage";
import AboutPage from "../../pages/AboutPage";
import PostPage from "../../pages/Post";
import NewPost from "../../pages/NewPost";
import Header from "../Header";
import { AuthContext } from "../../context";
import { getMe } from "../../WebAPI";
import { getAuthToken } from "../../utils";

const Root = styled.div`
  padding-top: 64px;
`;

function _ScrollToTop(props) {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return props.children;
}
const ScrollToTop = withRouter(_ScrollToTop);

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (getAuthToken()) {
      getMe().then((res) => {
        if (res.ok) {
          setUser(res.data);
        }
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Root>
        <Router>
          <ScrollToTop>
            <Header />
            <Switch>
              <Route exact path="/">
                <HomePage />
              </Route>
              <Route exact path="/archives/:page">
                <ArchivePage />
              </Route>
              <Route exact path="/about">
                <AboutPage />
              </Route>
              <Route exact path="/login">
                <LoginPage />
              </Route>
              <Route exact path="/register">
                <RegisterPage />
              </Route>
              <Route exact path="/posts/:id">
                <PostPage />
              </Route>
              <Route exact path="/new-post">
                <NewPost />
              </Route>
            </Switch>
          </ScrollToTop>
        </Router>
      </Root>
    </AuthContext.Provider>
  );
}
