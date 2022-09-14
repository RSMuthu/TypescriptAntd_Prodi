export type Filter = {
  info: {
    filter_agent_list: string[];
    filter_time_range: number[];
  };
};

export type LabelOp = {
  name: string;
  op: string;
};

export type Labeling = {
  operation: {
    callList: number[];
    label_ops: LabelOp[];
  };
};
