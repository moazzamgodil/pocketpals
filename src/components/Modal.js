import React, { useState, useEffect } from "react";
import { getErrorMessage } from "../redux/blockchain/blockchainActions";

const isStyleMob = () => {
    if (window.innerWidth < 767) {
        return true;
    } else {
        return false;
    }
};

const divParent = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.8)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9998
}

const divStyle = {
    backgroundColor: "#ffffff",
    width: !isStyleMob() ? "calc(100vw - 50%)" : "90%",
    boxShadow: "0 0 10px rgba(0,0,0,1)",
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
    paddingBottom: isStyleMob() ? "40px" : "20px",
    position: "relative",
    flexDirection: !isStyleMob() ? "row" : "column",
    height: isStyleMob() ? "90%" : null,
    overflowX: isStyleMob() ? "hidden" : null,
    overflowY: isStyleMob() ? "scroll" : null
}

const closeBtn = {
    position: !isStyleMob() ? "absolute" : "fixed",
    bottom: !isStyleMob() ? "-44px" : "0",
    left: "0",
    right: "0",
    margin: "auto",
    fontSize: "24px",
    width: !isStyleMob() ? "100%" : "90%",
    textAlign: "center",
    padding: "10px 20px",
    backgroundColor: "#ff3939",
    color: "#ffffff",
    cursor: "pointer"
}

const imgStyle = {
    width: "100%"
}

const childDivStyle = {
    width: !isStyleMob() ? "40%" : "100%",
    display: "flex",
    flexDirection: "column"
}

const buttonStyle = {
    padding: "10px 20px",
    textAlign: "center",
    margin: "0 10px",
    backgroundColor: "rgba(0,0,0,0.05)",
    outline: "none",
    border: "none",
    borderRadius: "10px",
    boxShadow: "0 1px 5px rgba(0,0,0,0.4)",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
}

const msgfeedbackStyle = {
    color: "#ffffff",
    textAlign: "center",
    marginBottom: "15px",
    fontSize: "14px",
    padding: "10px",
    borderRadius: "5px"
}

const Modal = ({ nft, closeFunc, data, blockchain, contractAddress }) => {

    const homepagePath = `${window.location.origin}/paws`;

    const [activeDays, setActiveDays] = useState({
        selectedDays: 30,
        stakedDate: "",
        valueDate: "",
        reward: "",
        redemptionPeriod: "",
        redemptionDate: "",
        MaxReward: ""
    });

    const [selectStake, setSelectStake] = useState(1);
    const [stakeNft, setstakeNft] = useState(0);

    const [loadingBtn, setLoadingBtn] = useState(false);
    const [stakeBtn, setstakeBtn] = useState("");
    const [unStakeBtn, setUnStakeBtn] = useState("");
    const [redeemBtn, setRedeemBtn] = useState("");

    const [msgFeedback, setMsgFeedback] = useState({});

    useEffect(() => {
        setActiveDaysValues(30);
        checkStaking(nft.id);

        return () => { setstakeNft(0); setMsgFeedback({}) }
    }, []);

    const getDateReturn = (timestamp, day = 0) => {
        timestamp = parseInt(timestamp);
        const dd = new Date((timestamp + (24 * 60 * 60 * day)) * 1000);
        const res = dd.getDate() + "-" + (dd.getMonth() + 1) + "-" + dd.getFullYear();
        return res;
    }

    const getDayReturn = (timestamp) => {
        const d1 = new Date().getDate();
        const d2 = new Date(timestamp * 1000).getDate();
        const res = d1 - d2;
        return res;
    }

    const getDateFromNow = (days) => {
        const d = new Date();
        d.setSeconds(24 * 60 * 60 * days);
        const res = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
        return res;
    }

    const setActiveDaysValues = (days) => {

        const d = new Date();
        const _stakedDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();

        const daysObj = {
            stakedDate: _stakedDate,
            valueDate: getDateFromNow(22),
            redemptionPeriod: days,
            redemptionDate: getDateFromNow(days)
        }

        if (days == 30) {
            setActiveDays({
                selectedDays: days,
                ...daysObj,
                reward: data.dailyRewards.thirty / 10 ** 18,
                MaxReward: ((data.dailyRewards.thirty / 10 ** 18) * 30)
            });
        }

        if (days == 60) {
            setActiveDays({
                selectedDays: days,
                ...daysObj,
                reward: data.dailyRewards.sixty / 10 ** 18,
                MaxReward: ((data.dailyRewards.sixty / 10 ** 18) * 60)
            });
        }

        if (days == 90) {
            setActiveDays({
                selectedDays: days,
                ...daysObj,
                reward: data.dailyRewards.ninety / 10 ** 18,
                MaxReward: ((data.dailyRewards.ninety / 10 ** 18) * 90)
            });
        }
    }


    const checkStaking = async (tokenID) => {
        await blockchain.stakeSmartContract.methods.checkStakingRewards(tokenID, data.NFTContract0).call({ from: blockchain.account })
            .then((res) => {
                setstakeNft(res);
            });
    }


    const handleStake = async (tokenID) => {
        setMsgFeedback({});
        setLoadingBtn(true);
        let isTrue = await blockchain.smartContract.methods.isApprovedForAll(blockchain.account, contractAddress).call({ from: blockchain.account });
        if (!isTrue) {
            setstakeBtn("Waiting for Approval");
            await blockchain.smartContract.methods.setApprovalForAll(contractAddress, true).send({ from: blockchain.account })
                .once("error", async (err) => {
                    var errMsg = await getErrorMessage(err);
                    setMsgFeedback({ msg: errMsg, status: "error" });
                    setstakeBtn("");
                    setLoadingBtn(false);
                })
                .then((receipt) => {
                    console.log(receipt);
                    setMsgFeedback({});
                    setstakeBtn("");
                    setLoadingBtn(false);
                });
        }

        setLoadingBtn(true);
        setstakeBtn("Initializing the NFT Staking");

        await blockchain.stakeSmartContract.methods.stakeNFT(tokenID, activeDays.selectedDays, 0).send({ from: blockchain.account })
            .once("error", async (err) => {
                var errMsg = await getErrorMessage(err);
                setMsgFeedback({ msg: errMsg, status: "error" });
                setstakeBtn("");
                setLoadingBtn(false);
            })
            .then((receipt) => {
                console.log(receipt);
                setMsgFeedback({});
                setstakeBtn("");
                setLoadingBtn(false);
            });

        checkStaking(nft.id);
        setstakeBtn("");
        setLoadingBtn(false);
        setMsgFeedback({ msg: "NFT Staked Successfully", status: "success" });
        checkStaking(tokenID);
    }


    const handleUnstake = async (tokenID) => {
        setMsgFeedback({});
        setLoadingBtn(true);
        setUnStakeBtn("Initializing the Claiming & Unstaking");

        await blockchain.stakeSmartContract.methods.withdrawToken(tokenID, 0).send({ from: blockchain.account })
            .once("error", async (err) => {
                var errMsg = await getErrorMessage(err);
                setMsgFeedback({ msg: errMsg, status: "error" });
                setUnStakeBtn("");
                setLoadingBtn(false);
            })
            .then((receipt) => {
                console.log(receipt);
                setMsgFeedback({});
                setUnStakeBtn("");
                setLoadingBtn(false);
            });

        checkStaking(nft.id);
        setUnStakeBtn("");
        setLoadingBtn(false);
        setMsgFeedback({ msg: "Rewards Claimed & NFT Unstaked Successfully", status: "success" });
        checkStaking(tokenID);
    }


    const handleClaim = async (tokenID) => {
        setMsgFeedback({});
        setLoadingBtn(true);
        setRedeemBtn("Initializing the Claiming Reward");

        await blockchain.stakeSmartContract.methods.redeemToken(tokenID, data.NFTContract0).send({ from: blockchain.account })
            .once("error", async (err) => {
                var errMsg = await getErrorMessage(err);
                setMsgFeedback({ msg: errMsg, status: "error" });
                setRedeemBtn("");
                setLoadingBtn(false);
            })
            .then((receipt) => {
                console.log(receipt);
                setMsgFeedback({});
                setRedeemBtn("");
                setLoadingBtn(false);
            });

        checkStaking(nft.id);
        setRedeemBtn("");
        setLoadingBtn(false);
        setMsgFeedback({ msg: "Rewards Claimed Successfully", status: "success" });
        checkStaking(tokenID);
    }


    const StakedContent = () => {
        return (
            <>
                <span style={{
                    position: "absolute", width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.6)", zIndex: 98
                }}></span>
                <span style={{ position: "absolute", color: "#ffffff", fontSize: !isStyleMob() ? "100px" : "60px", letterSpacing: "5px", fontWeight: 600, top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-25deg)", zIndex: 99 }}>
                    STAKED
                </span>
            </>
        );
    }


    const NonStakedComponent = () => {
        return (
            <>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                    <button style={selectStake == 1 ? { ...buttonStyle, margin: 0, border: "2px solid #008000", backgroundColor: "#f2fff1" } : { ...buttonStyle, margin: 0 }} onClick={() => { setActiveDaysValues(30); setSelectStake(1); }}>30 Days</button>
                    <button style={selectStake == 2 ? { ...buttonStyle, margin: 0, border: "2px solid #008000", backgroundColor: "#f2fff1" } : { ...buttonStyle, margin: 0 }} onClick={() => { setActiveDaysValues(60); setSelectStake(2); }}>60 Days</button>
                    <button style={selectStake == 3 ? { ...buttonStyle, margin: 0, border: "2px solid #008000", backgroundColor: "#f2fff1" } : { ...buttonStyle, margin: 0 }} onClick={() => { setActiveDaysValues(90); setSelectStake(3); }}>90 Days</button>
                </div>
                <h4 style={{ marginBottom: "10px", width: "100%" }}>Summary</h4>
                <div style={{ background: "linear-gradient(to right, rgba(0,0,0,0.05), rgba(0,0,0,0.1))", padding: "15px", borderRadius: "5px" }}>
                    <p style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                        <span style={{ fontWeight: "500" }}>Staked Date</span>
                        <span>{activeDays.stakedDate}</span>
                    </p>
                    <p style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                        <span style={{ fontWeight: "500" }}>Value Date</span>
                        <span>{activeDays.valueDate}</span>
                    </p>
                    <p style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                        <span style={{ fontWeight: "500" }}>Reward</span>
                        <span>{activeDays.reward} TCTK / Day</span>
                    </p>
                    <p style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                        <span style={{ fontWeight: "500" }}>Redemption Period</span>
                        <span>{activeDays.redemptionPeriod} days</span>
                    </p>
                    <p style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                        <span style={{ fontWeight: "500" }}>Redemption Date</span>
                        <span>{activeDays.redemptionDate}</span>
                    </p>
                    <p style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                        <span style={{ fontWeight: "500" }}>Max Earn Reward</span>
                        <span>{activeDays.MaxReward}</span>
                    </p>
                </div>
            </>
        );
    }


    const StakedComponent = () => {
        return (
            <>
                <h4 style={{ marginBottom: "10px", width: "100%" }}>Summary</h4>
                <div style={{ background: "linear-gradient(to right, rgba(0,0,0,0.05), rgba(0,0,0,0.1))", padding: "15px", borderRadius: "5px" }}>
                    <p style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                        <span style={{ fontWeight: "500" }}>Staked Date</span>
                        <span>{getDateReturn(stakeNft.timestamp)}</span>
                    </p>
                    <p style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                        <span style={{ fontWeight: "500" }}>Value Date</span>
                        <span>{getDateReturn(stakeNft.timestamp, 22)}</span>
                    </p>
                    <p style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                        <span style={{ fontWeight: "500" }}>Current Rewards</span>
                        <span>{stakeNft.rewards / 10 ** 18} TCTK</span>
                    </p>
                    <p style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                        <span style={{ fontWeight: "500" }}>Redeemed Rewards</span>
                        <span>{stakeNft.redeemed / 10 ** 18} TCTK</span>
                    </p>
                    <p style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                        <span style={{ fontWeight: "500" }}>Staking Period</span>
                        <span>{stakeNft.stakingDays} days</span>
                    </p>
                    <p style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                        <span style={{ fontWeight: "500" }}>Redemption Date</span>
                        <span>{getDateReturn(stakeNft.timestamp, Number(stakeNft.stakingDays))}</span>
                    </p>
                </div>
            </>
        );
    }


    const BtnLoading = ({ btnname }) => {
        let fnChk;
        if (btnname == "Stake NFT") {
            fnChk = stakeBtn;
        }
        if (btnname == "Claim Reward & Unstake NFT") {
            fnChk = unStakeBtn;
        }
        if (btnname == "Claim Reward") {
            fnChk = redeemBtn;
        }
        return (
            fnChk ?
                <>
                    {fnChk}
                    <img style={{ maxWidth: 20, marginLeft: 15 }} src={`${homepagePath}/config/images/loadingrotate.gif`} alt="" />
                </>
                :
                btnname
        );
    }


    return (
        <div style={divParent}>
            {stakeNft && stakeNft != 0 ?
                <>
                    <div style={divStyle}>
                        <span style={closeBtn} onClick={(e) => { e.preventDefault(); closeFunc(false) }}>Close</span>
                        <div style={{ width: !isStyleMob() ? "50%" : "100%", position: "relative" }}>
                            {stakeNft.nfttokenId != 0 ?
                                <StakedContent /> : null
                            }
                            <img style={imgStyle} src={nft.image} alt="" />
                        </div>
                        <span style={{ height: "100%", width: "5px", background: "grey", borderRadius: "50%" }}></span>
                        <div style={childDivStyle}>
                            <h3 style={{ marginBottom: "15px", borderBottom: "1px solid rgba(0,0,0,0.5)", padding: "10px", width: "100%", textAlign: "center", fontSize: "18px" }}>{nft.name}</h3>
                            {stakeNft.nfttokenId == 0 ?
                                <NonStakedComponent /> : <StakedComponent />
                            }

                            <div style={{ marginTop: "auto" }}>
                                <p style={{ margin: "15px 0", fontSize: "12px", fontStyle: "italic" }}>
                                    <span style={{ fontWeight: "500" }}>Note:</span> Unstake before the {stakeNft.nfttokenId == 0 ? activeDays.redemptionPeriod : stakeNft.stakingDays} days will result the 10% penalty on reward.
                                </p>
                                {msgFeedback.msg ?
                                    <p style={msgFeedback.status == "success" ? { ...msgfeedbackStyle, backgroundColor: "#2f9737" } : { ...msgfeedbackStyle, backgroundColor: "#ff4646" }}>
                                        {msgFeedback.msg}
                                    </p> : null}
                                {stakeNft.nfttokenId == 0 ?
                                    <button style={{ ...buttonStyle, width: "100%", margin: 0 }} disabled={loadingBtn} onClick={() => handleStake(nft.id)}> {<BtnLoading btnname={"Stake NFT"} />} </button>
                                    :
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "column" }}>
                                        <button style={{ ...buttonStyle, width: "100%", margin: "5px 0" }} onClick={() => handleUnstake(nft.id)} disabled={loadingBtn}>{<BtnLoading btnname={"Claim Reward & Unstake NFT"} />}</button>
                                        {getDayReturn(stakeNft.timestamp) < 7 ?
                                            <button style={{ ...buttonStyle, width: "100%", margin: "5px 0", cursor: "not-allowed" }} disabled={true}>Claim Reward</button>
                                            :
                                            <button style={{ ...buttonStyle, width: "100%", margin: "5px 0" }} onClick={() => handleClaim(nft.id)} disabled={loadingBtn}><BtnLoading btnname={"Claim Reward"} /></button>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </>
                :
                <>
                    <img src={`${homepagePath}/config/images/loader.gif`} alt="" />
                </>}
        </div>
    );
}

export default Modal;