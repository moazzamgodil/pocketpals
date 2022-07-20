// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const saveDataFeedbackLoggedin = (payload) => {
  return {
    type: "SAVE_DATA_FEEDBACK_LOGGEDIN",
    payload: payload,
  };
};

export const fetchData = (acc) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      // NFT
      let totalSupply = await store
        .getState()
        .blockchain.smartContract.methods.totalSupply()
        .call();

      let cost = await store
        .getState()
        .blockchain.smartContract.methods.cost()
        .call();

      let maxSupply = await store
        .getState()
        .blockchain.smartContract.methods.maxSupply()
        .call();

      let maxMintAmount = await store
        .getState()
        .blockchain.smartContract.methods.maxMintAmount()
        .call();


      // Staking
      let dailyRewards = await store
        .getState()
        .blockchain.stakeSmartContract.methods.dailyRewards()
        .call();

      let NFTContract0 = await store
        .getState()
        .blockchain.stakeSmartContract.methods.NFTContract(0)
        .call();
      // Staking

      let balanceOf = 0;
      let ownerOfStakedNFTs = 0;
      let walletOfOwner = [];
      let walletOfOwnerOfStaked = [];
      let nfts = [];
      if (acc) {
        balanceOf = await store
          .getState()
          .blockchain.smartContract.methods.balanceOf(acc)
          .call();

        walletOfOwner = await store
          .getState()
          .blockchain.smartContract.methods.walletOfOwner(acc)
          .call();

        var i = 0;
        while (i < Number(balanceOf)) {

          let tokenURI = await store
            .getState()
            .blockchain.smartContract.methods.tokenURI(walletOfOwner[i])
            .call();
          if (tokenURI) {
            let tokenURIJson = tokenURI.substring(7, tokenURI.length);
            nfts.push(tokenURIJson);
          }
          i++;
        }

        // Staking
        ownerOfStakedNFTs = await store
          .getState()
          .blockchain.stakeSmartContract.methods.ownerOfStakedNFTs(acc, NFTContract0)
          .call();

        walletOfOwnerOfStaked = await store
          .getState()
          .blockchain.stakeSmartContract.methods.walletOfOwner(acc, NFTContract0)
          .call();
        // Staking

        var j = 0;
        while (j < Number(ownerOfStakedNFTs)) {

          let tokenURI = await store
            .getState()
            .blockchain.smartContract.methods.tokenURI(walletOfOwnerOfStaked[j])
            .call();
          if (tokenURI) {
            let tokenURIJson = tokenURI.substring(7, tokenURI.length);
            nfts.push(tokenURIJson);
          }
          j++;
        }

      }

      dispatch(
        fetchDataSuccess({
          totalSupply,
          cost,
          maxSupply,
          maxMintAmount,
          balanceOf,
          walletOfOwner,
          nfts,
          dailyRewards,
          ownerOfStakedNFTs,
          walletOfOwnerOfStaked,
          NFTContract0
        })
      );
    } catch (err) {
      console.log(err)
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};