import { Button, Checkbox, Form, Input, Select } from "antd";
import React, { useEffect } from "react";
import styled from "styled-components";
import { BOOKING_MODES, BOOKING_MODES_LIST } from "../../Data";
const { Option } = Select;

function BookingForm({ onSubmit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      mode: BOOKING_MODES.OFFLINE,
    });
  }, []);

  return (
    <Style>
      <Form
        form={form}
        name="basic"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 14,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[
            {
              required: true,
              message: "Enter valid firstname!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[
            {
              required: true,
              message: "Enter valid lastname!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              type: "email",
              required: true,
              message: "Enter valid email!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mobile"
          name="mobile"
          rules={[
            {
              validator: (rule, value) => {
                const regex = new RegExp(
                  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
                );
                if (regex.test(value)) return Promise.resolve();
                return Promise.reject();
              },

              required: true,
              message: "Enter valid mobile!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount"
          rules={[
            {
              validator: (rule, value) => {
                if (parseInt(value)) return Promise.resolve();
                return Promise.reject();
              },

              required: true,
              message: "Enter valid amount!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Booking Mode" name="mode">
          <Select
            defaultValue={form.getFieldValue("mode")}
            onChange={(value) =>
              form.setFieldsValue({
                mode: value,
              })
            }
          >
            {BOOKING_MODES_LIST.map((mode) => (
              <Option value={BOOKING_MODES[mode]}>{BOOKING_MODES[mode]}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 10,
            span: 15,
          }}
        >
          <Button type="primary" htmlType="submit">
            BOOK
          </Button>
        </Form.Item>
      </Form>
    </Style>
  );
}

const Style = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  form {
    margin-top: 1rem;

    min-width: 500px;
  }
`;

export default BookingForm;
