// import { expect } from "chai";
// import { spy } from "sinon";
// import { dummyLogger, dummyNetworkId } from "../../../../test/fixtures";
// import { createMock } from "../../../../test/testUtils";
// import {
//   BrowserWallet,
//   BrowserWalletConnector,
//   BrowserWalletLockedError,
// } from "../../../lib/web3/BrowserWallet";
// import { Web3Manager } from "../../../lib/web3/Web3Manager";
// import { actions } from "../../actions";
// import { walletFlows } from "../flows";

// describe("Wallet selector > Browser wizard > actions", () => {
//   describe("tryConnectingWithBrowserWallet action", () => {
//     it("should plug wallet on successful connection", async () => {
//       const expectedNetworkId = dummyNetworkId;

//       const dispatchMock = spy();
//       const browserWalletMock = createMock(BrowserWallet, {});
//       const browserWalletConnectorMock = createMock(BrowserWalletConnector, {
//         connect: async () => browserWalletMock,
//       });
//       const web3ManagerMock = createMock(Web3Manager, {
//         networkId: expectedNetworkId,
//         plugPersonalWallet: async () => {},
//       });

//       await walletFlows.tryConnectingWithBrowserWallet(
//         dispatchMock,
//         browserWalletConnectorMock,
//         web3ManagerMock,
//         dummyLogger,
//       );

//       expect(browserWalletConnectorMock.connect).to.be.calledWithExactly(expectedNetworkId);
//       expect(dispatchMock).to.be.calledWithExactly(walletFlows.walletConnected);
//     });

//     it("should dispatch error action on error", async () => {
//       const expectedNetworkId = dummyNetworkId;

//       const dispatchMock = spy();
//       const browserWalletConnectorMock = createMock(BrowserWalletConnector, {
//         connect: async () => {
//           throw new BrowserWalletLockedError();
//         },
//       });
//       const web3ManagerMock = createMock(Web3Manager, {
//         networkId: expectedNetworkId,
//         plugPersonalWallet: async () => {},
//       });

//       await walletFlows.tryConnectingWithBrowserWallet(
//         dispatchMock,
//         browserWalletConnectorMock,
//         web3ManagerMock,
//         dummyLogger,
//       );

//       expect(browserWalletConnectorMock.connect).to.be.calledWithExactly(expectedNetworkId);
//       expect(dispatchMock).to.be.calledWithExactly(
//         actions.wallet.browserWalletConnectionError(
//           "Your wallet seems to be locked — we can't access any accounts.",
//         ),
//       );
//     });
//   });
// });
