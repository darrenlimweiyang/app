import Web3 from "web3";
import type { SendOptions, EventData } from 'web3-eth-contract'
import { EventEmitter } from "events";

type NumericalString = string;
type HexString = string;
type Address = string;

interface TemplatableEventData<T> extends EventData {
    returnValues: T;
}
type Event<T> = (options: any, cb: (event: TemplatableEventData<T>) => void) => EventEmitter;

export type Web3Provider = Web3 | null;
type ContractMethod<ReturnType> = {
    call: () => Promise<ReturnType>;
    send: (options:SendOptions) => Promise<ReturnType>;
}

export interface Operator {
    constantFee: NumericalString
    exists: boolean
    linearFee: NumericalString
    lnBalance: NumericalString
    publicUrl: string
    tBTCBalance: NumericalString
}

export interface ERC20Contract {
    methods: {
        approve: (address:Address,amount:NumericalString) => ContractMethod<void>,
    }
}

export interface Ln2tbtcContract {
    methods: {
        operators: (address: string) => ContractMethod<Operator>,
        operatorList: (index: number) => ContractMethod<Address>,
        operatorRegister: (tBTCBalance: NumericalString, lnBalance: NumericalString, linearFee: NumericalString, constantFee: NumericalString, publicUrl: string) => ContractMethod<void>,
        getOperatorListLength: () => ContractMethod<NumericalString>,
        operatorWithdrawTBTC: (amount: NumericalString) => ContractMethod<void>,
        operatorDepositTBTC: (amount: NumericalString) => ContractMethod<void>,
        operatorSetFees: (linearFee: NumericalString, constantFee: NumericalString) => ContractMethod<void>,
        operatorSetLNBalance: (newLNBalance: NumericalString) => ContractMethod<void>,
        operatorSetPublicUrl: (newUrl: string) => ContractMethod<void>,
        createTBTC2LNSwap: (paymentHash: HexString, amount: NumericalString, providerAddress: Address, invoice: string) => ContractMethod<void>,
        revertTBTC2LNSwap: (paymentHash: HexString) => ContractMethod<void>,
        operatorClaimPayment: (userAddress: Address, paymentHash: HexString, preimage: HexString) => ContractMethod<void>,
        createLN2TBTCSwap: (paymentHash: HexString, providerAddress: Address, tBTCAmount: NumericalString) => ContractMethod<void>,
        revertLN2TBTCSwap: (paymentHash: HexString) => ContractMethod<void>,
        operatorLockTBTCForLN2TBTCSwap: (userAddress: Address, paymentHash: HexString) => ContractMethod<void>,
        operatorRevertLN2TBTCSwap: (userAddress: Address, paymentHash: HexString) => ContractMethod<void>,
        claimTBTCPayment: (paymentHash: HexString, preimage: HexString) => ContractMethod<void>,
    },
    events: {
        LN2TBTCOperatorLockedTBTC: Event<{
            userAddress: Address,
            paymentHash: HexString
        }>;
        LN2TBTCPreimageRevealed: Event<{
            userAddress: Address,
            paymentHash: HexString,
            providerAddress: Address,
            preimage: HexString
        }>;
        LN2TBTCSwapCreated: Event<{
            userAddress: Address,
            paymentHash: HexString,
            providerAddress: Address,
            tBTCAmount: NumericalString
        }>;
        TBTC2LNSwapCreated: Event<{
            amount: NumericalString,
            userAddress: Address,
            providerAddress: Address,
            invoice: string
        }>
    }
    /*
    Missing methods:
    
    addFees:(uint256,uint256,uint256) => void;
    lnSwaps: ƒ ()
    lnSwaps(address,bytes32): ƒ ()
    removeFees: ƒ ()
    removeFees(uint256,uint256,uint256): ƒ ()
    securityDepositAmount: ƒ ()
    securityDepositAmount(): ƒ ()
    tbtcSwaps: ƒ ()
    tbtcSwaps(address,bytes32): ƒ ()
    timeoutPeriod: ƒ ()
    timeoutPeriod(): ƒ ()
    */
}