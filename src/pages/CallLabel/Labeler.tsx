import { useEffect, useState, useRef, Key } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Spin, Button, Table, Tag, Row, Modal, Input } from 'antd';
import { getCallList, applyLabels } from '@services/callLabeling';
import type { ColumnsType } from 'antd/es/table';
import FormModal from './BulkUpdateModal';

import '@static/css/label.css';

interface TableDataType {
  call_id: number;
  label_id: string[];
}

function Labeler() {
  const mount = useRef<boolean>(false);
  const [err, setErr] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [inpBox, showInpBox] = useState<boolean[]>([]);
  const [multiUpdate, showMultiUpdate] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<Key[]>([]);
  const [tdata, setTdata] = useState<TableDataType[]>([]);

  function serviceHandler(info: any, hookSetter?: Function) {
    if (mount.current) {
      if (info.success) {
        hookSetter?.(info.data);
      } else {
        setErr(info);
      }
      setLoading(false);
    }
  }

  function showHideUpdateModal() {
    showMultiUpdate((prev) => !prev);
  }

  function alterShowInput(id: number) {
    showInpBox((prev) => {
      const temp: boolean[] = [...prev];
      temp[id] = !temp[id];
      return temp;
    });
  }

  function refreshTData(res: any) {
    if (res.success) {
      getCallList((resp: any) => {
        if (mount.current) {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          resp.success ? setTdata(resp.data.call_data) : setErr(resp);
          setLoading(false);
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    } else mount.current ? setErr(res) : undefined;
  }

  function newSingleLabel(callId: number, label: string) {
    if (
      label !== '' &&
      tdata[callId].label_id.findIndex(
        (item: string) => item.toLowerCase() === label.toLowerCase(),
      ) === -1
    ) {
      setLoading(true);
      applyLabels([callId], [{ name: label, op: 'add' }], refreshTData);
    }
    // revert input box to Tag
    alterShowInput(callId);
  }

  function removeSingleLabel(callId: number, label: string) {
    setLoading(true);
    applyLabels([callId], [{ name: label, op: 'remove' }], refreshTData);
  }

  function bulkUpdate(inp: { addLabel?: string[]; removeLabel?: string[] }) {
    const addOp = inp.addLabel?.map((label: string) => ({
      name: label,
      op: 'add',
    }));
    const removeOp = inp.removeLabel?.map((label: string) => ({
      name: label,
      op: 'remove',
    }));
    setLoading(true);
    applyLabels(
      selectedRows as number[],
      [...(addOp || []), ...(removeOp || [])],
      refreshTData,
    );
    showHideUpdateModal();
  }

  useEffect(() => {
    mount.current = true;
    getCallList((res: any) => {
      serviceHandler(
        res.success ? { success: res.success, data: res.data.call_data } : res,
        setTdata,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      res.success
        ? showInpBox(new Array(res.data.call_data.length).fill(false))
        : undefined;
    });
    return () => {
      mount.current = false;
    };
  }, []);

  const columns: ColumnsType<TableDataType> = [
    {
      title: 'Caller ID',
      dataIndex: 'call_id',
      key: 'call_id',
      sorter: (a, b) => a.call_id - b.call_id,
    },
    {
      title: 'Labels',
      dataIndex: 'label_id',
      key: 'label_id',
      render: (labels: string[], _: TableDataType, index: number) => (
        <>
          {labels.map((label: string) => (
            <Tag
              closable
              color="blue"
              key={label}
              onClose={() => removeSingleLabel(index, label)}
            >
              {label.toUpperCase()}
            </Tag>
          ))}
          {inpBox[index] ? (
            <Input
              autoFocus
              type="text"
              size="small"
              style={{ width: 100 }}
              placeholder="New Label"
              onPressEnter={(event) =>
                newSingleLabel(index, event.currentTarget.value)
              }
              onBlur={(event) => newSingleLabel(index, event.target.value)}
            />
          ) : (
            <Tag onClick={() => alterShowInput(index)} className="tag-plus">
              <PlusOutlined /> New Label
            </Tag>
          )}
        </>
      ),
    },
  ];

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
    <Spin size="large" tip="Loading..." spinning={loading}>
      <div style={{ padding: '10px 50px' }}>
        <Row style={{ padding: '10px 0' }}>
          <Button
            size="small"
            onClick={showHideUpdateModal}
            type="primary"
            disabled={!selectedRows.length}
            loading={loading}
          >
            Add/Remove Labels
          </Button>
          {selectedRows.length ? (
            <span style={{ marginLeft: 10 }}>
              Selected {selectedRows.length} rows
            </span>
          ) : (
            ''
          )}
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
          rowSelection={{
            selectedRowKeys: selectedRows,
            onChange: setSelectedRows,
            selections: [
              Table.SELECTION_ALL,
              Table.SELECTION_INVERT,
              Table.SELECTION_NONE,
            ],
          }}
        />
      </div>
      {multiUpdate ? (
        <FormModal
          callIdString={selectedRows.join(',')}
          onClose={showHideUpdateModal}
          onOk={bulkUpdate}
        />
      ) : undefined}
    </Spin>
  );
}

export default Labeler;
