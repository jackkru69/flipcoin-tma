import {
  Cell,
  Slice,
  Address,
  Builder,
  beginCell,

  TupleReader,
  Dictionary,
  contractAddress,
  type ContractProvider,
  type Sender,
  type Contract,
  type ContractABI,
  type ABIType,
  type ABIGetter,
  type ABIReceiver,
  TupleBuilder,
  type DictionaryValue
} from '@ton/core';

export type DataSize = {
  $$type: 'DataSize';
  cells: bigint;
  bits: bigint;
  refs: bigint;
}

export function storeDataSize(src: DataSize) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeInt(src.cells, 257);
    b_0.storeInt(src.bits, 257);
    b_0.storeInt(src.refs, 257);
  };
}

export function loadDataSize(slice: Slice) {
  const sc_0 = slice;
  const _cells = sc_0.loadIntBig(257);
  const _bits = sc_0.loadIntBig(257);
  const _refs = sc_0.loadIntBig(257);
  return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadTupleDataSize(source: TupleReader) {
  const _cells = source.readBigNumber();
  const _bits = source.readBigNumber();
  const _refs = source.readBigNumber();
  return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadGetterTupleDataSize(source: TupleReader) {
  const _cells = source.readBigNumber();
  const _bits = source.readBigNumber();
  const _refs = source.readBigNumber();
  return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function storeTupleDataSize(source: DataSize) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.cells);
  builder.writeNumber(source.bits);
  builder.writeNumber(source.refs);
  return builder.build();
}

export function dictValueParserDataSize(): DictionaryValue<DataSize> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeDataSize(src)).endCell());
    },
    parse: (src) => {
      return loadDataSize(src.loadRef().beginParse());
    }
  }
}

export type SignedBundle = {
  $$type: 'SignedBundle';
  signature: Buffer;
  signedData: Slice;
}

export function storeSignedBundle(src: SignedBundle) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeBuffer(src.signature);
    b_0.storeBuilder(src.signedData.asBuilder());
  };
}

export function loadSignedBundle(slice: Slice) {
  const sc_0 = slice;
  const _signature = sc_0.loadBuffer(64);
  const _signedData = sc_0;
  return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadTupleSignedBundle(source: TupleReader) {
  const _signature = source.readBuffer();
  const _signedData = source.readCell().asSlice();
  return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadGetterTupleSignedBundle(source: TupleReader) {
  const _signature = source.readBuffer();
  const _signedData = source.readCell().asSlice();
  return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function storeTupleSignedBundle(source: SignedBundle) {
  const builder = new TupleBuilder();
  builder.writeBuffer(source.signature);
  builder.writeSlice(source.signedData.asCell());
  return builder.build();
}

export function dictValueParserSignedBundle(): DictionaryValue<SignedBundle> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeSignedBundle(src)).endCell());
    },
    parse: (src) => {
      return loadSignedBundle(src.loadRef().beginParse());
    }
  }
}

export type StateInit = {
  $$type: 'StateInit';
  code: Cell;
  data: Cell;
}

export function storeStateInit(src: StateInit) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeRef(src.code);
    b_0.storeRef(src.data);
  };
}

export function loadStateInit(slice: Slice) {
  const sc_0 = slice;
  const _code = sc_0.loadRef();
  const _data = sc_0.loadRef();
  return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadTupleStateInit(source: TupleReader) {
  const _code = source.readCell();
  const _data = source.readCell();
  return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadGetterTupleStateInit(source: TupleReader) {
  const _code = source.readCell();
  const _data = source.readCell();
  return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function storeTupleStateInit(source: StateInit) {
  const builder = new TupleBuilder();
  builder.writeCell(source.code);
  builder.writeCell(source.data);
  return builder.build();
}

export function dictValueParserStateInit(): DictionaryValue<StateInit> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
    },
    parse: (src) => {
      return loadStateInit(src.loadRef().beginParse());
    }
  }
}

export type Context = {
  $$type: 'Context';
  bounceable: boolean;
  sender: Address;
  value: bigint;
  raw: Slice;
}

export function storeContext(src: Context) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeBit(src.bounceable);
    b_0.storeAddress(src.sender);
    b_0.storeInt(src.value, 257);
    b_0.storeRef(src.raw.asCell());
  };
}

export function loadContext(slice: Slice) {
  const sc_0 = slice;
  const _bounceable = sc_0.loadBit();
  const _sender = sc_0.loadAddress();
  const _value = sc_0.loadIntBig(257);
  const _raw = sc_0.loadRef().asSlice();
  return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadTupleContext(source: TupleReader) {
  const _bounceable = source.readBoolean();
  const _sender = source.readAddress();
  const _value = source.readBigNumber();
  const _raw = source.readCell().asSlice();
  return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadGetterTupleContext(source: TupleReader) {
  const _bounceable = source.readBoolean();
  const _sender = source.readAddress();
  const _value = source.readBigNumber();
  const _raw = source.readCell().asSlice();
  return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function storeTupleContext(source: Context) {
  const builder = new TupleBuilder();
  builder.writeBoolean(source.bounceable);
  builder.writeAddress(source.sender);
  builder.writeNumber(source.value);
  builder.writeSlice(source.raw.asCell());
  return builder.build();
}

export function dictValueParserContext(): DictionaryValue<Context> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeContext(src)).endCell());
    },
    parse: (src) => {
      return loadContext(src.loadRef().beginParse());
    }
  }
}

export type SendParameters = {
  $$type: 'SendParameters';
  mode: bigint;
  body: Cell | null;
  code: Cell | null;
  data: Cell | null;
  value: bigint;
  to: Address;
  bounce: boolean;
}

export function storeSendParameters(src: SendParameters) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeInt(src.mode, 257);
    if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
    if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
    if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    b_0.storeInt(src.value, 257);
    b_0.storeAddress(src.to);
    b_0.storeBit(src.bounce);
  };
}

export function loadSendParameters(slice: Slice) {
  const sc_0 = slice;
  const _mode = sc_0.loadIntBig(257);
  const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
  const _code = sc_0.loadBit() ? sc_0.loadRef() : null;
  const _data = sc_0.loadBit() ? sc_0.loadRef() : null;
  const _value = sc_0.loadIntBig(257);
  const _to = sc_0.loadAddress();
  const _bounce = sc_0.loadBit();
  return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleSendParameters(source: TupleReader) {
  const _mode = source.readBigNumber();
  const _body = source.readCellOpt();
  const _code = source.readCellOpt();
  const _data = source.readCellOpt();
  const _value = source.readBigNumber();
  const _to = source.readAddress();
  const _bounce = source.readBoolean();
  return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleSendParameters(source: TupleReader) {
  const _mode = source.readBigNumber();
  const _body = source.readCellOpt();
  const _code = source.readCellOpt();
  const _data = source.readCellOpt();
  const _value = source.readBigNumber();
  const _to = source.readAddress();
  const _bounce = source.readBoolean();
  return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleSendParameters(source: SendParameters) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.mode);
  builder.writeCell(source.body);
  builder.writeCell(source.code);
  builder.writeCell(source.data);
  builder.writeNumber(source.value);
  builder.writeAddress(source.to);
  builder.writeBoolean(source.bounce);
  return builder.build();
}

export function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
    },
    parse: (src) => {
      return loadSendParameters(src.loadRef().beginParse());
    }
  }
}

export type MessageParameters = {
  $$type: 'MessageParameters';
  mode: bigint;
  body: Cell | null;
  value: bigint;
  to: Address;
  bounce: boolean;
}

export function storeMessageParameters(src: MessageParameters) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeInt(src.mode, 257);
    if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
    b_0.storeInt(src.value, 257);
    b_0.storeAddress(src.to);
    b_0.storeBit(src.bounce);
  };
}

export function loadMessageParameters(slice: Slice) {
  const sc_0 = slice;
  const _mode = sc_0.loadIntBig(257);
  const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
  const _value = sc_0.loadIntBig(257);
  const _to = sc_0.loadAddress();
  const _bounce = sc_0.loadBit();
  return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleMessageParameters(source: TupleReader) {
  const _mode = source.readBigNumber();
  const _body = source.readCellOpt();
  const _value = source.readBigNumber();
  const _to = source.readAddress();
  const _bounce = source.readBoolean();
  return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleMessageParameters(source: TupleReader) {
  const _mode = source.readBigNumber();
  const _body = source.readCellOpt();
  const _value = source.readBigNumber();
  const _to = source.readAddress();
  const _bounce = source.readBoolean();
  return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleMessageParameters(source: MessageParameters) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.mode);
  builder.writeCell(source.body);
  builder.writeNumber(source.value);
  builder.writeAddress(source.to);
  builder.writeBoolean(source.bounce);
  return builder.build();
}

export function dictValueParserMessageParameters(): DictionaryValue<MessageParameters> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeMessageParameters(src)).endCell());
    },
    parse: (src) => {
      return loadMessageParameters(src.loadRef().beginParse());
    }
  }
}

export type DeployParameters = {
  $$type: 'DeployParameters';
  mode: bigint;
  body: Cell | null;
  value: bigint;
  bounce: boolean;
  init: StateInit;
}

export function storeDeployParameters(src: DeployParameters) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeInt(src.mode, 257);
    if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
    b_0.storeInt(src.value, 257);
    b_0.storeBit(src.bounce);
    b_0.store(storeStateInit(src.init));
  };
}

export function loadDeployParameters(slice: Slice) {
  const sc_0 = slice;
  const _mode = sc_0.loadIntBig(257);
  const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
  const _value = sc_0.loadIntBig(257);
  const _bounce = sc_0.loadBit();
  const _init = loadStateInit(sc_0);
  return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadTupleDeployParameters(source: TupleReader) {
  const _mode = source.readBigNumber();
  const _body = source.readCellOpt();
  const _value = source.readBigNumber();
  const _bounce = source.readBoolean();
  const _init = loadTupleStateInit(source);
  return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadGetterTupleDeployParameters(source: TupleReader) {
  const _mode = source.readBigNumber();
  const _body = source.readCellOpt();
  const _value = source.readBigNumber();
  const _bounce = source.readBoolean();
  const _init = loadGetterTupleStateInit(source);
  return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function storeTupleDeployParameters(source: DeployParameters) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.mode);
  builder.writeCell(source.body);
  builder.writeNumber(source.value);
  builder.writeBoolean(source.bounce);
  builder.writeTuple(storeTupleStateInit(source.init));
  return builder.build();
}

export function dictValueParserDeployParameters(): DictionaryValue<DeployParameters> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeDeployParameters(src)).endCell());
    },
    parse: (src) => {
      return loadDeployParameters(src.loadRef().beginParse());
    }
  }
}

export type StdAddress = {
  $$type: 'StdAddress';
  workchain: bigint;
  address: bigint;
}

export function storeStdAddress(src: StdAddress) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeInt(src.workchain, 8);
    b_0.storeUint(src.address, 256);
  };
}

export function loadStdAddress(slice: Slice) {
  const sc_0 = slice;
  const _workchain = sc_0.loadIntBig(8);
  const _address = sc_0.loadUintBig(256);
  return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleStdAddress(source: TupleReader) {
  const _workchain = source.readBigNumber();
  const _address = source.readBigNumber();
  return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleStdAddress(source: TupleReader) {
  const _workchain = source.readBigNumber();
  const _address = source.readBigNumber();
  return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleStdAddress(source: StdAddress) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.workchain);
  builder.writeNumber(source.address);
  return builder.build();
}

export function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
    },
    parse: (src) => {
      return loadStdAddress(src.loadRef().beginParse());
    }
  }
}

export type VarAddress = {
  $$type: 'VarAddress';
  workchain: bigint;
  address: Slice;
}

export function storeVarAddress(src: VarAddress) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeInt(src.workchain, 32);
    b_0.storeRef(src.address.asCell());
  };
}

export function loadVarAddress(slice: Slice) {
  const sc_0 = slice;
  const _workchain = sc_0.loadIntBig(32);
  const _address = sc_0.loadRef().asSlice();
  return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleVarAddress(source: TupleReader) {
  const _workchain = source.readBigNumber();
  const _address = source.readCell().asSlice();
  return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleVarAddress(source: TupleReader) {
  const _workchain = source.readBigNumber();
  const _address = source.readCell().asSlice();
  return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleVarAddress(source: VarAddress) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.workchain);
  builder.writeSlice(source.address.asCell());
  return builder.build();
}

export function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
    },
    parse: (src) => {
      return loadVarAddress(src.loadRef().beginParse());
    }
  }
}

export type BasechainAddress = {
  $$type: 'BasechainAddress';
  hash: bigint | null;
}

export function storeBasechainAddress(src: BasechainAddress) {
  return (builder: Builder) => {
    const b_0 = builder;
    if (src.hash !== null && src.hash !== undefined) { b_0.storeBit(true).storeInt(src.hash, 257); } else { b_0.storeBit(false); }
  };
}

export function loadBasechainAddress(slice: Slice) {
  const sc_0 = slice;
  const _hash = sc_0.loadBit() ? sc_0.loadIntBig(257) : null;
  return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadTupleBasechainAddress(source: TupleReader) {
  const _hash = source.readBigNumberOpt();
  return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadGetterTupleBasechainAddress(source: TupleReader) {
  const _hash = source.readBigNumberOpt();
  return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function storeTupleBasechainAddress(source: BasechainAddress) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.hash);
  return builder.build();
}

export function dictValueParserBasechainAddress(): DictionaryValue<BasechainAddress> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeBasechainAddress(src)).endCell());
    },
    parse: (src) => {
      return loadBasechainAddress(src.loadRef().beginParse());
    }
  }
}

export type ChangeOwner = {
  $$type: 'ChangeOwner';
  queryId: bigint;
  newOwner: Address;
}

export function storeChangeOwner(src: ChangeOwner) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(2174598809, 32);
    b_0.storeUint(src.queryId, 64);
    b_0.storeAddress(src.newOwner);
  };
}

export function loadChangeOwner(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 2174598809) { throw Error('Invalid prefix'); }
  const _queryId = sc_0.loadUintBig(64);
  const _newOwner = sc_0.loadAddress();
  return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

export function loadTupleChangeOwner(source: TupleReader) {
  const _queryId = source.readBigNumber();
  const _newOwner = source.readAddress();
  return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

export function loadGetterTupleChangeOwner(source: TupleReader) {
  const _queryId = source.readBigNumber();
  const _newOwner = source.readAddress();
  return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

export function storeTupleChangeOwner(source: ChangeOwner) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.queryId);
  builder.writeAddress(source.newOwner);
  return builder.build();
}

export function dictValueParserChangeOwner(): DictionaryValue<ChangeOwner> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeChangeOwner(src)).endCell());
    },
    parse: (src) => {
      return loadChangeOwner(src.loadRef().beginParse());
    }
  }
}

export type ChangeOwnerOk = {
  $$type: 'ChangeOwnerOk';
  queryId: bigint;
  newOwner: Address;
}

export function storeChangeOwnerOk(src: ChangeOwnerOk) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(846932810, 32);
    b_0.storeUint(src.queryId, 64);
    b_0.storeAddress(src.newOwner);
  };
}

export function loadChangeOwnerOk(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 846932810) { throw Error('Invalid prefix'); }
  const _queryId = sc_0.loadUintBig(64);
  const _newOwner = sc_0.loadAddress();
  return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

export function loadTupleChangeOwnerOk(source: TupleReader) {
  const _queryId = source.readBigNumber();
  const _newOwner = source.readAddress();
  return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

export function loadGetterTupleChangeOwnerOk(source: TupleReader) {
  const _queryId = source.readBigNumber();
  const _newOwner = source.readAddress();
  return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

export function storeTupleChangeOwnerOk(source: ChangeOwnerOk) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.queryId);
  builder.writeAddress(source.newOwner);
  return builder.build();
}

export function dictValueParserChangeOwnerOk(): DictionaryValue<ChangeOwnerOk> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeChangeOwnerOk(src)).endCell());
    },
    parse: (src) => {
      return loadChangeOwnerOk(src.loadRef().beginParse());
    }
  }
}

export type Deploy = {
  $$type: 'Deploy';
  queryId: bigint;
}

export function storeDeploy(src: Deploy) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(2490013878, 32);
    b_0.storeUint(src.queryId, 64);
  };
}

export function loadDeploy(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
  const _queryId = sc_0.loadUintBig(64);
  return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadTupleDeploy(source: TupleReader) {
  const _queryId = source.readBigNumber();
  return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadGetterTupleDeploy(source: TupleReader) {
  const _queryId = source.readBigNumber();
  return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function storeTupleDeploy(source: Deploy) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.queryId);
  return builder.build();
}

export function dictValueParserDeploy(): DictionaryValue<Deploy> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
    },
    parse: (src) => {
      return loadDeploy(src.loadRef().beginParse());
    }
  }
}

export type DeployOk = {
  $$type: 'DeployOk';
  queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(2952335191, 32);
    b_0.storeUint(src.queryId, 64);
  };
}

export function loadDeployOk(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
  const _queryId = sc_0.loadUintBig(64);
  return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadTupleDeployOk(source: TupleReader) {
  const _queryId = source.readBigNumber();
  return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadGetterTupleDeployOk(source: TupleReader) {
  const _queryId = source.readBigNumber();
  return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function storeTupleDeployOk(source: DeployOk) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.queryId);
  return builder.build();
}

export function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
    },
    parse: (src) => {
      return loadDeployOk(src.loadRef().beginParse());
    }
  }
}

export type FactoryDeploy = {
  $$type: 'FactoryDeploy';
  queryId: bigint;
  cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(1829761339, 32);
    b_0.storeUint(src.queryId, 64);
    b_0.storeAddress(src.cashback);
  };
}

export function loadFactoryDeploy(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
  const _queryId = sc_0.loadUintBig(64);
  const _cashback = sc_0.loadAddress();
  return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadTupleFactoryDeploy(source: TupleReader) {
  const _queryId = source.readBigNumber();
  const _cashback = source.readAddress();
  return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadGetterTupleFactoryDeploy(source: TupleReader) {
  const _queryId = source.readBigNumber();
  const _cashback = source.readAddress();
  return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function storeTupleFactoryDeploy(source: FactoryDeploy) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.queryId);
  builder.writeAddress(source.cashback);
  return builder.build();
}

export function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
    },
    parse: (src) => {
      return loadFactoryDeploy(src.loadRef().beginParse());
    }
  }
}

export type CreateEmptyGameMsg = {
  $$type: 'CreateEmptyGameMsg';
  gameId: bigint;
}

export function storeCreateEmptyGameMsg(src: CreateEmptyGameMsg) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(253439376, 32);
    b_0.storeUint(src.gameId, 256);
  };
}

export function loadCreateEmptyGameMsg(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 253439376) { throw Error('Invalid prefix'); }
  const _gameId = sc_0.loadUintBig(256);
  return { $$type: 'CreateEmptyGameMsg' as const, gameId: _gameId };
}

export function loadTupleCreateEmptyGameMsg(source: TupleReader) {
  const _gameId = source.readBigNumber();
  return { $$type: 'CreateEmptyGameMsg' as const, gameId: _gameId };
}

export function loadGetterTupleCreateEmptyGameMsg(source: TupleReader) {
  const _gameId = source.readBigNumber();
  return { $$type: 'CreateEmptyGameMsg' as const, gameId: _gameId };
}

export function storeTupleCreateEmptyGameMsg(source: CreateEmptyGameMsg) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.gameId);
  return builder.build();
}

export function dictValueParserCreateEmptyGameMsg(): DictionaryValue<CreateEmptyGameMsg> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeCreateEmptyGameMsg(src)).endCell());
    },
    parse: (src) => {
      return loadCreateEmptyGameMsg(src.loadRef().beginParse());
    }
  }
}

export type SetServiceFeeMsg = {
  $$type: 'SetServiceFeeMsg';
  newValue: bigint;
}

export function storeSetServiceFeeMsg(src: SetServiceFeeMsg) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(3441994003, 32);
    b_0.storeUint(src.newValue, 32);
  };
}

export function loadSetServiceFeeMsg(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 3441994003) { throw Error('Invalid prefix'); }
  const _newValue = sc_0.loadUintBig(32);
  return { $$type: 'SetServiceFeeMsg' as const, newValue: _newValue };
}

export function loadTupleSetServiceFeeMsg(source: TupleReader) {
  const _newValue = source.readBigNumber();
  return { $$type: 'SetServiceFeeMsg' as const, newValue: _newValue };
}

export function loadGetterTupleSetServiceFeeMsg(source: TupleReader) {
  const _newValue = source.readBigNumber();
  return { $$type: 'SetServiceFeeMsg' as const, newValue: _newValue };
}

export function storeTupleSetServiceFeeMsg(source: SetServiceFeeMsg) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.newValue);
  return builder.build();
}

export function dictValueParserSetServiceFeeMsg(): DictionaryValue<SetServiceFeeMsg> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeSetServiceFeeMsg(src)).endCell());
    },
    parse: (src) => {
      return loadSetServiceFeeMsg(src.loadRef().beginParse());
    }
  }
}

export type SetReferrerFeeMsg = {
  $$type: 'SetReferrerFeeMsg';
  newValue: bigint;
}

export function storeSetReferrerFeeMsg(src: SetReferrerFeeMsg) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(1971523271, 32);
    b_0.storeUint(src.newValue, 32);
  };
}

export function loadSetReferrerFeeMsg(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 1971523271) { throw Error('Invalid prefix'); }
  const _newValue = sc_0.loadUintBig(32);
  return { $$type: 'SetReferrerFeeMsg' as const, newValue: _newValue };
}

export function loadTupleSetReferrerFeeMsg(source: TupleReader) {
  const _newValue = source.readBigNumber();
  return { $$type: 'SetReferrerFeeMsg' as const, newValue: _newValue };
}

export function loadGetterTupleSetReferrerFeeMsg(source: TupleReader) {
  const _newValue = source.readBigNumber();
  return { $$type: 'SetReferrerFeeMsg' as const, newValue: _newValue };
}

export function storeTupleSetReferrerFeeMsg(source: SetReferrerFeeMsg) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.newValue);
  return builder.build();
}

export function dictValueParserSetReferrerFeeMsg(): DictionaryValue<SetReferrerFeeMsg> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeSetReferrerFeeMsg(src)).endCell());
    },
    parse: (src) => {
      return loadSetReferrerFeeMsg(src.loadRef().beginParse());
    }
  }
}

export type SetFeeReceiverMsg = {
  $$type: 'SetFeeReceiverMsg';
  newReceiver: Address;
}

export function storeSetFeeReceiverMsg(src: SetFeeReceiverMsg) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(3887204533, 32);
    b_0.storeAddress(src.newReceiver);
  };
}

export function loadSetFeeReceiverMsg(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 3887204533) { throw Error('Invalid prefix'); }
  const _newReceiver = sc_0.loadAddress();
  return { $$type: 'SetFeeReceiverMsg' as const, newReceiver: _newReceiver };
}

export function loadTupleSetFeeReceiverMsg(source: TupleReader) {
  const _newReceiver = source.readAddress();
  return { $$type: 'SetFeeReceiverMsg' as const, newReceiver: _newReceiver };
}

export function loadGetterTupleSetFeeReceiverMsg(source: TupleReader) {
  const _newReceiver = source.readAddress();
  return { $$type: 'SetFeeReceiverMsg' as const, newReceiver: _newReceiver };
}

export function storeTupleSetFeeReceiverMsg(source: SetFeeReceiverMsg) {
  const builder = new TupleBuilder();
  builder.writeAddress(source.newReceiver);
  return builder.build();
}

export function dictValueParserSetFeeReceiverMsg(): DictionaryValue<SetFeeReceiverMsg> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeSetFeeReceiverMsg(src)).endCell());
    },
    parse: (src) => {
      return loadSetFeeReceiverMsg(src.loadRef().beginParse());
    }
  }
}

export type SetLowestBidMsg = {
  $$type: 'SetLowestBidMsg';
  newValue: bigint;
}

export function storeSetLowestBidMsg(src: SetLowestBidMsg) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(3710779798, 32);
    b_0.storeUint(src.newValue, 256);
  };
}

export function loadSetLowestBidMsg(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 3710779798) { throw Error('Invalid prefix'); }
  const _newValue = sc_0.loadUintBig(256);
  return { $$type: 'SetLowestBidMsg' as const, newValue: _newValue };
}

export function loadTupleSetLowestBidMsg(source: TupleReader) {
  const _newValue = source.readBigNumber();
  return { $$type: 'SetLowestBidMsg' as const, newValue: _newValue };
}

export function loadGetterTupleSetLowestBidMsg(source: TupleReader) {
  const _newValue = source.readBigNumber();
  return { $$type: 'SetLowestBidMsg' as const, newValue: _newValue };
}

export function storeTupleSetLowestBidMsg(source: SetLowestBidMsg) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.newValue);
  return builder.build();
}

export function dictValueParserSetLowestBidMsg(): DictionaryValue<SetLowestBidMsg> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeSetLowestBidMsg(src)).endCell());
    },
    parse: (src) => {
      return loadSetLowestBidMsg(src.loadRef().beginParse());
    }
  }
}

export type SetHighestBidMsg = {
  $$type: 'SetHighestBidMsg';
  newValue: bigint;
}

export function storeSetHighestBidMsg(src: SetHighestBidMsg) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(335501441, 32);
    b_0.storeUint(src.newValue, 256);
  };
}

export function loadSetHighestBidMsg(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 335501441) { throw Error('Invalid prefix'); }
  const _newValue = sc_0.loadUintBig(256);
  return { $$type: 'SetHighestBidMsg' as const, newValue: _newValue };
}

export function loadTupleSetHighestBidMsg(source: TupleReader) {
  const _newValue = source.readBigNumber();
  return { $$type: 'SetHighestBidMsg' as const, newValue: _newValue };
}

export function loadGetterTupleSetHighestBidMsg(source: TupleReader) {
  const _newValue = source.readBigNumber();
  return { $$type: 'SetHighestBidMsg' as const, newValue: _newValue };
}

export function storeTupleSetHighestBidMsg(source: SetHighestBidMsg) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.newValue);
  return builder.build();
}

export function dictValueParserSetHighestBidMsg(): DictionaryValue<SetHighestBidMsg> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeSetHighestBidMsg(src)).endCell());
    },
    parse: (src) => {
      return loadSetHighestBidMsg(src.loadRef().beginParse());
    }
  }
}

export type SetWaitingForOpenBidSecondsMsg = {
  $$type: 'SetWaitingForOpenBidSecondsMsg';
  newValue: bigint;
}

export function storeSetWaitingForOpenBidSecondsMsg(src: SetWaitingForOpenBidSecondsMsg) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(2871718913, 32);
    b_0.storeUint(src.newValue, 256);
  };
}

export function loadSetWaitingForOpenBidSecondsMsg(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 2871718913) { throw Error('Invalid prefix'); }
  const _newValue = sc_0.loadUintBig(256);
  return { $$type: 'SetWaitingForOpenBidSecondsMsg' as const, newValue: _newValue };
}

export function loadTupleSetWaitingForOpenBidSecondsMsg(source: TupleReader) {
  const _newValue = source.readBigNumber();
  return { $$type: 'SetWaitingForOpenBidSecondsMsg' as const, newValue: _newValue };
}

export function loadGetterTupleSetWaitingForOpenBidSecondsMsg(source: TupleReader) {
  const _newValue = source.readBigNumber();
  return { $$type: 'SetWaitingForOpenBidSecondsMsg' as const, newValue: _newValue };
}

export function storeTupleSetWaitingForOpenBidSecondsMsg(source: SetWaitingForOpenBidSecondsMsg) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.newValue);
  return builder.build();
}

export function dictValueParserSetWaitingForOpenBidSecondsMsg(): DictionaryValue<SetWaitingForOpenBidSecondsMsg> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeSetWaitingForOpenBidSecondsMsg(src)).endCell());
    },
    parse: (src) => {
      return loadSetWaitingForOpenBidSecondsMsg(src.loadRef().beginParse());
    }
  }
}

export type SetMinReferrerPayoutValueMsg = {
  $$type: 'SetMinReferrerPayoutValueMsg';
  newValue: bigint;
}

export function storeSetMinReferrerPayoutValueMsg(src: SetMinReferrerPayoutValueMsg) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(429174101, 32);
    b_0.storeUint(src.newValue, 256);
  };
}

export function loadSetMinReferrerPayoutValueMsg(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 429174101) { throw Error('Invalid prefix'); }
  const _newValue = sc_0.loadUintBig(256);
  return { $$type: 'SetMinReferrerPayoutValueMsg' as const, newValue: _newValue };
}

export function loadTupleSetMinReferrerPayoutValueMsg(source: TupleReader) {
  const _newValue = source.readBigNumber();
  return { $$type: 'SetMinReferrerPayoutValueMsg' as const, newValue: _newValue };
}

export function loadGetterTupleSetMinReferrerPayoutValueMsg(source: TupleReader) {
  const _newValue = source.readBigNumber();
  return { $$type: 'SetMinReferrerPayoutValueMsg' as const, newValue: _newValue };
}

export function storeTupleSetMinReferrerPayoutValueMsg(source: SetMinReferrerPayoutValueMsg) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.newValue);
  return builder.build();
}

export function dictValueParserSetMinReferrerPayoutValueMsg(): DictionaryValue<SetMinReferrerPayoutValueMsg> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeSetMinReferrerPayoutValueMsg(src)).endCell());
    },
    parse: (src) => {
      return loadSetMinReferrerPayoutValueMsg(src.loadRef().beginParse());
    }
  }
}

export type GameCreatedResponse = {
  $$type: 'GameCreatedResponse';
  gameId: bigint;
  gameAddress: Address;
}

export function storeGameCreatedResponse(src: GameCreatedResponse) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(3945039031, 32);
    b_0.storeUint(src.gameId, 256);
    b_0.storeAddress(src.gameAddress);
  };
}

export function loadGameCreatedResponse(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 3945039031) { throw Error('Invalid prefix'); }
  const _gameId = sc_0.loadUintBig(256);
  const _gameAddress = sc_0.loadAddress();
  return { $$type: 'GameCreatedResponse' as const, gameId: _gameId, gameAddress: _gameAddress };
}

export function loadTupleGameCreatedResponse(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _gameAddress = source.readAddress();
  return { $$type: 'GameCreatedResponse' as const, gameId: _gameId, gameAddress: _gameAddress };
}

export function loadGetterTupleGameCreatedResponse(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _gameAddress = source.readAddress();
  return { $$type: 'GameCreatedResponse' as const, gameId: _gameId, gameAddress: _gameAddress };
}

export function storeTupleGameCreatedResponse(source: GameCreatedResponse) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.gameId);
  builder.writeAddress(source.gameAddress);
  return builder.build();
}

export function dictValueParserGameCreatedResponse(): DictionaryValue<GameCreatedResponse> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeGameCreatedResponse(src)).endCell());
    },
    parse: (src) => {
      return loadGameCreatedResponse(src.loadRef().beginParse());
    }
  }
}

export type CreateGameAndOpenBidsMsg = {
  $$type: 'CreateGameAndOpenBidsMsg';
  bidValue: bigint;
  secret: bigint;
  referrer: Address | null;
  gameIdsToOpen: Dictionary<number, bigint>;
  keysToOpen: Dictionary<number, bigint>;
  count: bigint;
}

export function storeCreateGameAndOpenBidsMsg(src: CreateGameAndOpenBidsMsg) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(3220317951, 32);
    b_0.storeCoins(src.bidValue);
    b_0.storeUint(src.secret, 256);
    b_0.storeAddress(src.referrer);
    b_0.storeDict(src.gameIdsToOpen, Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256));
    b_0.storeDict(src.keysToOpen, Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256));
    b_0.storeUint(src.count, 16);
  };
}

export function loadCreateGameAndOpenBidsMsg(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 3220317951) { throw Error('Invalid prefix'); }
  const _bidValue = sc_0.loadCoins();
  const _secret = sc_0.loadUintBig(256);
  const _referrer = sc_0.loadMaybeAddress();
  const _gameIdsToOpen = Dictionary.load(Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256), sc_0);
  const _keysToOpen = Dictionary.load(Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256), sc_0);
  const _count = sc_0.loadUintBig(16);
  return { $$type: 'CreateGameAndOpenBidsMsg' as const, bidValue: _bidValue, secret: _secret, referrer: _referrer, gameIdsToOpen: _gameIdsToOpen, keysToOpen: _keysToOpen, count: _count };
}

export function loadTupleCreateGameAndOpenBidsMsg(source: TupleReader) {
  const _bidValue = source.readBigNumber();
  const _secret = source.readBigNumber();
  const _referrer = source.readAddressOpt();
  const _gameIdsToOpen = Dictionary.loadDirect(Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256), source.readCellOpt());
  const _keysToOpen = Dictionary.loadDirect(Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256), source.readCellOpt());
  const _count = source.readBigNumber();
  return { $$type: 'CreateGameAndOpenBidsMsg' as const, bidValue: _bidValue, secret: _secret, referrer: _referrer, gameIdsToOpen: _gameIdsToOpen, keysToOpen: _keysToOpen, count: _count };
}

export function loadGetterTupleCreateGameAndOpenBidsMsg(source: TupleReader) {
  const _bidValue = source.readBigNumber();
  const _secret = source.readBigNumber();
  const _referrer = source.readAddressOpt();
  const _gameIdsToOpen = Dictionary.loadDirect(Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256), source.readCellOpt());
  const _keysToOpen = Dictionary.loadDirect(Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256), source.readCellOpt());
  const _count = source.readBigNumber();
  return { $$type: 'CreateGameAndOpenBidsMsg' as const, bidValue: _bidValue, secret: _secret, referrer: _referrer, gameIdsToOpen: _gameIdsToOpen, keysToOpen: _keysToOpen, count: _count };
}

export function storeTupleCreateGameAndOpenBidsMsg(source: CreateGameAndOpenBidsMsg) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.bidValue);
  builder.writeNumber(source.secret);
  builder.writeAddress(source.referrer);
  builder.writeCell(source.gameIdsToOpen.size > 0 ? beginCell().storeDictDirect(source.gameIdsToOpen, Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256)).endCell() : null);
  builder.writeCell(source.keysToOpen.size > 0 ? beginCell().storeDictDirect(source.keysToOpen, Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256)).endCell() : null);
  builder.writeNumber(source.count);
  return builder.build();
}

export function dictValueParserCreateGameAndOpenBidsMsg(): DictionaryValue<CreateGameAndOpenBidsMsg> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeCreateGameAndOpenBidsMsg(src)).endCell());
    },
    parse: (src) => {
      return loadCreateGameAndOpenBidsMsg(src.loadRef().beginParse());
    }
  }
}

export type JoinGameAndOpenBidsMsg = {
  $$type: 'JoinGameAndOpenBidsMsg';
  gameId: bigint;
  bidValue: bigint;
  secret: bigint;
  referrer: Address | null;
  gameIdsToOpen: Dictionary<number, bigint>;
  keysToOpen: Dictionary<number, bigint>;
  count: bigint;
}

export function storeJoinGameAndOpenBidsMsg(src: JoinGameAndOpenBidsMsg) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(3735868027, 32);
    b_0.storeUint(src.gameId, 256);
    b_0.storeCoins(src.bidValue);
    b_0.storeUint(src.secret, 256);
    b_0.storeAddress(src.referrer);
    b_0.storeDict(src.gameIdsToOpen, Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256));
    b_0.storeDict(src.keysToOpen, Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256));
    b_0.storeUint(src.count, 16);
  };
}

export function loadJoinGameAndOpenBidsMsg(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 3735868027) { throw Error('Invalid prefix'); }
  const _gameId = sc_0.loadUintBig(256);
  const _bidValue = sc_0.loadCoins();
  const _secret = sc_0.loadUintBig(256);
  const _referrer = sc_0.loadMaybeAddress();
  const _gameIdsToOpen = Dictionary.load(Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256), sc_0);
  const _keysToOpen = Dictionary.load(Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256), sc_0);
  const _count = sc_0.loadUintBig(16);
  return { $$type: 'JoinGameAndOpenBidsMsg' as const, gameId: _gameId, bidValue: _bidValue, secret: _secret, referrer: _referrer, gameIdsToOpen: _gameIdsToOpen, keysToOpen: _keysToOpen, count: _count };
}

export function loadTupleJoinGameAndOpenBidsMsg(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _bidValue = source.readBigNumber();
  const _secret = source.readBigNumber();
  const _referrer = source.readAddressOpt();
  const _gameIdsToOpen = Dictionary.loadDirect(Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256), source.readCellOpt());
  const _keysToOpen = Dictionary.loadDirect(Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256), source.readCellOpt());
  const _count = source.readBigNumber();
  return { $$type: 'JoinGameAndOpenBidsMsg' as const, gameId: _gameId, bidValue: _bidValue, secret: _secret, referrer: _referrer, gameIdsToOpen: _gameIdsToOpen, keysToOpen: _keysToOpen, count: _count };
}

export function loadGetterTupleJoinGameAndOpenBidsMsg(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _bidValue = source.readBigNumber();
  const _secret = source.readBigNumber();
  const _referrer = source.readAddressOpt();
  const _gameIdsToOpen = Dictionary.loadDirect(Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256), source.readCellOpt());
  const _keysToOpen = Dictionary.loadDirect(Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256), source.readCellOpt());
  const _count = source.readBigNumber();
  return { $$type: 'JoinGameAndOpenBidsMsg' as const, gameId: _gameId, bidValue: _bidValue, secret: _secret, referrer: _referrer, gameIdsToOpen: _gameIdsToOpen, keysToOpen: _keysToOpen, count: _count };
}

export function storeTupleJoinGameAndOpenBidsMsg(source: JoinGameAndOpenBidsMsg) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.gameId);
  builder.writeNumber(source.bidValue);
  builder.writeNumber(source.secret);
  builder.writeAddress(source.referrer);
  builder.writeCell(source.gameIdsToOpen.size > 0 ? beginCell().storeDictDirect(source.gameIdsToOpen, Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256)).endCell() : null);
  builder.writeCell(source.keysToOpen.size > 0 ? beginCell().storeDictDirect(source.keysToOpen, Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256)).endCell() : null);
  builder.writeNumber(source.count);
  return builder.build();
}

export function dictValueParserJoinGameAndOpenBidsMsg(): DictionaryValue<JoinGameAndOpenBidsMsg> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeJoinGameAndOpenBidsMsg(src)).endCell());
    },
    parse: (src) => {
      return loadJoinGameAndOpenBidsMsg(src.loadRef().beginParse());
    }
  }
}

export type OpenMultipleGamesMsg = {
  $$type: 'OpenMultipleGamesMsg';
  gameIdsToOpen: Dictionary<number, bigint>;
  keysToOpen: Dictionary<number, bigint>;
  count: bigint;
}

export function storeOpenMultipleGamesMsg(src: OpenMultipleGamesMsg) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(3766232339, 32);
    b_0.storeDict(src.gameIdsToOpen, Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256));
    b_0.storeDict(src.keysToOpen, Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256));
    b_0.storeUint(src.count, 16);
  };
}

export function loadOpenMultipleGamesMsg(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 3766232339) { throw Error('Invalid prefix'); }
  const _gameIdsToOpen = Dictionary.load(Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256), sc_0);
  const _keysToOpen = Dictionary.load(Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256), sc_0);
  const _count = sc_0.loadUintBig(16);
  return { $$type: 'OpenMultipleGamesMsg' as const, gameIdsToOpen: _gameIdsToOpen, keysToOpen: _keysToOpen, count: _count };
}

export function loadTupleOpenMultipleGamesMsg(source: TupleReader) {
  const _gameIdsToOpen = Dictionary.loadDirect(Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256), source.readCellOpt());
  const _keysToOpen = Dictionary.loadDirect(Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256), source.readCellOpt());
  const _count = source.readBigNumber();
  return { $$type: 'OpenMultipleGamesMsg' as const, gameIdsToOpen: _gameIdsToOpen, keysToOpen: _keysToOpen, count: _count };
}

export function loadGetterTupleOpenMultipleGamesMsg(source: TupleReader) {
  const _gameIdsToOpen = Dictionary.loadDirect(Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256), source.readCellOpt());
  const _keysToOpen = Dictionary.loadDirect(Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256), source.readCellOpt());
  const _count = source.readBigNumber();
  return { $$type: 'OpenMultipleGamesMsg' as const, gameIdsToOpen: _gameIdsToOpen, keysToOpen: _keysToOpen, count: _count };
}

export function storeTupleOpenMultipleGamesMsg(source: OpenMultipleGamesMsg) {
  const builder = new TupleBuilder();
  builder.writeCell(source.gameIdsToOpen.size > 0 ? beginCell().storeDictDirect(source.gameIdsToOpen, Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256)).endCell() : null);
  builder.writeCell(source.keysToOpen.size > 0 ? beginCell().storeDictDirect(source.keysToOpen, Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256)).endCell() : null);
  builder.writeNumber(source.count);
  return builder.build();
}

export function dictValueParserOpenMultipleGamesMsg(): DictionaryValue<OpenMultipleGamesMsg> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeOpenMultipleGamesMsg(src)).endCell());
    },
    parse: (src) => {
      return loadOpenMultipleGamesMsg(src.loadRef().beginParse());
    }
  }
}

export type CreateGameMsg = {
  $$type: 'CreateGameMsg';
  bidValue: bigint;
  secret: bigint;
  referrer: Address | null;
}

export function storeCreateGameMsg(src: CreateGameMsg) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(260122099, 32);
    b_0.storeCoins(src.bidValue);
    b_0.storeUint(src.secret, 256);
    b_0.storeAddress(src.referrer);
  };
}

export function loadCreateGameMsg(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 260122099) { throw Error('Invalid prefix'); }
  const _bidValue = sc_0.loadCoins();
  const _secret = sc_0.loadUintBig(256);
  const _referrer = sc_0.loadMaybeAddress();
  return { $$type: 'CreateGameMsg' as const, bidValue: _bidValue, secret: _secret, referrer: _referrer };
}

export function loadTupleCreateGameMsg(source: TupleReader) {
  const _bidValue = source.readBigNumber();
  const _secret = source.readBigNumber();
  const _referrer = source.readAddressOpt();
  return { $$type: 'CreateGameMsg' as const, bidValue: _bidValue, secret: _secret, referrer: _referrer };
}

export function loadGetterTupleCreateGameMsg(source: TupleReader) {
  const _bidValue = source.readBigNumber();
  const _secret = source.readBigNumber();
  const _referrer = source.readAddressOpt();
  return { $$type: 'CreateGameMsg' as const, bidValue: _bidValue, secret: _secret, referrer: _referrer };
}

export function storeTupleCreateGameMsg(source: CreateGameMsg) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.bidValue);
  builder.writeNumber(source.secret);
  builder.writeAddress(source.referrer);
  return builder.build();
}

export function dictValueParserCreateGameMsg(): DictionaryValue<CreateGameMsg> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeCreateGameMsg(src)).endCell());
    },
    parse: (src) => {
      return loadCreateGameMsg(src.loadRef().beginParse());
    }
  }
}

export type ForwardOpenBidMsg = {
  $$type: 'ForwardOpenBidMsg';
  gameId: bigint;
  key: bigint;
}

export function storeForwardOpenBidMsg(src: ForwardOpenBidMsg) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(3537668725, 32);
    b_0.storeUint(src.gameId, 256);
    b_0.storeUint(src.key, 256);
  };
}

export function loadForwardOpenBidMsg(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 3537668725) { throw Error('Invalid prefix'); }
  const _gameId = sc_0.loadUintBig(256);
  const _key = sc_0.loadUintBig(256);
  return { $$type: 'ForwardOpenBidMsg' as const, gameId: _gameId, key: _key };
}

export function loadTupleForwardOpenBidMsg(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _key = source.readBigNumber();
  return { $$type: 'ForwardOpenBidMsg' as const, gameId: _gameId, key: _key };
}

export function loadGetterTupleForwardOpenBidMsg(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _key = source.readBigNumber();
  return { $$type: 'ForwardOpenBidMsg' as const, gameId: _gameId, key: _key };
}

export function storeTupleForwardOpenBidMsg(source: ForwardOpenBidMsg) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.gameId);
  builder.writeNumber(source.key);
  return builder.build();
}

export function dictValueParserForwardOpenBidMsg(): DictionaryValue<ForwardOpenBidMsg> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeForwardOpenBidMsg(src)).endCell());
    },
    parse: (src) => {
      return loadForwardOpenBidMsg(src.loadRef().beginParse());
    }
  }
}

export type ForwardJoinGameMsg = {
  $$type: 'ForwardJoinGameMsg';
  gameId: bigint;
  bidValue: bigint;
  secret: bigint;
  referrer: Address | null;
}

export function storeForwardJoinGameMsg(src: ForwardJoinGameMsg) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(3893815928, 32);
    b_0.storeUint(src.gameId, 256);
    b_0.storeCoins(src.bidValue);
    b_0.storeUint(src.secret, 256);
    b_0.storeAddress(src.referrer);
  };
}

export function loadForwardJoinGameMsg(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 3893815928) { throw Error('Invalid prefix'); }
  const _gameId = sc_0.loadUintBig(256);
  const _bidValue = sc_0.loadCoins();
  const _secret = sc_0.loadUintBig(256);
  const _referrer = sc_0.loadMaybeAddress();
  return { $$type: 'ForwardJoinGameMsg' as const, gameId: _gameId, bidValue: _bidValue, secret: _secret, referrer: _referrer };
}

export function loadTupleForwardJoinGameMsg(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _bidValue = source.readBigNumber();
  const _secret = source.readBigNumber();
  const _referrer = source.readAddressOpt();
  return { $$type: 'ForwardJoinGameMsg' as const, gameId: _gameId, bidValue: _bidValue, secret: _secret, referrer: _referrer };
}

export function loadGetterTupleForwardJoinGameMsg(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _bidValue = source.readBigNumber();
  const _secret = source.readBigNumber();
  const _referrer = source.readAddressOpt();
  return { $$type: 'ForwardJoinGameMsg' as const, gameId: _gameId, bidValue: _bidValue, secret: _secret, referrer: _referrer };
}

export function storeTupleForwardJoinGameMsg(source: ForwardJoinGameMsg) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.gameId);
  builder.writeNumber(source.bidValue);
  builder.writeNumber(source.secret);
  builder.writeAddress(source.referrer);
  return builder.build();
}

export function dictValueParserForwardJoinGameMsg(): DictionaryValue<ForwardJoinGameMsg> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeForwardJoinGameMsg(src)).endCell());
    },
    parse: (src) => {
      return loadForwardJoinGameMsg(src.loadRef().beginParse());
    }
  }
}

export type GameDeployedEvent = {
  $$type: 'GameDeployedEvent';
  gameId: bigint;
  gameAddress: Address;
  creator: Address;
  timestamp: bigint;
}

export function storeGameDeployedEvent(src: GameDeployedEvent) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(185727368, 32);
    b_0.storeUint(src.gameId, 256);
    b_0.storeAddress(src.gameAddress);
    b_0.storeAddress(src.creator);
    b_0.storeUint(src.timestamp, 32);
  };
}

export function loadGameDeployedEvent(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 185727368) { throw Error('Invalid prefix'); }
  const _gameId = sc_0.loadUintBig(256);
  const _gameAddress = sc_0.loadAddress();
  const _creator = sc_0.loadAddress();
  const _timestamp = sc_0.loadUintBig(32);
  return { $$type: 'GameDeployedEvent' as const, gameId: _gameId, gameAddress: _gameAddress, creator: _creator, timestamp: _timestamp };
}

export function loadTupleGameDeployedEvent(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _gameAddress = source.readAddress();
  const _creator = source.readAddress();
  const _timestamp = source.readBigNumber();
  return { $$type: 'GameDeployedEvent' as const, gameId: _gameId, gameAddress: _gameAddress, creator: _creator, timestamp: _timestamp };
}

export function loadGetterTupleGameDeployedEvent(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _gameAddress = source.readAddress();
  const _creator = source.readAddress();
  const _timestamp = source.readBigNumber();
  return { $$type: 'GameDeployedEvent' as const, gameId: _gameId, gameAddress: _gameAddress, creator: _creator, timestamp: _timestamp };
}

export function storeTupleGameDeployedEvent(source: GameDeployedEvent) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.gameId);
  builder.writeAddress(source.gameAddress);
  builder.writeAddress(source.creator);
  builder.writeNumber(source.timestamp);
  return builder.build();
}

export function dictValueParserGameDeployedEvent(): DictionaryValue<GameDeployedEvent> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeGameDeployedEvent(src)).endCell());
    },
    parse: (src) => {
      return loadGameDeployedEvent(src.loadRef().beginParse());
    }
  }
}

export type GameInitializedEvent = {
  $$type: 'GameInitializedEvent';
  gameId: bigint;
  playerOne: Address;
  bidValue: bigint;
  timestamp: bigint;
}

export function storeGameInitializedEvent(src: GameInitializedEvent) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(2904670482, 32);
    b_0.storeUint(src.gameId, 256);
    b_0.storeAddress(src.playerOne);
    b_0.storeCoins(src.bidValue);
    b_0.storeUint(src.timestamp, 32);
  };
}

export function loadGameInitializedEvent(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 2904670482) { throw Error('Invalid prefix'); }
  const _gameId = sc_0.loadUintBig(256);
  const _playerOne = sc_0.loadAddress();
  const _bidValue = sc_0.loadCoins();
  const _timestamp = sc_0.loadUintBig(32);
  return { $$type: 'GameInitializedEvent' as const, gameId: _gameId, playerOne: _playerOne, bidValue: _bidValue, timestamp: _timestamp };
}

export function loadTupleGameInitializedEvent(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _playerOne = source.readAddress();
  const _bidValue = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'GameInitializedEvent' as const, gameId: _gameId, playerOne: _playerOne, bidValue: _bidValue, timestamp: _timestamp };
}

export function loadGetterTupleGameInitializedEvent(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _playerOne = source.readAddress();
  const _bidValue = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'GameInitializedEvent' as const, gameId: _gameId, playerOne: _playerOne, bidValue: _bidValue, timestamp: _timestamp };
}

export function storeTupleGameInitializedEvent(source: GameInitializedEvent) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.gameId);
  builder.writeAddress(source.playerOne);
  builder.writeNumber(source.bidValue);
  builder.writeNumber(source.timestamp);
  return builder.build();
}

export function dictValueParserGameInitializedEvent(): DictionaryValue<GameInitializedEvent> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeGameInitializedEvent(src)).endCell());
    },
    parse: (src) => {
      return loadGameInitializedEvent(src.loadRef().beginParse());
    }
  }
}

export type GameStartedEvent = {
  $$type: 'GameStartedEvent';
  gameId: bigint;
  playerOne: Address;
  playerTwo: Address;
  totalGainings: bigint;
  timestamp: bigint;
}

export function storeGameStartedEvent(src: GameStartedEvent) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(3493528925, 32);
    b_0.storeUint(src.gameId, 256);
    b_0.storeAddress(src.playerOne);
    b_0.storeAddress(src.playerTwo);
    b_0.storeCoins(src.totalGainings);
    b_0.storeUint(src.timestamp, 32);
  };
}

export function loadGameStartedEvent(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 3493528925) { throw Error('Invalid prefix'); }
  const _gameId = sc_0.loadUintBig(256);
  const _playerOne = sc_0.loadAddress();
  const _playerTwo = sc_0.loadAddress();
  const _totalGainings = sc_0.loadCoins();
  const _timestamp = sc_0.loadUintBig(32);
  return { $$type: 'GameStartedEvent' as const, gameId: _gameId, playerOne: _playerOne, playerTwo: _playerTwo, totalGainings: _totalGainings, timestamp: _timestamp };
}

export function loadTupleGameStartedEvent(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _playerOne = source.readAddress();
  const _playerTwo = source.readAddress();
  const _totalGainings = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'GameStartedEvent' as const, gameId: _gameId, playerOne: _playerOne, playerTwo: _playerTwo, totalGainings: _totalGainings, timestamp: _timestamp };
}

export function loadGetterTupleGameStartedEvent(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _playerOne = source.readAddress();
  const _playerTwo = source.readAddress();
  const _totalGainings = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'GameStartedEvent' as const, gameId: _gameId, playerOne: _playerOne, playerTwo: _playerTwo, totalGainings: _totalGainings, timestamp: _timestamp };
}

export function storeTupleGameStartedEvent(source: GameStartedEvent) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.gameId);
  builder.writeAddress(source.playerOne);
  builder.writeAddress(source.playerTwo);
  builder.writeNumber(source.totalGainings);
  builder.writeNumber(source.timestamp);
  return builder.build();
}

export function dictValueParserGameStartedEvent(): DictionaryValue<GameStartedEvent> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeGameStartedEvent(src)).endCell());
    },
    parse: (src) => {
      return loadGameStartedEvent(src.loadRef().beginParse());
    }
  }
}

export type GameFinishedEvent = {
  $$type: 'GameFinishedEvent';
  gameId: bigint;
  winner: Address;
  looser: Address;
  totalGainings: bigint;
  timestamp: bigint;
}

export function storeGameFinishedEvent(src: GameFinishedEvent) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(2774366883, 32);
    b_0.storeUint(src.gameId, 256);
    b_0.storeAddress(src.winner);
    b_0.storeAddress(src.looser);
    b_0.storeCoins(src.totalGainings);
    b_0.storeUint(src.timestamp, 32);
  };
}

export function loadGameFinishedEvent(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 2774366883) { throw Error('Invalid prefix'); }
  const _gameId = sc_0.loadUintBig(256);
  const _winner = sc_0.loadAddress();
  const _looser = sc_0.loadAddress();
  const _totalGainings = sc_0.loadCoins();
  const _timestamp = sc_0.loadUintBig(32);
  return { $$type: 'GameFinishedEvent' as const, gameId: _gameId, winner: _winner, looser: _looser, totalGainings: _totalGainings, timestamp: _timestamp };
}

export function loadTupleGameFinishedEvent(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _winner = source.readAddress();
  const _looser = source.readAddress();
  const _totalGainings = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'GameFinishedEvent' as const, gameId: _gameId, winner: _winner, looser: _looser, totalGainings: _totalGainings, timestamp: _timestamp };
}

export function loadGetterTupleGameFinishedEvent(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _winner = source.readAddress();
  const _looser = source.readAddress();
  const _totalGainings = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'GameFinishedEvent' as const, gameId: _gameId, winner: _winner, looser: _looser, totalGainings: _totalGainings, timestamp: _timestamp };
}

export function storeTupleGameFinishedEvent(source: GameFinishedEvent) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.gameId);
  builder.writeAddress(source.winner);
  builder.writeAddress(source.looser);
  builder.writeNumber(source.totalGainings);
  builder.writeNumber(source.timestamp);
  return builder.build();
}

export function dictValueParserGameFinishedEvent(): DictionaryValue<GameFinishedEvent> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeGameFinishedEvent(src)).endCell());
    },
    parse: (src) => {
      return loadGameFinishedEvent(src.loadRef().beginParse());
    }
  }
}

export type GameCancelledEvent = {
  $$type: 'GameCancelledEvent';
  gameId: bigint;
  playerOne: Address;
  timestamp: bigint;
}

export function storeGameCancelledEvent(src: GameCancelledEvent) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(616834666, 32);
    b_0.storeUint(src.gameId, 256);
    b_0.storeAddress(src.playerOne);
    b_0.storeUint(src.timestamp, 32);
  };
}

export function loadGameCancelledEvent(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 616834666) { throw Error('Invalid prefix'); }
  const _gameId = sc_0.loadUintBig(256);
  const _playerOne = sc_0.loadAddress();
  const _timestamp = sc_0.loadUintBig(32);
  return { $$type: 'GameCancelledEvent' as const, gameId: _gameId, playerOne: _playerOne, timestamp: _timestamp };
}

export function loadTupleGameCancelledEvent(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _playerOne = source.readAddress();
  const _timestamp = source.readBigNumber();
  return { $$type: 'GameCancelledEvent' as const, gameId: _gameId, playerOne: _playerOne, timestamp: _timestamp };
}

export function loadGetterTupleGameCancelledEvent(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _playerOne = source.readAddress();
  const _timestamp = source.readBigNumber();
  return { $$type: 'GameCancelledEvent' as const, gameId: _gameId, playerOne: _playerOne, timestamp: _timestamp };
}

export function storeTupleGameCancelledEvent(source: GameCancelledEvent) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.gameId);
  builder.writeAddress(source.playerOne);
  builder.writeNumber(source.timestamp);
  return builder.build();
}

export function dictValueParserGameCancelledEvent(): DictionaryValue<GameCancelledEvent> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeGameCancelledEvent(src)).endCell());
    },
    parse: (src) => {
      return loadGameCancelledEvent(src.loadRef().beginParse());
    }
  }
}

export type DrawEvent = {
  $$type: 'DrawEvent';
  gameId: bigint;
  timestamp: bigint;
}

export function storeDrawEvent(src: DrawEvent) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(2466780489, 32);
    b_0.storeUint(src.gameId, 256);
    b_0.storeUint(src.timestamp, 32);
  };
}

export function loadDrawEvent(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 2466780489) { throw Error('Invalid prefix'); }
  const _gameId = sc_0.loadUintBig(256);
  const _timestamp = sc_0.loadUintBig(32);
  return { $$type: 'DrawEvent' as const, gameId: _gameId, timestamp: _timestamp };
}

export function loadTupleDrawEvent(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'DrawEvent' as const, gameId: _gameId, timestamp: _timestamp };
}

export function loadGetterTupleDrawEvent(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'DrawEvent' as const, gameId: _gameId, timestamp: _timestamp };
}

export function storeTupleDrawEvent(source: DrawEvent) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.gameId);
  builder.writeNumber(source.timestamp);
  return builder.build();
}

export function dictValueParserDrawEvent(): DictionaryValue<DrawEvent> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeDrawEvent(src)).endCell());
    },
    parse: (src) => {
      return loadDrawEvent(src.loadRef().beginParse());
    }
  }
}

export type ServiceFeeChangedEvent = {
  $$type: 'ServiceFeeChangedEvent';
  newValue: bigint;
  timestamp: bigint;
}

export function storeServiceFeeChangedEvent(src: ServiceFeeChangedEvent) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(3770411203, 32);
    b_0.storeUint(src.newValue, 32);
    b_0.storeUint(src.timestamp, 32);
  };
}

export function loadServiceFeeChangedEvent(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 3770411203) { throw Error('Invalid prefix'); }
  const _newValue = sc_0.loadUintBig(32);
  const _timestamp = sc_0.loadUintBig(32);
  return { $$type: 'ServiceFeeChangedEvent' as const, newValue: _newValue, timestamp: _timestamp };
}

export function loadTupleServiceFeeChangedEvent(source: TupleReader) {
  const _newValue = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'ServiceFeeChangedEvent' as const, newValue: _newValue, timestamp: _timestamp };
}

export function loadGetterTupleServiceFeeChangedEvent(source: TupleReader) {
  const _newValue = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'ServiceFeeChangedEvent' as const, newValue: _newValue, timestamp: _timestamp };
}

export function storeTupleServiceFeeChangedEvent(source: ServiceFeeChangedEvent) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.newValue);
  builder.writeNumber(source.timestamp);
  return builder.build();
}

export function dictValueParserServiceFeeChangedEvent(): DictionaryValue<ServiceFeeChangedEvent> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeServiceFeeChangedEvent(src)).endCell());
    },
    parse: (src) => {
      return loadServiceFeeChangedEvent(src.loadRef().beginParse());
    }
  }
}

export type ReferrerFeeChangedEvent = {
  $$type: 'ReferrerFeeChangedEvent';
  newValue: bigint;
  timestamp: bigint;
}

export function storeReferrerFeeChangedEvent(src: ReferrerFeeChangedEvent) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(2889764698, 32);
    b_0.storeUint(src.newValue, 32);
    b_0.storeUint(src.timestamp, 32);
  };
}

export function loadReferrerFeeChangedEvent(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 2889764698) { throw Error('Invalid prefix'); }
  const _newValue = sc_0.loadUintBig(32);
  const _timestamp = sc_0.loadUintBig(32);
  return { $$type: 'ReferrerFeeChangedEvent' as const, newValue: _newValue, timestamp: _timestamp };
}

export function loadTupleReferrerFeeChangedEvent(source: TupleReader) {
  const _newValue = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'ReferrerFeeChangedEvent' as const, newValue: _newValue, timestamp: _timestamp };
}

export function loadGetterTupleReferrerFeeChangedEvent(source: TupleReader) {
  const _newValue = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'ReferrerFeeChangedEvent' as const, newValue: _newValue, timestamp: _timestamp };
}

export function storeTupleReferrerFeeChangedEvent(source: ReferrerFeeChangedEvent) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.newValue);
  builder.writeNumber(source.timestamp);
  return builder.build();
}

export function dictValueParserReferrerFeeChangedEvent(): DictionaryValue<ReferrerFeeChangedEvent> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeReferrerFeeChangedEvent(src)).endCell());
    },
    parse: (src) => {
      return loadReferrerFeeChangedEvent(src.loadRef().beginParse());
    }
  }
}

export type FeeReceiverChangedEvent = {
  $$type: 'FeeReceiverChangedEvent';
  newReceiver: Address;
  timestamp: bigint;
}

export function storeFeeReceiverChangedEvent(src: FeeReceiverChangedEvent) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(3831903941, 32);
    b_0.storeAddress(src.newReceiver);
    b_0.storeUint(src.timestamp, 32);
  };
}

export function loadFeeReceiverChangedEvent(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 3831903941) { throw Error('Invalid prefix'); }
  const _newReceiver = sc_0.loadAddress();
  const _timestamp = sc_0.loadUintBig(32);
  return { $$type: 'FeeReceiverChangedEvent' as const, newReceiver: _newReceiver, timestamp: _timestamp };
}

export function loadTupleFeeReceiverChangedEvent(source: TupleReader) {
  const _newReceiver = source.readAddress();
  const _timestamp = source.readBigNumber();
  return { $$type: 'FeeReceiverChangedEvent' as const, newReceiver: _newReceiver, timestamp: _timestamp };
}

export function loadGetterTupleFeeReceiverChangedEvent(source: TupleReader) {
  const _newReceiver = source.readAddress();
  const _timestamp = source.readBigNumber();
  return { $$type: 'FeeReceiverChangedEvent' as const, newReceiver: _newReceiver, timestamp: _timestamp };
}

export function storeTupleFeeReceiverChangedEvent(source: FeeReceiverChangedEvent) {
  const builder = new TupleBuilder();
  builder.writeAddress(source.newReceiver);
  builder.writeNumber(source.timestamp);
  return builder.build();
}

export function dictValueParserFeeReceiverChangedEvent(): DictionaryValue<FeeReceiverChangedEvent> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeFeeReceiverChangedEvent(src)).endCell());
    },
    parse: (src) => {
      return loadFeeReceiverChangedEvent(src.loadRef().beginParse());
    }
  }
}

export type LowestBidChangedEvent = {
  $$type: 'LowestBidChangedEvent';
  newValue: bigint;
  timestamp: bigint;
}

export function storeLowestBidChangedEvent(src: LowestBidChangedEvent) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(84132035, 32);
    b_0.storeUint(src.newValue, 256);
    b_0.storeUint(src.timestamp, 32);
  };
}

export function loadLowestBidChangedEvent(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 84132035) { throw Error('Invalid prefix'); }
  const _newValue = sc_0.loadUintBig(256);
  const _timestamp = sc_0.loadUintBig(32);
  return { $$type: 'LowestBidChangedEvent' as const, newValue: _newValue, timestamp: _timestamp };
}

export function loadTupleLowestBidChangedEvent(source: TupleReader) {
  const _newValue = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'LowestBidChangedEvent' as const, newValue: _newValue, timestamp: _timestamp };
}

export function loadGetterTupleLowestBidChangedEvent(source: TupleReader) {
  const _newValue = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'LowestBidChangedEvent' as const, newValue: _newValue, timestamp: _timestamp };
}

export function storeTupleLowestBidChangedEvent(source: LowestBidChangedEvent) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.newValue);
  builder.writeNumber(source.timestamp);
  return builder.build();
}

export function dictValueParserLowestBidChangedEvent(): DictionaryValue<LowestBidChangedEvent> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeLowestBidChangedEvent(src)).endCell());
    },
    parse: (src) => {
      return loadLowestBidChangedEvent(src.loadRef().beginParse());
    }
  }
}

export type HighestBidChangedEvent = {
  $$type: 'HighestBidChangedEvent';
  newValue: bigint;
  timestamp: bigint;
}

export function storeHighestBidChangedEvent(src: HighestBidChangedEvent) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(1285959087, 32);
    b_0.storeUint(src.newValue, 256);
    b_0.storeUint(src.timestamp, 32);
  };
}

export function loadHighestBidChangedEvent(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 1285959087) { throw Error('Invalid prefix'); }
  const _newValue = sc_0.loadUintBig(256);
  const _timestamp = sc_0.loadUintBig(32);
  return { $$type: 'HighestBidChangedEvent' as const, newValue: _newValue, timestamp: _timestamp };
}

export function loadTupleHighestBidChangedEvent(source: TupleReader) {
  const _newValue = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'HighestBidChangedEvent' as const, newValue: _newValue, timestamp: _timestamp };
}

export function loadGetterTupleHighestBidChangedEvent(source: TupleReader) {
  const _newValue = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'HighestBidChangedEvent' as const, newValue: _newValue, timestamp: _timestamp };
}

export function storeTupleHighestBidChangedEvent(source: HighestBidChangedEvent) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.newValue);
  builder.writeNumber(source.timestamp);
  return builder.build();
}

export function dictValueParserHighestBidChangedEvent(): DictionaryValue<HighestBidChangedEvent> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeHighestBidChangedEvent(src)).endCell());
    },
    parse: (src) => {
      return loadHighestBidChangedEvent(src.loadRef().beginParse());
    }
  }
}

export type WaitingForOpenBidSecondsChangedEvent = {
  $$type: 'WaitingForOpenBidSecondsChangedEvent';
  newValue: bigint;
  timestamp: bigint;
}

export function storeWaitingForOpenBidSecondsChangedEvent(src: WaitingForOpenBidSecondsChangedEvent) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(1273858625, 32);
    b_0.storeUint(src.newValue, 256);
    b_0.storeUint(src.timestamp, 32);
  };
}

export function loadWaitingForOpenBidSecondsChangedEvent(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 1273858625) { throw Error('Invalid prefix'); }
  const _newValue = sc_0.loadUintBig(256);
  const _timestamp = sc_0.loadUintBig(32);
  return { $$type: 'WaitingForOpenBidSecondsChangedEvent' as const, newValue: _newValue, timestamp: _timestamp };
}

export function loadTupleWaitingForOpenBidSecondsChangedEvent(source: TupleReader) {
  const _newValue = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'WaitingForOpenBidSecondsChangedEvent' as const, newValue: _newValue, timestamp: _timestamp };
}

export function loadGetterTupleWaitingForOpenBidSecondsChangedEvent(source: TupleReader) {
  const _newValue = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'WaitingForOpenBidSecondsChangedEvent' as const, newValue: _newValue, timestamp: _timestamp };
}

export function storeTupleWaitingForOpenBidSecondsChangedEvent(source: WaitingForOpenBidSecondsChangedEvent) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.newValue);
  builder.writeNumber(source.timestamp);
  return builder.build();
}

export function dictValueParserWaitingForOpenBidSecondsChangedEvent(): DictionaryValue<WaitingForOpenBidSecondsChangedEvent> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeWaitingForOpenBidSecondsChangedEvent(src)).endCell());
    },
    parse: (src) => {
      return loadWaitingForOpenBidSecondsChangedEvent(src.loadRef().beginParse());
    }
  }
}

export type MinReferrerPayoutValueChangedEvent = {
  $$type: 'MinReferrerPayoutValueChangedEvent';
  newValue: bigint;
  timestamp: bigint;
}

export function storeMinReferrerPayoutValueChangedEvent(src: MinReferrerPayoutValueChangedEvent) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(3481155971, 32);
    b_0.storeUint(src.newValue, 256);
    b_0.storeUint(src.timestamp, 32);
  };
}

export function loadMinReferrerPayoutValueChangedEvent(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 3481155971) { throw Error('Invalid prefix'); }
  const _newValue = sc_0.loadUintBig(256);
  const _timestamp = sc_0.loadUintBig(32);
  return { $$type: 'MinReferrerPayoutValueChangedEvent' as const, newValue: _newValue, timestamp: _timestamp };
}

export function loadTupleMinReferrerPayoutValueChangedEvent(source: TupleReader) {
  const _newValue = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'MinReferrerPayoutValueChangedEvent' as const, newValue: _newValue, timestamp: _timestamp };
}

export function loadGetterTupleMinReferrerPayoutValueChangedEvent(source: TupleReader) {
  const _newValue = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'MinReferrerPayoutValueChangedEvent' as const, newValue: _newValue, timestamp: _timestamp };
}

export function storeTupleMinReferrerPayoutValueChangedEvent(source: MinReferrerPayoutValueChangedEvent) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.newValue);
  builder.writeNumber(source.timestamp);
  return builder.build();
}

export function dictValueParserMinReferrerPayoutValueChangedEvent(): DictionaryValue<MinReferrerPayoutValueChangedEvent> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeMinReferrerPayoutValueChangedEvent(src)).endCell());
    },
    parse: (src) => {
      return loadMinReferrerPayoutValueChangedEvent(src.loadRef().beginParse());
    }
  }
}

export type SystemStoppedEvent = {
  $$type: 'SystemStoppedEvent';
  timestamp: bigint;
}

export function storeSystemStoppedEvent(src: SystemStoppedEvent) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(2994542628, 32);
    b_0.storeUint(src.timestamp, 32);
  };
}

export function loadSystemStoppedEvent(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 2994542628) { throw Error('Invalid prefix'); }
  const _timestamp = sc_0.loadUintBig(32);
  return { $$type: 'SystemStoppedEvent' as const, timestamp: _timestamp };
}

export function loadTupleSystemStoppedEvent(source: TupleReader) {
  const _timestamp = source.readBigNumber();
  return { $$type: 'SystemStoppedEvent' as const, timestamp: _timestamp };
}

export function loadGetterTupleSystemStoppedEvent(source: TupleReader) {
  const _timestamp = source.readBigNumber();
  return { $$type: 'SystemStoppedEvent' as const, timestamp: _timestamp };
}

export function storeTupleSystemStoppedEvent(source: SystemStoppedEvent) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.timestamp);
  return builder.build();
}

export function dictValueParserSystemStoppedEvent(): DictionaryValue<SystemStoppedEvent> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeSystemStoppedEvent(src)).endCell());
    },
    parse: (src) => {
      return loadSystemStoppedEvent(src.loadRef().beginParse());
    }
  }
}

export type SystemResumeEvent = {
  $$type: 'SystemResumeEvent';
  timestamp: bigint;
}

export function storeSystemResumeEvent(src: SystemResumeEvent) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(1976079967, 32);
    b_0.storeUint(src.timestamp, 32);
  };
}

export function loadSystemResumeEvent(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 1976079967) { throw Error('Invalid prefix'); }
  const _timestamp = sc_0.loadUintBig(32);
  return { $$type: 'SystemResumeEvent' as const, timestamp: _timestamp };
}

export function loadTupleSystemResumeEvent(source: TupleReader) {
  const _timestamp = source.readBigNumber();
  return { $$type: 'SystemResumeEvent' as const, timestamp: _timestamp };
}

export function loadGetterTupleSystemResumeEvent(source: TupleReader) {
  const _timestamp = source.readBigNumber();
  return { $$type: 'SystemResumeEvent' as const, timestamp: _timestamp };
}

export function storeTupleSystemResumeEvent(source: SystemResumeEvent) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.timestamp);
  return builder.build();
}

export function dictValueParserSystemResumeEvent(): DictionaryValue<SystemResumeEvent> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeSystemResumeEvent(src)).endCell());
    },
    parse: (src) => {
      return loadSystemResumeEvent(src.loadRef().beginParse());
    }
  }
}

export type BouncedMessageEvent = {
  $$type: 'BouncedMessageEvent';
  op: bigint;
  gameId: bigint;
  timestamp: bigint;
}

export function storeBouncedMessageEvent(src: BouncedMessageEvent) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(2167600854, 32);
    b_0.storeUint(src.op, 32);
    b_0.storeUint(src.gameId, 64);
    b_0.storeUint(src.timestamp, 32);
  };
}

export function loadBouncedMessageEvent(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 2167600854) { throw Error('Invalid prefix'); }
  const _op = sc_0.loadUintBig(32);
  const _gameId = sc_0.loadUintBig(64);
  const _timestamp = sc_0.loadUintBig(32);
  return { $$type: 'BouncedMessageEvent' as const, op: _op, gameId: _gameId, timestamp: _timestamp };
}

export function loadTupleBouncedMessageEvent(source: TupleReader) {
  const _op = source.readBigNumber();
  const _gameId = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'BouncedMessageEvent' as const, op: _op, gameId: _gameId, timestamp: _timestamp };
}

export function loadGetterTupleBouncedMessageEvent(source: TupleReader) {
  const _op = source.readBigNumber();
  const _gameId = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'BouncedMessageEvent' as const, op: _op, gameId: _gameId, timestamp: _timestamp };
}

export function storeTupleBouncedMessageEvent(source: BouncedMessageEvent) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.op);
  builder.writeNumber(source.gameId);
  builder.writeNumber(source.timestamp);
  return builder.build();
}

export function dictValueParserBouncedMessageEvent(): DictionaryValue<BouncedMessageEvent> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeBouncedMessageEvent(src)).endCell());
    },
    parse: (src) => {
      return loadBouncedMessageEvent(src.loadRef().beginParse());
    }
  }
}

export type InitGameMsg = {
  $$type: 'InitGameMsg';
  playerOne: Address;
  bidValue: bigint;
  secret: bigint;
  referrer: Address | null;
  serviceFeeNumerator: bigint;
  referrerFeeNumerator: bigint;
  waitingForOpenBidSeconds: bigint;
  lowestBid: bigint;
  highestBid: bigint;
  feeReceiver: Address;
}

export function storeInitGameMsg(src: InitGameMsg) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(2971395423, 32);
    b_0.storeAddress(src.playerOne);
    b_0.storeCoins(src.bidValue);
    b_0.storeUint(src.secret, 256);
    b_0.storeAddress(src.referrer);
    b_0.storeUint(src.serviceFeeNumerator, 32);
    b_0.storeUint(src.referrerFeeNumerator, 32);
    const b_1 = new Builder();
    b_1.storeUint(src.waitingForOpenBidSeconds, 32);
    b_1.storeCoins(src.lowestBid);
    b_1.storeCoins(src.highestBid);
    b_1.storeAddress(src.feeReceiver);
    b_0.storeRef(b_1.endCell());
  };
}

export function loadInitGameMsg(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 2971395423) { throw Error('Invalid prefix'); }
  const _playerOne = sc_0.loadAddress();
  const _bidValue = sc_0.loadCoins();
  const _secret = sc_0.loadUintBig(256);
  const _referrer = sc_0.loadMaybeAddress();
  const _serviceFeeNumerator = sc_0.loadUintBig(32);
  const _referrerFeeNumerator = sc_0.loadUintBig(32);
  const sc_1 = sc_0.loadRef().beginParse();
  const _waitingForOpenBidSeconds = sc_1.loadUintBig(32);
  const _lowestBid = sc_1.loadCoins();
  const _highestBid = sc_1.loadCoins();
  const _feeReceiver = sc_1.loadAddress();
  return { $$type: 'InitGameMsg' as const, playerOne: _playerOne, bidValue: _bidValue, secret: _secret, referrer: _referrer, serviceFeeNumerator: _serviceFeeNumerator, referrerFeeNumerator: _referrerFeeNumerator, waitingForOpenBidSeconds: _waitingForOpenBidSeconds, lowestBid: _lowestBid, highestBid: _highestBid, feeReceiver: _feeReceiver };
}

export function loadTupleInitGameMsg(source: TupleReader) {
  const _playerOne = source.readAddress();
  const _bidValue = source.readBigNumber();
  const _secret = source.readBigNumber();
  const _referrer = source.readAddressOpt();
  const _serviceFeeNumerator = source.readBigNumber();
  const _referrerFeeNumerator = source.readBigNumber();
  const _waitingForOpenBidSeconds = source.readBigNumber();
  const _lowestBid = source.readBigNumber();
  const _highestBid = source.readBigNumber();
  const _feeReceiver = source.readAddress();
  return { $$type: 'InitGameMsg' as const, playerOne: _playerOne, bidValue: _bidValue, secret: _secret, referrer: _referrer, serviceFeeNumerator: _serviceFeeNumerator, referrerFeeNumerator: _referrerFeeNumerator, waitingForOpenBidSeconds: _waitingForOpenBidSeconds, lowestBid: _lowestBid, highestBid: _highestBid, feeReceiver: _feeReceiver };
}

export function loadGetterTupleInitGameMsg(source: TupleReader) {
  const _playerOne = source.readAddress();
  const _bidValue = source.readBigNumber();
  const _secret = source.readBigNumber();
  const _referrer = source.readAddressOpt();
  const _serviceFeeNumerator = source.readBigNumber();
  const _referrerFeeNumerator = source.readBigNumber();
  const _waitingForOpenBidSeconds = source.readBigNumber();
  const _lowestBid = source.readBigNumber();
  const _highestBid = source.readBigNumber();
  const _feeReceiver = source.readAddress();
  return { $$type: 'InitGameMsg' as const, playerOne: _playerOne, bidValue: _bidValue, secret: _secret, referrer: _referrer, serviceFeeNumerator: _serviceFeeNumerator, referrerFeeNumerator: _referrerFeeNumerator, waitingForOpenBidSeconds: _waitingForOpenBidSeconds, lowestBid: _lowestBid, highestBid: _highestBid, feeReceiver: _feeReceiver };
}

export function storeTupleInitGameMsg(source: InitGameMsg) {
  const builder = new TupleBuilder();
  builder.writeAddress(source.playerOne);
  builder.writeNumber(source.bidValue);
  builder.writeNumber(source.secret);
  builder.writeAddress(source.referrer);
  builder.writeNumber(source.serviceFeeNumerator);
  builder.writeNumber(source.referrerFeeNumerator);
  builder.writeNumber(source.waitingForOpenBidSeconds);
  builder.writeNumber(source.lowestBid);
  builder.writeNumber(source.highestBid);
  builder.writeAddress(source.feeReceiver);
  return builder.build();
}

export function dictValueParserInitGameMsg(): DictionaryValue<InitGameMsg> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeInitGameMsg(src)).endCell());
    },
    parse: (src) => {
      return loadInitGameMsg(src.loadRef().beginParse());
    }
  }
}

export type JoinGameMsg = {
  $$type: 'JoinGameMsg';
  playerTwo: Address;
  secret: bigint;
  referrer: Address | null;
}

export function storeJoinGameMsg(src: JoinGameMsg) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(924533763, 32);
    b_0.storeAddress(src.playerTwo);
    b_0.storeUint(src.secret, 256);
    b_0.storeAddress(src.referrer);
  };
}

export function loadJoinGameMsg(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 924533763) { throw Error('Invalid prefix'); }
  const _playerTwo = sc_0.loadAddress();
  const _secret = sc_0.loadUintBig(256);
  const _referrer = sc_0.loadMaybeAddress();
  return { $$type: 'JoinGameMsg' as const, playerTwo: _playerTwo, secret: _secret, referrer: _referrer };
}

export function loadTupleJoinGameMsg(source: TupleReader) {
  const _playerTwo = source.readAddress();
  const _secret = source.readBigNumber();
  const _referrer = source.readAddressOpt();
  return { $$type: 'JoinGameMsg' as const, playerTwo: _playerTwo, secret: _secret, referrer: _referrer };
}

export function loadGetterTupleJoinGameMsg(source: TupleReader) {
  const _playerTwo = source.readAddress();
  const _secret = source.readBigNumber();
  const _referrer = source.readAddressOpt();
  return { $$type: 'JoinGameMsg' as const, playerTwo: _playerTwo, secret: _secret, referrer: _referrer };
}

export function storeTupleJoinGameMsg(source: JoinGameMsg) {
  const builder = new TupleBuilder();
  builder.writeAddress(source.playerTwo);
  builder.writeNumber(source.secret);
  builder.writeAddress(source.referrer);
  return builder.build();
}

export function dictValueParserJoinGameMsg(): DictionaryValue<JoinGameMsg> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeJoinGameMsg(src)).endCell());
    },
    parse: (src) => {
      return loadJoinGameMsg(src.loadRef().beginParse());
    }
  }
}

export type OpenBidMsg = {
  $$type: 'OpenBidMsg';
  key: bigint;
}

export function storeOpenBidMsg(src: OpenBidMsg) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(704611509, 32);
    b_0.storeUint(src.key, 256);
  };
}

export function loadOpenBidMsg(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 704611509) { throw Error('Invalid prefix'); }
  const _key = sc_0.loadUintBig(256);
  return { $$type: 'OpenBidMsg' as const, key: _key };
}

export function loadTupleOpenBidMsg(source: TupleReader) {
  const _key = source.readBigNumber();
  return { $$type: 'OpenBidMsg' as const, key: _key };
}

export function loadGetterTupleOpenBidMsg(source: TupleReader) {
  const _key = source.readBigNumber();
  return { $$type: 'OpenBidMsg' as const, key: _key };
}

export function storeTupleOpenBidMsg(source: OpenBidMsg) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.key);
  return builder.build();
}

export function dictValueParserOpenBidMsg(): DictionaryValue<OpenBidMsg> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeOpenBidMsg(src)).endCell());
    },
    parse: (src) => {
      return loadOpenBidMsg(src.loadRef().beginParse());
    }
  }
}

export type OpenMultipleBidsMsg = {
  $$type: 'OpenMultipleBidsMsg';
  gameIds: Dictionary<number, bigint>;
  keys: Dictionary<number, bigint>;
  count: bigint;
}

export function storeOpenMultipleBidsMsg(src: OpenMultipleBidsMsg) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(4091047635, 32);
    b_0.storeDict(src.gameIds, Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256));
    b_0.storeDict(src.keys, Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256));
    b_0.storeUint(src.count, 16);
  };
}

export function loadOpenMultipleBidsMsg(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 4091047635) { throw Error('Invalid prefix'); }
  const _gameIds = Dictionary.load(Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256), sc_0);
  const _keys = Dictionary.load(Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256), sc_0);
  const _count = sc_0.loadUintBig(16);
  return { $$type: 'OpenMultipleBidsMsg' as const, gameIds: _gameIds, keys: _keys, count: _count };
}

export function loadTupleOpenMultipleBidsMsg(source: TupleReader) {
  const _gameIds = Dictionary.loadDirect(Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256), source.readCellOpt());
  const _keys = Dictionary.loadDirect(Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256), source.readCellOpt());
  const _count = source.readBigNumber();
  return { $$type: 'OpenMultipleBidsMsg' as const, gameIds: _gameIds, keys: _keys, count: _count };
}

export function loadGetterTupleOpenMultipleBidsMsg(source: TupleReader) {
  const _gameIds = Dictionary.loadDirect(Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256), source.readCellOpt());
  const _keys = Dictionary.loadDirect(Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256), source.readCellOpt());
  const _count = source.readBigNumber();
  return { $$type: 'OpenMultipleBidsMsg' as const, gameIds: _gameIds, keys: _keys, count: _count };
}

export function storeTupleOpenMultipleBidsMsg(source: OpenMultipleBidsMsg) {
  const builder = new TupleBuilder();
  builder.writeCell(source.gameIds.size > 0 ? beginCell().storeDictDirect(source.gameIds, Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256)).endCell() : null);
  builder.writeCell(source.keys.size > 0 ? beginCell().storeDictDirect(source.keys, Dictionary.Keys.Uint(16), Dictionary.Values.BigUint(256)).endCell() : null);
  builder.writeNumber(source.count);
  return builder.build();
}

export function dictValueParserOpenMultipleBidsMsg(): DictionaryValue<OpenMultipleBidsMsg> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeOpenMultipleBidsMsg(src)).endCell());
    },
    parse: (src) => {
      return loadOpenMultipleBidsMsg(src.loadRef().beginParse());
    }
  }
}

export type CancelGameMsg = {
  $$type: 'CancelGameMsg';
  gameId: bigint;
}

export function storeCancelGameMsg(src: CancelGameMsg) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(2404003461, 32);
    b_0.storeUint(src.gameId, 256);
  };
}

export function loadCancelGameMsg(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 2404003461) { throw Error('Invalid prefix'); }
  const _gameId = sc_0.loadUintBig(256);
  return { $$type: 'CancelGameMsg' as const, gameId: _gameId };
}

export function loadTupleCancelGameMsg(source: TupleReader) {
  const _gameId = source.readBigNumber();
  return { $$type: 'CancelGameMsg' as const, gameId: _gameId };
}

export function loadGetterTupleCancelGameMsg(source: TupleReader) {
  const _gameId = source.readBigNumber();
  return { $$type: 'CancelGameMsg' as const, gameId: _gameId };
}

export function storeTupleCancelGameMsg(source: CancelGameMsg) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.gameId);
  return builder.build();
}

export function dictValueParserCancelGameMsg(): DictionaryValue<CancelGameMsg> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeCancelGameMsg(src)).endCell());
    },
    parse: (src) => {
      return loadCancelGameMsg(src.loadRef().beginParse());
    }
  }
}

export type FinishGameMsg = {
  $$type: 'FinishGameMsg';
  gameId: bigint;
}

export function storeFinishGameMsg(src: FinishGameMsg) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(2152428653, 32);
    b_0.storeUint(src.gameId, 256);
  };
}

export function loadFinishGameMsg(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 2152428653) { throw Error('Invalid prefix'); }
  const _gameId = sc_0.loadUintBig(256);
  return { $$type: 'FinishGameMsg' as const, gameId: _gameId };
}

export function loadTupleFinishGameMsg(source: TupleReader) {
  const _gameId = source.readBigNumber();
  return { $$type: 'FinishGameMsg' as const, gameId: _gameId };
}

export function loadGetterTupleFinishGameMsg(source: TupleReader) {
  const _gameId = source.readBigNumber();
  return { $$type: 'FinishGameMsg' as const, gameId: _gameId };
}

export function storeTupleFinishGameMsg(source: FinishGameMsg) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.gameId);
  return builder.build();
}

export function dictValueParserFinishGameMsg(): DictionaryValue<FinishGameMsg> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeFinishGameMsg(src)).endCell());
    },
    parse: (src) => {
      return loadFinishGameMsg(src.loadRef().beginParse());
    }
  }
}

export type GameInitializedNotify = {
  $$type: 'GameInitializedNotify';
  gameId: bigint;
  playerOne: Address;
  bidValue: bigint;
}

export function storeGameInitializedNotify(src: GameInitializedNotify) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(3945341079, 32);
    b_0.storeUint(src.gameId, 256);
    b_0.storeAddress(src.playerOne);
    b_0.storeCoins(src.bidValue);
  };
}

export function loadGameInitializedNotify(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 3945341079) { throw Error('Invalid prefix'); }
  const _gameId = sc_0.loadUintBig(256);
  const _playerOne = sc_0.loadAddress();
  const _bidValue = sc_0.loadCoins();
  return { $$type: 'GameInitializedNotify' as const, gameId: _gameId, playerOne: _playerOne, bidValue: _bidValue };
}

export function loadTupleGameInitializedNotify(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _playerOne = source.readAddress();
  const _bidValue = source.readBigNumber();
  return { $$type: 'GameInitializedNotify' as const, gameId: _gameId, playerOne: _playerOne, bidValue: _bidValue };
}

export function loadGetterTupleGameInitializedNotify(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _playerOne = source.readAddress();
  const _bidValue = source.readBigNumber();
  return { $$type: 'GameInitializedNotify' as const, gameId: _gameId, playerOne: _playerOne, bidValue: _bidValue };
}

export function storeTupleGameInitializedNotify(source: GameInitializedNotify) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.gameId);
  builder.writeAddress(source.playerOne);
  builder.writeNumber(source.bidValue);
  return builder.build();
}

export function dictValueParserGameInitializedNotify(): DictionaryValue<GameInitializedNotify> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeGameInitializedNotify(src)).endCell());
    },
    parse: (src) => {
      return loadGameInitializedNotify(src.loadRef().beginParse());
    }
  }
}

export type GameStartedNotify = {
  $$type: 'GameStartedNotify';
  gameId: bigint;
  playerOne: Address;
  playerTwo: Address;
  totalGainings: bigint;
}

export function storeGameStartedNotify(src: GameStartedNotify) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(102653531, 32);
    b_0.storeUint(src.gameId, 256);
    b_0.storeAddress(src.playerOne);
    b_0.storeAddress(src.playerTwo);
    b_0.storeCoins(src.totalGainings);
  };
}

export function loadGameStartedNotify(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 102653531) { throw Error('Invalid prefix'); }
  const _gameId = sc_0.loadUintBig(256);
  const _playerOne = sc_0.loadAddress();
  const _playerTwo = sc_0.loadAddress();
  const _totalGainings = sc_0.loadCoins();
  return { $$type: 'GameStartedNotify' as const, gameId: _gameId, playerOne: _playerOne, playerTwo: _playerTwo, totalGainings: _totalGainings };
}

export function loadTupleGameStartedNotify(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _playerOne = source.readAddress();
  const _playerTwo = source.readAddress();
  const _totalGainings = source.readBigNumber();
  return { $$type: 'GameStartedNotify' as const, gameId: _gameId, playerOne: _playerOne, playerTwo: _playerTwo, totalGainings: _totalGainings };
}

export function loadGetterTupleGameStartedNotify(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _playerOne = source.readAddress();
  const _playerTwo = source.readAddress();
  const _totalGainings = source.readBigNumber();
  return { $$type: 'GameStartedNotify' as const, gameId: _gameId, playerOne: _playerOne, playerTwo: _playerTwo, totalGainings: _totalGainings };
}

export function storeTupleGameStartedNotify(source: GameStartedNotify) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.gameId);
  builder.writeAddress(source.playerOne);
  builder.writeAddress(source.playerTwo);
  builder.writeNumber(source.totalGainings);
  return builder.build();
}

export function dictValueParserGameStartedNotify(): DictionaryValue<GameStartedNotify> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeGameStartedNotify(src)).endCell());
    },
    parse: (src) => {
      return loadGameStartedNotify(src.loadRef().beginParse());
    }
  }
}

export type GameFinishedNotify = {
  $$type: 'GameFinishedNotify';
  gameId: bigint;
  winner: Address;
  looser: Address;
  totalGainings: bigint;
}

export function storeGameFinishedNotify(src: GameFinishedNotify) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(535291459, 32);
    b_0.storeUint(src.gameId, 256);
    b_0.storeAddress(src.winner);
    b_0.storeAddress(src.looser);
    b_0.storeCoins(src.totalGainings);
  };
}

export function loadGameFinishedNotify(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 535291459) { throw Error('Invalid prefix'); }
  const _gameId = sc_0.loadUintBig(256);
  const _winner = sc_0.loadAddress();
  const _looser = sc_0.loadAddress();
  const _totalGainings = sc_0.loadCoins();
  return { $$type: 'GameFinishedNotify' as const, gameId: _gameId, winner: _winner, looser: _looser, totalGainings: _totalGainings };
}

export function loadTupleGameFinishedNotify(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _winner = source.readAddress();
  const _looser = source.readAddress();
  const _totalGainings = source.readBigNumber();
  return { $$type: 'GameFinishedNotify' as const, gameId: _gameId, winner: _winner, looser: _looser, totalGainings: _totalGainings };
}

export function loadGetterTupleGameFinishedNotify(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _winner = source.readAddress();
  const _looser = source.readAddress();
  const _totalGainings = source.readBigNumber();
  return { $$type: 'GameFinishedNotify' as const, gameId: _gameId, winner: _winner, looser: _looser, totalGainings: _totalGainings };
}

export function storeTupleGameFinishedNotify(source: GameFinishedNotify) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.gameId);
  builder.writeAddress(source.winner);
  builder.writeAddress(source.looser);
  builder.writeNumber(source.totalGainings);
  return builder.build();
}

export function dictValueParserGameFinishedNotify(): DictionaryValue<GameFinishedNotify> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeGameFinishedNotify(src)).endCell());
    },
    parse: (src) => {
      return loadGameFinishedNotify(src.loadRef().beginParse());
    }
  }
}

export type GameCancelledNotify = {
  $$type: 'GameCancelledNotify';
  gameId: bigint;
  playerOne: Address;
}

export function storeGameCancelledNotify(src: GameCancelledNotify) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(388530130, 32);
    b_0.storeUint(src.gameId, 256);
    b_0.storeAddress(src.playerOne);
  };
}

export function loadGameCancelledNotify(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 388530130) { throw Error('Invalid prefix'); }
  const _gameId = sc_0.loadUintBig(256);
  const _playerOne = sc_0.loadAddress();
  return { $$type: 'GameCancelledNotify' as const, gameId: _gameId, playerOne: _playerOne };
}

export function loadTupleGameCancelledNotify(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _playerOne = source.readAddress();
  return { $$type: 'GameCancelledNotify' as const, gameId: _gameId, playerOne: _playerOne };
}

export function loadGetterTupleGameCancelledNotify(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _playerOne = source.readAddress();
  return { $$type: 'GameCancelledNotify' as const, gameId: _gameId, playerOne: _playerOne };
}

export function storeTupleGameCancelledNotify(source: GameCancelledNotify) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.gameId);
  builder.writeAddress(source.playerOne);
  return builder.build();
}

export function dictValueParserGameCancelledNotify(): DictionaryValue<GameCancelledNotify> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeGameCancelledNotify(src)).endCell());
    },
    parse: (src) => {
      return loadGameCancelledNotify(src.loadRef().beginParse());
    }
  }
}

export type SecretOpenedNotify = {
  $$type: 'SecretOpenedNotify';
  gameId: bigint;
  player: Address;
  coinSide: bigint;
}

export function storeSecretOpenedNotify(src: SecretOpenedNotify) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(1202198728, 32);
    b_0.storeUint(src.gameId, 256);
    b_0.storeAddress(src.player);
    b_0.storeUint(src.coinSide, 8);
  };
}

export function loadSecretOpenedNotify(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 1202198728) { throw Error('Invalid prefix'); }
  const _gameId = sc_0.loadUintBig(256);
  const _player = sc_0.loadAddress();
  const _coinSide = sc_0.loadUintBig(8);
  return { $$type: 'SecretOpenedNotify' as const, gameId: _gameId, player: _player, coinSide: _coinSide };
}

export function loadTupleSecretOpenedNotify(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _player = source.readAddress();
  const _coinSide = source.readBigNumber();
  return { $$type: 'SecretOpenedNotify' as const, gameId: _gameId, player: _player, coinSide: _coinSide };
}

export function loadGetterTupleSecretOpenedNotify(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _player = source.readAddress();
  const _coinSide = source.readBigNumber();
  return { $$type: 'SecretOpenedNotify' as const, gameId: _gameId, player: _player, coinSide: _coinSide };
}

export function storeTupleSecretOpenedNotify(source: SecretOpenedNotify) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.gameId);
  builder.writeAddress(source.player);
  builder.writeNumber(source.coinSide);
  return builder.build();
}

export function dictValueParserSecretOpenedNotify(): DictionaryValue<SecretOpenedNotify> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeSecretOpenedNotify(src)).endCell());
    },
    parse: (src) => {
      return loadSecretOpenedNotify(src.loadRef().beginParse());
    }
  }
}

export type DrawNotify = {
  $$type: 'DrawNotify';
  gameId: bigint;
}

export function storeDrawNotify(src: DrawNotify) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(317981831, 32);
    b_0.storeUint(src.gameId, 256);
  };
}

export function loadDrawNotify(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 317981831) { throw Error('Invalid prefix'); }
  const _gameId = sc_0.loadUintBig(256);
  return { $$type: 'DrawNotify' as const, gameId: _gameId };
}

export function loadTupleDrawNotify(source: TupleReader) {
  const _gameId = source.readBigNumber();
  return { $$type: 'DrawNotify' as const, gameId: _gameId };
}

export function loadGetterTupleDrawNotify(source: TupleReader) {
  const _gameId = source.readBigNumber();
  return { $$type: 'DrawNotify' as const, gameId: _gameId };
}

export function storeTupleDrawNotify(source: DrawNotify) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.gameId);
  return builder.build();
}

export function dictValueParserDrawNotify(): DictionaryValue<DrawNotify> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeDrawNotify(src)).endCell());
    },
    parse: (src) => {
      return loadDrawNotify(src.loadRef().beginParse());
    }
  }
}

export type InsufficientBalanceNotify = {
  $$type: 'InsufficientBalanceNotify';
  gameId: bigint;
  required: bigint;
  actual: bigint;
}

export function storeInsufficientBalanceNotify(src: InsufficientBalanceNotify) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(4148213171, 32);
    b_0.storeUint(src.gameId, 256);
    b_0.storeCoins(src.required);
    b_0.storeCoins(src.actual);
  };
}

export function loadInsufficientBalanceNotify(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 4148213171) { throw Error('Invalid prefix'); }
  const _gameId = sc_0.loadUintBig(256);
  const _required = sc_0.loadCoins();
  const _actual = sc_0.loadCoins();
  return { $$type: 'InsufficientBalanceNotify' as const, gameId: _gameId, required: _required, actual: _actual };
}

export function loadTupleInsufficientBalanceNotify(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _required = source.readBigNumber();
  const _actual = source.readBigNumber();
  return { $$type: 'InsufficientBalanceNotify' as const, gameId: _gameId, required: _required, actual: _actual };
}

export function loadGetterTupleInsufficientBalanceNotify(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _required = source.readBigNumber();
  const _actual = source.readBigNumber();
  return { $$type: 'InsufficientBalanceNotify' as const, gameId: _gameId, required: _required, actual: _actual };
}

export function storeTupleInsufficientBalanceNotify(source: InsufficientBalanceNotify) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.gameId);
  builder.writeNumber(source.required);
  builder.writeNumber(source.actual);
  return builder.build();
}

export function dictValueParserInsufficientBalanceNotify(): DictionaryValue<InsufficientBalanceNotify> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeInsufficientBalanceNotify(src)).endCell());
    },
    parse: (src) => {
      return loadInsufficientBalanceNotify(src.loadRef().beginParse());
    }
  }
}

export type DetailedStats = {
  $$type: 'DetailedStats';
  totalGamesCreated: bigint;
  totalGamesInitialized: bigint;
  totalGamesFinished: bigint;
  totalGamesCancelled: bigint;
  totalGamesDrawn: bigint;
}

export function storeDetailedStats(src: DetailedStats) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(src.totalGamesCreated, 64);
    b_0.storeUint(src.totalGamesInitialized, 64);
    b_0.storeUint(src.totalGamesFinished, 64);
    b_0.storeUint(src.totalGamesCancelled, 64);
    b_0.storeUint(src.totalGamesDrawn, 64);
  };
}

export function loadDetailedStats(slice: Slice) {
  const sc_0 = slice;
  const _totalGamesCreated = sc_0.loadUintBig(64);
  const _totalGamesInitialized = sc_0.loadUintBig(64);
  const _totalGamesFinished = sc_0.loadUintBig(64);
  const _totalGamesCancelled = sc_0.loadUintBig(64);
  const _totalGamesDrawn = sc_0.loadUintBig(64);
  return { $$type: 'DetailedStats' as const, totalGamesCreated: _totalGamesCreated, totalGamesInitialized: _totalGamesInitialized, totalGamesFinished: _totalGamesFinished, totalGamesCancelled: _totalGamesCancelled, totalGamesDrawn: _totalGamesDrawn };
}

export function loadTupleDetailedStats(source: TupleReader) {
  const _totalGamesCreated = source.readBigNumber();
  const _totalGamesInitialized = source.readBigNumber();
  const _totalGamesFinished = source.readBigNumber();
  const _totalGamesCancelled = source.readBigNumber();
  const _totalGamesDrawn = source.readBigNumber();
  return { $$type: 'DetailedStats' as const, totalGamesCreated: _totalGamesCreated, totalGamesInitialized: _totalGamesInitialized, totalGamesFinished: _totalGamesFinished, totalGamesCancelled: _totalGamesCancelled, totalGamesDrawn: _totalGamesDrawn };
}

export function loadGetterTupleDetailedStats(source: TupleReader) {
  const _totalGamesCreated = source.readBigNumber();
  const _totalGamesInitialized = source.readBigNumber();
  const _totalGamesFinished = source.readBigNumber();
  const _totalGamesCancelled = source.readBigNumber();
  const _totalGamesDrawn = source.readBigNumber();
  return { $$type: 'DetailedStats' as const, totalGamesCreated: _totalGamesCreated, totalGamesInitialized: _totalGamesInitialized, totalGamesFinished: _totalGamesFinished, totalGamesCancelled: _totalGamesCancelled, totalGamesDrawn: _totalGamesDrawn };
}

export function storeTupleDetailedStats(source: DetailedStats) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.totalGamesCreated);
  builder.writeNumber(source.totalGamesInitialized);
  builder.writeNumber(source.totalGamesFinished);
  builder.writeNumber(source.totalGamesCancelled);
  builder.writeNumber(source.totalGamesDrawn);
  return builder.build();
}

export function dictValueParserDetailedStats(): DictionaryValue<DetailedStats> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeDetailedStats(src)).endCell());
    },
    parse: (src) => {
      return loadDetailedStats(src.loadRef().beginParse());
    }
  }
}

export type FactoryConfig = {
  $$type: 'FactoryConfig';
  serviceFeeNumerator: bigint;
  referrerFeeNumerator: bigint;
  waitingForOpenBidSeconds: bigint;
  feeReceiver: Address;
  stopped: boolean;
}

export function storeFactoryConfig(src: FactoryConfig) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(src.serviceFeeNumerator, 32);
    b_0.storeUint(src.referrerFeeNumerator, 32);
    b_0.storeUint(src.waitingForOpenBidSeconds, 32);
    b_0.storeAddress(src.feeReceiver);
    b_0.storeBit(src.stopped);
  };
}

export function loadFactoryConfig(slice: Slice) {
  const sc_0 = slice;
  const _serviceFeeNumerator = sc_0.loadUintBig(32);
  const _referrerFeeNumerator = sc_0.loadUintBig(32);
  const _waitingForOpenBidSeconds = sc_0.loadUintBig(32);
  const _feeReceiver = sc_0.loadAddress();
  const _stopped = sc_0.loadBit();
  return { $$type: 'FactoryConfig' as const, serviceFeeNumerator: _serviceFeeNumerator, referrerFeeNumerator: _referrerFeeNumerator, waitingForOpenBidSeconds: _waitingForOpenBidSeconds, feeReceiver: _feeReceiver, stopped: _stopped };
}

export function loadTupleFactoryConfig(source: TupleReader) {
  const _serviceFeeNumerator = source.readBigNumber();
  const _referrerFeeNumerator = source.readBigNumber();
  const _waitingForOpenBidSeconds = source.readBigNumber();
  const _feeReceiver = source.readAddress();
  const _stopped = source.readBoolean();
  return { $$type: 'FactoryConfig' as const, serviceFeeNumerator: _serviceFeeNumerator, referrerFeeNumerator: _referrerFeeNumerator, waitingForOpenBidSeconds: _waitingForOpenBidSeconds, feeReceiver: _feeReceiver, stopped: _stopped };
}

export function loadGetterTupleFactoryConfig(source: TupleReader) {
  const _serviceFeeNumerator = source.readBigNumber();
  const _referrerFeeNumerator = source.readBigNumber();
  const _waitingForOpenBidSeconds = source.readBigNumber();
  const _feeReceiver = source.readAddress();
  const _stopped = source.readBoolean();
  return { $$type: 'FactoryConfig' as const, serviceFeeNumerator: _serviceFeeNumerator, referrerFeeNumerator: _referrerFeeNumerator, waitingForOpenBidSeconds: _waitingForOpenBidSeconds, feeReceiver: _feeReceiver, stopped: _stopped };
}

export function storeTupleFactoryConfig(source: FactoryConfig) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.serviceFeeNumerator);
  builder.writeNumber(source.referrerFeeNumerator);
  builder.writeNumber(source.waitingForOpenBidSeconds);
  builder.writeAddress(source.feeReceiver);
  builder.writeBoolean(source.stopped);
  return builder.build();
}

export function dictValueParserFactoryConfig(): DictionaryValue<FactoryConfig> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeFactoryConfig(src)).endCell());
    },
    parse: (src) => {
      return loadFactoryConfig(src.loadRef().beginParse());
    }
  }
}

export type GameAddressBatch = {
  $$type: 'GameAddressBatch';
  startId: bigint;
  addresses: Dictionary<number, Address>;
}

export function storeGameAddressBatch(src: GameAddressBatch) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(src.startId, 32);
    b_0.storeDict(src.addresses, Dictionary.Keys.Uint(32), Dictionary.Values.Address());
  };
}

export function loadGameAddressBatch(slice: Slice) {
  const sc_0 = slice;
  const _startId = sc_0.loadUintBig(32);
  const _addresses = Dictionary.load(Dictionary.Keys.Uint(32), Dictionary.Values.Address(), sc_0);
  return { $$type: 'GameAddressBatch' as const, startId: _startId, addresses: _addresses };
}

export function loadTupleGameAddressBatch(source: TupleReader) {
  const _startId = source.readBigNumber();
  const _addresses = Dictionary.loadDirect(Dictionary.Keys.Uint(32), Dictionary.Values.Address(), source.readCellOpt());
  return { $$type: 'GameAddressBatch' as const, startId: _startId, addresses: _addresses };
}

export function loadGetterTupleGameAddressBatch(source: TupleReader) {
  const _startId = source.readBigNumber();
  const _addresses = Dictionary.loadDirect(Dictionary.Keys.Uint(32), Dictionary.Values.Address(), source.readCellOpt());
  return { $$type: 'GameAddressBatch' as const, startId: _startId, addresses: _addresses };
}

export function storeTupleGameAddressBatch(source: GameAddressBatch) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.startId);
  builder.writeCell(source.addresses.size > 0 ? beginCell().storeDictDirect(source.addresses, Dictionary.Keys.Uint(32), Dictionary.Values.Address()).endCell() : null);
  return builder.build();
}

export function dictValueParserGameAddressBatch(): DictionaryValue<GameAddressBatch> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeGameAddressBatch(src)).endCell());
    },
    parse: (src) => {
      return loadGameAddressBatch(src.loadRef().beginParse());
    }
  }
}

export type GameInfo = {
  $$type: 'GameInfo';
  gameId: bigint;
  status: bigint;
  playerOne: Address;
  playerTwo: Address;
  bidValue: bigint;
  totalGainings: bigint;
  playerOneChosenSide: bigint;
  playerTwoChosenSide: bigint;
  gameCreatedTimestamp: bigint;
  gameStartedTimestamp: bigint;
  winner: Address;
  configReceived: boolean;
}

export function storeGameInfo(src: GameInfo) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(src.gameId, 256);
    b_0.storeUint(src.status, 8);
    b_0.storeAddress(src.playerOne);
    b_0.storeAddress(src.playerTwo);
    b_0.storeCoins(src.bidValue);
    const b_1 = new Builder();
    b_1.storeCoins(src.totalGainings);
    b_1.storeUint(src.playerOneChosenSide, 2);
    b_1.storeUint(src.playerTwoChosenSide, 2);
    b_1.storeUint(src.gameCreatedTimestamp, 32);
    b_1.storeUint(src.gameStartedTimestamp, 32);
    b_1.storeAddress(src.winner);
    b_1.storeBit(src.configReceived);
    b_0.storeRef(b_1.endCell());
  };
}

export function loadGameInfo(slice: Slice) {
  const sc_0 = slice;
  const _gameId = sc_0.loadUintBig(256);
  const _status = sc_0.loadUintBig(8);
  const _playerOne = sc_0.loadAddress();
  const _playerTwo = sc_0.loadAddress();
  const _bidValue = sc_0.loadCoins();
  const sc_1 = sc_0.loadRef().beginParse();
  const _totalGainings = sc_1.loadCoins();
  const _playerOneChosenSide = sc_1.loadUintBig(2);
  const _playerTwoChosenSide = sc_1.loadUintBig(2);
  const _gameCreatedTimestamp = sc_1.loadUintBig(32);
  const _gameStartedTimestamp = sc_1.loadUintBig(32);
  const _winner = sc_1.loadAddress();
  const _configReceived = sc_1.loadBit();
  return { $$type: 'GameInfo' as const, gameId: _gameId, status: _status, playerOne: _playerOne, playerTwo: _playerTwo, bidValue: _bidValue, totalGainings: _totalGainings, playerOneChosenSide: _playerOneChosenSide, playerTwoChosenSide: _playerTwoChosenSide, gameCreatedTimestamp: _gameCreatedTimestamp, gameStartedTimestamp: _gameStartedTimestamp, winner: _winner, configReceived: _configReceived };
}

export function loadTupleGameInfo(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _status = source.readBigNumber();
  const _playerOne = source.readAddress();
  const _playerTwo = source.readAddress();
  const _bidValue = source.readBigNumber();
  const _totalGainings = source.readBigNumber();
  const _playerOneChosenSide = source.readBigNumber();
  const _playerTwoChosenSide = source.readBigNumber();
  const _gameCreatedTimestamp = source.readBigNumber();
  const _gameStartedTimestamp = source.readBigNumber();
  const _winner = source.readAddress();
  const _configReceived = source.readBoolean();
  return { $$type: 'GameInfo' as const, gameId: _gameId, status: _status, playerOne: _playerOne, playerTwo: _playerTwo, bidValue: _bidValue, totalGainings: _totalGainings, playerOneChosenSide: _playerOneChosenSide, playerTwoChosenSide: _playerTwoChosenSide, gameCreatedTimestamp: _gameCreatedTimestamp, gameStartedTimestamp: _gameStartedTimestamp, winner: _winner, configReceived: _configReceived };
}

export function loadGetterTupleGameInfo(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _status = source.readBigNumber();
  const _playerOne = source.readAddress();
  const _playerTwo = source.readAddress();
  const _bidValue = source.readBigNumber();
  const _totalGainings = source.readBigNumber();
  const _playerOneChosenSide = source.readBigNumber();
  const _playerTwoChosenSide = source.readBigNumber();
  const _gameCreatedTimestamp = source.readBigNumber();
  const _gameStartedTimestamp = source.readBigNumber();
  const _winner = source.readAddress();
  const _configReceived = source.readBoolean();
  return { $$type: 'GameInfo' as const, gameId: _gameId, status: _status, playerOne: _playerOne, playerTwo: _playerTwo, bidValue: _bidValue, totalGainings: _totalGainings, playerOneChosenSide: _playerOneChosenSide, playerTwoChosenSide: _playerTwoChosenSide, gameCreatedTimestamp: _gameCreatedTimestamp, gameStartedTimestamp: _gameStartedTimestamp, winner: _winner, configReceived: _configReceived };
}

export function storeTupleGameInfo(source: GameInfo) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.gameId);
  builder.writeNumber(source.status);
  builder.writeAddress(source.playerOne);
  builder.writeAddress(source.playerTwo);
  builder.writeNumber(source.bidValue);
  builder.writeNumber(source.totalGainings);
  builder.writeNumber(source.playerOneChosenSide);
  builder.writeNumber(source.playerTwoChosenSide);
  builder.writeNumber(source.gameCreatedTimestamp);
  builder.writeNumber(source.gameStartedTimestamp);
  builder.writeAddress(source.winner);
  builder.writeBoolean(source.configReceived);
  return builder.build();
}

export function dictValueParserGameInfo(): DictionaryValue<GameInfo> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeGameInfo(src)).endCell());
    },
    parse: (src) => {
      return loadGameInfo(src.loadRef().beginParse());
    }
  }
}

export type PlayerInfo = {
  $$type: 'PlayerInfo';
  playerOne: Address;
  playerTwo: Address;
}

export function storePlayerInfo(src: PlayerInfo) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeAddress(src.playerOne);
    b_0.storeAddress(src.playerTwo);
  };
}

export function loadPlayerInfo(slice: Slice) {
  const sc_0 = slice;
  const _playerOne = sc_0.loadAddress();
  const _playerTwo = sc_0.loadAddress();
  return { $$type: 'PlayerInfo' as const, playerOne: _playerOne, playerTwo: _playerTwo };
}

export function loadTuplePlayerInfo(source: TupleReader) {
  const _playerOne = source.readAddress();
  const _playerTwo = source.readAddress();
  return { $$type: 'PlayerInfo' as const, playerOne: _playerOne, playerTwo: _playerTwo };
}

export function loadGetterTuplePlayerInfo(source: TupleReader) {
  const _playerOne = source.readAddress();
  const _playerTwo = source.readAddress();
  return { $$type: 'PlayerInfo' as const, playerOne: _playerOne, playerTwo: _playerTwo };
}

export function storeTuplePlayerInfo(source: PlayerInfo) {
  const builder = new TupleBuilder();
  builder.writeAddress(source.playerOne);
  builder.writeAddress(source.playerTwo);
  return builder.build();
}

export function dictValueParserPlayerInfo(): DictionaryValue<PlayerInfo> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storePlayerInfo(src)).endCell());
    },
    parse: (src) => {
      return loadPlayerInfo(src.loadRef().beginParse());
    }
  }
}

export type GameConfig = {
  $$type: 'GameConfig';
  serviceFeeNumerator: bigint;
  referrerFeeNumerator: bigint;
  waitingForOpenBidSeconds: bigint;
  feeReceiver: Address;
}

export function storeGameConfig(src: GameConfig) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(src.serviceFeeNumerator, 32);
    b_0.storeUint(src.referrerFeeNumerator, 32);
    b_0.storeUint(src.waitingForOpenBidSeconds, 32);
    b_0.storeAddress(src.feeReceiver);
  };
}

export function loadGameConfig(slice: Slice) {
  const sc_0 = slice;
  const _serviceFeeNumerator = sc_0.loadUintBig(32);
  const _referrerFeeNumerator = sc_0.loadUintBig(32);
  const _waitingForOpenBidSeconds = sc_0.loadUintBig(32);
  const _feeReceiver = sc_0.loadAddress();
  return { $$type: 'GameConfig' as const, serviceFeeNumerator: _serviceFeeNumerator, referrerFeeNumerator: _referrerFeeNumerator, waitingForOpenBidSeconds: _waitingForOpenBidSeconds, feeReceiver: _feeReceiver };
}

export function loadTupleGameConfig(source: TupleReader) {
  const _serviceFeeNumerator = source.readBigNumber();
  const _referrerFeeNumerator = source.readBigNumber();
  const _waitingForOpenBidSeconds = source.readBigNumber();
  const _feeReceiver = source.readAddress();
  return { $$type: 'GameConfig' as const, serviceFeeNumerator: _serviceFeeNumerator, referrerFeeNumerator: _referrerFeeNumerator, waitingForOpenBidSeconds: _waitingForOpenBidSeconds, feeReceiver: _feeReceiver };
}

export function loadGetterTupleGameConfig(source: TupleReader) {
  const _serviceFeeNumerator = source.readBigNumber();
  const _referrerFeeNumerator = source.readBigNumber();
  const _waitingForOpenBidSeconds = source.readBigNumber();
  const _feeReceiver = source.readAddress();
  return { $$type: 'GameConfig' as const, serviceFeeNumerator: _serviceFeeNumerator, referrerFeeNumerator: _referrerFeeNumerator, waitingForOpenBidSeconds: _waitingForOpenBidSeconds, feeReceiver: _feeReceiver };
}

export function storeTupleGameConfig(source: GameConfig) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.serviceFeeNumerator);
  builder.writeNumber(source.referrerFeeNumerator);
  builder.writeNumber(source.waitingForOpenBidSeconds);
  builder.writeAddress(source.feeReceiver);
  return builder.build();
}

export function dictValueParserGameConfig(): DictionaryValue<GameConfig> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeGameConfig(src)).endCell());
    },
    parse: (src) => {
      return loadGameConfig(src.loadRef().beginParse());
    }
  }
}

export type Game$Data = {
  $$type: 'Game$Data';
  gameId: bigint;
  factory: Address;
  serviceFeeNumerator: bigint;
  referrerFeeNumerator: bigint;
  waitingForOpenBidSeconds: bigint;
  lowestBid: bigint;
  highestBid: bigint;
  feeReceiver: Address;
  configReceived: boolean;
  status: bigint;
  playerOne: Address;
  playerTwo: Address;
  bidValue: bigint;
  totalGainings: bigint;
  playerOneEncryptedBet: bigint;
  playerTwoEncryptedBet: bigint;
  playerOneChosenSide: bigint;
  playerTwoChosenSide: bigint;
  gameCreatedTimestamp: bigint;
  gameStartedTimestamp: bigint;
  winner: Address;
  playerOneReferrer: Address | null;
  playerTwoReferrer: Address | null;
  finishing: boolean;
}

export function storeGame$Data(src: Game$Data) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(src.gameId, 256);
    b_0.storeAddress(src.factory);
    b_0.storeUint(src.serviceFeeNumerator, 32);
    b_0.storeUint(src.referrerFeeNumerator, 32);
    b_0.storeUint(src.waitingForOpenBidSeconds, 32);
    b_0.storeCoins(src.lowestBid);
    b_0.storeCoins(src.highestBid);
    const b_1 = new Builder();
    b_1.storeAddress(src.feeReceiver);
    b_1.storeBit(src.configReceived);
    b_1.storeUint(src.status, 8);
    b_1.storeAddress(src.playerOne);
    b_1.storeAddress(src.playerTwo);
    b_1.storeCoins(src.bidValue);
    const b_2 = new Builder();
    b_2.storeCoins(src.totalGainings);
    b_2.storeUint(src.playerOneEncryptedBet, 256);
    b_2.storeUint(src.playerTwoEncryptedBet, 256);
    b_2.storeUint(src.playerOneChosenSide, 2);
    b_2.storeUint(src.playerTwoChosenSide, 2);
    b_2.storeUint(src.gameCreatedTimestamp, 32);
    b_2.storeUint(src.gameStartedTimestamp, 32);
    b_2.storeAddress(src.winner);
    const b_3 = new Builder();
    b_3.storeAddress(src.playerOneReferrer);
    b_3.storeAddress(src.playerTwoReferrer);
    b_3.storeBit(src.finishing);
    b_2.storeRef(b_3.endCell());
    b_1.storeRef(b_2.endCell());
    b_0.storeRef(b_1.endCell());
  };
}

export function loadGame$Data(slice: Slice) {
  const sc_0 = slice;
  const _gameId = sc_0.loadUintBig(256);
  const _factory = sc_0.loadAddress();
  const _serviceFeeNumerator = sc_0.loadUintBig(32);
  const _referrerFeeNumerator = sc_0.loadUintBig(32);
  const _waitingForOpenBidSeconds = sc_0.loadUintBig(32);
  const _lowestBid = sc_0.loadCoins();
  const _highestBid = sc_0.loadCoins();
  const sc_1 = sc_0.loadRef().beginParse();
  const _feeReceiver = sc_1.loadAddress();
  const _configReceived = sc_1.loadBit();
  const _status = sc_1.loadUintBig(8);
  const _playerOne = sc_1.loadAddress();
  const _playerTwo = sc_1.loadAddress();
  const _bidValue = sc_1.loadCoins();
  const sc_2 = sc_1.loadRef().beginParse();
  const _totalGainings = sc_2.loadCoins();
  const _playerOneEncryptedBet = sc_2.loadUintBig(256);
  const _playerTwoEncryptedBet = sc_2.loadUintBig(256);
  const _playerOneChosenSide = sc_2.loadUintBig(2);
  const _playerTwoChosenSide = sc_2.loadUintBig(2);
  const _gameCreatedTimestamp = sc_2.loadUintBig(32);
  const _gameStartedTimestamp = sc_2.loadUintBig(32);
  const _winner = sc_2.loadAddress();
  const sc_3 = sc_2.loadRef().beginParse();
  const _playerOneReferrer = sc_3.loadMaybeAddress();
  const _playerTwoReferrer = sc_3.loadMaybeAddress();
  const _finishing = sc_3.loadBit();
  return { $$type: 'Game$Data' as const, gameId: _gameId, factory: _factory, serviceFeeNumerator: _serviceFeeNumerator, referrerFeeNumerator: _referrerFeeNumerator, waitingForOpenBidSeconds: _waitingForOpenBidSeconds, lowestBid: _lowestBid, highestBid: _highestBid, feeReceiver: _feeReceiver, configReceived: _configReceived, status: _status, playerOne: _playerOne, playerTwo: _playerTwo, bidValue: _bidValue, totalGainings: _totalGainings, playerOneEncryptedBet: _playerOneEncryptedBet, playerTwoEncryptedBet: _playerTwoEncryptedBet, playerOneChosenSide: _playerOneChosenSide, playerTwoChosenSide: _playerTwoChosenSide, gameCreatedTimestamp: _gameCreatedTimestamp, gameStartedTimestamp: _gameStartedTimestamp, winner: _winner, playerOneReferrer: _playerOneReferrer, playerTwoReferrer: _playerTwoReferrer, finishing: _finishing };
}

export function loadTupleGame$Data(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _factory = source.readAddress();
  const _serviceFeeNumerator = source.readBigNumber();
  const _referrerFeeNumerator = source.readBigNumber();
  const _waitingForOpenBidSeconds = source.readBigNumber();
  const _lowestBid = source.readBigNumber();
  const _highestBid = source.readBigNumber();
  const _feeReceiver = source.readAddress();
  const _configReceived = source.readBoolean();
  const _status = source.readBigNumber();
  const _playerOne = source.readAddress();
  const _playerTwo = source.readAddress();
  const _bidValue = source.readBigNumber();
  const _totalGainings = source.readBigNumber();
  source = source.readTuple();
  const _playerOneEncryptedBet = source.readBigNumber();
  const _playerTwoEncryptedBet = source.readBigNumber();
  const _playerOneChosenSide = source.readBigNumber();
  const _playerTwoChosenSide = source.readBigNumber();
  const _gameCreatedTimestamp = source.readBigNumber();
  const _gameStartedTimestamp = source.readBigNumber();
  const _winner = source.readAddress();
  const _playerOneReferrer = source.readAddressOpt();
  const _playerTwoReferrer = source.readAddressOpt();
  const _finishing = source.readBoolean();
  return { $$type: 'Game$Data' as const, gameId: _gameId, factory: _factory, serviceFeeNumerator: _serviceFeeNumerator, referrerFeeNumerator: _referrerFeeNumerator, waitingForOpenBidSeconds: _waitingForOpenBidSeconds, lowestBid: _lowestBid, highestBid: _highestBid, feeReceiver: _feeReceiver, configReceived: _configReceived, status: _status, playerOne: _playerOne, playerTwo: _playerTwo, bidValue: _bidValue, totalGainings: _totalGainings, playerOneEncryptedBet: _playerOneEncryptedBet, playerTwoEncryptedBet: _playerTwoEncryptedBet, playerOneChosenSide: _playerOneChosenSide, playerTwoChosenSide: _playerTwoChosenSide, gameCreatedTimestamp: _gameCreatedTimestamp, gameStartedTimestamp: _gameStartedTimestamp, winner: _winner, playerOneReferrer: _playerOneReferrer, playerTwoReferrer: _playerTwoReferrer, finishing: _finishing };
}

export function loadGetterTupleGame$Data(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _factory = source.readAddress();
  const _serviceFeeNumerator = source.readBigNumber();
  const _referrerFeeNumerator = source.readBigNumber();
  const _waitingForOpenBidSeconds = source.readBigNumber();
  const _lowestBid = source.readBigNumber();
  const _highestBid = source.readBigNumber();
  const _feeReceiver = source.readAddress();
  const _configReceived = source.readBoolean();
  const _status = source.readBigNumber();
  const _playerOne = source.readAddress();
  const _playerTwo = source.readAddress();
  const _bidValue = source.readBigNumber();
  const _totalGainings = source.readBigNumber();
  const _playerOneEncryptedBet = source.readBigNumber();
  const _playerTwoEncryptedBet = source.readBigNumber();
  const _playerOneChosenSide = source.readBigNumber();
  const _playerTwoChosenSide = source.readBigNumber();
  const _gameCreatedTimestamp = source.readBigNumber();
  const _gameStartedTimestamp = source.readBigNumber();
  const _winner = source.readAddress();
  const _playerOneReferrer = source.readAddressOpt();
  const _playerTwoReferrer = source.readAddressOpt();
  const _finishing = source.readBoolean();
  return { $$type: 'Game$Data' as const, gameId: _gameId, factory: _factory, serviceFeeNumerator: _serviceFeeNumerator, referrerFeeNumerator: _referrerFeeNumerator, waitingForOpenBidSeconds: _waitingForOpenBidSeconds, lowestBid: _lowestBid, highestBid: _highestBid, feeReceiver: _feeReceiver, configReceived: _configReceived, status: _status, playerOne: _playerOne, playerTwo: _playerTwo, bidValue: _bidValue, totalGainings: _totalGainings, playerOneEncryptedBet: _playerOneEncryptedBet, playerTwoEncryptedBet: _playerTwoEncryptedBet, playerOneChosenSide: _playerOneChosenSide, playerTwoChosenSide: _playerTwoChosenSide, gameCreatedTimestamp: _gameCreatedTimestamp, gameStartedTimestamp: _gameStartedTimestamp, winner: _winner, playerOneReferrer: _playerOneReferrer, playerTwoReferrer: _playerTwoReferrer, finishing: _finishing };
}

export function storeTupleGame$Data(source: Game$Data) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.gameId);
  builder.writeAddress(source.factory);
  builder.writeNumber(source.serviceFeeNumerator);
  builder.writeNumber(source.referrerFeeNumerator);
  builder.writeNumber(source.waitingForOpenBidSeconds);
  builder.writeNumber(source.lowestBid);
  builder.writeNumber(source.highestBid);
  builder.writeAddress(source.feeReceiver);
  builder.writeBoolean(source.configReceived);
  builder.writeNumber(source.status);
  builder.writeAddress(source.playerOne);
  builder.writeAddress(source.playerTwo);
  builder.writeNumber(source.bidValue);
  builder.writeNumber(source.totalGainings);
  builder.writeNumber(source.playerOneEncryptedBet);
  builder.writeNumber(source.playerTwoEncryptedBet);
  builder.writeNumber(source.playerOneChosenSide);
  builder.writeNumber(source.playerTwoChosenSide);
  builder.writeNumber(source.gameCreatedTimestamp);
  builder.writeNumber(source.gameStartedTimestamp);
  builder.writeAddress(source.winner);
  builder.writeAddress(source.playerOneReferrer);
  builder.writeAddress(source.playerTwoReferrer);
  builder.writeBoolean(source.finishing);
  return builder.build();
}

export function dictValueParserGame$Data(): DictionaryValue<Game$Data> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeGame$Data(src)).endCell());
    },
    parse: (src) => {
      return loadGame$Data(src.loadRef().beginParse());
    }
  }
}

export type AddReferrerReward = {
  $$type: 'AddReferrerReward';
  gameId: bigint;
  amount: bigint;
  winner: Address;
}

export function storeAddReferrerReward(src: AddReferrerReward) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(160244998, 32);
    b_0.storeUint(src.gameId, 256);
    b_0.storeCoins(src.amount);
    b_0.storeAddress(src.winner);
  };
}

export function loadAddReferrerReward(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 160244998) { throw Error('Invalid prefix'); }
  const _gameId = sc_0.loadUintBig(256);
  const _amount = sc_0.loadCoins();
  const _winner = sc_0.loadAddress();
  return { $$type: 'AddReferrerReward' as const, gameId: _gameId, amount: _amount, winner: _winner };
}

export function loadTupleAddReferrerReward(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _amount = source.readBigNumber();
  const _winner = source.readAddress();
  return { $$type: 'AddReferrerReward' as const, gameId: _gameId, amount: _amount, winner: _winner };
}

export function loadGetterTupleAddReferrerReward(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _amount = source.readBigNumber();
  const _winner = source.readAddress();
  return { $$type: 'AddReferrerReward' as const, gameId: _gameId, amount: _amount, winner: _winner };
}

export function storeTupleAddReferrerReward(source: AddReferrerReward) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.gameId);
  builder.writeNumber(source.amount);
  builder.writeAddress(source.winner);
  return builder.build();
}

export function dictValueParserAddReferrerReward(): DictionaryValue<AddReferrerReward> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeAddReferrerReward(src)).endCell());
    },
    parse: (src) => {
      return loadAddReferrerReward(src.loadRef().beginParse());
    }
  }
}

export type ReferrerRewardAdded = {
  $$type: 'ReferrerRewardAdded';
  gameId: bigint;
  amount: bigint;
  timestamp: bigint;
}

export function storeReferrerRewardAdded(src: ReferrerRewardAdded) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(2959210841, 32);
    b_0.storeUint(src.gameId, 256);
    b_0.storeCoins(src.amount);
    b_0.storeUint(src.timestamp, 32);
  };
}

export function loadReferrerRewardAdded(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 2959210841) { throw Error('Invalid prefix'); }
  const _gameId = sc_0.loadUintBig(256);
  const _amount = sc_0.loadCoins();
  const _timestamp = sc_0.loadUintBig(32);
  return { $$type: 'ReferrerRewardAdded' as const, gameId: _gameId, amount: _amount, timestamp: _timestamp };
}

export function loadTupleReferrerRewardAdded(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _amount = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'ReferrerRewardAdded' as const, gameId: _gameId, amount: _amount, timestamp: _timestamp };
}

export function loadGetterTupleReferrerRewardAdded(source: TupleReader) {
  const _gameId = source.readBigNumber();
  const _amount = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'ReferrerRewardAdded' as const, gameId: _gameId, amount: _amount, timestamp: _timestamp };
}

export function storeTupleReferrerRewardAdded(source: ReferrerRewardAdded) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.gameId);
  builder.writeNumber(source.amount);
  builder.writeNumber(source.timestamp);
  return builder.build();
}

export function dictValueParserReferrerRewardAdded(): DictionaryValue<ReferrerRewardAdded> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeReferrerRewardAdded(src)).endCell());
    },
    parse: (src) => {
      return loadReferrerRewardAdded(src.loadRef().beginParse());
    }
  }
}

export type ReferrerWithdrawn = {
  $$type: 'ReferrerWithdrawn';
  amount: bigint;
  timestamp: bigint;
}

export function storeReferrerWithdrawn(src: ReferrerWithdrawn) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(1896431876, 32);
    b_0.storeCoins(src.amount);
    b_0.storeUint(src.timestamp, 32);
  };
}

export function loadReferrerWithdrawn(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 1896431876) { throw Error('Invalid prefix'); }
  const _amount = sc_0.loadCoins();
  const _timestamp = sc_0.loadUintBig(32);
  return { $$type: 'ReferrerWithdrawn' as const, amount: _amount, timestamp: _timestamp };
}

export function loadTupleReferrerWithdrawn(source: TupleReader) {
  const _amount = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'ReferrerWithdrawn' as const, amount: _amount, timestamp: _timestamp };
}

export function loadGetterTupleReferrerWithdrawn(source: TupleReader) {
  const _amount = source.readBigNumber();
  const _timestamp = source.readBigNumber();
  return { $$type: 'ReferrerWithdrawn' as const, amount: _amount, timestamp: _timestamp };
}

export function storeTupleReferrerWithdrawn(source: ReferrerWithdrawn) {
  const builder = new TupleBuilder();
  builder.writeNumber(source.amount);
  builder.writeNumber(source.timestamp);
  return builder.build();
}

export function dictValueParserReferrerWithdrawn(): DictionaryValue<ReferrerWithdrawn> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeReferrerWithdrawn(src)).endCell());
    },
    parse: (src) => {
      return loadReferrerWithdrawn(src.loadRef().beginParse());
    }
  }
}

export type ReferrerWallet$Data = {
  $$type: 'ReferrerWallet$Data';
  referrer: Address;
  factory: Address;
  totalEarned: bigint;
  availableToWithdraw: bigint;
  minWithdrawAmount: bigint;
  lastWithdrawalAmount: bigint;
}

export function storeReferrerWallet$Data(src: ReferrerWallet$Data) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeAddress(src.referrer);
    b_0.storeAddress(src.factory);
    b_0.storeCoins(src.totalEarned);
    b_0.storeCoins(src.availableToWithdraw);
    b_0.storeCoins(src.minWithdrawAmount);
    const b_1 = new Builder();
    b_1.storeCoins(src.lastWithdrawalAmount);
    b_0.storeRef(b_1.endCell());
  };
}

export function loadReferrerWallet$Data(slice: Slice) {
  const sc_0 = slice;
  const _referrer = sc_0.loadAddress();
  const _factory = sc_0.loadAddress();
  const _totalEarned = sc_0.loadCoins();
  const _availableToWithdraw = sc_0.loadCoins();
  const _minWithdrawAmount = sc_0.loadCoins();
  const sc_1 = sc_0.loadRef().beginParse();
  const _lastWithdrawalAmount = sc_1.loadCoins();
  return { $$type: 'ReferrerWallet$Data' as const, referrer: _referrer, factory: _factory, totalEarned: _totalEarned, availableToWithdraw: _availableToWithdraw, minWithdrawAmount: _minWithdrawAmount, lastWithdrawalAmount: _lastWithdrawalAmount };
}

export function loadTupleReferrerWallet$Data(source: TupleReader) {
  const _referrer = source.readAddress();
  const _factory = source.readAddress();
  const _totalEarned = source.readBigNumber();
  const _availableToWithdraw = source.readBigNumber();
  const _minWithdrawAmount = source.readBigNumber();
  const _lastWithdrawalAmount = source.readBigNumber();
  return { $$type: 'ReferrerWallet$Data' as const, referrer: _referrer, factory: _factory, totalEarned: _totalEarned, availableToWithdraw: _availableToWithdraw, minWithdrawAmount: _minWithdrawAmount, lastWithdrawalAmount: _lastWithdrawalAmount };
}

export function loadGetterTupleReferrerWallet$Data(source: TupleReader) {
  const _referrer = source.readAddress();
  const _factory = source.readAddress();
  const _totalEarned = source.readBigNumber();
  const _availableToWithdraw = source.readBigNumber();
  const _minWithdrawAmount = source.readBigNumber();
  const _lastWithdrawalAmount = source.readBigNumber();
  return { $$type: 'ReferrerWallet$Data' as const, referrer: _referrer, factory: _factory, totalEarned: _totalEarned, availableToWithdraw: _availableToWithdraw, minWithdrawAmount: _minWithdrawAmount, lastWithdrawalAmount: _lastWithdrawalAmount };
}

export function storeTupleReferrerWallet$Data(source: ReferrerWallet$Data) {
  const builder = new TupleBuilder();
  builder.writeAddress(source.referrer);
  builder.writeAddress(source.factory);
  builder.writeNumber(source.totalEarned);
  builder.writeNumber(source.availableToWithdraw);
  builder.writeNumber(source.minWithdrawAmount);
  builder.writeNumber(source.lastWithdrawalAmount);
  return builder.build();
}

export function dictValueParserReferrerWallet$Data(): DictionaryValue<ReferrerWallet$Data> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeReferrerWallet$Data(src)).endCell());
    },
    parse: (src) => {
      return loadReferrerWallet$Data(src.loadRef().beginParse());
    }
  }
}

export type FlipCoinGameFactory$Data = {
  $$type: 'FlipCoinGameFactory$Data';
  stopped: boolean;
  owner: Address;
  serviceFeeNumerator: bigint;
  referrerFeeNumerator: bigint;
  lowestBid: bigint;
  highestBid: bigint;
  waitingForOpenBidSeconds: bigint;
  minReferrerPayoutValue: bigint;
  feeReceiver: Address;
  totalGamesCreated: bigint;
  totalGamesInitialized: bigint;
  totalGamesFinished: bigint;
  totalGamesCancelled: bigint;
  totalGamesDrawn: bigint;
  lastCreatedGameId: bigint;
}

export function storeFlipCoinGameFactory$Data(src: FlipCoinGameFactory$Data) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeBit(src.stopped);
    b_0.storeAddress(src.owner);
    b_0.storeUint(src.serviceFeeNumerator, 256);
    b_0.storeUint(src.referrerFeeNumerator, 256);
    const b_1 = new Builder();
    b_1.storeUint(src.lowestBid, 256);
    b_1.storeUint(src.highestBid, 256);
    b_1.storeUint(src.waitingForOpenBidSeconds, 256);
    const b_2 = new Builder();
    b_2.storeUint(src.minReferrerPayoutValue, 256);
    b_2.storeAddress(src.feeReceiver);
    b_2.storeUint(src.totalGamesCreated, 64);
    b_2.storeUint(src.totalGamesInitialized, 64);
    b_2.storeUint(src.totalGamesFinished, 64);
    b_2.storeUint(src.totalGamesCancelled, 64);
    b_2.storeUint(src.totalGamesDrawn, 64);
    b_2.storeUint(src.lastCreatedGameId, 64);
    b_1.storeRef(b_2.endCell());
    b_0.storeRef(b_1.endCell());
  };
}

export function loadFlipCoinGameFactory$Data(slice: Slice) {
  const sc_0 = slice;
  const _stopped = sc_0.loadBit();
  const _owner = sc_0.loadAddress();
  const _serviceFeeNumerator = sc_0.loadUintBig(256);
  const _referrerFeeNumerator = sc_0.loadUintBig(256);
  const sc_1 = sc_0.loadRef().beginParse();
  const _lowestBid = sc_1.loadUintBig(256);
  const _highestBid = sc_1.loadUintBig(256);
  const _waitingForOpenBidSeconds = sc_1.loadUintBig(256);
  const sc_2 = sc_1.loadRef().beginParse();
  const _minReferrerPayoutValue = sc_2.loadUintBig(256);
  const _feeReceiver = sc_2.loadAddress();
  const _totalGamesCreated = sc_2.loadUintBig(64);
  const _totalGamesInitialized = sc_2.loadUintBig(64);
  const _totalGamesFinished = sc_2.loadUintBig(64);
  const _totalGamesCancelled = sc_2.loadUintBig(64);
  const _totalGamesDrawn = sc_2.loadUintBig(64);
  const _lastCreatedGameId = sc_2.loadUintBig(64);
  return { $$type: 'FlipCoinGameFactory$Data' as const, stopped: _stopped, owner: _owner, serviceFeeNumerator: _serviceFeeNumerator, referrerFeeNumerator: _referrerFeeNumerator, lowestBid: _lowestBid, highestBid: _highestBid, waitingForOpenBidSeconds: _waitingForOpenBidSeconds, minReferrerPayoutValue: _minReferrerPayoutValue, feeReceiver: _feeReceiver, totalGamesCreated: _totalGamesCreated, totalGamesInitialized: _totalGamesInitialized, totalGamesFinished: _totalGamesFinished, totalGamesCancelled: _totalGamesCancelled, totalGamesDrawn: _totalGamesDrawn, lastCreatedGameId: _lastCreatedGameId };
}

export function loadTupleFlipCoinGameFactory$Data(source: TupleReader) {
  const _stopped = source.readBoolean();
  const _owner = source.readAddress();
  const _serviceFeeNumerator = source.readBigNumber();
  const _referrerFeeNumerator = source.readBigNumber();
  const _lowestBid = source.readBigNumber();
  const _highestBid = source.readBigNumber();
  const _waitingForOpenBidSeconds = source.readBigNumber();
  const _minReferrerPayoutValue = source.readBigNumber();
  const _feeReceiver = source.readAddress();
  const _totalGamesCreated = source.readBigNumber();
  const _totalGamesInitialized = source.readBigNumber();
  const _totalGamesFinished = source.readBigNumber();
  const _totalGamesCancelled = source.readBigNumber();
  const _totalGamesDrawn = source.readBigNumber();
  const _lastCreatedGameId = source.readBigNumber();
  return { $$type: 'FlipCoinGameFactory$Data' as const, stopped: _stopped, owner: _owner, serviceFeeNumerator: _serviceFeeNumerator, referrerFeeNumerator: _referrerFeeNumerator, lowestBid: _lowestBid, highestBid: _highestBid, waitingForOpenBidSeconds: _waitingForOpenBidSeconds, minReferrerPayoutValue: _minReferrerPayoutValue, feeReceiver: _feeReceiver, totalGamesCreated: _totalGamesCreated, totalGamesInitialized: _totalGamesInitialized, totalGamesFinished: _totalGamesFinished, totalGamesCancelled: _totalGamesCancelled, totalGamesDrawn: _totalGamesDrawn, lastCreatedGameId: _lastCreatedGameId };
}

export function loadGetterTupleFlipCoinGameFactory$Data(source: TupleReader) {
  const _stopped = source.readBoolean();
  const _owner = source.readAddress();
  const _serviceFeeNumerator = source.readBigNumber();
  const _referrerFeeNumerator = source.readBigNumber();
  const _lowestBid = source.readBigNumber();
  const _highestBid = source.readBigNumber();
  const _waitingForOpenBidSeconds = source.readBigNumber();
  const _minReferrerPayoutValue = source.readBigNumber();
  const _feeReceiver = source.readAddress();
  const _totalGamesCreated = source.readBigNumber();
  const _totalGamesInitialized = source.readBigNumber();
  const _totalGamesFinished = source.readBigNumber();
  const _totalGamesCancelled = source.readBigNumber();
  const _totalGamesDrawn = source.readBigNumber();
  const _lastCreatedGameId = source.readBigNumber();
  return { $$type: 'FlipCoinGameFactory$Data' as const, stopped: _stopped, owner: _owner, serviceFeeNumerator: _serviceFeeNumerator, referrerFeeNumerator: _referrerFeeNumerator, lowestBid: _lowestBid, highestBid: _highestBid, waitingForOpenBidSeconds: _waitingForOpenBidSeconds, minReferrerPayoutValue: _minReferrerPayoutValue, feeReceiver: _feeReceiver, totalGamesCreated: _totalGamesCreated, totalGamesInitialized: _totalGamesInitialized, totalGamesFinished: _totalGamesFinished, totalGamesCancelled: _totalGamesCancelled, totalGamesDrawn: _totalGamesDrawn, lastCreatedGameId: _lastCreatedGameId };
}

export function storeTupleFlipCoinGameFactory$Data(source: FlipCoinGameFactory$Data) {
  const builder = new TupleBuilder();
  builder.writeBoolean(source.stopped);
  builder.writeAddress(source.owner);
  builder.writeNumber(source.serviceFeeNumerator);
  builder.writeNumber(source.referrerFeeNumerator);
  builder.writeNumber(source.lowestBid);
  builder.writeNumber(source.highestBid);
  builder.writeNumber(source.waitingForOpenBidSeconds);
  builder.writeNumber(source.minReferrerPayoutValue);
  builder.writeAddress(source.feeReceiver);
  builder.writeNumber(source.totalGamesCreated);
  builder.writeNumber(source.totalGamesInitialized);
  builder.writeNumber(source.totalGamesFinished);
  builder.writeNumber(source.totalGamesCancelled);
  builder.writeNumber(source.totalGamesDrawn);
  builder.writeNumber(source.lastCreatedGameId);
  return builder.build();
}

export function dictValueParserFlipCoinGameFactory$Data(): DictionaryValue<FlipCoinGameFactory$Data> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeFlipCoinGameFactory$Data(src)).endCell());
    },
    parse: (src) => {
      return loadFlipCoinGameFactory$Data(src.loadRef().beginParse());
    }
  }
}

type Game_init_args = {
  $$type: 'Game_init_args';
  gameId: bigint;
  factory: Address;
}

function initGame_init_args(src: Game_init_args) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeInt(src.gameId, 257);
    b_0.storeAddress(src.factory);
  };
}

async function Game_init(gameId: bigint, factory: Address) {
  const __code = Cell.fromHex('b5ee9c7241026801001b2000022cff008e88f4a413f4bcf2c80bed53208e8130e1ed43d9010e0202710206020120030403c3baa43ed44d0d200018e8d810101d700fa405902d101db3ce30d1117111a11171116111911161115111811151114111711141113111611131112111511121111111411111110111311100f11120f0e11110e0d11100d10cf552bdb3c57105f0f6c8180f1228033fb8b4fed44d0d200018e8d810101d700fa405902d101db3ce30ddb3c6ccc6ccc80f1205001c5617547fed547feb547dcb2d561a020162070c020120080a034bad20f6a268690000c746c08080eb807d202c816880ed9e7186ed9e2b892b882f87a83c2f83c00f1209000453dc0343ae8576a268690000c746c08080eb807d202c816880ed9e7186ed9e2b882f87b640c00f120b00022e033fb09b7b513434800063a360404075c03e901640b44076cf38c376cf1b311b31200f120d001056155615561556130478eda2edfb01d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e8d810101d700fa405902d101db3ce30d1119e3025617d749c21f0f12141601f670547000208d086000000000000000000000000000000000000000000000000000000000000000000470228d08600000000000000000000000000000000000000000000000000000000000000000048d08600000000000000000000000000000000000000000000000000000000000000000045472222071547011100108896d6d701100438000000000000000000000000000000000000000000000000000000000000000001001fcd3fffa40d31fd31fd31ffa00fa00d401d0fa40d200d307fa40fa40fa00d430d0fa00d3ffd3ffd301d301d31fd31ffa40d430d0d72c01916d93fa4001e201d72c01916d93fa4001e201d2003011111118111111111117111111111116111111111115111111111114111111111113111111111112111157181116111711161300541115111611151114111511141113111411131112111311121111111211111110111111100f11100f550e02fc11178020d7217021d749c21f963020d70b1f319131e282101fe7e643ba8ec02cc004993c571673701117500cde1115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df551cdb3ce0111511171115111411161114111311151113111211141112111111131111661501281110111211100f11110f0e11100e10df551cdb3c660264e3001117f90182f07eb83851a96f92cc4eca034b89d2f6683400e664badb4b60cf7695d5a1b51071bae3025f0f5f09f2c082175a04541117d31f218210b11be55fbae302218210371b4403bae30221821029ff84b5bae3022182108f4a2e85ba181d223001fa313e3e3e3e3e3e3e07fa40fa00d3ffd72c01916d93fa4001e201d31fd31fd430d0d31ffa00fa00fa40308148ea5610c000f2f4813ed3f8425619c705f2f48200a8565365bef2f4812ce523c200f2f48120265323bef2f47f8200e9bf53a4bef2f482008c6553a3bbf2f4814ac52a8208989680bef2f481575ef8416f241902fc135f032bbef2f4276eb38e1807111707061115060511120504111004103f102d50cb5f08e30d7122f8232282089896807256175398c855208210eb2920975004cb1f12cbffce01fa02c9561755205a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e21a1c02fa27206ef2d0801118111a1118111711191117071116070611150605111405041113040311120302111102011110014fe04dc04ba0103908111a08071119070611190605111905041119040311190302111b0201111c01db3c32343536363637378130335612206ef2d0805614c705b3f2f406111306031112030f11110f5f1b00200e11100e105e4cb04a89102710465e40018af400c901fb001115111711151114111611141111111511110e11140e0c11130c0b11120b0911110908111008107f0e106d10ac105b102a10491068103750050604db3cdb316602f431fa40d3ffd72c01916d93fa4001e2318200e72a5610c001f2f48200c9cef8425619c705f2f48141f1533fc705b3f2f48200e9bff8416f24135f032ebef2f482008c65f8416f24135f032e820afaf080a0bbf2f4206eb39d061119063f103c102a50865f06e30d717227aa00f8238208989680235617547e94c81e2002fe20206ef2d0801118111911181117111911171116111911161115111911151114111911141113111911131112111911121111111911111110111911100f11190f0e11190e0d11190d0c11190c0b11190b0a11190a0911190908111908071119070611190605111905041119040311190302111a0201111b01db3c31333435365f1f007437388130335614206ef2d0805613c705b3f2f403111303051112051110111111100f11100f10ef10de10cd10bc10ab109a10891038161714430501fe55308210061e5e5b5005cb1f13cbffcece01fa02c9561755205a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb001115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df102e21012810bd106c109b1a10795e34103645145adb3cdb316603fe31d3ff30811dd42ec002f2f48113b35619c000f2f471f8422ec7058edaf8422dc7058e4d31f2c3e81116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a1089106807104610354430e30d09507a18e30d82089896807223242a01ce3082009a4926c001f2f41116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df2b10df51e810ce10bd10ac0b108a10791068105710461035144330db3c373881145b26c301f2f425702501cc3082009a4927c001f2f41116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df2c51f910df10ce10bd0c109b108a107910681057104613154440db3c383981145b27c301f2f426702503f61117111a11171116111911161115111811151114111a11141113111911131112111811121111111a11111110111911100f11180f0e111a0e0d11190d0c11180c0b111a0b0a11190a0911180908111a08071119070611180605111a05041119040311180302111a0201111901111872561a561adb3c561b01bae302282627006a5718571857181114111711141113111611131112111511121111111411111110111311100f11120f0e11110e0d11100d10cf552b7202fa1117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e551d7359db3c01111901ba8e311116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550e73e011161117111628290018c813cb07cbff01cf16c9f90000561115111611151114111511141113111411131112111311121111111211111110111111100f11100f550e7103f4f842561b401cc85520821047a818c85004cb1f12cbffcecb07c956190350bb5a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0020c2019326c2019170e28f1239f8276f102abe8e8510687fdb3ce30e0907de0709db3cdb31362b6601f63d7f73820898968072f8276f10561a52e2c855208210f740b5b35004cb1f12cbff01fa0201fa02c9561955205a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00f8276f10820afaf080a1208209312d00be9130e30d0e1079012c011aab00208208989680be9130e30d2d03f88d0954185c9d1a585b081c99599d5b99080b481a5b9cdd59999a58da595b9d0818985b185b98d960111811191118111711191117111611191116111511191115111411191114111311191113111211191112111111191111111011191110102f220f0e0d0c10ab09080706050403111a030201111a0120111bdb3c895e2e2f004a5061727469616c20726566756e64202d20696e73756666696369656e742062616c616e636501ba1118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef2d0f10de10cd10bc10ab109a1089107810671056104510344300db3c3e0d1068745e03dee302018210804b746dba8f60d3ff3081659f015617baf2f4811dd42dc002f2f48200dd271118c00001111801f2f48200b078f823235613a0bef2f41114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df551c7fdb3cdb3cdb31e0111731366603fc31d3ff3081659f015617baf2f48178350dc0011df2f4820098f7f8422cc705f2f4812756f823245613a0bef2f474295614a8812710a90453a0a172708856130405552010246d50436d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb007270882f32333400280000000043616e63656c6c6174696f6e2066656500360000000047616d652063616e63656c6c6564202d20726566756e6402fa553010246d50436d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb007081008256172ec859821017287fd25003cb1fcbffcec9561755205a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf818ae2f400c901fb005035018e1115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df0e10bd10ac109b108a107910681057104610354403db3cdb31660286812b6d0fc0021ff2f426c2019325c2019170e2e30f1115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e551d375504fa325354ba9253ab9253bae2531a5617a8812710a9042c5617a8812710a90453d1a121a1255612c70591269127e2206eb374727088561a0409552010246d50436d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00923031e30d891119111b111938395253001e00000000536572766963652066656501d2206ef2d0801118111c11181117111b11171116111a11161115111911151114111c11141113111b11131112111a11121111111911111110111c1110103f0e111a0e0d11190d0c111c0c103b0a111a0a0911190908111c08103706111a060511190502111c0201111b013a03fc5617821005f5e100db3c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d07270561a561f561ec855208210098d25065004cb1f12cbff01fa02cec9103403111f0310246d50436d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf818ae23b5051012488c87001ca0055215023cece810101cf00c93c0228ff008e88f4a413f4bcf2c80bed5320e303ed43d93d480202713e400175bc5cbf6a268690000c70bfd207d207d007d007d006a00e87d00180b0a8a2198360b47097d207d20408080eb802a9001e8ac382a2810f16d9e3630c3f000225020148414602012042440175b192fb51343480006385fe903e903e803e803e803500743e800c05854510cc1b05a384be903e9020404075c0154800f4561c15140878b6cf1b1860430002230175b1b03b51343480006385fe903e903e803e803e803500743e800c05854510cc1b05a384be903e9020404075c0154800f4561c15140878b6cf1b1860450002220175b4ed9da89a1a400031c2ff481f481f401f401f401a803a1f400602c2a288660d82d1c25f481f481020203ae00aa4007a2b0e0a8a043c5b678d8c304700022103be30eda2edfb01d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e17fa40fa40fa00fa00fa00d401d0fa003016151443306c168e12fa40fa40810101d700552003d15870545021e207e30225d749c21f9136e30d04f901494a4c005a3525c200965005a0705055de10355512c87f01ca0055505056ce13ce01fa0201fa0201fa02c858fa02cdc9ed5401fc05d31f218210098d2506ba8e6831d3fffa00308142a621c200f2f45133a05123a0f82314c855208210b061f9595004cb1f12cbff01fa02cb1fc9c88258c000000000000000000000000101cb67ccc970fb0010354143c87f01ca0055505056ce13ce01fa0201fa0201fa02c858fa02cdc9ed54db31e0018210946a98b6ba4b00c08e5ad33f30c8018210aff90f5758cb1fcb3fc910461035443012f84270705003804201503304c8cf8580ca00cf8440ce01fa02806acf40f400c901fb00c87f01ca0055505056ce13ce01fa0201fa0201fa02c858fa02cdc9ed54db31e0361045015482f0158e394e7cc73a9aeb362957fe037665588aef16f3bd68580c13ab84097cf22abae3025f05f2c0824d02e8820084eef84224c705f2f4812d2f5345bef2f482009ebc24c200f2f4820afaf0808200f1e7f8276f1026a158bef2f42370727088275139413310246d50436d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00f82316c84e4f0026000000005265666572726572207265776172640094598210710941045003cb1f01fa02cb1fc9c88258c000000000000000000000000101cb67ccc970fb0010354430c87f01ca0055505056ce13ce01fa0201fa0201fa02c858fa02cdc9ed54001a58cf8680cf8480f400f400cf8100a8f400c901fb001116111a11161115111911151114111811141113111711131112111611121111111511111110111411100f11130f0e11120e0e11110e0c11100c10bf10ae109d108c107b106a10591048103750560010596f7520776f6e2102e01118111a11181117111b11171116111a11161115111b11151114111a11141113111b11131112111a11121111111b1111021110020f111b0f102e0d111b0d102c0b111b0b102a09111b09102807111b075e32102403111b0302111a02561b59db3c7081008256190201111c01111b2dc85e5400aa553082101fe7e6435005cb1f13cbffcece01fa02c956170302111a02111b015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0002f8295615a8812710a90453a0a1ab007472708856150406552010246d50436d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb008bd44726177202d20726566756e6481118111911181117111911171116111911161115111911151114111911145657002c0000000053657276696365206665652028647261772902fe111311191113111211191112111111191111111011191110102f220f0e0d0c0b0a0908070605040302111a0201561a01db3c8bd44726177202d20726566756e6481118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef2d0f5e5802fc10de10cd10bc10ab109a1089107810671056104510344300db3c708100825619c801821012f4048758cb1fcbffc9561955205a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00011117011116011115011114011113011112011111015e590008111055d104fe812e0cf8425616c705f2f4812b6d2dc001923d7f930dc002e21df2f45311923022df81084ef823028208278d00a012bef2f4748d086000000000000000000000000000000000000000000000000000000000000000000452b0c705b3e30f7081008288561955205a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025b5d646502fa298d04115b595c99d95b98de481c99599d5b99201117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f102f2d0f10de10cd10bc10ab109a1089107810671056040502111a0201561a01db3c8d04115b595c99d95b98de481c99599d5b99205e5c01b01118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef2d0f10de10cd10bc10ab109a1089107810671056104510344300db3c5e01c28d04115b595c99d95b98de481c99599d5b99201116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e541f0c51fb10df0e10bd10ac109b108a10791068105710465a14db3c5e02f01117111a11171116111911161115111811151114111a11141113111911131112111811121111111a11111110111911100f11180f0e111a0e0d11190d0c11180c0b111a0b0a11190a0911180908111a08071119070611180605111a05041119040311180302111a02011119011118561adb3c8200b676561a5f60005c8200cc708d086000000000000000000000000000000000000000000000000000000000000000000412c705b3f2f402fc8208989680bef2f47170111adb3c04111c0403111b031201111a0110246d50436d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb001114111711141113111611131112111511121111111411111110111311100f11120f0e11110e0d11100d10cf61630142c87001cb1f6f00016f8c6d6f8c01db3c6f2201c993216eb396016f2259ccc9e8316200b620d74a21d7499720c20022c200b18e48036f22807f22cf31ab02a105ab025155b60820c2009a20aa0215d71803ce4014de596f025341a1c20099c8016f025044a1aa028e123133c20099d430d020d74a21d749927020e2e2e85f030004552b004200000000456d657267656e6379207769746864726177616c20636f6d706c65746501405c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00db3c660132c87f01ca0011181117111611151114111311121111111055e06700e2011117011118cbff01111501ce01111301cb1f01111101cb1f1fcb1f500dfa02500bfa0209c8ce18ca0016cb0714ce12ce01fa02c858fa0212cbff12cbff13cb0113cb0113cb1f13cb1f13cec85004206e9430cf84809201cee25004206e9430cf84809201cee214ca00cd12cdcdc9ed542b12c89c');
  const builder = beginCell();
  builder.storeUint(0, 1);
  initGame_init_args({ $$type: 'Game_init_args', gameId, factory })(builder);
  const __data = builder.endCell();
  return { code: __code, data: __data };
}

export const Game_errors = {
  2: { message: "Stack underflow" },
  3: { message: "Stack overflow" },
  4: { message: "Integer overflow" },
  5: { message: "Integer out of expected range" },
  6: { message: "Invalid opcode" },
  7: { message: "Type check error" },
  8: { message: "Cell overflow" },
  9: { message: "Cell underflow" },
  10: { message: "Dictionary error" },
  11: { message: "'Unknown' error" },
  12: { message: "Fatal error" },
  13: { message: "Out of gas error" },
  14: { message: "Virtualization error" },
  32: { message: "Action list is invalid" },
  33: { message: "Action list is too long" },
  34: { message: "Action is invalid or not supported" },
  35: { message: "Invalid source address in outbound message" },
  36: { message: "Invalid destination address in outbound message" },
  37: { message: "Not enough Toncoin" },
  38: { message: "Not enough extra currencies" },
  39: { message: "Outbound message does not fit into a cell after rewriting" },
  40: { message: "Cannot process a message" },
  41: { message: "Library reference is null" },
  42: { message: "Library change action error" },
  43: { message: "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree" },
  50: { message: "Account state size exceeded limits" },
  128: { message: "Null reference exception" },
  129: { message: "Invalid serialization prefix" },
  130: { message: "Invalid incoming message" },
  131: { message: "Constraints error" },
  132: { message: "Access denied" },
  133: { message: "Contract stopped" },
  134: { message: "Invalid argument" },
  135: { message: "Code of a contract was not found" },
  136: { message: "Invalid standard address" },
  138: { message: "Not a basechain address" },
  2126: { message: "Too early for emergency" },
  2805: { message: "Insufficient value" },
  3041: { message: "Not stopped" },
  5043: { message: "Game is finishing" },
  5211: { message: "Invalid key or coin side" },
  7636: { message: "Wrong game status" },
  8230: { message: "Invalid highest bid" },
  10070: { message: "Too early to cancel" },
  11117: { message: "Wrong status" },
  11493: { message: "Invalid lowest bid" },
  11567: { message: "Below minimum withdrawal" },
  11788: { message: "Only factory" },
  12043: { message: "You cannot input zero address for this operation" },
  12339: { message: "Cannot refer yourself" },
  13330: { message: "Game not exists" },
  16083: { message: "Only factory can initialize" },
  16881: { message: "Cannot play with yourself" },
  17062: { message: "Invalid amount" },
  18666: { message: "Game already initialized" },
  19141: { message: "Bid too small" },
  20709: { message: "Batch too large" },
  22366: { message: "Insufficient value received" },
  26015: { message: "Wrong game ID" },
  30773: { message: "Cannot cancel" },
  34030: { message: "Only referrer can withdraw" },
  34972: { message: "Fee too high (max 20%)" },
  34996: { message: "Wrong value" },
  35941: { message: "Bid too high" },
  39159: { message: "Only creator can cancel" },
  39497: { message: "Already opened" },
  40636: { message: "Nothing to withdraw" },
  43094: { message: "Invalid fees" },
  44065: { message: "Invalid game sender" },
  45176: { message: "Too early to finish" },
  46710: { message: "Amount too small" },
  49083: { message: "Already stopped" },
  51662: { message: "Only factory can forward join" },
  52336: { message: "Zero address" },
  53296: { message: "Contract not stopped" },
  56615: { message: "Already finishing" },
  58890: { message: "Invalid timeout" },
  59178: { message: "Game not ready" },
  59839: { message: "Bid too low" },
  61927: { message: "Insufficient gas reserve" },
} as const

export const Game_errors_backward = {
  "Stack underflow": 2,
  "Stack overflow": 3,
  "Integer overflow": 4,
  "Integer out of expected range": 5,
  "Invalid opcode": 6,
  "Type check error": 7,
  "Cell overflow": 8,
  "Cell underflow": 9,
  "Dictionary error": 10,
  "'Unknown' error": 11,
  "Fatal error": 12,
  "Out of gas error": 13,
  "Virtualization error": 14,
  "Action list is invalid": 32,
  "Action list is too long": 33,
  "Action is invalid or not supported": 34,
  "Invalid source address in outbound message": 35,
  "Invalid destination address in outbound message": 36,
  "Not enough Toncoin": 37,
  "Not enough extra currencies": 38,
  "Outbound message does not fit into a cell after rewriting": 39,
  "Cannot process a message": 40,
  "Library reference is null": 41,
  "Library change action error": 42,
  "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree": 43,
  "Account state size exceeded limits": 50,
  "Null reference exception": 128,
  "Invalid serialization prefix": 129,
  "Invalid incoming message": 130,
  "Constraints error": 131,
  "Access denied": 132,
  "Contract stopped": 133,
  "Invalid argument": 134,
  "Code of a contract was not found": 135,
  "Invalid standard address": 136,
  "Not a basechain address": 138,
  "Too early for emergency": 2126,
  "Insufficient value": 2805,
  "Not stopped": 3041,
  "Game is finishing": 5043,
  "Invalid key or coin side": 5211,
  "Wrong game status": 7636,
  "Invalid highest bid": 8230,
  "Too early to cancel": 10070,
  "Wrong status": 11117,
  "Invalid lowest bid": 11493,
  "Below minimum withdrawal": 11567,
  "Only factory": 11788,
  "You cannot input zero address for this operation": 12043,
  "Cannot refer yourself": 12339,
  "Game not exists": 13330,
  "Only factory can initialize": 16083,
  "Cannot play with yourself": 16881,
  "Invalid amount": 17062,
  "Game already initialized": 18666,
  "Bid too small": 19141,
  "Batch too large": 20709,
  "Insufficient value received": 22366,
  "Wrong game ID": 26015,
  "Cannot cancel": 30773,
  "Only referrer can withdraw": 34030,
  "Fee too high (max 20%)": 34972,
  "Wrong value": 34996,
  "Bid too high": 35941,
  "Only creator can cancel": 39159,
  "Already opened": 39497,
  "Nothing to withdraw": 40636,
  "Invalid fees": 43094,
  "Invalid game sender": 44065,
  "Too early to finish": 45176,
  "Amount too small": 46710,
  "Already stopped": 49083,
  "Only factory can forward join": 51662,
  "Zero address": 52336,
  "Contract not stopped": 53296,
  "Already finishing": 56615,
  "Invalid timeout": 58890,
  "Game not ready": 59178,
  "Bid too low": 59839,
  "Insufficient gas reserve": 61927,
} as const

const Game_types: ABIType[] = [
  { "name": "DataSize", "header": null, "fields": [{ "name": "cells", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "bits", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "refs", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }] },
  { "name": "SignedBundle", "header": null, "fields": [{ "name": "signature", "type": { "kind": "simple", "type": "fixed-bytes", "optional": false, "format": 64 } }, { "name": "signedData", "type": { "kind": "simple", "type": "slice", "optional": false, "format": "remainder" } }] },
  { "name": "StateInit", "header": null, "fields": [{ "name": "code", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "data", "type": { "kind": "simple", "type": "cell", "optional": false } }] },
  { "name": "Context", "header": null, "fields": [{ "name": "bounceable", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "sender", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "raw", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
  { "name": "SendParameters", "header": null, "fields": [{ "name": "mode", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "body", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "code", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "data", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "to", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "bounce", "type": { "kind": "simple", "type": "bool", "optional": false } }] },
  { "name": "MessageParameters", "header": null, "fields": [{ "name": "mode", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "body", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "to", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "bounce", "type": { "kind": "simple", "type": "bool", "optional": false } }] },
  { "name": "DeployParameters", "header": null, "fields": [{ "name": "mode", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "body", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "bounce", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "init", "type": { "kind": "simple", "type": "StateInit", "optional": false } }] },
  { "name": "StdAddress", "header": null, "fields": [{ "name": "workchain", "type": { "kind": "simple", "type": "int", "optional": false, "format": 8 } }, { "name": "address", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
  { "name": "VarAddress", "header": null, "fields": [{ "name": "workchain", "type": { "kind": "simple", "type": "int", "optional": false, "format": 32 } }, { "name": "address", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
  { "name": "BasechainAddress", "header": null, "fields": [{ "name": "hash", "type": { "kind": "simple", "type": "int", "optional": true, "format": 257 } }] },
  { "name": "ChangeOwner", "header": 2174598809, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "newOwner", "type": { "kind": "simple", "type": "address", "optional": false } }] },
  { "name": "ChangeOwnerOk", "header": 846932810, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "newOwner", "type": { "kind": "simple", "type": "address", "optional": false } }] },
  { "name": "Deploy", "header": 2490013878, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
  { "name": "DeployOk", "header": 2952335191, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
  { "name": "FactoryDeploy", "header": 1829761339, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "cashback", "type": { "kind": "simple", "type": "address", "optional": false } }] },
  { "name": "CreateEmptyGameMsg", "header": 253439376, "fields": [{ "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
  { "name": "SetServiceFeeMsg", "header": 3441994003, "fields": [{ "name": "newValue", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }] },
  { "name": "SetReferrerFeeMsg", "header": 1971523271, "fields": [{ "name": "newValue", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }] },
  { "name": "SetFeeReceiverMsg", "header": 3887204533, "fields": [{ "name": "newReceiver", "type": { "kind": "simple", "type": "address", "optional": false } }] },
  { "name": "SetLowestBidMsg", "header": 3710779798, "fields": [{ "name": "newValue", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
  { "name": "SetHighestBidMsg", "header": 335501441, "fields": [{ "name": "newValue", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
  { "name": "SetWaitingForOpenBidSecondsMsg", "header": 2871718913, "fields": [{ "name": "newValue", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
  { "name": "SetMinReferrerPayoutValueMsg", "header": 429174101, "fields": [{ "name": "newValue", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
  { "name": "GameCreatedResponse", "header": 3945039031, "fields": [{ "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "gameAddress", "type": { "kind": "simple", "type": "address", "optional": false } }] },
  { "name": "CreateGameAndOpenBidsMsg", "header": 3220317951, "fields": [{ "name": "bidValue", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "secret", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "referrer", "type": { "kind": "simple", "type": "address", "optional": true } }, { "name": "gameIdsToOpen", "type": { "kind": "dict", "key": "uint", "keyFormat": 16, "value": "uint", "valueFormat": 256 } }, { "name": "keysToOpen", "type": { "kind": "dict", "key": "uint", "keyFormat": 16, "value": "uint", "valueFormat": 256 } }, { "name": "count", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 16 } }] },
  { "name": "JoinGameAndOpenBidsMsg", "header": 3735868027, "fields": [{ "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "bidValue", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "secret", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "referrer", "type": { "kind": "simple", "type": "address", "optional": true } }, { "name": "gameIdsToOpen", "type": { "kind": "dict", "key": "uint", "keyFormat": 16, "value": "uint", "valueFormat": 256 } }, { "name": "keysToOpen", "type": { "kind": "dict", "key": "uint", "keyFormat": 16, "value": "uint", "valueFormat": 256 } }, { "name": "count", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 16 } }] },
  { "name": "OpenMultipleGamesMsg", "header": 3766232339, "fields": [{ "name": "gameIdsToOpen", "type": { "kind": "dict", "key": "uint", "keyFormat": 16, "value": "uint", "valueFormat": 256 } }, { "name": "keysToOpen", "type": { "kind": "dict", "key": "uint", "keyFormat": 16, "value": "uint", "valueFormat": 256 } }, { "name": "count", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 16 } }] },
  { "name": "CreateGameMsg", "header": 260122099, "fields": [{ "name": "bidValue", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "secret", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "referrer", "type": { "kind": "simple", "type": "address", "optional": true } }] },
  { "name": "ForwardOpenBidMsg", "header": 3537668725, "fields": [{ "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "key", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
  { "name": "ForwardJoinGameMsg", "header": 3893815928, "fields": [{ "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "bidValue", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "secret", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "referrer", "type": { "kind": "simple", "type": "address", "optional": true } }] },
  { "name": "GameDeployedEvent", "header": 185727368, "fields": [{ "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "gameAddress", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "creator", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "timestamp", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }] },
  { "name": "GameInitializedEvent", "header": 2904670482, "fields": [{ "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "playerOne", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "bidValue", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "timestamp", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }] },
  { "name": "GameStartedEvent", "header": 3493528925, "fields": [{ "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "playerOne", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "playerTwo", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "totalGainings", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "timestamp", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }] },
  { "name": "GameFinishedEvent", "header": 2774366883, "fields": [{ "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "winner", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "looser", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "totalGainings", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "timestamp", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }] },
  { "name": "GameCancelledEvent", "header": 616834666, "fields": [{ "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "playerOne", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "timestamp", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }] },
  { "name": "DrawEvent", "header": 2466780489, "fields": [{ "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "timestamp", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }] },
  { "name": "ServiceFeeChangedEvent", "header": 3770411203, "fields": [{ "name": "newValue", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "timestamp", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }] },
  { "name": "ReferrerFeeChangedEvent", "header": 2889764698, "fields": [{ "name": "newValue", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "timestamp", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }] },
  { "name": "FeeReceiverChangedEvent", "header": 3831903941, "fields": [{ "name": "newReceiver", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "timestamp", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }] },
  { "name": "LowestBidChangedEvent", "header": 84132035, "fields": [{ "name": "newValue", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "timestamp", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }] },
  { "name": "HighestBidChangedEvent", "header": 1285959087, "fields": [{ "name": "newValue", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "timestamp", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }] },
  { "name": "WaitingForOpenBidSecondsChangedEvent", "header": 1273858625, "fields": [{ "name": "newValue", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "timestamp", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }] },
  { "name": "MinReferrerPayoutValueChangedEvent", "header": 3481155971, "fields": [{ "name": "newValue", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "timestamp", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }] },
  { "name": "SystemStoppedEvent", "header": 2994542628, "fields": [{ "name": "timestamp", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }] },
  { "name": "SystemResumeEvent", "header": 1976079967, "fields": [{ "name": "timestamp", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }] },
  { "name": "BouncedMessageEvent", "header": 2167600854, "fields": [{ "name": "op", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "timestamp", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }] },
  { "name": "InitGameMsg", "header": 2971395423, "fields": [{ "name": "playerOne", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "bidValue", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "secret", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "referrer", "type": { "kind": "simple", "type": "address", "optional": true } }, { "name": "serviceFeeNumerator", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "referrerFeeNumerator", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "waitingForOpenBidSeconds", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "lowestBid", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "highestBid", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "feeReceiver", "type": { "kind": "simple", "type": "address", "optional": false } }] },
  { "name": "JoinGameMsg", "header": 924533763, "fields": [{ "name": "playerTwo", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "secret", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "referrer", "type": { "kind": "simple", "type": "address", "optional": true } }] },
  { "name": "OpenBidMsg", "header": 704611509, "fields": [{ "name": "key", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
  { "name": "OpenMultipleBidsMsg", "header": 4091047635, "fields": [{ "name": "gameIds", "type": { "kind": "dict", "key": "uint", "keyFormat": 16, "value": "uint", "valueFormat": 256 } }, { "name": "keys", "type": { "kind": "dict", "key": "uint", "keyFormat": 16, "value": "uint", "valueFormat": 256 } }, { "name": "count", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 16 } }] },
  { "name": "CancelGameMsg", "header": 2404003461, "fields": [{ "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
  { "name": "FinishGameMsg", "header": 2152428653, "fields": [{ "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
  { "name": "GameInitializedNotify", "header": 3945341079, "fields": [{ "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "playerOne", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "bidValue", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }] },
  { "name": "GameStartedNotify", "header": 102653531, "fields": [{ "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "playerOne", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "playerTwo", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "totalGainings", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }] },
  { "name": "GameFinishedNotify", "header": 535291459, "fields": [{ "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "winner", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "looser", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "totalGainings", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }] },
  { "name": "GameCancelledNotify", "header": 388530130, "fields": [{ "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "playerOne", "type": { "kind": "simple", "type": "address", "optional": false } }] },
  { "name": "SecretOpenedNotify", "header": 1202198728, "fields": [{ "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "player", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "coinSide", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 8 } }] },
  { "name": "DrawNotify", "header": 317981831, "fields": [{ "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
  { "name": "InsufficientBalanceNotify", "header": 4148213171, "fields": [{ "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "required", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "actual", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }] },
  { "name": "DetailedStats", "header": null, "fields": [{ "name": "totalGamesCreated", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "totalGamesInitialized", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "totalGamesFinished", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "totalGamesCancelled", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "totalGamesDrawn", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
  { "name": "FactoryConfig", "header": null, "fields": [{ "name": "serviceFeeNumerator", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "referrerFeeNumerator", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "waitingForOpenBidSeconds", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "feeReceiver", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "stopped", "type": { "kind": "simple", "type": "bool", "optional": false } }] },
  { "name": "GameAddressBatch", "header": null, "fields": [{ "name": "startId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "addresses", "type": { "kind": "dict", "key": "uint", "keyFormat": 32, "value": "address" } }] },
  { "name": "GameInfo", "header": null, "fields": [{ "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "status", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 8 } }, { "name": "playerOne", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "playerTwo", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "bidValue", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "totalGainings", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "playerOneChosenSide", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 2 } }, { "name": "playerTwoChosenSide", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 2 } }, { "name": "gameCreatedTimestamp", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "gameStartedTimestamp", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "winner", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "configReceived", "type": { "kind": "simple", "type": "bool", "optional": false } }] },
  { "name": "PlayerInfo", "header": null, "fields": [{ "name": "playerOne", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "playerTwo", "type": { "kind": "simple", "type": "address", "optional": false } }] },
  { "name": "GameConfig", "header": null, "fields": [{ "name": "serviceFeeNumerator", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "referrerFeeNumerator", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "waitingForOpenBidSeconds", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "feeReceiver", "type": { "kind": "simple", "type": "address", "optional": false } }] },
  { "name": "Game$Data", "header": null, "fields": [{ "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "factory", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "serviceFeeNumerator", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "referrerFeeNumerator", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "waitingForOpenBidSeconds", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "lowestBid", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "highestBid", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "feeReceiver", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "configReceived", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "status", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 8 } }, { "name": "playerOne", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "playerTwo", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "bidValue", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "totalGainings", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "playerOneEncryptedBet", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "playerTwoEncryptedBet", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "playerOneChosenSide", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 2 } }, { "name": "playerTwoChosenSide", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 2 } }, { "name": "gameCreatedTimestamp", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "gameStartedTimestamp", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "winner", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "playerOneReferrer", "type": { "kind": "simple", "type": "address", "optional": true } }, { "name": "playerTwoReferrer", "type": { "kind": "simple", "type": "address", "optional": true } }, { "name": "finishing", "type": { "kind": "simple", "type": "bool", "optional": false } }] },
  { "name": "AddReferrerReward", "header": 160244998, "fields": [{ "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "winner", "type": { "kind": "simple", "type": "address", "optional": false } }] },
  { "name": "ReferrerRewardAdded", "header": 2959210841, "fields": [{ "name": "gameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "timestamp", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }] },
  { "name": "ReferrerWithdrawn", "header": 1896431876, "fields": [{ "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "timestamp", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }] },
  { "name": "ReferrerWallet$Data", "header": null, "fields": [{ "name": "referrer", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "factory", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "totalEarned", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "availableToWithdraw", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "minWithdrawAmount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "lastWithdrawalAmount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }] },
  { "name": "FlipCoinGameFactory$Data", "header": null, "fields": [{ "name": "stopped", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "owner", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "serviceFeeNumerator", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "referrerFeeNumerator", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "lowestBid", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "highestBid", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "waitingForOpenBidSeconds", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "minReferrerPayoutValue", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "feeReceiver", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "totalGamesCreated", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "totalGamesInitialized", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "totalGamesFinished", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "totalGamesCancelled", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "totalGamesDrawn", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "lastCreatedGameId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
]

const Game_opcodes = {
  "ChangeOwner": 2174598809,
  "ChangeOwnerOk": 846932810,
  "Deploy": 2490013878,
  "DeployOk": 2952335191,
  "FactoryDeploy": 1829761339,
  "CreateEmptyGameMsg": 253439376,
  "SetServiceFeeMsg": 3441994003,
  "SetReferrerFeeMsg": 1971523271,
  "SetFeeReceiverMsg": 3887204533,
  "SetLowestBidMsg": 3710779798,
  "SetHighestBidMsg": 335501441,
  "SetWaitingForOpenBidSecondsMsg": 2871718913,
  "SetMinReferrerPayoutValueMsg": 429174101,
  "GameCreatedResponse": 3945039031,
  "CreateGameAndOpenBidsMsg": 3220317951,
  "JoinGameAndOpenBidsMsg": 3735868027,
  "OpenMultipleGamesMsg": 3766232339,
  "CreateGameMsg": 260122099,
  "ForwardOpenBidMsg": 3537668725,
  "ForwardJoinGameMsg": 3893815928,
  "GameDeployedEvent": 185727368,
  "GameInitializedEvent": 2904670482,
  "GameStartedEvent": 3493528925,
  "GameFinishedEvent": 2774366883,
  "GameCancelledEvent": 616834666,
  "DrawEvent": 2466780489,
  "ServiceFeeChangedEvent": 3770411203,
  "ReferrerFeeChangedEvent": 2889764698,
  "FeeReceiverChangedEvent": 3831903941,
  "LowestBidChangedEvent": 84132035,
  "HighestBidChangedEvent": 1285959087,
  "WaitingForOpenBidSecondsChangedEvent": 1273858625,
  "MinReferrerPayoutValueChangedEvent": 3481155971,
  "SystemStoppedEvent": 2994542628,
  "SystemResumeEvent": 1976079967,
  "BouncedMessageEvent": 2167600854,
  "InitGameMsg": 2971395423,
  "JoinGameMsg": 924533763,
  "OpenBidMsg": 704611509,
  "OpenMultipleBidsMsg": 4091047635,
  "CancelGameMsg": 2404003461,
  "FinishGameMsg": 2152428653,
  "GameInitializedNotify": 3945341079,
  "GameStartedNotify": 102653531,
  "GameFinishedNotify": 535291459,
  "GameCancelledNotify": 388530130,
  "SecretOpenedNotify": 1202198728,
  "DrawNotify": 317981831,
  "InsufficientBalanceNotify": 4148213171,
  "AddReferrerReward": 160244998,
  "ReferrerRewardAdded": 2959210841,
  "ReferrerWithdrawn": 1896431876,
}

const Game_getters: ABIGetter[] = [
  { "name": "calculateHash", "methodId": 76355, "arguments": [{ "name": "coinSide", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "key", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "player", "type": { "kind": "simple", "type": "address", "optional": false } }], "returnType": { "kind": "simple", "type": "int", "optional": false, "format": 257 } },
  { "name": "gameInfo", "methodId": 84815, "arguments": [], "returnType": { "kind": "simple", "type": "GameInfo", "optional": false } },
  { "name": "status", "methodId": 101642, "arguments": [], "returnType": { "kind": "simple", "type": "int", "optional": false, "format": 257 } },
  { "name": "players", "methodId": 98881, "arguments": [], "returnType": { "kind": "simple", "type": "PlayerInfo", "optional": false } },
  { "name": "config", "methodId": 103021, "arguments": [], "returnType": { "kind": "simple", "type": "GameConfig", "optional": false } },
]

export const Game_getterMapping: { [key: string]: string } = {
  'calculateHash': 'getCalculateHash',
  'gameInfo': 'getGameInfo',
  'status': 'getStatus',
  'players': 'getPlayers',
  'config': 'getConfig',
}

const Game_receivers: ABIReceiver[] = [
  { "receiver": "internal", "message": { "kind": "typed", "type": "InitGameMsg" } },
  { "receiver": "internal", "message": { "kind": "typed", "type": "JoinGameMsg" } },
  { "receiver": "internal", "message": { "kind": "typed", "type": "OpenBidMsg" } },
  { "receiver": "internal", "message": { "kind": "typed", "type": "CancelGameMsg" } },
  { "receiver": "internal", "message": { "kind": "typed", "type": "FinishGameMsg" } },
  { "receiver": "internal", "message": { "kind": "text", "text": "emergencyWithdraw" } },
]

export const ZERO_ADDRESS = "You cannot input zero address for this operation";
export const WRONG_BET = "Wrong bet value";
export const WRONG_GAME_STATUS = "Wrong game status";
export const WRONG_COINSIDE_VALUE = "Wrong CoinSide value";
export const ANOTHER_REFERER = "You already have another referer";
export const MIN_PAYOUT_VALUE = "You don't achieve min payout value";
export const ARRAYS_SAME_LENGTH = "Arrays should have the same length";
export const NOT_YOUR_GAME = "You don't take part in game with provided id";
export const TRANSFER_FAILED = "Transfer failed";
export const LOWEST_BID_VALUE = "Bid should be more than the lowestBid";
export const HIGHEST_BID_VALUE = "Bid should be less than the highestBid";
export const WRONG_VALUE = "Wrong value";
export const GAME_STARTED = "Game already has been started";
export const ALREADY_YOUR_GAME = "You already take part in this game";
export const WAIT_MORE = "Need to wait more";
export const WRONG_PARAMS = "WRONG_PARAMS";
export const WRONG_GAME_ID = "Wrong game id";
export const COIN_SIDE_NONE = 0n;
export const COIN_SIDE_CLOSED = 1n;
export const COIN_SIDE_HEADS = 2n;
export const COIN_SIDE_TAILS = 3n;
export const GAME_STATUS_UNINITIALIZED = 0n;
export const GAME_STATUS_WAITING_FOR_OPPONENT = 1n;
export const GAME_STATUS_WAITING_FOR_OPEN_BIDS = 2n;
export const GAME_STATUS_ENDED = 3n;
export const GAME_STATUS_PAID = 4n;
export const DENOMINATOR = 10000n;
export const MIN_CONTRACT_BALANCE = 50000000n;
export const MIN_TRANSFER_AMOUNT = 10000000n;
export const MIN_MESSAGE_VALUE = 10000000n;
export const GAS_NOTIFICATION = 10000000n;
export const GAS_INIT_BUFFER = 20000000n;
export const GAS_JOIN_BUFFER = 50000000n;
export const EMERGENCY_TIMEOUT = 2592000n;
export const FACTORY_RESERVE = 50000000n;
export const MIN_DEPLOY_VALUE = 150000000n;
export const MAX_BATCH_SIZE = 10n;

export class Game implements Contract {

  public static readonly storageReserve = 0n;
  public static readonly errors = Game_errors_backward;
  public static readonly opcodes = Game_opcodes;

  static async init(gameId: bigint, factory: Address) {
    return await Game_init(gameId, factory);
  }

  static async fromInit(gameId: bigint, factory: Address) {
    const __gen_init = await Game_init(gameId, factory);
    const address = contractAddress(0, __gen_init);
    return new Game(address, __gen_init);
  }

  static fromAddress(address: Address) {
    return new Game(address);
  }

  readonly address: Address;
  readonly init?: { code: Cell, data: Cell };
  readonly abi: ContractABI = {
    types: Game_types,
    getters: Game_getters,
    receivers: Game_receivers,
    errors: Game_errors,
  };

  constructor(address: Address, init?: { code: Cell, data: Cell }) {
    this.address = address;
    this.init = init;
  }

  async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean | null | undefined }, message: InitGameMsg | JoinGameMsg | OpenBidMsg | CancelGameMsg | FinishGameMsg | "emergencyWithdraw") {

    let body: Cell | null = null;
    if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'InitGameMsg') {
      body = beginCell().store(storeInitGameMsg(message)).endCell();
    }
    if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'JoinGameMsg') {
      body = beginCell().store(storeJoinGameMsg(message)).endCell();
    }
    if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'OpenBidMsg') {
      body = beginCell().store(storeOpenBidMsg(message)).endCell();
    }
    if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'CancelGameMsg') {
      body = beginCell().store(storeCancelGameMsg(message)).endCell();
    }
    if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'FinishGameMsg') {
      body = beginCell().store(storeFinishGameMsg(message)).endCell();
    }
    if (message === "emergencyWithdraw") {
      body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
    }
    if (body === null) { throw new Error('Invalid message type'); }

    await provider.internal(via, { ...args, body: body });

  }

  async getCalculateHash(provider: ContractProvider, coinSide: bigint, key: bigint, player: Address) {
    const builder = new TupleBuilder();
    builder.writeNumber(coinSide);
    builder.writeNumber(key);
    builder.writeAddress(player);
    const source = (await provider.get('calculateHash', builder.build())).stack;
    const result = source.readBigNumber();
    return result;
  }

  async getGameInfo(provider: ContractProvider) {
    const builder = new TupleBuilder();
    const source = (await provider.get('gameInfo', builder.build())).stack;
    const result = loadGetterTupleGameInfo(source);
    return result;
  }

  async getStatus(provider: ContractProvider) {
    const builder = new TupleBuilder();
    const source = (await provider.get('status', builder.build())).stack;
    const result = source.readBigNumber();
    return result;
  }

  async getPlayers(provider: ContractProvider) {
    const builder = new TupleBuilder();
    const source = (await provider.get('players', builder.build())).stack;
    const result = loadGetterTuplePlayerInfo(source);
    return result;
  }

  async getConfig(provider: ContractProvider) {
    const builder = new TupleBuilder();
    const source = (await provider.get('config', builder.build())).stack;
    const result = loadGetterTupleGameConfig(source);
    return result;
  }

}
