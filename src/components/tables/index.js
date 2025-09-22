import moment from "moment";
import Style from "./table.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DownloadOutlined,
  InfoCircleFilled,
  InfoCircleOutlined,
  LoadingOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Empty,
  Image,
  Popconfirm,
  Popover,
  Progress,
  Select,
  Skeleton,
  Switch,
  Tooltip,
  Table,
} from "antd";
import {
  auditStatusTemplate,
  processstatusBodyTemplate,
  renderUserProfile,
  renderUserProfileDisable,
  reusableEllipses,
  tableSkeleton,
  createIdGen,
  proxyStatusBodyTemplate,
  getRoasterStatus,
  renderFlagCells,
  processStatusBodyTemplate,
  dynamicAuditStatusTemplate,
  findItemWithTrueOrFalse,
  checkWithIncludesKey,
  createIdGens,
} from "../../utils/reusable";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import { priorityOptions, priorityStatus } from "../headerFilters/functions";
import Legends from "../legends";
import { bullets } from "../../pages/reviewer/patients";
import { auditBullets } from "../../pages/supervisor/auditing";
import { CircularProgressbar } from "react-circular-progressbar";
import EditButton from "../../images/adminUsers/EditButton";
import EditButtonDisbled from "../../images/adminUsersDisabled/EditButtonDisabled";
import { faArrowsRotate, faUpload, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { batchBullets } from "../../commonPages/patients";
import { useRouter } from "next/router";
import { Paginator } from "primereact/paginator";
import { useState, useMemo } from "react";

const AppTable = ({
  switchStates,
  data,
  column,
  status,
  setAction,
  count = 18,
  onSwitchToggle,
  totalLength,
  loader,
  onRowClick,
  handleRowCheckboxChange,
  checkBoxLoader,
  handleUpload,
  disableUser,
  rowHighlight = false,
  activeItem,
  setActiveItem,
  handleReportIcon,
  setTriggeredBatch,
  setOpenUpload,
  openUpload,
  handleBatchTrigger,
  tableHeight,
  isReportPage,
  triggeredId,
  isNullable,
  setSelectedRows,
  selectedRows,
  onPageChange,
  sort,
  setSort,
  handlePriorityChange,
  setRowData,
  setPopoverVisible,
  setSelectedRoles,
  optionsUser,
  setSelectedManager,
  getContent,
  popoverVisible,
  isMultiple,
  actionBodyTemplate,
  statusBodyTemplate,
  getRetregger,
  id,
  infoIcon = true,
  tableId,
  renderFlagCell,
  first,
  totalRecords,
  row,
  handleRoasterBtn,
  isPagination = true,
  dateFormateAlign,
  getStatusStyles,
  renderCountDetailsPopover,
  isCheckBox,
  checkedHeader,
  isUpload,
  idKey,
  handleAction,
  isEdit,
  content,
  visiblePopoverKey,
  setVisiblePopoverKey,
  setEditingUser,
  isGenerateReport,
  isGenerateReportDownload,
  setRole,
  selectedRole,
  onCloseIconClick,
  disabled,
  handleReportDownload,
  isTrigger,
  showCancelIcon = false,
  progressCancel,
  totalCountHead,
  progressCancelIcon,
  cancelIcon=false
}) => {
  const router = useRouter();
  
  // Add dynamic columns based on props
  const dynamicColumns = useMemo(() => {
    const newColumns = [...(column || [])];
    
    if (isCheckBox) {
      newColumns.push({
        checkBox: true,
        value: idKey ? idKey : "patientId",
        header: true,
      });
    }
    
    if (isEdit) {
      newColumns.push({
        edit: true,
        value: "patientId",
      });
    }
    
    if (isGenerateReportDownload) {
      newColumns.push({
        reportDownload: true,
        value: idKey ? idKey : "patientId",
        header: false,
      });
    }
    
    if (isGenerateReport) {
      newColumns.push({
        checkBox: true,
        value: idKey ? idKey : "patientId",
        header: true,
      });
    }

    // Upload and Retry buttons at the end
    if (isUpload) {
      newColumns.push({
        statusButton: true,
        value: "patientId",
      });
    }
    
    if (isTrigger) {
      newColumns.push({
        triggerButton: true,
      });
    }

    return newColumns;
  }, [column, isCheckBox, isUpload, isTrigger, isEdit, isGenerateReportDownload, isGenerateReport, idKey]);

  // Convert columns to Ant Design format
  const antdColumns = useMemo(() => {
    return (dynamicColumns || []).map((item, index) => {
      const columnConfig = {
        key: `column-${index}`,
        dataIndex: item.actualField || item.value,
        title: checkWithIncludesKey(item?.design, "SORTABLE") ? (
          <div className="d-flex align-items-center gap-2">
            <span>{item.headerName || item.name}</span>
            <div className="d-flex flex-column">
              {sort?.sortField === item.actualField && sort?.sortDir === "ASC" ? (
                <ArrowUpOutlined style={{ color: '#FFF', fontSize: '12px', cursor: 'pointer' }} />
              ) : (
                <ArrowDownOutlined style={{ color: '#FFF', fontSize: '12px', cursor: 'pointer' }} />
              )}
            </div>
          </div>
        ) : (item.headerName || item.name),
        width: item.width,
        align: item.align || 'left',
        sorter: false,
        sortOrder: null,
        showSorterTooltip: false,
        onHeaderCell: () => ({
          onClick: checkWithIncludesKey(item?.design, "SORTABLE") ? () => {
            if (setSort) {
              const newSortDir = sort?.sortField === item.actualField && sort?.sortDir === "ASC" ? "DESC" : "ASC";
              setSort((prev) => ({
                ...prev,
                [item.actualField]: {
                  sortField: item?.actualField,
                  sortDir: newSortDir,
                },
                sortField: item?.actualField,
                sortDir: newSortDir,
              }));
            }
          } : undefined,
        }),
        render: (text, record, rowIndex) => renderCellContent(item, record, rowIndex, index),
      };

      // Handle special column types
      if (item.checkBox && item?.header) {
        columnConfig.title = (
          <div className="d-flex align-items-center justify-content-center" style={{ height: '32px' }}>
            <input
              className="mx-1"
              onChange={(e) => {
                e.stopPropagation();
                handleRowCheckboxChange({
                  e,
                  row: item,
                  singleCheck: false,
                  checked: e.target.checked,
                });
              }}
              style={{
                width: "20px",
                height: "20px",
                flexShrink: "0",
                borderRadius: "4px",
                cursor: disabled ? "not-allowed" : "pointer",
              }}
              type="checkbox"
              id={
                id
                  ? createIdGen("tableCheckbox" + id)
                  : createIdGen("tableCheckbox" + router.pathname.replaceAll("/", " "))
              }
              checked={checkedHeader}
              disabled={disabled}
            />
            <span>{item.name}</span>
          </div>
        );
        columnConfig.render = (text, record, rowIndex) => renderCheckboxCell(item, record, rowIndex);
      }

      if (item.statusButton) {
        columnConfig.title = (
          <div className="d-flex align-items-center justify-content-center" style={{ height: '32px' }}>
            Upload
          </div>
        );
        columnConfig.align = "center";
        columnConfig.render = (text, record, rowIndex) => (
          <div className="d-flex align-items-center justify-content-center" style={{ height: '32px' }}>
            {actionBodyTemplate && actionBodyTemplate(record)}
          </div>
        );
      }

      if (item.edit) {
        const isUsersPage = window.location.pathname.includes("tenantadmin/settings");
        columnConfig.title = isUsersPage ? "Edit" : "Action";
        columnConfig.render = (text, record, rowIndex) => renderEditCell(item, record, rowIndex);
      }

      if (item.triggerButton) {
        columnConfig.title = "";
        columnConfig.render = (text, record, rowIndex) => renderTriggerCell(item, record, rowIndex);
      }

      if (item.reportDownload) {
        columnConfig.title = "Download";
        columnConfig.align = "center";
        columnConfig.render = (text, record, rowIndex) => renderDownloadCell(item, record, rowIndex);
      }

      if (item.status || item?.auditedStatus || item?.batchStatus) {
        columnConfig.title = (
          <div className="d-flex align-items-center">
            {item?.headerName?.toUpperCase()}
            {item?.infoIcon && (
              <Popover
                content={
                  <Legends
                    bullets={
                      item.auditedStatus
                        ? auditBullets
                        : item?.batchStatus
                        ? batchBullets
                        : bullets
                    }
                    display="block"
                    padding="0 0px 10px 0"
                  />
                }
                trigger={["click"]}
                placement="bottom"
              >
                <InfoCircleFilled className={`font2 ${Style.infoIcon}`} />
              </Popover>
            )}
          </div>
        );
        columnConfig.align = "center";
      }

      if (item.isTooltip) {
        columnConfig.title = (
          <Tooltip
            title={
              item.name == "RC"
                ? "REVIEWER CHANGES"
                : "REVIEWER CHANGES REJECTION"
            }
            placement="bottom"
          >
            {item.name.toUpperCase()}
          </Tooltip>
        );
        columnConfig.align = "center";
      }

      return columnConfig;
    });
  }, [dynamicColumns, sort, setSort, checkedHeader, disabled, handleRowCheckboxChange, actionBodyTemplate, infoIcon, router, id]);

  // Early return if no columns
  if (!dynamicColumns || dynamicColumns.length === 0) {
    return (
      <div className="customTable">
        <div className={`${tableHeight ? Style.pageContainer1 : Style.pageContainer}`}>
          <div className={Style.pageContent}>
            <div style={{ overflowX: "auto" }}>
              <table className={`${Style.classTable} ${isReportPage ? Style.scrollIssue : ''}`}>
                <tbody>
                  {Array.from({ length: row || 15 }, (_, rowIndex) => (
                    <tr key={`skeleton-${rowIndex}`} className={Style.tbodyRow}>
                      {Array.from({ length: 5 }, (_, colIndex) => (
                        <td key={`skeleton-${rowIndex}-${colIndex}`}>
                          <Skeleton.Input 
                            active 
                            size="small" 
                            style={{ width: 100, height: 30 }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render cell content based on column type
  const renderCellContent = (columnItem, item, colIndex, index) => {
    // Handle total row
    if (item?.allocatedTo === "TOTAL") {
      return (
        <div className="d-flex align-items-center">
          <div className="">{item[`${columnItem.actualField}`]}</div>
        </div>
      );
    }

    // Handle priority column
    if (columnItem?.design?.includes("PRIORITY")) {
      return (
        <div className="text-secondary">
          <Select
            options={priorityOptions}
            placeholder="Set priority"
            className={`custom-ant-select ${Style.customAntSelect}`}
            showSearch={false}
            value={item?.priority || undefined}
            onClick={(e) => e.stopPropagation()}
            onChange={
              handlePriorityChange
                ? (value) => handlePriorityChange(item?.tinNumber, value)
                : undefined
            }
            disabled={!handlePriorityChange}
            style={{ width: "100%" }}
          />
        </div>
      );
    }

    // Handle profile column
    if (findItemWithTrueOrFalse(columnItem.design, "PROFILE")) {
      return (
        <div
          style={{
            color: item.accountStatus === false ? "gray" : "",
          }}
        >
          {renderUserProfile(item, columnItem)}
        </div>
      );
    }

    // Handle comma separation
    if (columnItem?.design?.includes("COMMA_SEPARATION")) {
      return (
        <div
          style={{
            color: item.accountStatus === false ? "gray" : "",
          }}
        >
          {item[columnItem.actualField]
            ? item[columnItem.actualField]
                .toString()
                .replace(/_/g, " ")
                .replace(/,\s*/g, ", ")
            : "---"}
        </div>
      );
    }

    // Handle rebuttal changes
    if (columnItem?.design?.includes("REBUTTAL_CHANGES")) {
      return item?.rebuttedOn ? "YES" : "NO";
    }

    // Handle count info
    if (columnItem.countInfo) {
      return (
        <div className="d-flex">
          <div style={{ width: "25px" }}>{item[columnItem.value]}</div>
          {renderCountDetailsPopover(item)}
        </div>
      );
    }

    // Handle boolean values
    if (columnItem.isBoolean) {
      return (
        <div
          style={{
            color: item.accountStatus === false ? "gray" : "",
          }}
        >
          {item[columnItem.value] === false
            ? columnItem.falseValue
            : columnItem.truthValue}
        </div>
      );
    }

    // Handle object values
    if (columnItem.objValue) {
      return (
        <div
          style={{
            color: item.accountStatus === false ? "gray" : "",
          }}
        >
          {item[columnItem.value.firstValue] &&
          item[columnItem.value.firstValue][columnItem.value.secondValue]
            ? item[columnItem.value.firstValue][columnItem.value.secondValue]
            : "---"}
        </div>
      );
    }

    // Handle date columns
    if (
      columnItem?.design?.includes("DATE") ||
      columnItem?.design === "DATE_TIME"
    ) {
      return (
        <div style={{ color: item.accountStatus === false ? "gray" : "" }}>
          {item[`${columnItem.actualField}`] ? (
            columnItem.design === "DATE_TIME" ? (
              moment(item[`${columnItem.actualField}`]).format("MM-DD-YYYY hh:mm A")
            ) : (
              moment(item[`${columnItem.actualField}`]).format("MM-DD-YYYY")
            )
          ) : (
            <div className="d-flex px-4">---</div>
          )}
        </div>
      );
    }

    // Handle toggle columns
    if (
      findItemWithTrueOrFalse(columnItem.design, "TOGGLE") &&
      switchStates
    ) {
      return (
        <div>
          <Switch
            data-testid={
              tableId
                ? createIdGens("userSwitch" + id + colIndex)
                : createIdGens("userSwitch" + colIndex)
            }
            className="user-switch"
            checked={item?.userName ? switchStates[item?.userName] : true}
            onChange={(checked) => onSwitchToggle(item, checked)}
            disabled={item.currentUser === true}
          />
        </div>
      );
    }

    // Handle reviewer status
    if (columnItem?.design?.includes("REVIEWER_STATUS")) {
      return (
        <div className="d-flex justify-content-center">
          {processStatusBodyTemplate(
            item[`${columnItem.actualField}`],
            columnItem.isIcon
          )}
        </div>
      );
    }

    // Handle proxy status
    if (columnItem?.design?.includes("PROXY_STATUS")) {
      return (
        <div className="d-flex justify-content-center">
          {proxyStatusBodyTemplate(
            item[`${columnItem.actualField}`],
            columnItem.isIcon
          )}
        </div>
      );
    }

    // Handle computation status
    if (columnItem?.design?.includes("COMPUTATION_STATUS")) {
      return statusBodyTemplate && statusBodyTemplate(item);
    }

    // Handle audit status
    if (columnItem.auditedStatus) {
      return (
        <div className="d-flex justify-content-center">
          {auditStatusTemplate(
            item[`${columnItem.value}`],
            columnItem.isIcon
          )}
        </div>
      );
    }

    // Handle dynamic audit status
    if (columnItem?.design?.includes("AUDIT_STATUS")) {
      return (
        <div className="d-flex justify-content-center">
          {dynamicAuditStatusTemplate(
            item[`${columnItem.actualField}`],
            columnItem.isIcon
          )}
        </div>
      );
    }

    // Handle progress bar
    if (columnItem?.design?.includes("PROGRESS_BAR")) {
      return (
        <div className="d-flex justify-content-start gap-3">
          <Progress
            percent={item[`${columnItem.actualField}`]}
            format={(percent) => `${percent}%`}
            className={` ${Style.progreddBr}`}
          />
          {showCancelIcon && (
            <div>
              <CloseCircleOutlined
                style={{ fontSize: "20px" }}
                className="text-danger"
                onClick={progressCancel}
              />
            </div>
          )}
        </div>
      );
    }

    // Handle clumpse two fields
    if (columnItem.clumpseTwoFields) {
      return (
        <div>
          {item[columnItem?.fromObject] === "SYSTEM" ? (
            <div>{item[columnItem?.fromObject]}</div>
          ) : (
            renderUserProfile(item, columnItem)
          )}
          {columnItem?.value && item[columnItem.value] ? (
            <div className="d-flex align-items-start justify-content-start mx-5">
              {moment(item[columnItem.value]).format("MM-DD-YYYY")}
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-center mx-5">
              ---
            </div>
          )}
        </div>
      );
    }

    // Handle flag columns
    if (columnItem?.design?.includes("FLAG")) {
      return renderFlagCells(item);
    }

    // Handle progress bar with cancel button
    if (columnItem?.design?.includes("PROGRESS_BAR_WITH_CANCEL_BUTTON")) {
      if (item?.progress < 0) {
        return (
          <div style={{ fontStyle: "italic" }} className="text-danger">
            Cancelled
          </div>
        );
      }
      if (item?.status === "FAILED") {
        return (
          <div style={{ fontStyle: "italic" }} className="text-danger">
            Failed
          </div>
        );
      }
      return (
        <div className="d-flex justify-content-start gap-3">
          <Progress
            percent={item[`${columnItem.actualField}`]}
            format={(percent) => `${percent}%`}
            className={`${Style.progreddBr}`}
          />
          {cancelIcon && item?.progress !== 100 && (
            <Popconfirm
              title="Are you sure to cancel the process?"
              onConfirm={() => progressCancelIcon(item.id)}
              okText="Yes"
              cancelText="No"
            >
              <CloseCircleOutlined
                style={{ fontSize: "20px" }}
                className="text-danger"
                onClick={(e) => e.stopPropagation()}
              />
            </Popconfirm>
          )}
        </div>
      );
    }

    // Handle array data format
    if (columnItem?.arrayDataFormat) {
      return dateFormateAlign(item?.yearOfService);
    }

    // Handle re-upload for failed roaster status
    if (columnItem?.design?.includes("RE_UPLOAD")) {
      return (
        <div className="d-flex justify-content-center align-items-center">
          {item?.roasterStatus === "FAILED" ? (
            <div className="d-flex justify-content-center gap-2">
              <button
                id={
                  tableId
                    ? createIdGen("reUploadIcon" + tableId + colIndex)
                    : createIdGen(
                        "reUploadIcon" +
                          router.pathname.replaceAll("/", " ") +
                          colIndex
                      )
                }
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoasterBtn(item);
                }}
                className="btn hegiht10 sharp me-1 action-btn"
                style={{ background: "#0942c4" }}
                role="button"
                tabIndex={0}
              >
                <FontAwesomeIcon
                  icon={faUpload}
                  fontSize={11}
                  style={{ color: "#ffff" }}
                />
              </button>
              <Popover
                title="Reason"
                content={
                  <div
                    style={{
                      maxWidth: 200,
                      maxHeight: 100,
                      overflow: "auto",
                    }}
                  >
                    {item?.failedReason ? item.failedReason : "---"}
                  </div>
                }
              >
                <InfoCircleOutlined
                  style={{
                    fontSize: "20px",
                    color: "#df3a3a",
                    cursor: "pointer",
                  }}
                />
              </Popover>
            </div>
          ) : (
            <div className="text-start">---</div>
          )}
        </div>
      );
    }

    // Handle batch buttons
    if (columnItem?.batchButtons) {
      return (
        <div>
          <div style={{ width: "65%" }}>
            {item?.batchUploadStatus && (
              <div
                style={{
                  width: "100%",
                  ...getStatusStyles({
                    status: item?.batchUploadStatus,
                    isBorder: true,
                  }),
                }}
                className="px-4 py-1 rounded-1 font-semibold d-flex justify-content-center align-items-center"
              >
                {item?.batchUploadStatus === "PROCESSING" ? (
                  <Skeleton.Button 
                    active 
                    size="small" 
                    style={{ width: 60, height: 20 }}
                    className="ant-badge mx-2"
                  />
                ) : item?.batchUploadStatus === "FAILED" ? (
                  <FontAwesomeIcon
                    className="mx-1"
                    icon={faCircleXmark}
                    style={getStatusStyles({
                      status: item?.batchUploadStatus,
                    })}
                  />
                ) : (
                  <FontAwesomeIcon
                    className="mx-1"
                    icon={faCircleCheck}
                    style={getStatusStyles({
                      status: item?.batchUploadStatus,
                    })}
                  />
                )}
                {item?.batchUploadStatus.charAt(0).toUpperCase() +
                  item?.batchUploadStatus.slice(1).toLowerCase()}
              </div>
            )}
            {!item?.batchUploadStatus && (
              <div 
                className="w-100 d-flex justify-content-center align-items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  id="status-btn"
                  name="status-btn"
                  className={`w-100 px-4 py-1  ${
                    item?.source === "CogentUpload"
                      ? Style.uploadButton
                      : Style.triggerButton
                  } d-flex justify-content-center align-items-center`}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setTriggeredBatch({
                      status: true,
                      id: item?.batchID,
                    });
                    if (item?.source === "CogentUpload") {
                      setOpenUpload({
                        status: !openUpload?.status,
                        data: item,
                      });
                    }
                    if (
                      item?.batchUploadStatus == null &&
                      item?.source !== "CogentUpload"
                    ) {
                      handleBatchTrigger(item);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {item?.source === "CogentUpload" ? "Upload" : "Trigger"}
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Default cell content
    if (columnItem?.columnActive) {
      return (
        <div
          style={{
            color: item.accountStatus === false ? "gray" : "",
          }}
        >
          {typeof item[columnItem.value] === "boolean" ? (
            <div className="d-flex px-4">
              {item[columnItem.value] ? "True" : "False"}
            </div>
          ) : item[columnItem.actualField] ||
            item[columnItem.actualField] === 0 ? (
            <Tooltip title={item[columnItem.value]}>
              {reusableEllipses({
                str: item[columnItem.actualField],
                count: count || 20,
              })}
            </Tooltip>
          ) : (
            <div>---</div>
          )}
        </div>
      );
    }

    return null;
  };

  // Render checkbox cell
  const renderCheckboxCell = (columnItem, item, colIndex) => {
    return (
      <div className={`${Style.checkBoxDiv} d-flex justify-content-center align-items-center`} style={{ height: '32px' }}>
        {checkBoxLoader ? (
          <Skeleton.Button 
            active 
            size="small" 
            style={{ width: 20, height: 20 }}
            className={Style.spinnerStyle}
          />
        ) : item.status === "FAILED" ? (
          "---"
        ) : (
          <input
            type="checkbox"
            onChange={(e) => {
              e.stopPropagation();
              handleRowCheckboxChange({
                e,
                row: item,
                singleCheck: true,
              });
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            checked={selectedRows?.some(
              (row) => row === item[columnItem.value]
            )}
            id={
              tableId
                ? createIdGen("checkBox" + tableId + colIndex)
                : createIdGen("checkbox" + router.pathname.replaceAll("/", " ") + colIndex)
            }
            className={`${Style.checkBoxBg} ${Style.customChecked}`}
          />
        )}
      </div>
    );
  };

  // Render edit cell
  const renderEditCell = (columnItem, item, colIndex) => {
    return item.accountStatus === true ? (
      <div
        id={
          tableId
            ? createIdGen("edit" + tableId + colIndex)
            : createIdGen(
                "edit" + router.pathname.replaceAll("/", " ") + colIndex
              )
        }
        onClick={(e) => {
          e.stopPropagation();
          handleAction(item);
        }}
      >
        <Popover
          content={content && content(item)}
          title={
            <div className="d-flex justify-content-between align-items-center">
              <span>Change Role</span>
              <CloseCircleOutlined
                className="cr-pointer"
                onClick={onCloseIconClick}
                id={
                  tableId
                    ? createIdGens("closeIcon" + tableId + colIndex)
                    : createIdGens("closeIcon" + colIndex)
                }
              />
            </div>
          }
          placement="bottom"
          trigger="click"
          open={visiblePopoverKey === item.id}
          onOpenChange={(visible) => {
            if (visible) {
              setEditingUser && setEditingUser(item);
              setVisiblePopoverKey(item.id);
              setRole && setRole(selectedRole);
            }
          }}
        >
          <div
            id={
              tableId
                ? createIdGens("editBtn" + tableId + colIndex)
                : createIdGens("edit" + colIndex)
            }
            onClick={() => handleAction(item.id)}
          >
            <FontAwesomeIcon
              icon={faPenToSquare}
              style={{ fontSize: "16px", color: "#0942C4" }}
            />
          </div>
        </Popover>
      </div>
    ) : (
      <div
        id={
          tableId
            ? createIdGen("editDisabled" + tableId + colIndex)
            : createIdGen(
                "editDisabled" + router.pathname.replaceAll("/", " ") + colIndex
              )
        }
      >
        <FontAwesomeIcon
          icon={faPenToSquare}
          style={{ fontSize: "16px", color: "gray" }}
        />
      </div>
    );
  };

  // Render trigger cell
  const renderTriggerCell = (columnItem, item, colIndex) => {
    return item?.isRequestForRetry === true ? (
      <div
        onClick={(e) => {
          e.stopPropagation();
          getRetregger(item);
        }}
        id={
          tableId
            ? createIdGen("trigger" + tableId + colIndex)
            : createIdGen("trigger" + router.pathname.replaceAll("/", " ") + colIndex)
        }
        className="d-flex align-items-center"
        role="button"
        tabIndex={0}
      >
        <FontAwesomeIcon
          icon={faArrowsRotate}
          style={{ fontSize: "large", color: "#df3a3a" }}
        />
      </div>
    ) : null;
  };

  // Render download cell
  const renderDownloadCell = (columnItem, item, colIndex) => {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        id={
          tableId
            ? createIdGen("reportDownload" + tableId + colIndex)
            : createIdGen("reportDownload" + router.pathname.replaceAll("/", " ") + colIndex)
        }
        className="d-flex align-items-start justify-content-start"
      >
        {item.enableDownload ? (
          <Popconfirm
            title="Are you sure you want to download this report?"
            onConfirm={() => handleReportDownload(item.id)}
            okText="Yes"
            cancelText="No"
          >
            <DownloadOutlined
              onClick={(e) => e.stopPropagation()}
              style={{ fontSize: "16px", cursor: "pointer" }}
            />
          </Popconfirm>
        ) : (
          "---"
        )}
      </div>
    );
  };

  // Handle row click
  const handleRowClick = (record, event) => {
    // Check if the click target is an interactive element
    const target = event?.target;
    if (target) {
      // Check if the clicked element or its parent is an interactive element
      const isInteractiveElement = target.closest('button, input, select, textarea, a, [role="button"]');
      if (isInteractiveElement) {
        return; // Don't trigger row click for interactive elements
      }
    }
    
    if (onRowClick) {
      onRowClick(record);
    }
  };

  // Table row class name
  const getRowClassName = (record, index) => {
    let className = `${Style.tbodyRow}`;
    
    if (disableUser && !record?.accountStatus) {
      className += ` ${Style.disableUser}`;
    }
    
    if (activeItem?.id === record?.id) {
      className += ` ${Style.activeRow}`;
    }
    
    if (record?.allocatedTo === "TOTAL") {
      className += ` ${Style.totalRow}`;
    }
    
    return className;
  };

  // Table row style
  const getRowStyle = (record) => {
    const style = { height: "28px" };
    
    if (record?.allocatedTo === "TOTAL") {
      style.backgroundColor = "#cee1fd";
    }
    
    return style;
  };

  // Create skeleton rows for main table loading
  const renderSkeletonRows = () => {
    const skeletonRows = Array.from({ length: row || 15 }, (_, index) => ({
      key: `skeleton-${index}`,
      isSkeleton: true,
    }));
    
    return skeletonRows.map((row, rowIndex) => (
      <tr key={row.key} className={Style.tbodyRow}>
        {antdColumns.map((column, colIndex) => (
          <td key={`skeleton-${rowIndex}-${colIndex}`}>
            <Skeleton.Input 
              active 
              size="small" 
              style={{ width: column.width || 100, height: 20 }}
            />
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="customTable">
      <div
        id={
          tableId
            ? createIdGen("table" + tableId)
            : createIdGen("row" + router.pathname.replaceAll("/", " "))
        }
        className={`${
          tableHeight ? Style.pageContainer1 : Style.pageContainer
        }`}
      >
        <div className={Style.pageContent}>
          <div style={{ overflowX: "auto" }}>
             {loader ? (
               <Table
                 columns={antdColumns.map(col => ({
                   ...col,
                   render: () => <Skeleton.Input active size="small" style={{ width: col.width || 100, height: 20 }} />
                 }))}
                 dataSource={Array.from({ length: row || 15 }, (_, index) => ({ key: `skeleton-${index}` }))}
                 pagination={false}
                 className={`${Style.classTable} ${isReportPage ? Style.scrollIssue : ''}`}
                 scroll={{ x: 'max-content' }}
                 components={{
                   header: {
                     cell: (props) => (
                       <th {...props} style={{ 
                         ...props.style, 
                         borderRight: 'none !important',
                         position: 'relative'
                       }}>
                         <style jsx>{`
                           th::before {
                             display: none !important;
                             content: none !important;
                             width: 0 !important;
                             height: 0 !important;
                           }
                         `}</style>
                         {props.children}
                       </th>
                     )
                   }
                 }}
               />
             ) : (
              <Table
                columns={antdColumns}
                dataSource={data || []}
                pagination={false}
                rowKey={(record, index) => record.id || record.patientId || index}
                onRow={(record, index) => ({
                  onClick: (event) => handleRowClick(record, event),
                  className: getRowClassName(record, index),
                  style: getRowStyle(record),
                })}
                className={`${Style.classTable} ${isReportPage ? Style.scrollIssue : ''}`}
                scroll={{ x: 'max-content' }}
                locale={{
                  emptyText: <Empty />
                }}
                components={{
                header: {
                  cell: (props) => (
                    <th {...props} style={{ 
                      ...props.style, 
                      borderRight: 'none !important',
                      position: 'relative'
                    }}>
                      <style jsx>{`
                        th::before {
                          display: none !important;
                          content: none !important;
                          width: 0 !important;
                          height: 0 !important;
                        }
                      `}</style>
                      {props.children}
                    </th>
                  )
                }
              }}
            />
            )}
          </div>

          {isPagination && (
            <div className="pagination-container">
              <Paginator
                id={
                  tableId
                    ? createIdGen("pagination" + tableId)
                    : createIdGen("pagination" + router.pathname.replaceAll("/", " "))
                }
                first={first}
                rows={row ? row : 15}
                totalRecords={totalRecords}
                onPageChange={onPageChange}
              />
              <div className="total-pages">
                Total count: {totalRecords ? totalRecords : "0"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppTable;
