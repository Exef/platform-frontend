import { expect } from "chai";
import { actions } from "../../actions";
import {
  DEFAULT_DERIVATION_PATH_PREFIX,
  DEFAULT_LEDGER_ACCOUNTS_PER_PAGE,
  ILedgerWizardState,
  ledgerWizardInitialState,
  ledgerWizardReducer,
} from "./reducer";

describe("Wallet selector > Ledger wizard > reducer", () => {
  it("should act on LEDGER_WIZARD_ACCOUNTS_LIST_NEXT_PAGE action", () => {
    const newState = ledgerWizardReducer(
      undefined,
      actions.wallet.ledgerWizardAccountsListNextPage(),
    );

    expect(newState).to.be.deep.eq({
      isConnectionEstablished: false,
      accounts: [],
      derivationPathPrefix: DEFAULT_DERIVATION_PATH_PREFIX,
      index: 1,
      isLoadingAddresses: true,
      numberOfAccountsPerPage: DEFAULT_LEDGER_ACCOUNTS_PER_PAGE,
      advanced: false,
    });
  });

  it("should act on LEDGER_WIZARD_ACCOUNTS_LIST_PREVIOUS_PAGE action", () => {
    const state: ILedgerWizardState = {
      isConnectionEstablished: true,
      accounts: [],
      derivationPathPrefix: DEFAULT_DERIVATION_PATH_PREFIX,
      index: 1,
      isLoadingAddresses: true,
      numberOfAccountsPerPage: DEFAULT_LEDGER_ACCOUNTS_PER_PAGE,
      advanced: false,
    };

    const newState = ledgerWizardReducer(
      state,
      actions.wallet.ledgerWizardAccountsListPreviousPage(),
    );

    expect(newState).to.be.deep.eq({
      isConnectionEstablished: true,
      accounts: [],
      derivationPathPrefix: DEFAULT_DERIVATION_PATH_PREFIX,
      index: 0,
      isLoadingAddresses: true,
      numberOfAccountsPerPage: DEFAULT_LEDGER_ACCOUNTS_PER_PAGE,
      advanced: false,
    });
  });

  it("should do nothing on LEDGER_WIZARD_ACCOUNTS_LIST_PREVIOUS_PAGE action when its first page", () => {
    const state: ILedgerWizardState = {
      isConnectionEstablished: true,
      accounts: [],
      derivationPathPrefix: DEFAULT_DERIVATION_PATH_PREFIX,
      index: 0,
      isLoadingAddresses: true,
      numberOfAccountsPerPage: DEFAULT_LEDGER_ACCOUNTS_PER_PAGE,
      advanced: false,
    };

    const newState = ledgerWizardReducer(
      state,
      actions.wallet.ledgerWizardAccountsListPreviousPage(),
    );

    expect(newState).to.be.deep.eq({
      isConnectionEstablished: true,
      accounts: [],
      derivationPathPrefix: DEFAULT_DERIVATION_PATH_PREFIX,
      index: 0,
      isLoadingAddresses: true,
      numberOfAccountsPerPage: DEFAULT_LEDGER_ACCOUNTS_PER_PAGE,
      advanced: false,
    });
  });

  describe("SET_LEDGER_WIZARD_ACCOUNTS", () => {
    it("should act on SET_LEDGER_WIZARD_ACCOUNTS action", () => {
      const newState = ledgerWizardReducer(
        undefined,
        actions.wallet.setLedgerAccounts(
          [{ address: "0x67", balanceETH: "123", balanceNEU: "0", derivationPath: "44/60" }],
          DEFAULT_DERIVATION_PATH_PREFIX,
        ),
      );

      expect(newState).to.be.deep.eq({
        isConnectionEstablished: false,
        accounts: [
          { address: "0x67", balanceETH: "123", balanceNEU: "0", derivationPath: "44/60" },
        ],
        index: 0,
        isLoadingAddresses: false,
        derivationPathPrefix: DEFAULT_DERIVATION_PATH_PREFIX,
        numberOfAccountsPerPage: DEFAULT_LEDGER_ACCOUNTS_PER_PAGE,
        advanced: false,
      });
    });

    it("should not act when derivation path prefix mismatch or advanced chooser", () => {
      const initialState = {
        ...ledgerWizardInitialState,
        advanced: true,
      };
      const newState = ledgerWizardReducer(
        initialState,
        actions.wallet.setLedgerAccounts(
          [{ address: "0x67", balanceETH: "123", balanceNEU: "0", derivationPath: "44/60" }],
          "",
        ),
      );

      expect(newState).to.be.deep.eq(initialState);
    });

    it("should act when derivation path prefix mismatch but advanced field is false", () => {
      const newAccounts = [
        { address: "0x67", balanceETH: "123", balanceNEU: "0", derivationPath: "44/60" },
      ];
      const initialState = ledgerWizardInitialState;
      const newState = ledgerWizardReducer(
        initialState,
        actions.wallet.setLedgerAccounts(newAccounts, ""),
      );

      expect(newState).to.be.deep.eq({
        ...initialState,
        isLoadingAddresses: false,
        accounts: newAccounts,
      });
    });
  });

  it("should act on LEDGER_CONNECTION_ESTABLISHED action", () => {
    const action = actions.wallet.ledgerConnectionEstablished();
    const initialState = {
      ...ledgerWizardInitialState,
      errorMsg: "some error",
    };

    const newState = ledgerWizardReducer(initialState, action);

    expect(newState).to.be.deep.eq({
      isConnectionEstablished: true,
      errorMsg: undefined,
      accounts: [],
      index: 0,
      isLoadingAddresses: true,
      derivationPathPrefix: DEFAULT_DERIVATION_PATH_PREFIX,
      numberOfAccountsPerPage: DEFAULT_LEDGER_ACCOUNTS_PER_PAGE,
      advanced: false,
    });
  });

  it("should act on LEDGER_CONNECTION_ESTABLISHED_ERROR action", () => {
    const expectedErrorMsg = "LEDGER ERROR";
    const action = actions.wallet.ledgerConnectionEstablishedError(expectedErrorMsg);

    const newState = ledgerWizardReducer(undefined, action);

    expect(newState).to.be.deep.eq({
      isConnectionEstablished: false,
      errorMsg: expectedErrorMsg,
      accounts: [],
      index: 0,
      isLoadingAddresses: true,
      derivationPathPrefix: DEFAULT_DERIVATION_PATH_PREFIX,
      numberOfAccountsPerPage: DEFAULT_LEDGER_ACCOUNTS_PER_PAGE,
      advanced: false,
    });
  });

  it("should act on SET_LEDGER_WIZARD_DERIVATION_PATH_PREFIX", () => {
    const newDerivationPath = "test";
    const newState = ledgerWizardReducer(
      undefined,
      actions.wallet.setLedgerWizardDerivationPathPrefix(newDerivationPath),
    );

    expect(newState).to.be.deep.eq({
      isConnectionEstablished: false,
      isLoadingAddresses: true,
      accounts: [],
      index: 0,
      derivationPathPrefix: newDerivationPath,
      numberOfAccountsPerPage: DEFAULT_LEDGER_ACCOUNTS_PER_PAGE,
      advanced: false,
    });
  });

  it("should act on LEDGER_WIZARD_DERIVATION_PATH_PREFIX_ERROR", () => {
    const newState = ledgerWizardReducer(
      undefined,
      actions.wallet.ledgerWizardDerivationPathPrefixError(),
    );

    expect(newState).to.be.deep.eq({
      isConnectionEstablished: false,
      isLoadingAddresses: true,
      accounts: [],
      index: 0,
      derivationPathPrefix: "",
      numberOfAccountsPerPage: 10,
      advanced: false,
    });
  });

  it("should act on TOGGLE_LEDGER_WIZARD_ADVANCED", () => {
    const state = ledgerWizardInitialState;
    const newState = ledgerWizardReducer(state, actions.wallet.toggleLedgerAccountsAdvanced());

    expect(newState).to.be.deep.eq({
      ...state,
      advanced: !state.advanced,
    });
  });
});
