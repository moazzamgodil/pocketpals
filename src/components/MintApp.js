import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect, getErrorMessage, updateAccount } from "../redux/blockchain/blockchainActions";
import { fetchData, saveDataFeedbackLoggedin } from "../redux/data/dataActions";
import * as s from "../styles/globalStyles";
import styled from "styled-components";
import Web3 from "web3";
import LoadingEngine from "./LoadingEngine";
import Truncate from "./Truncate";

export const StyledButton = styled.button`
  display: flex;
  align-items: center;
  padding: 5px 20px;
  border-radius: 20px;
  border: none;
  background: var(--gradient);
  font-weight: 900;
  color: var(--secondary-text);
  font-size: 24px;
  @media (max-width: 767px) {
    font-size: 14px;
  }
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: #3280d3;
  padding: 20px;
  font-weight: bold;
  font-size: 24px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  @media (max-width: 767px) {
    font-size: 16px;
    padding: 10px;
  }
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
  @media (max-width: 767px) {
    padding-top: 0 !important;
  }
  @media (min-width: 768px) and (max-width: 1000px) {
    padding-top: 0 !important;
  }
`;

export const StyledLogo = styled.img`
  width: 60px;
  @media (max-width: 767px) {
    width: 50px;
    margin-bottom: 5px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
  z-index: 999;
`;

export const StyledImg = styled.img`
  position: absolute;
  left: calc(2vw);
  z-index: 998;
  bottom: 0;
  max-width: calc(40vw);
  max-height: 100%;
  @media (max-width: 767px) {
    position: relative;
    max-width: 250px;
    height: auto;
    left: 0;
  }
  @media (min-width: 768px) and (max-width: 1000px) {
    position: relative;
    left: 0;
    max-width: 300px;
    height: auto;
  }
  }
  @media (min-width: 1024px) and (max-width: 1200px) {
    max-width: 250px;
    height: auto;
  }
  transition: width 0.5s;
`;

export const NftDiv = styled.div`
  max-width: 350px;
  width: 100%;
  border: 2px solid #27a6dc;
  border-radius: 15px;
  background: rgba(0,0,0,0.5);
  margin: 0 10px 20px;
  overflow: hidden;
  @media (max-width: 767px) {
    width: auto;
  }
`;

export const NftImg = styled.img`
  width: 100%;
//   height: 100%;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
  font-size: 24px;
  @media (max-width: 767px) {
    font-size: 16px;
  }
`;

export const StyledTopDiv = styled.div`
  width: 100%;
  max-width: 1440px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 40px;
  position: relative;
  border-style: solid;
  border-width: 0 0 1px;
  border-color: #CACED326;
  margin: 0 auto;
  @media (max-width: 767px) {
    flex-direction: column;
    min-height: 80px;
    flex-direction: revert;
    padding: 10px 15px;
  }
`;

export const StyledSocialLink = styled.a`
  margin-left: 20px;
  @media (max-width: 767px) {
    margin: 0 15px;
  }
`;

export const StyledSocialImg = styled.img`
  filter: invert();
  max-width: 60px;
  @media (max-width: 767px) {
    max-width: 40px;
  }
`;

export const StyledBlueText = styled.p`
  color: #27a6dc;
  font-size: 32px;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 15px;
  text-align: center;
  @media (max-width: 767px) {
    font-size: 24px;
    ${({ responsiveBool }) => (responsiveBool ? `
        flex-direction: column;
        height: 120px;
        justify-content: space-between !important;
        padding-bottom: 0 !important;
        ` : '')}
  }
`;

export const StyledWhiteText = styled.h3`
  color: #ffffff;
  font-size: 80px;
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
  @media (max-width: 767px) {
    font-size: 40px;
  }
  `;

export const StyledGoldenText = styled.p`
  color: #b58823;
  font-size: 24px;
  text-transform: uppercase;
  text-align: center;
  @media (max-width: 767px) {
    font-size: 20px;
  }
`;

export const HamburgerMenuParent = styled.span`
  display: none;
  @media (max-width: 767px) {
    display: block;
  }
`;

export const NavStyle = styled.nav`
  color: #ffffff;
  font-size: 20px;
  @media (max-width: 767px) {
    display: ${({ isNavOpen }) => (isNavOpen ? "flex" : "none")};
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    position: absolute;
    top: 80px;
    z-index: 99999;
    background: #1b2339;
    left: 0;
    padding: 15px;
  }
`;

function MintApp() {
    const homepagePath = `${window.location.origin}/paws`;
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const [claimingNft, setClaimingNft] = useState(false);
    const [mintAmount, setMintAmount] = useState(1);
    const [feedback, setFeedback] = useState('');
    const [loggedIn, setloggedIn] = useState(false);
    const [CONFIG, SET_CONFIG] = useState({
        CONTRACT_ADDRESS: "",
        SCAN_LINK: "",
        NETWORK: {
            NAME: "",
            SYMBOL: "",
            ID: 0,
        },
        NFT_NAME: "",
        SYMBOL: "",
        MAX_SUPPLY: 1,
        WEI_COST: 0,
        DISPLAY_COST: 0,
        GAS_LIMIT: 0,
        MARKETPLACE: "",
        MARKETPLACE_LINK: "",
        SHOW_BACKGROUND: true,
        MAX_MINT_AMOUNT: 10
    });

    const claimNFTs = () => {
        let cost = CONFIG.WEI_COST;
        let gasLimit = CONFIG.GAS_LIMIT;
        let totalCostWei = String(cost * mintAmount);
        let totalGasLimit = String(gasLimit * mintAmount);
        console.log("Cost: ", totalCostWei);
        console.log("Gas limit: ", totalGasLimit);
        console.log("Minting in progress...");
        setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
        setClaimingNft(true);
        try {
            let web3 = new Web3(window.ethereum);
            web3.eth.estimateGas({ gas: totalGasLimit }).then((res) => {
                blockchain.smartContract.methods
                    .mint(mintAmount)
                    .send({
                        // gasLimit: String(res),
                        gasLimit: String(totalGasLimit),
                        to: CONFIG.CONTRACT_ADDRESS,
                        from: blockchain.account,
                        value: totalCostWei,
                    })
                    .once("error", async (err) => {

                        var errMsg = await getErrorMessage(err);
                        setFeedback(errMsg);
                        setClaimingNft(false);
                    })
                    .then((receipt) => {
                        console.log(receipt);
                        setFeedback(
                            `Let's Go! The ${CONFIG.NFT_NAME} is yours, now view it at Opensea.io.`
                        );
                        setClaimingNft(false);
                        dispatch(fetchData(blockchain.account));
                    });
                console.log(res)
            });

        } catch (error) {
            console.log(error)
        }
    };

    const disconnectWallet = async () => {
        if (blockchain.provider && blockchain.provider.isWalletConnect) {
            await blockchain.provider.disconnect();
        } else if (blockchain.provider && blockchain.provider.isCoinbaseWallet) {
            await blockchain.provider.close();
        } else {
            blockchain.provider = '';
            setloggedIn(false);
            blockchain.account = "";
        }
        if (blockchain.provider) {
            blockchain.provider.on("disconnect", () => {
                blockchain.provider = '';
                setloggedIn(false);
                blockchain.account = "";
            });
        }
    }

    const switchChain = async () => {
        const networkId = await blockchain.provider.request({
            method: "net_version",
        });
        if (networkId != CONFIG.NETWORK.ID) {
            window.location.reload();
        }
    }
    if (blockchain.provider) {
        blockchain.provider.on("chainChanged", () => {
            switchChain();
        });
        blockchain.provider.on("accountsChanged", (accounts) => {
            if (accounts.length == 0) {
                setFeedback('');
                blockchain.provider = '';
                // setloggedIn(false);
                setloggedIn(false);
                return (dispatch) => {
                    dispatch(updateAccount(""));
                }
            }
        });
    }

    const decrementMintAmount = () => {
        let newMintAmount = mintAmount - 1;
        if (newMintAmount < 1) {
            newMintAmount = 1;
        }
        setMintAmount(newMintAmount);
    };

    const incrementMintAmount = () => {
        let newMintAmount = mintAmount + 1;
        if (newMintAmount > CONFIG.MAX_MINT_AMOUNT) {
            newMintAmount = CONFIG.MAX_MINT_AMOUNT;
        }
        setMintAmount(newMintAmount);
    };

    const getData = () => {
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
            setloggedIn(true);
            dispatch(fetchData(blockchain.account));
        }
    };

    const getConfig = async () => {
        const configResponse = await fetch(`${homepagePath}/config/config.json`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const config = await configResponse.json();
        if (!data.loading && data.maxSupply > 0) {
            config.WEI_COST = Number(data.cost);
            config.DISPLAY_COST = (Number(data.cost) / 10 ** 18);
            config.MAX_MINT_AMOUNT = data.maxMintAmount;
            config.MAX_SUPPLY = data.maxSupply;
        }
        SET_CONFIG(config);
    };

    useEffect(() => {
        getConfig();
    }, [data]);

    useEffect(() => {
        getData();
    }, [blockchain.account]);

    useEffect(() => {
        dispatch(saveDataFeedbackLoggedin({ loggedIn, feedback }));
    }, [loggedIn, feedback]);

    const [activeSlideImg, setActiveSlideImg] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlideImg((prevActiveSlideImg) => prevActiveSlideImg < 7 ? prevActiveSlideImg + 1 : 0);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const SliderNFTs = () => {
        return (
            <div id="sliderNFTsAnimation">
                <StyledImg style={activeSlideImg == 0 ? { display: "block" } : { display: "none" }} src={`${homepagePath}/config/images/0.png`} alt={"slideImage"} />
                <StyledImg style={activeSlideImg == 1 ? { display: "block" } : { display: "none" }} src={`${homepagePath}/config/images/1.png`} alt={"slideImage"} />
                <StyledImg style={activeSlideImg == 2 ? { display: "block" } : { display: "none" }} src={`${homepagePath}/config/images/2.png`} alt={"slideImage"} />
                <StyledImg style={activeSlideImg == 3 ? { display: "block" } : { display: "none" }} src={`${homepagePath}/config/images/3.png`} alt={"slideImage"} />
                <StyledImg style={activeSlideImg == 4 ? { display: "block" } : { display: "none" }} src={`${homepagePath}/config/images/4.png`} alt={"slideImage"} />
                <StyledImg style={activeSlideImg == 5 ? { display: "block" } : { display: "none" }} src={`${homepagePath}/config/images/5.png`} alt={"slideImage"} />
                <StyledImg style={activeSlideImg == 6 ? { display: "block" } : { display: "none" }} src={`${homepagePath}/config/images/6.png`} alt={"slideImage"} />
                <StyledImg style={activeSlideImg == 7 ? { display: "block" } : { display: "none" }} src={`${homepagePath}/config/images/7.png`} alt={"slideImage"} />
            </div>
        );
    }


    return (
        <>

            {data.loading || claimingNft ?
                <>
                    <LoadingEngine
                        type={"Minting"}
                        feedback={data.feedback}
                        loggedIn={data.loggedIn} />
                </>
                :
                null
            }

            {data.loggedIn && blockchain.account ?
                <StyledBlueText responsiveBool={true} style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "40px 0 0", fontSize: "24px" }}>
                    Connected wallet <a style={{ color: "#b58823", margin: "0 15px" }} target={"_blank"} href={`https://rinkeby.etherscan.io/address/${blockchain.account}`}>{Truncate(blockchain.account, 5, true)}</a>
                    <StyledButton
                        style={{ fontSize: "18px" }}
                        onClick={(e) => {
                            e.preventDefault();
                            disconnectWallet();
                        }}
                    >
                        Disconnect Wallet
                    </StyledButton>
                </StyledBlueText>
                : null
            }

            <SliderNFTs />

            <ResponsiveWrapper flex={1} style={{ padding: 24, flex: 1 }}>
                <s.SpacerLarge display={"none"} />
                <s.Container
                    jc={"center"}
                    ai={"center"}
                    style={{
                        backgroundColor: "rgba(0,0,0,0.4)",
                        padding: 30,
                        borderRadius: 24,
                        flex: "initial",
                        margin: "30px",
                        minHeight: "60vh"
                    }}
                    className="maincontainer"
                >
                    <s.TextTitle
                        style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                        }}
                    >
                        {data.totalSupply} / {CONFIG.MAX_SUPPLY}
                    </s.TextTitle>
                    <s.TextDescription
                        style={{
                            textAlign: "center",
                            color: "var(--primary-text)",
                        }}
                    >
                        <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK} style={{ fontSize: 18, wordBreak: "break-all" }}>
                            {Truncate(CONFIG.CONTRACT_ADDRESS, 15)}
                        </StyledLink>
                    </s.TextDescription>
                    <s.SpacerSmall />
                    {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                        <>
                            <s.TextTitle
                                style={{ textAlign: "center", color: "var(--accent-text)" }}
                            >
                                The sale has ended.
                            </s.TextTitle>
                            <s.TextDescription
                                style={{ textAlign: "center", color: "var(--accent-text)" }}
                            >
                                You can still find {CONFIG.NFT_NAME} on
                            </s.TextDescription>
                            <s.SpacerSmall />
                            <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                                {CONFIG.MARKETPLACE}
                            </StyledLink>
                        </>
                    ) : (
                        <>
                            {!data.loggedIn ||
                                blockchain.smartContract === null ? (
                                <s.Container ai={"center"} jc={"center"}>
                                    <s.SpacerSmall />
                                    <div style={{ display: 'flex', flexDirection: 'column', width: "100%", maxWidth: "400px" }}>
                                        {/* Metamask */}
                                        <StyledButton
                                            onClick={(e) => {
                                                e.preventDefault();
                                                dispatch(connect('metamask'));
                                                getData();
                                            }}
                                        >
                                            METAMASK
                                            <img style={{ width: 40, marginLeft: "auto" }} src={`${homepagePath}/config/images/metamask.png`} />
                                        </StyledButton>
                                        {/* Coinbase */}
                                        <StyledButton
                                            style={{ marginTop: '10px' }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                dispatch(connect('coinbase'));
                                                getData();
                                            }}
                                        >
                                            COINBASE
                                            <img style={{ width: 40, marginLeft: "auto" }} src={`${homepagePath}/config/images/coinbase.png`} />
                                        </StyledButton>
                                        {/* WalletConnect */}
                                        <StyledButton
                                            style={{ marginTop: '10px' }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                dispatch(connect('walletconnect'));
                                                getData();
                                            }}
                                        >
                                            WALLETCONNECT
                                            <img style={{ width: 40, marginLeft: "auto" }} src={`${homepagePath}/config/images/walletconnect.png`} />
                                        </StyledButton>
                                    </div>

                                    {blockchain.errorMsg !== "" ? (
                                        <>
                                            <s.SpacerSmall />
                                            <s.TextDescription2
                                                style={{
                                                    textAlign: "center",
                                                    color: "red",
                                                }}
                                            >
                                                {blockchain.errorMsg}
                                            </s.TextDescription2>
                                        </>
                                    ) : null}

                                </s.Container>
                            ) : !data.loading || claimingNft ? (
                                <>
                                    <s.TextDescription
                                        style={{
                                            textAlign: "center",
                                            color: "var(--accent-text)",
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {data.feedback}
                                    </s.TextDescription>
                                    <s.SpacerMedium />
                                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                                        <StyledRoundButton
                                            style={{ lineHeight: 0.4 }}
                                            disabled={claimingNft ? 1 : 0}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                decrementMintAmount();
                                            }}
                                        >
                                            -
                                        </StyledRoundButton>
                                        <s.SpacerMedium />
                                        <s.TextDescription
                                            style={{
                                                textAlign: "center",
                                                color: "var(--accent-text)",
                                            }}
                                        >
                                            {mintAmount}
                                        </s.TextDescription>
                                        <s.SpacerMedium />
                                        <StyledRoundButton
                                            disabled={claimingNft ? 1 : 0}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                incrementMintAmount();
                                            }}
                                        >
                                            +
                                        </StyledRoundButton>
                                    </s.Container>
                                    <s.SpacerSmall />
                                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                                        <StyledButton
                                            disabled={claimingNft ? 1 : 0}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                claimNFTs();
                                                getData();
                                            }}
                                        >
                                            {claimingNft ? "MINTING" : "BUY"}
                                        </StyledButton>
                                    </s.Container>
                                </>
                            ) :
                                <s.TextDescription
                                    style={{
                                        textAlign: "center",
                                        color: "var(--primary-text)",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    Connecting to Wallet
                                </s.TextDescription>}
                            {/* <s.SpacerSmall /> */}
                            <s.TextTitleMintPrice
                                style={{ textAlign: "center", color: "var(--accent-text)", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "2px", marginTop: "20px" }}
                            >
                                MINT PRICE: {CONFIG.DISPLAY_COST}{" "}{CONFIG.NETWORK.SYMBOL}.
                            </s.TextTitleMintPrice>
                            <s.SpacerXSmall />
                            <s.TextDescription2
                                style={{ textAlign: "center", color: "var(--accent-text)", textTransform: "uppercase", fontWeight: "normal" }}
                            >
                                Excluding gas fees.
                            </s.TextDescription2>
                        </>
                    )}
                </s.Container>
            </ResponsiveWrapper>
        </>
    );
}

export default MintApp;
