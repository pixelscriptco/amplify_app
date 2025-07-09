import "antd/dist/antd.css";
import {
  Button,
  Form,
  Input,
  Popconfirm,
  Table,
  Modal,
  Alert,
  message,
} from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useInventories } from "../Hooks";
import { Select } from "antd";
import {
  BOOKING_MODES_LIST,
  BOOKING_MODES,
} from "../Data";
import { useBookings } from "../Hooks/booking";
import {
  getDateFromTimestamp,
  getTimeFromTimestamp,
} from "../Utility/function";
import { useNavigate } from "react-router-dom";
import Loading from "../Components/Atoms/Loading";
const { Option } = Select;

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

// list of unit status for which user details are to be fetched

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const Search = ({ onSearch }) => {
  return (
    <Form
      name="basic"
      initialValues={{ remember: true }}
      autoComplete="off"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "1rem 0",
      }}
    >
      <Form.Item
        style={{ margin: 0, marginRight: "1rem", padding: "0" }}
        name="FlatId"
      >
        <Input
          placeholder="Transaction Id"
          onChange={(e) => onSearch(e.target.value)}
        />
      </Form.Item>
    </Form>
  );
};

const Bookings = () => {
  const { bookingsList, fetchBookings } = useBookings();
  const [dataSource, setDataSource] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [justEditedField, setJustEditedField] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookings(setLoading);
  }, []);

  useEffect(() => {
    if (dataSource.length > 0) setTableData(dataSource);
  }, [dataSource]);

  useEffect(() => {
    if (bookingsList.length > 0) {
      setDataSource(
        bookingsList.map((booking) => ({
          ...booking,
        }))
      );
    }
  }, [bookingsList]);

  const handleSave = () => {
    const { row } = justEditedField;
    const newData = [...tableData];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setTableData(newData);
    setJustEditedField(null);
  };

  const handleSearch = (trans_id) => {
    if (trans_id == "") {
      setTableData(dataSource);
      return;
    }

    setTableData(
      dataSource.filter((flat) =>
        flat.transactionId
          .toString()
          .toUpperCase()
          .includes(trans_id.toUpperCase())
      )
    );
  };

  const getChangedColumn = (old_row, row) => {
    let changed_column;
    Object.keys(row).forEach((key) => {
      if (old_row[key] !== row[key]) {
        changed_column = key;
        return;
      }
    });
    return changed_column;
  };

  // show model when field is edited
  const handleFieldEdit = (field) => {
    const row = field;
    const newData = [...tableData];
    const index = newData.findIndex((item) => row.key === item.key);
    const old_row = newData[index];
    const changedColumn = getChangedColumn(old_row, row);

    // confirm if user wants to save changes
    if (changedColumn)
      setJustEditedField({
        editedField: changedColumn,
        row: row,
        oldRow: old_row,
      });
    return;
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const defaultColumns = [
    // {
    //   title: formalTitles.id,
    //   dataIndex: "id",
    //   width: "10%",
    // },
    {
      title: formalTitles.transactionId,
      dataIndex: "transactionId",
    },
    {
      title: formalTitles.flatId,
      dataIndex: "flatId",
      width: "10%",
    },
    {
      title: formalTitles.amount,
      dataIndex: "amount",
      width: "10%",
    },

    {
      title: formalTitles.userId,
      dataIndex: "userId",
    },

    {
      title: formalTitles.timestamp,
      dataIndex: "timestamp",
      // defaultSortOrder: "descend",
      sorter: (a, b) => b.timestamp - a.timestamp,
      render: (timestamp) => {
        return `${getDateFromTimestamp(timestamp)} ${getTimeFromTimestamp(
          timestamp
        )}`;
      },
    },

    {
      title: formalTitles.mode,
      dataIndex: "mode",
      filters: BOOKING_MODES_LIST.map((mode) => ({
        text: BOOKING_MODES[mode],
        value: BOOKING_MODES[mode],
      })),
      onFilter: (value, record) => record.mode == value,
    },
  ];

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: (field) => handleFieldEdit(field),
      }),
    };
  });

  return (
    <Style>
      <div className="title">Manage Bookings</div>

      <div className="row space-between center">
        <Search onSearch={handleSearch} />
        <Button
          loading={loading}
          onClick={() => fetchBookings(setLoading)}
          style={{ margin: "0" }}
        >
          Refresh
        </Button>
      </div>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={tableData}
        columns={columns}
      />

      {/* if any field is changes show model */}
      {justEditedField && (
        // confirmation model for any other field is changed
        <Modal
          title={`Are you sure to update Flat with Id ${justEditedField.row.id} ?`}
          visible={justEditedField}
          onOk={handleSave}
          onCancel={() => setJustEditedField(null)}
        >
          <p>{`You are updating ${
            formalTitles[justEditedField.editedField]
          } from ${justEditedField.oldRow[justEditedField.editedField]} to ${
            justEditedField.row[justEditedField.editedField]
          }`}</p>
        </Modal>
      )}
      <Button
        type="link"
        style={{ float: "left" }}
        onClick={() => navigate("/dashboard/inventories")}
      >
        Manage Inventories
      </Button>
      <Button
        type="link"
        style={{ float: "left" }}
        onClick={() => navigate("/dashboard/users")}
      >
        Manage Users
      </Button>
    </Style>
  );
};

export default Bookings;

const Style = styled.div`
  .row {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }

  .center {
    align-items: center;
  }
  /* font-family: "Roboto", sans-serif; */
  /* font-family: "lato" !important; */
  font-weight: normal;
  padding: 1rem;
  .title {
    color: var(--input_label_text_color);
    font-size: 1.3rem;
    font-weight: 500;
    margin-bottom: 1rem;
    text-align: center;
  }
`;

const formalTitles = {
  id: "Booking Id",
  FlatId: "Flat Id",
  TowerName: "Tower Name",
  FlatNumber: "Flat Number",
  FloorNumber: "Floor Number",
  SBU: "SBU",
  Status: "Status",
  TotalCost: "Total Cost",
  UnitType: "Unit Type",

  userId: "User Id",
  amount: "Amount",
  email: "Email",
  firstName: "First Name",
  lastName: "Last Name",
  mobile: "Mobile",
  timestamp: "Date & Time",
  flatId: "Flat Id",
  mode: "Booking Mode",
  transactionId: "Transaction Id",
};
