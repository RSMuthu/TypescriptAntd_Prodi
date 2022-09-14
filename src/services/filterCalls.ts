import { getCaller, postCaller } from '@services/utils';

export function getListOfAgents(cb: Function) {
  return getCaller('getlistofagents', cb);
}

export function getDurationRange(cb: Function) {
  return getCaller('getdurationrange', cb);
}

export function getFilteredCalls(
  agentList: string[],
  timeRange: number[],
  cb: Function,
) {
  return postCaller(
    'getfilteredcalls', // endpoint
    {
      // payload
      info: {
        filter_agent_list: agentList,
        filter_time_range: timeRange,
      },
    },
    cb,
  );
}
