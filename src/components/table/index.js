import React, { useState } from 'react';
import { Table, Button, Space, Tag, Tooltip, Popconfirm, message } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';

const ReusableTable = ({
  data = [],
  columns = [],
  loading = false,
  pagination = true,
  pageSize = 10,
  showSizeChanger = true,
  showQuickJumper = true,
  showTotal = true,
  rowKey = 'id',
  size = 'middle',
  bordered = false,
  striped = false,
  hoverable = true,
  selectable = false,
  onRowSelect = null,
  onRowClick = null,
  actions = [],
  searchable = false,
  onSearch = null,
  filterable = false,
  onFilter = null,
  expandable = false,
  expandedRowRender = null,
  scroll = null,
  className = '',
  style = {},
  ...props
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');

  // Handle row selection
  const handleRowSelection = {
    type: selectable ? 'checkbox' : undefined,
    selectedRowKeys,
    onChange: (keys, selectedRows) => {
      setSelectedRowKeys(keys);
      if (onRowSelect) {
        onRowSelect(keys, selectedRows);
      }
    },
    getCheckboxProps: (record) => ({
      disabled: record.disabled || false,
    }),
  };

  // Handle row click
  const handleRowClick = (record, index) => {
    if (onRowClick) {
      onRowClick(record, index);
    }
  };

  // Default action buttons
  const defaultActions = [
    {
      key: 'view',
      label: 'View',
      icon: <EyeOutlined />,
      onClick: (record) => message.info(`Viewing ${record.name || record.title || 'item'}`),
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: <EditOutlined />,
      onClick: (record) => message.info(`Editing ${record.name || record.title || 'item'}`),
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: (record) => message.info(`Deleting ${record.name || record.title || 'item'}`),
    },
  ];

  // Merge default actions with custom actions, avoiding duplicates
  const allActions = [...defaultActions];
  actions.forEach(customAction => {
    const existingIndex = allActions.findIndex(action => action.key === customAction.key);
    if (existingIndex >= 0) {
      // Replace default action with custom action
      allActions[existingIndex] = customAction;
    } else {
      // Add new custom action
      allActions.push(customAction);
    }
  });

  // Create actions column if actions are provided
  const actionsColumn = allActions.length > 0 ? {
    title: 'Actions',
    key: 'actions',
    width: 120,
    fixed: 'right',
    render: (_, record) => (
      <Space size="small">
        {allActions.map((action) => {
          if (action.confirm) {
            return (
              <Popconfirm
                key={action.key}
                title={action.confirm.title || 'Are you sure?'}
                description={typeof action.confirm.description === 'function' 
                  ? action.confirm.description(record) 
                  : action.confirm.description}
                onConfirm={() => action.onClick(record)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type={action.type || 'text'}
                  size="small"
                  icon={action.icon}
                  danger={action.danger}
                  disabled={action.disabled}
                >
                  {action.label}
                </Button>
              </Popconfirm>
            );
          }

          return (
            <Tooltip key={action.key} title={action.tooltip || action.label}>
              <Button
                type={action.type || 'text'}
                size="small"
                icon={action.icon}
                danger={action.danger}
                disabled={action.disabled}
                onClick={() => action.onClick(record)}
              >
                {action.label}
              </Button>
            </Tooltip>
          );
        })}
      </Space>
    ),
  } : null;

  // Filter data based on search text
  const filteredData = searchable && searchText
    ? data.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        )
      )
    : data;

  // Table configuration
  const tableConfig = {
    dataSource: filteredData,
    columns: [...columns],
    loading,
    pagination: pagination ? {
      pageSize,
      showSizeChanger,
      showQuickJumper,
      showTotal: showTotal ? (total, range) => 
        `${range[0]}-${range[1]} of ${total} items` : undefined,
      pageSizeOptions: ['10', '20', '50', '100'],
    } : false,
    rowKey,
    size,
    bordered,
    striped,
    hoverable,
    onRow: (record, index) => ({
      onClick: () => handleRowClick(record, index),
      style: { cursor: onRowClick ? 'pointer' : 'default' },
    }),
    scroll,
    className: `reusable-table ${className}`,
    style,
    ...props,
  };

  // Add row selection if enabled
  if (selectable) {
    tableConfig.rowSelection = handleRowSelection;
  }

  // Add expandable rows if enabled
  if (expandable && expandedRowRender) {
    tableConfig.expandable = {
      expandedRowRender,
      expandRowByClick: true,
    };
  }

  return (
    <div className="reusable-table-container">
      {/* Table */}
      <Table {...tableConfig} />
    </div>
  );
};

export default ReusableTable;