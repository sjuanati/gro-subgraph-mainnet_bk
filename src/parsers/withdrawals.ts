// @ts-nocheck
import { BigInt } from '@graphprotocol/graph-ts';
import { DepoWithdraw as DepoWithdrawEvent } from '../types/depowithdraw';
import {
    ADDR,
    NO_POOL,
    NUM
} from '../utils/constants';
import { getUSDAmountOfShare } from '../utils/tokens';


// parse core withdrawal events
function parseCoreWithdrawalEvent<T>(ev: T): DepoWithdrawEvent {
    const event = new DepoWithdrawEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.address,
        'core_withdrawal',
        ev.params.user.toHexString(),   // links with User.id,
        ev.params.user,                 // from
        ADDR.ZERO,                      // to
        BigInt.fromString('0'),         // coinAmount
        ev.params.returnUsd,            // usdAmount
        NO_POOL,                        // poolId
    )
    return event;
}

function parseGRouterWithdrawEvent<T>(ev: T): DepoWithdrawEvent {
    const shareAmount = ev.params.calcAmount;
    const tokenIndex = ev.params.tokenIndex.toI32();
    const usdAmount = getUSDAmountOfShare(tokenIndex, shareAmount.toBigDecimal());
    const event = new DepoWithdrawEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.address,
        'core_withdrawal',
        ev.params.sender.toHexString(),   // links with User.id,
        ev.params.sender,                 // from
        ADDR.ZERO,                      // to
        ev.params.tokenAmount,         // coinAmount
        usdAmount,                     // usdAmount
        NO_POOL,                        // poolId
    )
    return event;
}

// parse core withdrawal events
function parseCoreEmergencyWithdrawalEvent<T>(ev: T): DepoWithdrawEvent {
    const event = new DepoWithdrawEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.address,
        'core_withdrawal',
        '',
        ADDR.ZERO,
        ADDR.ZERO,
        BigInt.fromString('0'),         // coinAmount
        BigInt.fromString('0'),         // usdAmount
        NO_POOL,                        // poolId
    )
    return event;
}

// parse staker withdrawal events
function parseStakerWithdrawalEvent<T>(ev: T): DepoWithdrawEvent {
    const poolId = (ev.params.pid)
        ? ev.params.pid.toI32()
        : NO_POOL;
    const event = new DepoWithdrawEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.address,
        'staker_withdrawal',
        ev.params.user.toHexString(),   // links with User.id,
        ev.address,                     // from
        ev.params.user,                 // to
        ev.params.amount,               // coinAmount
        BigInt.fromString('0'),         // usdAmount // TODO **************************
        poolId,                         // poolId
    )
    return event;
}

export {
    parseCoreWithdrawalEvent,
    parseStakerWithdrawalEvent,
    parseCoreEmergencyWithdrawalEvent,
    parseGRouterWithdrawEvent
}
