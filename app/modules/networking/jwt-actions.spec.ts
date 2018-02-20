// import { expect } from "chai";
// import { spy } from "sinon";
// import {
//   dummyEthereumAddress,
//   dummyEthereumAddressWithChecksum,
//   dummyLogger,
// } from "../../../test/fixtures";
// import { createMock } from "../../../test/testUtils";
// import { SignatureAuthApi } from "../../lib/api/SignatureAuthApi";
// import { BrowserWallet } from "../../lib/web3/BrowserWallet";
// import { SignerType } from "../../lib/web3/PersonalWeb3";
// import { Web3Manager } from "../../lib/web3/Web3Manager";
// import { IAppState } from "../../store";
// import { WalletSubType, WalletType } from "../web3/types";
// import { obtainJwt } from "./jwt-actions";

// describe("Jwt actions", () => {
//   describe("obtain-jwt", () => {
//     it("should obtain jwt", async () => {
//       const expectedSalt = "some not really random salt";
//       const expectedChallenge = "backend challenge";
//       const expectedSignedMessage = "signed message";
//       const expectedJwt = "jwt";
//       const expectedSignerType = SignerType.ETH_SIGN_TYPED_DATA;

//       const mockedState: Partial<IAppState> = {
//         web3State: {
//           connected: true,
//           ethereumAddress: dummyEthereumAddress,
//           type: WalletType.BROWSER,
//           subtype: WalletSubType.UNKNOWN,
//         },
//       };

//       const browserWalletMock = createMock(BrowserWallet, {
//         signMessage: async () => expectedSignedMessage,
//         signerType: expectedSignerType,
//       });
//       const web3ManagerMock = createMock(Web3Manager, {
//         personalWallet: browserWalletMock,
//       });
//       const getStateMock = spy(() => mockedState);
//       const signatureAuthApiMock = createMock(SignatureAuthApi, {
//         challenge: async () => ({ statusCode: 200, body: { challenge: expectedChallenge } }),
//         createJwt: async () => ({ statusCode: 200, body: { jwt: expectedJwt } }),
//       });
//       const randomStringMock = spy(() => expectedSalt);

//       await obtainJwt(
//         web3ManagerMock,
//         getStateMock,
//         signatureAuthApiMock,
//         randomStringMock,
//         dummyLogger,
//       );

//       expect(randomStringMock).to.be.calledWithExactly(64);
//       expect(signatureAuthApiMock.challenge).to.be.calledWithExactly(
//         dummyEthereumAddressWithChecksum,
//         expectedSalt,
//         expectedSignerType,
//       );
//       expect(browserWalletMock.signMessage).to.be.calledWithExactly(expectedChallenge);
//       expect(signatureAuthApiMock.createJwt).to.be.calledWithExactly(
//         expectedChallenge,
//         expectedSignedMessage,
//         expectedSignerType,
//       );
//     });
//   });
// });
