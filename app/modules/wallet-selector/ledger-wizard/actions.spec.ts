// import { BigNumber } from "bignumber.js";
// import { expect } from "chai";
// import { spy } from "sinon";

// import { dummyNetworkId } from "../../../../test/fixtures";
// import { createMock } from "../../../../test/testUtils";
// import {
//   IDerivationPathToAddress,
//   LedgerNotAvailableError,
//   LedgerWallet,
//   LedgerWalletConnector,
// } from "../../../lib/web3/LedgerWallet";
// import { Web3Adapter } from "../../../lib/web3/Web3Adapter";
// import { WalletNotConnectedError, Web3Manager } from "../../../lib/web3/Web3Manager";
// import { IAppState } from "../../../store";
// import { Dictionary } from "../../../types";
// import { actions } from "../../actions";
// import { walletFlows } from "../flows";
// import { ledgerWizardFlows } from "./flows";
// import { DEFAULT_DERIVATION_PATH_PREFIX } from "./reducer";

// describe("Wallet selector > Ledger wizard > actions", () => {
//   describe("tryEstablishingConnectionWithLedger", () => {
//     it("should try establishing connection", async () => {
//       const expectedNetworkId = dummyNetworkId;

//       const mockDispatch = spy();
//       const ledgerWalletConnectorMock = createMock(LedgerWalletConnector, {
//         connect: async () => {},
//       });
//       const web3ManagerMock = createMock(Web3Manager, {
//         networkId: expectedNetworkId,
//       });

//       await ledgerWizardFlows.tryEstablishingConnectionWithLedger(
//         mockDispatch,
//         ledgerWalletConnectorMock,
//         web3ManagerMock,
//       );

//       expect(mockDispatch).to.be.calledWithExactly(actions.wallet.ledgerConnectionEstablished());
//       expect(ledgerWalletConnectorMock.connect).to.be.calledWithExactly(expectedNetworkId);
//     });

//     it("should send error action on error", async () => {
//       const expectedNetworkId = dummyNetworkId;

//       const mockDispatch = spy();
//       const ledgerWalletConnectorMock = createMock(LedgerWalletConnector, {
//         connect: async () => {
//           throw new LedgerNotAvailableError();
//         },
//       });
//       const web3ManagerMock = createMock(Web3Manager, {
//         networkId: expectedNetworkId,
//       });

//       await ledgerWizardFlows.tryEstablishingConnectionWithLedger(
//         mockDispatch,
//         ledgerWalletConnectorMock,
//         web3ManagerMock,
//       );

//       expect(mockDispatch).to.be.calledWithExactly(
//         actions.wallet.ledgerConnectionEstablishedError("Nano Ledger S not available"),
//       );
//       expect(ledgerWalletConnectorMock.connect).to.be.calledWithExactly(expectedNetworkId);
//     });
//   });

//   describe("loadLedgerAccountsAction", () => {
//     it("should load accounts from ledger connector", async () => {
//       const dummyState: Partial<IAppState> = {
//         ledgerWizardState: {
//           index: 1,
//           numberOfAccountsPerPage: 10,
//           derivationPathPrefix: "44'/60'/0'/",
//           accounts: [],
//           isLoadingAddresses: false,
//           isConnectionEstablished: true,
//           advanced: true,
//         },
//       };
//       const expectedAccounts: IDerivationPathToAddress = {
//         "44'/60'/0'/1": "0x131213123123",
//         "44'/60'/0'/2": "0xab2245c",
//       };
//       const expectedAccountsToBalances: Dictionary<number> = {
//         "0x131213123123": 4,
//         "0xab2245c": 15,
//       };

//       const dispatchMock = spy();
//       const getStateMock = spy(() => dummyState);
//       const ledgerWalletConnectorMock = createMock(LedgerWalletConnector, {
//         getMultipleAccountsFromDerivationPrefix: spy(() => expectedAccounts),
//       });
//       const web3ManagerMock = createMock(Web3Manager, {
//         internalWeb3Adapter: createMock(Web3Adapter, {
//           getBalance: (address: string) =>
//             Promise.resolve(new BigNumber(expectedAccountsToBalances[address])),
//         }),
//       });

//       await ledgerWizardFlows.loadLedgerAccounts(
//         dispatchMock,
//         getStateMock,
//         ledgerWalletConnectorMock,
//         web3ManagerMock,
//       );

//       expect(
//         ledgerWalletConnectorMock.getMultipleAccountsFromDerivationPrefix,
//       ).to.calledWithExactly(
//         dummyState.ledgerWizardState!.derivationPathPrefix,
//         dummyState.ledgerWizardState!.index,
//         dummyState.ledgerWizardState!.numberOfAccountsPerPage,
//       );
//       expect(dispatchMock).to.be.calledWithExactly(
//         actions.wallet.setLedgerAccounts(
//           [
//             {
//               address: expectedAccounts["44'/60'/0'/1"],
//               balanceETH: expectedAccountsToBalances[expectedAccounts["44'/60'/0'/1"]].toString(),
//               balanceNEU: "0",
//               derivationPath: "44'/60'/0'/1",
//             },
//             {
//               address: expectedAccounts["44'/60'/0'/2"],
//               balanceETH: expectedAccountsToBalances[expectedAccounts["44'/60'/0'/2"]].toString(),
//               balanceNEU: "0",
//               derivationPath: "44'/60'/0'/2",
//             },
//           ],
//           DEFAULT_DERIVATION_PATH_PREFIX,
//         ),
//       );
//     });
//   });

//   describe("goToNextPageAndLoadDataAction", () => {
//     it("should work", async () => {
//       const mockDispatch = spy();

//       ledgerWizardFlows.goToNextPageAndLoadData(mockDispatch);

//       expect(mockDispatch).to.be.calledTwice;
//       expect(mockDispatch).to.be.calledWith(actions.wallet.ledgerWizardAccountsListNextPage());
//       expect(mockDispatch).to.be.calledWith(ledgerWizardFlows.loadLedgerAccounts);
//     });
//   });

//   describe("goToPreviousPageAndLoadDataAction", async () => {
//     it("should work", () => {
//       const mockDispatch = spy();

//       ledgerWizardFlows.goToPreviousPageAndLoadData(mockDispatch);

//       expect(mockDispatch).to.be.calledTwice;
//       expect(mockDispatch).to.be.calledWith(actions.wallet.ledgerWizardAccountsListPreviousPage());
//       expect(mockDispatch).to.be.calledWith(ledgerWizardFlows.loadLedgerAccounts);
//     });
//   });

//   describe("setDerivationPathPrefixAction", () => {
//     const newDP = "test";
//     const dummyState: Partial<IAppState> = {
//       ledgerWizardState: {
//         index: 1,
//         numberOfAccountsPerPage: 10,
//         derivationPathPrefix: DEFAULT_DERIVATION_PATH_PREFIX,
//         accounts: [],
//         isLoadingAddresses: false,
//         isConnectionEstablished: true,
//         advanced: false,
//       },
//     };

//     it("should do not fire when there is no change in derivationPathPrefix", async () => {
//       const mockDispatch = spy();
//       const getStateMock = spy(() => dummyState);

//       await ledgerWizardFlows.setDerivationPathPrefix(DEFAULT_DERIVATION_PATH_PREFIX)(
//         mockDispatch,
//         getStateMock,
//       );

//       expect(mockDispatch).have.not.been.called;
//     });

//     it("should fire when there is change in derivationPathPrefix", async () => {
//       const mockDispatch = spy();
//       const getStateMock = spy(() => dummyState);

//       await ledgerWizardFlows.setDerivationPathPrefix(newDP)(mockDispatch, getStateMock);

//       expect(mockDispatch).to.be.calledTwice;
//       expect(mockDispatch).to.be.calledWithExactly(
//         actions.wallet.setLedgerWizardDerivationPathPrefix(newDP),
//       );
//       expect(mockDispatch).to.be.calledWithExactly(ledgerWizardFlows.loadLedgerAccounts);
//     });
//   });

//   describe("finishSettingUpLedgerConnectorAction", () => {
//     it("should work when ledger wallet is connected", async () => {
//       const expectedDerivationPath = "44'/60'/0'/2";

//       const dispatchMock = spy();
//       const ledgerWalletMock = createMock(LedgerWallet, {});
//       const ledgerWalletConnectorMock = createMock(LedgerWalletConnector, {
//         finishConnecting: async () => ledgerWalletMock,
//       });
//       const web3ManagerMock = createMock(Web3Manager, {
//         plugPersonalWallet: async () => {},
//       });

//       await ledgerWizardFlows.finishSettingUpLedgerConnector(expectedDerivationPath)(
//         dispatchMock,
//         ledgerWalletConnectorMock,
//         web3ManagerMock,
//       );

//       expect(ledgerWalletConnectorMock.finishConnecting).to.be.calledWithExactly(
//         expectedDerivationPath,
//       );
//       expect(web3ManagerMock.plugPersonalWallet).to.be.calledWithExactly(ledgerWalletMock);
//       expect(dispatchMock).to.be.calledWithExactly(walletFlows.walletConnected);
//     });

//     it("should not navigate when ledger wallet is not connected", async () => {
//       // @todo exact behaviour should be specified
//       const expectedDerivationPath = "44'/60'/0'/2";

//       const navigateToMock = spy();
//       const ledgerWalletMock = createMock(LedgerWallet, {});
//       const ledgerWalletConnectorMock = createMock(LedgerWalletConnector, {
//         finishConnecting: async () => ledgerWalletMock,
//       });
//       const web3ManagerMock = createMock(Web3Manager, {
//         plugPersonalWallet: async () => {
//           throw new WalletNotConnectedError(ledgerWalletMock);
//         },
//       });

//       await ledgerWizardFlows
//         .finishSettingUpLedgerConnector(expectedDerivationPath)(
//           navigateToMock,
//           ledgerWalletConnectorMock,
//           web3ManagerMock,
//         )
//         .catch(() => {});

//       expect(ledgerWalletConnectorMock.finishConnecting).to.be.calledWithExactly(
//         expectedDerivationPath,
//       );
//       expect(web3ManagerMock.plugPersonalWallet).to.be.calledWithExactly(ledgerWalletMock);
//       expect(navigateToMock).not.be.called;
//     });
//   });

//   describe("verifyIfLedgerStillConnected", () => {
//     it("should do nothing if ledger is connected", async () => {
//       const dispatchMock = spy();
//       const ledgerWalletConnectorMock = createMock(LedgerWalletConnector, {
//         testConnection: async () => true,
//       });

//       await ledgerWizardFlows.verifyIfLedgerStillConnected(dispatchMock, ledgerWalletConnectorMock);

//       expect(ledgerWalletConnectorMock.testConnection).to.be.calledOnce;
//       expect(dispatchMock).to.not.be.called;
//     });

//     it("should issue error action if ledger is not connected", async () => {
//       const dispatchMock = spy();
//       const ledgerWalletConnectorMock = createMock(LedgerWalletConnector, {
//         testConnection: async () => false,
//       });

//       await ledgerWizardFlows.verifyIfLedgerStillConnected(dispatchMock, ledgerWalletConnectorMock);

//       expect(ledgerWalletConnectorMock.testConnection).to.be.calledOnce;
//       expect(dispatchMock).to.be.calledWithExactly(
//         actions.wallet.ledgerConnectionEstablishedError("Nano Ledger S not available"),
//       );
//     });
//   });
// });
