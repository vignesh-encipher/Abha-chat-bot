# Reusable Ant Design Table Component

A highly customizable and reusable table component built on top of Ant Design's Table component with additional features and configurations.

## 🚀 Features

- **Pagination** - Built-in pagination with customizable page sizes
- **Search** - Global search functionality across all columns
- **Filtering** - Custom filter capabilities
- **Row Selection** - Single and multiple row selection
- **Actions** - Customizable action buttons with confirmations
- **Sorting** - Column sorting support
- **Loading States** - Built-in loading indicators
- **Responsive** - Mobile-friendly design
- **Expandable Rows** - Support for expandable row content
- **Custom Styling** - Flexible styling options

## 📦 Installation

The component is already included in your project. Import it like this:

```javascript
import ReusableTable from '@/components/table';
```

## 🎯 Basic Usage

```javascript
import React from 'react';
import ReusableTable from '@/components/table';

const MyComponent = () => {
  const data = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  ];

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
  ];

  return (
    <ReusableTable
      data={data}
      columns={columns}
      rowKey="id"
    />
  );
};
```

## 🔧 Props

### Data & Columns
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Array` | `[]` | Table data source |
| `columns` | `Array` | `[]` | Table columns configuration |
| `rowKey` | `String` | `'id'` | Unique key for each row |

### Pagination
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pagination` | `Boolean` | `true` | Enable/disable pagination |
| `pageSize` | `Number` | `10` | Number of items per page |
| `showSizeChanger` | `Boolean` | `true` | Show page size changer |
| `showQuickJumper` | `Boolean` | `true` | Show quick page jumper |
| `showTotal` | `Boolean` | `true` | Show total items count |

### Selection
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectable` | `Boolean` | `false` | Enable row selection |
| `onRowSelect` | `Function` | `null` | Callback when rows are selected |

### Actions
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `actions` | `Array` | `[]` | Custom action buttons |
| `onRowClick` | `Function` | `null` | Callback when row is clicked |

### Search & Filter
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `searchable` | `Boolean` | `false` | Enable search functionality |
| `onSearch` | `Function` | `null` | Search callback |
| `filterable` | `Boolean` | `false` | Enable filter functionality |
| `onFilter` | `Function` | `null` | Filter callback |

### Styling
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `String` | `'middle'` | Table size ('small', 'middle', 'large') |
| `bordered` | `Boolean` | `false` | Show table borders |
| `striped` | `Boolean` | `false` | Show striped rows |
| `hoverable` | `Boolean` | `true` | Enable row hover effects |
| `className` | `String` | `''` | Additional CSS classes |
| `style` | `Object` | `{}` | Inline styles |

### Other
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | `Boolean` | `false` | Show loading state |
| `expandable` | `Boolean` | `false` | Enable expandable rows |
| `expandedRowRender` | `Function` | `null` | Render function for expanded content |
| `scroll` | `Object` | `null` | Table scroll configuration |

## 🎨 Action Configuration

Actions are defined as an array of objects with the following structure:

```javascript
const actions = [
  {
    key: 'view',                    // Unique key
    label: 'View',                  // Button label
    icon: <EyeOutlined />,          // Button icon
    type: 'text',                   // Button type
    danger: false,                  // Danger button style
    disabled: false,                // Disabled state
    tooltip: 'View details',        // Tooltip text
    confirm: {                      // Confirmation dialog
      title: 'Are you sure?',
      description: 'This action cannot be undone'
    },
    onClick: (record) => {          // Click handler
      console.log('Viewing:', record);
    }
  }
];
```

## 📝 Column Configuration

Columns support all Ant Design Table column props plus custom renderers:

```javascript
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (text, record) => (
      <span style={{ fontWeight: 'bold' }}>{text}</span>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => (
      <Tag color={status === 'active' ? 'green' : 'red'}>
        {status}
      </Tag>
    ),
  },
];
```

## 🔍 Search Configuration

Enable search functionality with custom search logic:

```javascript
<ReusableTable
  data={data}
  columns={columns}
  searchable={true}
  onSearch={(searchText) => {
    console.log('Searching for:', searchText);
    // Custom search logic
  }}
/>
```

## 🎯 Selection Configuration

Enable row selection with custom selection handlers:

```javascript
<ReusableTable
  data={data}
  columns={columns}
  selectable={true}
  onRowSelect={(selectedKeys, selectedRows) => {
    console.log('Selected keys:', selectedKeys);
    console.log('Selected rows:', selectedRows);
  }}
/>
```

## 📱 Expandable Rows

Enable expandable rows with custom content:

```javascript
<ReusableTable
  data={data}
  columns={columns}
  expandable={true}
  expandedRowRender={(record) => (
    <div>
      <p>Additional details for {record.name}</p>
      <p>More information here...</p>
    </div>
  )}
/>
```

## 🎨 Styling Examples

### Basic Table
```javascript
<ReusableTable
  data={data}
  columns={columns}
  pagination={true}
  pageSize={10}
/>
```

### Detailed Table
```javascript
<ReusableTable
  data={data}
  columns={columns}
  pagination={true}
  pageSize={5}
  bordered={true}
  striped={true}
  searchable={true}
  filterable={true}
  selectable={true}
  actions={customActions}
/>
```

### Compact Table
```javascript
<ReusableTable
  data={data}
  columns={columns}
  pagination={false}
  size="small"
  bordered={false}
  hoverable={false}
/>
```

## 🚀 Advanced Examples

### Users Management Table
```javascript
import { Avatar, Tag, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const userColumns = [
  {
    title: 'User',
    key: 'user',
    render: (_, record) => (
      <Space>
        <Avatar src={record.avatar} icon={<UserOutlined />} />
        <div>
          <div style={{ fontWeight: 500 }}>{record.name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
        </div>
      </Space>
    ),
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    render: (role) => {
      const color = role === 'Admin' ? 'red' : 'green';
      return <Tag color={color}>{role}</Tag>;
    },
  },
];

const userActions = [
  {
    key: 'view',
    label: 'View',
    icon: <EyeOutlined />,
    onClick: (record) => console.log('View user:', record.name),
  },
  {
    key: 'edit',
    label: 'Edit',
    icon: <EditOutlined />,
    onClick: (record) => console.log('Edit user:', record.name),
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: <DeleteOutlined />,
    danger: true,
    confirm: {
      title: 'Delete User',
      description: `Are you sure you want to delete ${record.name}?`,
    },
    onClick: (record) => console.log('Delete user:', record.name),
  },
];

<ReusableTable
  data={users}
  columns={userColumns}
  actions={userActions}
  selectable={true}
  searchable={true}
  onRowSelect={(keys, rows) => console.log('Selected:', keys)}
/>
```

## 🎯 Best Practices

1. **Always provide a unique `rowKey`** for proper row identification
2. **Use meaningful column keys** for better performance
3. **Implement proper loading states** for better UX
4. **Use confirmations for destructive actions**
5. **Provide tooltips for action buttons**
6. **Test responsive behavior** on different screen sizes
7. **Use appropriate table sizes** based on content density

## 🐛 Troubleshooting

### Common Issues

1. **Rows not selecting properly**
   - Ensure `rowKey` is unique and present in data
   - Check if `selectable` prop is set to `true`

2. **Search not working**
   - Verify `searchable` prop is set to `true`
   - Check if `onSearch` callback is provided

3. **Actions not appearing**
   - Ensure `actions` array is not empty
   - Check action configuration structure

4. **Pagination issues**
   - Verify `pagination` prop is set to `true`
   - Check `pageSize` configuration

## 📚 Related Components

- [Ant Design Table](https://ant.design/components/table)
- [Ant Design Button](https://ant.design/components/button)
- [Ant Design Tag](https://ant.design/components/tag)
- [Ant Design Avatar](https://ant.design/components/avatar)

## 🤝 Contributing

Feel free to extend this component with additional features or improvements. Some ideas:

- Virtual scrolling for large datasets
- Column resizing
- Column reordering
- Export functionality
- Advanced filtering options
- Custom row heights
- Sticky headers/columns

---

**Happy Coding! 🎉**
