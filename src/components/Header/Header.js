import styled from "styled-components";
import { useContext } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { AuthContext } from "../../context";
import { setAuthToken } from "../../utils";

const HeaderContainer = styled.div`
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  padding: 0 32px;
  background: white;
`;

const Brand = styled.h1`
  margin: 0;
`;
const NavbarList = styled.div`
  display: flex;
  align-items: center;
`;

const Nav = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 64px;
  width: 100px;
  cursor: pointer;
  text-decoration: none;
  color: black;

  ${(props) =>
    props.$active &&
    `
    background: rgba(0, 0, 0, 0.1);
  `}
`;

const NavLogout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 64px;
  width: 100px;
  cursor: pointer;
`;

const HeaderLeftContainer = styled.div`
  display: flex;
  align-items: center;

  ${NavbarList} {
    margin-left: 32px;
  }
`;

export default function Header() {
  const location = useLocation();
  const history = useHistory();
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    setAuthToken("");
    setUser(null);
    if (location.pathname !== "/") {
      history.push("/");
    }
  };

  return (
    <HeaderContainer>
      <HeaderLeftContainer>
        <Brand>My Blog</Brand>
        <NavbarList>
          <Nav to="/" $active={location.pathname === "/"}>
            首頁
          </Nav>
          <Nav
            to="/archives/1"
            $active={location.pathname.includes("archives")}
          >
            文章列表
          </Nav>
          <Nav to="/about" $active={location.pathname === "/about"}>
            關於我
          </Nav>
        </NavbarList>
      </HeaderLeftContainer>
      <NavbarList>
        {!user && (
          <>
            <Nav to="/login" $active={location.pathname === "/login"}>
              登入
            </Nav>
            <Nav to="/register" $active={location.pathname === "/register"}>
              註冊
            </Nav>
          </>
        )}
        {user && (
          <>
            <Nav to="/new-post" $active={location.pathname === "/new-post"}>
              發布文章
            </Nav>
            <NavLogout onClick={handleLogout}>登出</NavLogout>
          </>
        )}
      </NavbarList>
    </HeaderContainer>
  );
}
