const initialState = {
  loading: false,
  totalSupply: 0,
  cost: 0,
  maxSupply: 0,
  maxMintAmount: 0,
  balanceOf: 0,
  walletOfOwner: [],
  nfts: [],
  error: false,
  errorMsg: "",
  feedback: "",
  loggedIn: false
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...state,
        loading: false,
        totalSupply: action.payload.totalSupply,
        cost: action.payload.cost,
        maxSupply: action.payload.maxSupply,
        maxMintAmount: action.payload.maxMintAmount,
        balanceOf: action.payload.balanceOf,
        walletOfOwner: action.payload.walletOfOwner,
        nfts: action.payload.nfts,
        dailyRewards: action.payload.dailyRewards,
        ownerOfStakedNFTs: action.payload.ownerOfStakedNFTs,
        walletOfOwnerOfStaked: action.payload.walletOfOwnerOfStaked,
        NFTContract0: action.payload.NFTContract0,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    case "SAVE_DATA_FEEDBACK_LOGGEDIN":
      return {
        ...state,
        loggedIn: action.payload.loggedIn,
        feedback: action.payload.feedback,
      };
    default:
      return state;
  }
};

export default dataReducer;
