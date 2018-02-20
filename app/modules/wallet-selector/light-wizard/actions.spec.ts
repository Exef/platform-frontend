// import { expect } from "chai";
// import { spy } from "sinon";
// import { dummyLogger, dummyNetworkId } from "../../../../test/fixtures";
// import { createMock } from "../../../../test/testUtils";
// import { UsersApi } from "../../../lib/api/UsersApi";
// import { VaultApi } from "../../../lib/api/VaultApi";
// import { Storage } from "../../../lib/dependencies/storage";
// import {
//   ILightWallet,
//   LightWalletConnector,
//   LightWalletUtil,
//   LightWrongPasswordSaltError,
// } from "../../../lib/web3/LightWallet";
// import { Web3Manager } from "../../../lib/web3/Web3Manager";
// import { actions } from "../../actions";
// import { walletFlows } from "../flows";

// describe("Wallet selector > Light wallet wizard > actions", () => {
//   describe("tryConnectingWithLightWallet action", () => {
//     const dispatchMock = spy();
//     const expectedWalletDummy = { addresses: ["mockAddress"] };
//     const storage = createMock(Storage, { setKey: spy() });
//     const web3ManagerMock = createMock(Web3Manager, {
//       networkId: dummyNetworkId,
//       plugPersonalWallet: async () => {},
//     });
//     const vaultApi = createMock(VaultApi, {
//       store: async () => {},
//     });
//     const usersApi = createMock(UsersApi, {
//       createLightwalletAccount: async () => {},
//     });
//     const lightWalletUtil = createMock(LightWalletUtil, {
//       createLightWalletVault: () => {
//         return Promise.resolve({ walletInstance: "wallet", salt: "salt" });
//       },
//       deserializeLightWalletVault: (): Promise<ILightWallet> => {
//         const walletInstance = expectedWalletDummy;
//         return Promise.resolve(walletInstance as ILightWallet);
//       },
//     });

//     it("should create new wallet and store", async () => {
//       const lightWalletConnector = createMock(LightWalletConnector, {
//         connect: spy(),
//       });

//       await walletFlows.tryConnectingWithLightWallet("test@test.com", "password")(
//         dispatchMock,
//         web3ManagerMock,
//         lightWalletConnector,
//         lightWalletUtil,
//         storage,
//         vaultApi,
//         usersApi,
//         dummyLogger,
//       );

//       expect(lightWalletConnector.connect).to.be.calledWith({
//         walletInstance: expectedWalletDummy,
//         salt: "salt",
//       });
//     });

//     it("should dispatch error action on error", async () => {
//       const expectedNetworkId = dummyNetworkId;
//       const lightWalletConnector = createMock(LightWalletConnector, {
//         connect: async () => {
//           throw new LightWrongPasswordSaltError();
//         },
//       });
//       const web3ManagerMock = createMock(Web3Manager, {
//         networkId: expectedNetworkId,
//         plugPersonalWallet: async () => {},
//       });

//       await walletFlows.tryConnectingWithLightWallet("test@test.com", "password")(
//         dispatchMock,
//         web3ManagerMock,
//         lightWalletConnector,
//         lightWalletUtil,
//         storage,
//         vaultApi,
//         usersApi,
//         dummyLogger,
//       );

//       expect(dispatchMock).to.be.calledWithExactly(
//         actions.wallet.lightWalletConnectionError("Password is not correct"),
//       );
//     });
//   });
// });

// //TODO: change mocks into dummyObjects and put in /fixtures
