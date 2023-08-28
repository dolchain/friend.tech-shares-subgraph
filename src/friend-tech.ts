import {
  OwnershipTransferred as OwnershipTransferredEvent,
  Trade as TradeEvent,
} from "../generated/FriendTech/FriendTech";
import { OwnershipTransferred, Trade, Share } from "../generated/schema";

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTrade(event: TradeEvent): void {
  let share = Share.load(event.params.trader.concat(event.params.subject));
  if (!share) {
    share = new Share(event.params.trader.concat(event.params.subject));
    share.trader = event.params.trader;
    share.subject = event.params.subject;
    share.supply = 0;
  }
  if (event.params.isBuy) share.supply += event.params.shareAmount.toU32();
  else share.supply -= event.params.shareAmount.toU32();  
  share.save();

  // let entity = new Trade(
  //   event.transaction.hash.concatI32(event.logIndex.toI32())
  // );
  // entity.trader = event.params.trader;
  // entity.subject = event.params.subject;
  // entity.isBuy = event.params.isBuy;
  // entity.shareAmount = event.params.shareAmount;
  // entity.ethAmount = event.params.ethAmount;
  // entity.protocolEthAmount = event.params.protocolEthAmount;
  // entity.subjectEthAmount = event.params.subjectEthAmount;
  // entity.supply = event.params.supply;

  // entity.blockNumber = event.block.number;
  // entity.blockTimestamp = event.block.timestamp;
  // entity.transactionHash = event.transaction.hash;

  // entity.save();
}
