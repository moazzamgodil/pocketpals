import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as s from "../styles/globalStyles";
import { StyledGoldenText, StyledBlueText, NftImg, NftDiv, StyledButton, StyledImg, ResponsiveWrapper } from "./MintApp";
import LoadingEngine from "./LoadingEngine";
import Truncate from "./Truncate";
import Modal from "./Modal";
import { fetchData, saveDataFeedbackLoggedin } from "../redux/data/dataActions";
import { connect, getErrorMessage, updateAccount } from "../redux/blockchain/blockchainActions";



function StakeApp() {
    const homepagePath = `${window.location.origin}/paws`;
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const [feedback, setFeedback] = useState('');
    const [loggedIn, setloggedIn] = useState(false);
    const [nftObj, setnftObj] = useState([{}]);
    const [modalActive, setModalActive] = useState(false);
    const [nftStakeDetail, setNftStakeDetail] = useState({ image: "", name: "", id: 0 });
    const [contractAddress, setContractAddress] = useState("");

    useEffect(() => {
        getContractAddress();
    }, []);

    useEffect(() => {
        getNFTs();
    }, [data.nfts]);

    useEffect(() => {
        dispatch(saveDataFeedbackLoggedin({ loggedIn, feedback }));
    }, [loggedIn, feedback]);

    const getData = () => {
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
            // setloggedIn(true);
            setloggedIn(true);
            dispatch(fetchData(blockchain.account));
        }
    };

    useEffect(() => {
        getData();
    }, [blockchain.account]);

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

    const getNFTs = async () => {
        let nftObj = [];
        const nfts = await data.nfts;
        if (nfts.length > 0) {
            let i;
            for (i = 0; i < nfts.length; i++) {

                let nftId = nfts[i].tokenId;
                let tjson = nfts[i].tokenURIJson;
                const nftResponse = await fetch(`https://mygateway.mypinata.cloud/ipfs/${tjson}`, {
                    headers: {
                        Accept: "application/json",
                    },
                });
                const nft = await nftResponse.json();

                const nftImg = `https://mygateway.mypinata.cloud/ipfs/${nft.image.substring(7, nft.image.length)}`;
                nftObj[i] = { image: nftImg, name: nft.name, id: nftId };
            }
        }
        setnftObj(nftObj);
    }

    const getContractAddress = async () => {
        const configResponse = await fetch(`${homepagePath}/config/config.json`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const CONFIG = await configResponse.json();
        setContractAddress(CONFIG.STAKE_CONTRACT_ADDRESS);
    }


    const [activeSlideImg, setActiveSlideImg] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlideImg((prevActiveSlideImg) => prevActiveSlideImg < 7 ? prevActiveSlideImg + 1 : 0);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const SliderNFTs = ({ align }) => {
        const sliderDisplay = align == "center" ? {
            left: 0, right: 0, margin: "auto", position: "relative"
        } : null

        return (
            <div id="sliderNFTsAnimation">
                <StyledImg style={activeSlideImg == 0 ? { ...sliderDisplay, display: "block" } : { ...sliderDisplay, display: "none" }} src={`${homepagePath}/config/images/0.png`} alt={"slideImage"} />
                <StyledImg style={activeSlideImg == 1 ? { ...sliderDisplay, display: "block" } : { ...sliderDisplay, display: "none" }} src={`${homepagePath}/config/images/1.png`} alt={"slideImage"} />
                <StyledImg style={activeSlideImg == 2 ? { ...sliderDisplay, display: "block" } : { ...sliderDisplay, display: "none" }} src={`${homepagePath}/config/images/2.png`} alt={"slideImage"} />
                <StyledImg style={activeSlideImg == 3 ? { ...sliderDisplay, display: "block" } : { ...sliderDisplay, display: "none" }} src={`${homepagePath}/config/images/3.png`} alt={"slideImage"} />
                <StyledImg style={activeSlideImg == 4 ? { ...sliderDisplay, display: "block" } : { ...sliderDisplay, display: "none" }} src={`${homepagePath}/config/images/4.png`} alt={"slideImage"} />
                <StyledImg style={activeSlideImg == 5 ? { ...sliderDisplay, display: "block" } : { ...sliderDisplay, display: "none" }} src={`${homepagePath}/config/images/5.png`} alt={"slideImage"} />
                <StyledImg style={activeSlideImg == 6 ? { ...sliderDisplay, display: "block" } : { ...sliderDisplay, display: "none" }} src={`${homepagePath}/config/images/6.png`} alt={"slideImage"} />
                <StyledImg style={activeSlideImg == 7 ? { ...sliderDisplay, display: "block" } : { ...sliderDisplay, display: "none" }} src={`${homepagePath}/config/images/7.png`} alt={"slideImage"} />
            </div>
        );
    }

    return (
        <>
            {data.loading ?
                <>
                    <LoadingEngine
                        type={"Staking"}
                        feedback={data.feedback}
                        loggedIn={data.loggedIn}
                    />
                </>
                :
                null
            }

            {modalActive ?
                <>
                    <Modal
                        nft={nftStakeDetail}
                        closeFunc={setModalActive}
                        data={data}
                        blockchain={blockchain}
                        contractAddress={contractAddress}
                    />
                    {document.querySelector("body").style.overflow = "hidden"}</>
                : document.querySelector("body").style.overflow = ""
            }

            {!data.loggedIn || blockchain.smartContract === null ?
                <>
                    <SliderNFTs align={""} />
                    <ResponsiveWrapper flex={1} style={{ padding: 24, flex: 1 }}>

                        <s.Container
                            jc={"center"}
                            ai={"center"}
                            style={{
                                backgroundColor: "rgba(0,0,0,0.4)",
                                padding: 30,
                                borderRadius: 24,
                                flex: "initial",
                                margin: "30px",
                                height: "60vh"
                            }}
                            className="maincontainer"
                        >
                            <s.SpacerSmall />
                            <s.Container ai={"center"} jc={"center"}>
                                <StyledBlueText>Connect your account to see your NFTs</StyledBlueText>
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
                        </s.Container>
                    </ResponsiveWrapper>
                </>
                :
                <s.Container ai={"center"} flex={"1"} style={{ marginTop: "50px" }}>
                    <StyledBlueText responsiveBool={true} style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: "40px", fontSize: "24px" }}>
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
                    {data.loading && data.loggedIn ? (<><StyledGoldenText>Loading your NFTs</StyledGoldenText><img src={`${homepagePath}/config/images/loader.gif`} alt="" /></>)
                        : (
                            data.balanceOf > 0 || nftObj.length > 0 ? (
                                <>
                                    <br />
                                    <div style={{ display: "flex", flexWrap: "wrap", padding: "20px" }}>
                                        {
                                            nftObj.map((nft, i) => (
                                                <div key={i}>
                                                    {nft.image ? (
                                                        <NftDiv>
                                                            <NftImg src={nft.image} />
                                                            <div style={{ padding: "15px" }}>
                                                                <h3 style={{ color: "#ffffff", fontSize: "20px", marginBottom: "15px" }}>{nft.name}</h3>
                                                                <StyledButton style={{ width: "100%", borderRadius: "10px", justifyContent: "center" }}
                                                                    onClick={() => { setModalActive(true); setNftStakeDetail({ image: nft.image, name: nft.name, id: nft.id }) }}>
                                                                    View
                                                                </StyledButton>
                                                            </div>
                                                        </NftDiv>
                                                    ) : (<><StyledGoldenText>Loading your NFTs</StyledGoldenText><img src={`${homepagePath}/config/images/loader.gif`} alt="" /></>)}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </>
                            ) : (
                                <>
                                    <StyledBlueText>No NFT found</StyledBlueText>
                                    <SliderNFTs align={"center"} />
                                </>
                            )
                        )}
                </s.Container>
            }

        </>
    );
}

export default StakeApp;
