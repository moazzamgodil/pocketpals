import React, { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import * as s from "../styles/globalStyles";
import { StyledTopDiv, StyledLogo, HamburgerMenuParent, NavStyle } from "../components/MintApp";
import { getTotalSupply } from "../redux/blockchain/blockchainActions";
import { useDispatch } from "react-redux";

const isStyleMob = () => {
  if (window.innerWidth < 767) {
      return true;
  } else {
      return false;
  }
};

const linkStyle = {
  color: "#ffffff",
  margin: "0 20px",
  textDecoration: "none",
  fontSize: "15px"
};

const linkStyleButton = {
  padding: "10px 40px",
  backgroundImage: "linear-gradient(180deg, #b13fff 0%, #292bf2 100%)",
  borderRadius: "25px"
};

const hamburgerMenu = {
  borderTop: "2px solid #ffffff",
  width: "30px",
  display: "block",
  marginBottom: "5px"
}

const footerLink = {
  color: "#808080",
  position: !isStyleMob() ? "absolute" : "static",
  bottom: 0,
  paddingBottom: "15px",
  left: "50px",
  fontSize: "14px",
  zIndex: "999"
}

function RouterDom() {

  const homepagePath = `${window.location.origin}/paws`;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTotalSupply());
  }, []);

  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ backgroundColor: "var(--primary)", /*minHeight: "100vh"*/ }}
        imageGradient={`linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${homepagePath}/config/images/bg.jpg)`}
      >
        <div style={{ backgroundColor: "#13101e", width: "100%", margin: "0 auto" }}>
          <StyledTopDiv>

            <a href="#" style={{ zIndex: "999" }}>
              <StyledLogo alt={"logo"} src={`${homepagePath}/config/images/logo.png`} />
            </a>
            <HamburgerMenuParent onClick={() => isNavOpen ? setIsNavOpen(false) : setIsNavOpen(true)}>
              <span style={hamburgerMenu}></span>
              <span style={hamburgerMenu}></span>
              <span style={hamburgerMenu}></span>
            </HamburgerMenuParent>
            <NavStyle isNavOpen={isNavOpen}>
              <a style={linkStyle} className={"navmenulink"} href="https://www.pocketpals.club/">Home</a>
              <a style={linkStyle} className={"navmenulink"} href="https://www.pocketpals.club/tokenomics/">Tokenomics</a>
              <Link style={linkStyle} className={"navmenulink"} to="mint">Mint</Link>
              <Link style={linkStyle} className={"navmenulink"} to="stake">Stake</Link>
              <a style={linkStyle} className={"navmenulink"} href="https://www.pocketpals.club/">Store</a>
              <a style={linkStyle} className={"navmenulink"} href="https://kidthereum.net/">About Kidthereum</a>
              <a style={{ ...linkStyle, ...linkStyleButton }} className={"navmenulinkbtn"} href="https://discord.gg/x3edhA7YdC">Join Discord</a>
            </NavStyle>
          </StyledTopDiv>
        </div>

        <Outlet />

        <p style={footerLink}>Powered By <a style={{color: "#808080", fontSize: "14px", textDecoration: "none"}} target="_blank" rel="noopener noreferrer" href="https://decentracrew.com">DecentraCrew</a></p>

      </s.Container>
    </s.Screen>
  );
}

export default RouterDom;