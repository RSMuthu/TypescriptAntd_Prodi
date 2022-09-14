import { LabelOp } from './serviceTyping';
import { getCaller, postCaller } from './utils';

export function getListofLabels(cb: Function) {
  return getCaller('getlistoflabels', cb, true);
}

export function getCallList(cb: Function) {
  return getCaller('getcalllist', cb, true);
}

export function applyLabels(
  callList: number[],
  labelOpList: LabelOp[],
  cb: Function,
) {
  return postCaller(
    'applyLabels', // endpoint
    {
      // payload
      operation: {
        callList,
        label_ops: labelOpList,
      },
    },
    cb,
    true,
  );
}
