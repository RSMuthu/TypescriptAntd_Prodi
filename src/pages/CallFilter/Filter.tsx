import { useEffect, useState, useRef } from 'react';

import {
  FilterOutlined,
  QuestionCircleFilled,
  CheckOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  getListOfAgents,
  getDurationRange,
  getFilteredCalls,
} from '@services/filterCalls';
import {
  Spin,
  Collapse,
  Button,
  Table,
  Select,
  Row,
  Col,
  Slider,
  Tooltip,
  Modal,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface TableDataType {
  agent_id: string;
  call_id: number;
  call_time: number;
}

function Filter() {
  const mount = useRef<boolean>(false);
  const [agentSelection, setAgentSelection] = useState<string[]>([]);
  const [timerange, setTimerange] = useState<[number, number]>([0, 0]);
  const [err, setErr] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [filterPanel, showFilterPanel] = useState<boolean>(true);
  const [agentsList, setAgentsList] = useState<string[]>([]);
  const [timeboundary, setTimeboundary] = useState<[number, number]>([0, 0]);
  const [tdata, setTdata] = useState<TableDataType[]>([]);

  const columns: ColumnsType<TableDataType> = [
    {
      title: 'Agent',
      dataIndex: 'agent_id',
      key: 'agent_id',
      sorter: (a, b) =>
        a.agent_id > b.agent_id ? 1 : a.agent_id < b.agent_id ? -1 : 0, // eslint-disable-line no-nested-ternary
    },
    {
      title: 'Caller ID',
      dataIndex: 'call_id',
      key: 'call_id',
      sorter: (a, b) => a.call_id - b.call_id,
    },
    {
      title: 'Call Duration',
      dataIndex: 'call_time',
      key: 'call_time',
      sorter: (a, b) => a.call_time - b.call_time,
    },
  ];

  function serviceHandler(hookSetter: Function, info: any) {
    if (mount.current) {
      if (info.success) {
        hookSetter(info.data);
      } else {
        setErr(info);
      }
      setLoading(false);
    }
  }

  function filtercall() {
    setLoading(true);
    getFilteredCalls(agentSelection, timerange, (res: any) => {
      serviceHandler(setTdata, res);
    });
  }

  useEffect(() => {
    // this wil be a onetime call
    // as we wont alter the dataset & time boundary
    if (agentsList.length && timeboundary.length) {
      setLoading(true);
      getFilteredCalls(agentsList, timeboundary, (res: any) => {
        serviceHandler(setTdata, res);
      });
    }
  }, [agentsList, timeboundary]);

  useEffect(() => {
    mount.current = true;
    getListOfAgents((res: any) => {
      serviceHandler(
        setAgentsList,
        res.success
          ? { success: res.success, data: res.data.listofagents }
          : res,
      );
    });
    getDurationRange((res: any) => {
      serviceHandler(
        setTimeboundary,
        res.success
          ? { success: res.success, data: [res.data.minimum, res.data.maximum] }
          : res,
      );
    });

    return () => {
      mount.current = false;
    };
  }, []);

  if (err)
    return (
      <Modal
        centered
        open
        footer={null}
        title="Error has occured !!"
        closable={false}
      >
        <p>Check your internet connectivity.</p>
        <p>If the issue prevails, please contact the admin</p>
      </Modal>
    );

  return (
    <Spin
      size="large"
      tip="Loading..."
      spinning={loading || !(agentsList.length && timeboundary.length)}
    >
      <div style={{ padding: '10px 50px' }}>
        <Row>
          <Col span={12}>
            <Collapse ghost>
              {/* Make this filter section into a sidenav if the filter list is huge */}
              <Collapse.Panel
                showArrow={false}
                header={
                  <Button
                    icon={<FilterOutlined />}
                    onClick={() => {
                      showFilterPanel((prev: boolean) => !prev);
                    }}
                  >
                    {filterPanel ? 'Show' : 'Hide'} Filter
                  </Button>
                }
                key="1"
              >
                <Row>
                  <Col span={12}>
                    <span>
                      Agent Name
                      <Tooltip title="Search & select the Agent names">
                        <QuestionCircleFilled />
                      </Tooltip>
                    </span>
                  </Col>
                  <Col span={12}>
                    <Select
                      allowClear
                      autoClearSearchValue={false}
                      style={{ width: '87%' }}
                      mode="multiple"
                      placeholder="Select Agent Names"
                      maxTagCount="responsive"
                      onChange={setAgentSelection}
                    >
                      {agentsList.map((key: string, index: number) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <Select.Option key={`agent${index}`} value={key}>
                          {key}
                        </Select.Option>
                      ))}
                    </Select>
                    <Button icon={<SearchOutlined />} />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <span>
                      Call Duration Range
                      <Tooltip title="Pick the Call duration range">
                        <QuestionCircleFilled />
                      </Tooltip>
                    </span>
                  </Col>
                  <Col span={12}>
                    <Slider
                      range
                      defaultValue={timerange}
                      min={Math.floor(timeboundary[0])}
                      max={Math.ceil(timeboundary[1])}
                      onChange={setTimerange}
                    />
                  </Col>
                </Row>
                <Row>
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={filtercall}
                  >
                    Apply Filter
                  </Button>
                </Row>
              </Collapse.Panel>
            </Collapse>
          </Col>
        </Row>
        <Table
          columns={columns}
          rowKey="call_id"
          pagination={{
            position: ['bottomRight'],
            showQuickJumper: true,
            defaultPageSize: 5,
            hideOnSinglePage: true,
          }}
          dataSource={tdata}
        />
      </div>
    </Spin>
  );
}

export default Filter;
