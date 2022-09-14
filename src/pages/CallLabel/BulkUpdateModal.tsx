import { useEffect, useState, useRef } from 'react';

import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { getListofLabels } from '@services/callLabeling';
import { Select, Modal, Input, Form } from 'antd';

type FormResponse = {
  // either add or remove can be undef (but not both)
  addLabel?: string[];
  removeLabel?: string[];
};

type ModalProps = {
  onClose: () => void;
  onOk: (inp: FormResponse) => void;
  callIdString: string;
};

export default function UpdateModal({
  onClose,
  onOk,
  callIdString,
}: ModalProps) {
  const mount = useRef<boolean>(false);
  const [labelsList, setLabelsList] = useState<string[]>([]);
  const [err, setErr] = useState<any>();

  const [form] = Form.useForm();

  useEffect(() => {
    mount.current = true;
    getListofLabels((res: any) => {
      if (mount.current) {
        if (res.success) setLabelsList(res.data.unique_label_list);
        else setErr(res);
      }
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
    <Modal
      centered
      closable
      keyboard
      okText="Submit"
      okButtonProps={{ icon: <CheckOutlined /> }}
      cancelButtonProps={{ icon: <CloseOutlined /> }}
      open
      title="Add/Remove Labels"
      onCancel={onClose}
      onOk={() => form.validateFields().then(onOk)}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ modifier: 'public' }}
      >
        <Form.Item label="Selected Call IDs">
          <Input.TextArea
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled
            value={callIdString}
          />
        </Form.Item>
        <Form.Item label="Select or Add comma seperated Labels" name="addLabel">
          <Select
            allowClear
            autoClearSearchValue={false}
            mode="tags"
            tokenSeparators={[',']}
            placeholder="Enter Labels to ADD"
            maxTagCount="responsive"
          >
            {labelsList.map((label: string, index: number) => (
              // eslint-disable-next-line react/no-array-index-key
              <Select.Option key={`addlabel${index}`} value={label}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Remove Labels" name="removeLabel">
          <Select
            allowClear
            autoClearSearchValue={false}
            mode="tags"
            placeholder="Select Labels to Remove"
            maxTagCount="responsive"
          >
            {labelsList.map((label: string, index: number) => (
              // eslint-disable-next-line react/no-array-index-key
              <Select.Option key={`removelabel${index}`} value={label}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
