import Style from "./table.module.css";
import { Empty, Popconfirm, Select, Spin, Switch, Tooltip } from "antd/lib";
import { useRouter } from "next/router";
import { Progress } from "antd/lib";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faCircleXmark,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { LoadingOutlined, WarningOutlined } from "@ant-design/icons/lib";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import ReusablePagination from "../pagination";
import RegularButton from "@/components/button";
import {
  ageCalculate,
  createIdGen,
  priorityOptions,
  priorityStatusRender,
  reusableEllipses,
  tableSkeleton,
} from "@/utils/reusable";
// import sortByimg from "../../../assets/table/sort (4) 8.webp";
// import Image from "next/image";
import { getStorage } from "@/utils/storages";

const CommonTable = ({
  id = "",
  data,
  column,
  count = 25,
  totalLength,
  pageNumber,
  setPageNumber,
  setPaginationFirst,
  loader,
  onRowClick,
  pagination = true,
  disableUser,
  totalPages,
  initialPage,
  activeItem,
  tableHeight,
  pageSize,
  headerCheckbox,
  setHeaderCheckbox,
  handleCheck,
  handleAction,
  handleCheckAll,
  selectedRows,
  setSort,
  sort,
  ellipsesCount,
  checkedLoader,
  accessTabKey,
  activeList,
  setActiveList,
  handleUpload,
  handleTrigger,
  handleisDownload,
  toggleid,
  tinSubTab,
  noHccFound,
  actionDisable,
  blockKeys,
  handleViewDetails,
  handleEducationalErr,
  showEducationalError,
  handlePriority,
}) => {
  const router = useRouter();
  const columnsArr = Array.from({ length: column?.length || 5 });
  const loaderComponent = () =>
    [...Array.from({ length: 5 })]?.map((_, rowIndex) => (
      <tr key={rowIndex}>
        {columnsArr?.map((_, colIndex) => (
          <td
            key={colIndex}
            className={`${
              colIndex === 0
                ? Style.firstTdBorder
                : colIndex === columnsArr.length
                ? Style.lastBorder
                : Style.childBorder
            } `}
          >
            {tableSkeleton({ rows: 1, columns: 1 })}
          </td>
        ))}
      </tr>
    ));
  const emptyComponent = () => (
    <tr>
      <td
        colSpan={columnsArr?.length}
        className={`${Style.firstTdBorder} ${Style.lastBorder} py-2 px-4`}
      >
        <Empty description={noHccFound ? "No HCC Found" : "No data"} />
      </td>
    </tr>
  );

  return (
    <div>
      <div
        className={`${
          tableHeight ? Style.pageContainer1 : Style.pageContainer
        }`}
        id={createIdGen(`table${id || router.pathname.replaceAll(" ")}`)}
        data-testid={createIdGen(
          `table${id || router.pathname.replaceAll("/", " ")}`
        )}
      >
        {!pagination ? (
          <div className={Style.tableWrapper}>
            <table className={Style.nopaginationContainer}>
              <thead className={Style.classThead}>
                <tr>
                  {column?.map((item, index) => (
                    <TableHeadItem
                      item={item}
                      headerCheckbox={headerCheckbox}
                      setHeaderCheckbox={setHeaderCheckbox}
                      handleCheckAll={handleCheckAll}
                      setSort={setSort}
                      sort={sort}
                      checkedLoader={checkedLoader}
                      id={id}
                      router={router}
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                {loader
                  ? loaderComponent()
                  : data?.length > 0
                  ? data?.map((item, index) => (
                      <TableRow
                        id={id}
                        item={item}
                        column={column}
                        count={count}
                        onRowClick={onRowClick}
                        disableUser={disableUser}
                        rowBackground={index % 2 === 0 ? "" : "#EAF0F5"}
                        activeItem={activeItem}
                        handleCheck={handleCheck}
                        colIndex={index}
                        handleAction={handleAction}
                        selectedRows={selectedRows}
                        ellipsesCount={ellipsesCount}
                        checkedLoader={checkedLoader}
                        accessTabKey={accessTabKey}
                        activeList={activeList}
                        setActiveList={setActiveList}
                        handleUpload={handleUpload}
                        handleTrigger={handleTrigger}
                        handleisDownload={handleisDownload}
                        router={router}
                        toggleid={toggleid}
                        tinSubTab={tinSubTab}
                        actionDisable={actionDisable}
                        blockKeys={blockKeys}
                        handleViewDetails={handleViewDetails}
                        handleEducationalErr={handleEducationalErr}
                        showEducationalError={showEducationalError}
                        handlePriority={handlePriority}
                      />
                    ))
                  : emptyComponent()}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={Style.pageContent}>
            <table className={`${Style.classTable} `}>
              <thead className={Style.classThead}>
                <tr>
                  {column?.map((item, index) => (
                    <TableHeadItem
                      item={item}
                      headerCheckbox={headerCheckbox}
                      setHeaderCheckbox={setHeaderCheckbox}
                      handleCheckAll={handleCheckAll}
                      setSort={setSort}
                      sort={sort}
                      checkedLoader={checkedLoader}
                      id={id}
                      router={router}
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                {loader
                  ? loaderComponent()
                  : data?.length > 0
                  ? data?.map((item, index) => (
                      <TableRow
                        item={item}
                        column={column}
                        count={count}
                        onRowClick={onRowClick}
                        disableUser={disableUser}
                        rowBackground={index % 2 == 0 ? "" : "#EAF0F5"}
                        activeItem={activeItem}
                        handleCheck={handleCheck}
                        colIndex={index}
                        handleAction={handleAction}
                        selectedRows={selectedRows}
                        ellipsesCount={ellipsesCount}
                        checkedLoader={checkedLoader}
                        accessTabKey={accessTabKey}
                        activeList={activeList}
                        setActiveList={setActiveList}
                        handleUpload={handleUpload}
                        handleTrigger={handleTrigger}
                        handleisDownload={handleisDownload}
                        id={id}
                        router={router}
                        toggleid={toggleid}
                        tinSubTab={tinSubTab}
                        actionDisable={actionDisable}
                        blockKeys={blockKeys}
                        handleEducationalErr={handleEducationalErr}
                        showEducationalError={showEducationalError}
                        handleViewDetails={handleViewDetails}
                        handlePriority={handlePriority}
                      />
                    ))
                  : emptyComponent()}
              </tbody>
            </table>
          </div>
        )}
        {pagination
          ? !loader && (
              <div className={`${Style.paginationContainer}`}>
                <ReusablePagination
                  totalLength={totalLength}
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                  setPaginationFirst={setPaginationFirst}
                  totalPages={totalPages}
                  initialPage={initialPage}
                  pageSize={pageSize}
                />
              </div>
            )
          : null}
      </div>
    </div>
  );
};

const TableHeadItem = ({
  id = "",
  item,
  headerCheckbox,
  handleCheckAll,
  sort,
  checkedLoader,
  setSort,
  router = { router },
}) => {
  if (item?.checkBox && !item?.onlyBodyCheckBox) {
    return (
      <th className="text-start text-truncate" style={{ width: "80px" }}>
        <div className="d-flex">
          {checkedLoader ? (
            <Spin indicator={<LoadingOutlined />} style={{ color: "#ffff" }} />
          ) : (
            <input
              type="checkbox"
              checked={headerCheckbox}
              onChange={(e) => handleCheckAll(e.target.checked)}
              className={`cr-pointer d-flex justify-content-center align-items-center ${Style.headerChecked}`}
              id="table-checkbox"
              data-testid="table-checkbox"
              disabled={checkedLoader}
            />
          )}
          <label
            htmlFor="table-checkbox"
            className="d-flex justify-content-center align-items-center px-2"
          >
            {item?.name}
          </label>
        </div>
      </th>
    );
  } else if (item?.sortable) {
    return (
      <th className="text-start text-truncate">
        {/* {item.name} */}
        {reusableEllipses({
          str: item.name,
          count: 15,
        }) || "--"}
        {/* <Image
          src={sortByimg}
          alt="sort"
          width={15}
          height={15}
          className="cr-pointer mx-1"
          onClick={() => {
            if (setSort) {
              setSort((prev) => ({
                ...prev,
                sortField: item?.name,
                sortDir: sort?.sortDir === "ASC" ? "DESC" : "ASC",
              }));
            }
          }}
        /> */}
      </th>
    );
  }
  return (
    <th
      className="text-start text-truncate"
      style={{ width: item?.checkBox && "70px" }}
    >
      {item.name}
    </th>
  );
};
const TableRow = ({
  id = "",
  item,
  column,
  onRowClick,
  disableUser,
  rowBackground,
  activeItem,
  handleCheck,
  handleAction,
  selectedRows,
  ellipsesCount,
  checkedLoader,
  accessTabKey,
  activeList,
  handleUpload,
  handleTrigger,
  handleisDownload,
  setActiveList,
  colIndex,
  router = { router },
  toggleid,
  tinSubTab,
  actionDisable,
  blockKeys,
  handleViewDetails,
  showEducationalError,
  handleEducationalErr,
  handlePriority,
}) => {
  const handleToggle = (name, item, active) => {
    setActiveList((pre) => {
      return { ...pre, [name]: !active };
    });
    handleAction(item, "toggle");
  };
  return (
    <tr
      onClick={(e) => {
        e.stopPropagation();
        if (onRowClick) onRowClick(item);
      }}
      className={`${disableUser && !item?.accountStatus && Style.disableUser} ${
        Style.tbodyRow
      } ${activeItem?.id === item?.id ? Style.activeRow : ""} text-start`}
      style={{ backgroundColor: rowBackground }}
      id={createIdGen(
        `row${id || router.pathname.replaceAll("/", " ")}${colIndex}`
      )}
      data-testid={createIdGen(
        `row${id || router.pathname.replaceAll("/", " ")}${colIndex}`
      )}
    >
      {column?.map((columnItem, index) => {
        if (columnItem.firstNameLastName) {
          const { firstName, lastName } =
            item[columnItem?.value?.key]?.[columnItem?.value?.accessName] || {};
          //  const { firstName, lastName } = item[`${columnItem.value}`]||{};

          if (columnItem.dtoAccess) {
            const { firstName = "", lastName = "" } =
              item[columnItem.value][columnItem.value1] || {};
            return (
              <td
                className={
                  index === 0
                    ? `${Style.firstTdBorder} `
                    : column.length - 1 === index
                    ? `${Style.lastBorder} `
                    : `${Style.childBorder} `
                }
              >
                {firstName || lastName ? (
                  <div className="d-flex align-items-center">
                    {firstName} &nbsp;
                    {lastName}
                  </div>
                ) : (
                  <div>---</div>
                )}
              </td>
            );
          }

          return (
            <td
              className={
                index === 0
                  ? `${Style.firstTdBorder} `
                  : column.length - 1 === index
                  ? `${Style.lastBorder} `
                  : `${Style.childBorder} `
              }
            >
              {columnItem?.value?.key &&
                (columnItem?.value?.key ? (
                  <div className="d-flex align-items-center">
                    {firstName || "--"} &nbsp;
                    {lastName || "--"}
                  </div>
                ) : (
                  <div>---</div>
                ))}
              {!columnItem?.value?.key &&
                (columnItem?.value ? (
                  <div className="d-flex align-items-center">
                    {item[`${columnItem.value}`]?.firstName || "--"} &nbsp;
                    {item[`${columnItem.value}`]?.lastName || "--"}
                  </div>
                ) : (
                  <div>---</div>
                ))}
              {/* {(item[`${columnItem.value}`] &&
                item[`${columnItem.value}`]?.firstName) ||
              item[`${columnItem.value}`]?.lastName ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  {item[`${columnItem.value}`]?.firstName}{" "}
                  {item[`${columnItem.value}`]?.lastName}
                </div>
              ) : (
                <div>---</div>
              )} */}
            </td>
          );
        }
        if (columnItem.getDtoNames) {
          return (
            <td
              className={
                index === 0
                  ? `${Style.firstTdBorder} `
                  : column.length - 1 === index
                  ? `${Style.lastBorder} `
                  : `${Style.childBorder} `
              }
            >
              {item[`${columnItem.value.key}`] ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  {reusableEllipses({
                    str: item[`${columnItem.value.key}`][
                      columnItem.value.accessName
                    ],
                    ellipsesCount,
                  })}
                </div>
              ) : (
                <div>---</div>
              )}
            </td>
          );
        }
        if (columnItem.accessTabBased) {
          if (columnItem.dtoAccessKey) {
            return (
              <td
                className={
                  index === 0
                    ? `${Style.firstTdBorder} px-4 py-2`
                    : column.length - 1 === index
                    ? `${Style.lastBorder} px-4 py-2`
                    : `${Style.childBorder} px-4 py-2`
                }
              >
                {item[columnItem.dtoAccessKey][columnItem.value] ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {reusableEllipses({
                      str: item[columnItem.dtoAccessKey][columnItem.value],
                      ellipsesCount,
                    })}
                  </div>
                ) : (
                  <div>0</div>
                )}
              </td>
            );
          }

          return (
            <td
              className={
                index === 0
                  ? `${Style.firstTdBorder} px-4 py-2`
                  : column.length - 1 === index
                  ? `${Style.lastBorder} px-4 py-2`
                  : `${Style.childBorder} px-4 py-2`
              }
            >
              {item[accessTabKey] ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  {reusableEllipses({
                    str: item[accessTabKey][columnItem.value],
                    ellipsesCount,
                  })}
                </div>
              ) : (
                <div>---</div>
              )}
            </td>
          );
        }
        if (columnItem.getTotals) {
          const getTotal = () => {
            let total = 0;
            if (item[columnItem.dtoAccessKey]) {
              columnItem?.value?.map(
                (value) => (total += item[columnItem.dtoAccessKey][value] || 0)
              );
            }
            return total;
          };

          return (
            <td
              className={
                index === 0
                  ? `${Style.firstTdBorder} px-4 py-2`
                  : column.length - 1 === index
                  ? `${Style.lastBorder} px-4 py-2`
                  : `${Style.childBorder} px-4 py-2`
              }
            >
              {item[columnItem.dtoAccessKey] ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  {getTotal()}
                </div>
              ) : (
                <div>0</div>
              )}
            </td>
          );
        }
        if (columnItem.checkBox) {
          return (
            <td
              className={
                index === 0
                  ? `${Style.firstTdBorder} `
                  : column.length - 1 === index
                  ? `${Style.lastBorder} `
                  : `${Style.childBorder} `
              }
              style={{ width: "70px" }}
              onClick={(e) => e.stopPropagation()}
            >
              {checkedLoader ? (
                <Spin
                  indicator={<LoadingOutlined />}
                  style={{ color: "#2c3e50" }}
                />
              ) : (
                <input
                  type="checkbox"
                  checked={selectedRows?.some(
                    (info) => info?.patientId === item[columnItem.value]
                  )}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleCheck(item);
                  }}
                  className={`cr-pointer d-flex justify-content-center align-items-center ${Style.customChecked}`}
                  id={
                    id
                      ? createIdGen("checkbox " + id + colIndex)
                      : createIdGen(
                          "checkbox" +
                            router.pathname.replaceAll("/", " ") +
                            colIndex
                        )
                  }
                  data-testid={
                    id
                      ? createIdGen("checkbox " + id + colIndex)
                      : createIdGen(
                          "checkbox" +
                            router.pathname.replaceAll("/", " ") +
                            colIndex
                        )
                  }
                />
              )}
            </td>
          );
        }
        if (columnItem?.isActions) {
          const isAdmin = getStorage("userRole") === "ADMIN";

          const deleteIcon = (
            <div
              className={`${
                (isAdmin || actionDisable) && blockKeys
                  ? "pointer-events-none opacity-50 cursor-not-allowed"
                  : "cr-pointer"
              }`}
              id={createIdGen(
                `delete${
                  id || router.pathname.replaceAll("/", " ")
                } ${colIndex}`
              )}
              data-testid={createIdGen(
                `delete${
                  id || router.pathname.replaceAll("/", " ")
                } ${colIndex}`
              )}
            >
              <FontAwesomeIcon
                icon={faCircleXmark}
                className={`mx-2 ${Style.cross}`}
                style={{ color: "red" }}
              />
            </div>
          );

          return (
            <td
              className={`${
                index === 0
                  ? `${Style.firstTdBorder} `
                  : column.length - 1 === index
                  ? `${Style.lastBorder} `
                  : `${Style.childBorder} `
              } commonTableAction`}
            >
              <div className="d-flex gap-1 justify-content-start align-items-enter">
                {columnItem?.isEditAction && (
                  <div
                    className={`${
                      (isAdmin || actionDisable) && blockKeys
                        ? "pointer-events-none opacity-50 cursor-not-allowed"
                        : "cr-pointer"
                    } d-flex align-items-center mx-2`}
                    onClick={(e) => {
                      if ((isAdmin || actionDisable) && blockKeys) return;
                      e.stopPropagation();
                      handleAction(item, "edit");
                    }}
                    id={
                      id
                        ? createIdGen(`edit ${id} ${colIndex}`)
                        : createIdGen(
                            `edit${router.pathname.replaceAll(
                              "/",
                              " "
                            )} ${colIndex}`
                          )
                    }
                    data-testid={
                      id
                        ? createIdGen(`edit ${id} ${colIndex}`)
                        : createIdGen(
                            `edit${router.pathname.replaceAll(
                              "/",
                              " "
                            )} ${colIndex}`
                          )
                    }
                  >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className={Style.editIcon}
                    />
                  </div>
                )}
                {columnItem?.isUploadAction && (
                  <div
                    className={`${
                      (isAdmin || actionDisable) && blockKeys
                        ? "pointer-events-none opacity-50 cursor-not-allowed"
                        : "cr-pointer"
                    } d-flex align-items-center mx-2`}
                    onClick={(e) => {
                      if ((isAdmin || actionDisable) && blockKeys) return;
                      e.stopPropagation();
                      handleAction(item, "edit");
                    }}
                    id={
                      id
                        ? createIdGen(`edit ${id} ${colIndex}`)
                        : createIdGen(
                            `edit${router.pathname.replaceAll(
                              "/",
                              " "
                            )} ${colIndex}`
                          )
                    }
                    data-testid={
                      id
                        ? createIdGen(`edit ${id} ${colIndex}`)
                        : createIdGen(
                            `edit${router.pathname.replaceAll(
                              "/",
                              " "
                            )} ${colIndex}`
                          )
                    }
                  >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className={Style.editIcon}
                    />
                  </div>
                )}
                {columnItem?.isDeleteAction &&
                  ((isAdmin || actionDisable) && blockKeys ? (
                    deleteIcon
                  ) : (
                    <Popconfirm
                      title={
                        showEducationalError ? (
                          <>
                            Are you sure you want to delete?
                            {(getStorage("userRole") == "CODER_2" ||
                              getStorage("userRole") == "QA") && (
                              <section className="col-12 d-flex mt-2">
                                <input
                                  type={"checkbox"}
                                  className={`cr-pointer ${Style.customChecked}`}
                                  onChange={handleEducationalErr}
                                />

                                <div className="d-flex justify-content-center align-items-top mx-2">
                                  Mark as Educational Error
                                </div>
                              </section>
                            )}
                          </>
                        ) : (
                          "Are you sure you want to delete?"
                        )
                      }
                      okText="Yes"
                      cancelText="No"
                      onConfirm={() => handleAction(item, "delete")}
                      placement="bottom"
                    >
                      {deleteIcon}
                    </Popconfirm>
                  ))}
                {columnItem?.isToggle && (
                  <div
                    className="cr-pointer"
                    id={
                      id
                        ? createIdGen(`toggle ${id} ${colIndex}`)
                        : createIdGen(
                            `toggle${router.pathname.replaceAll(
                              "/",
                              " "
                            )} ${colIndex}`
                          )
                    }
                    data-testid={
                      id
                        ? createIdGen(`toggle ${id} ${colIndex}`)
                        : createIdGen(
                            `toggle${router.pathname.replaceAll(
                              "/",
                              " "
                            )} ${colIndex}`
                          )
                    }
                  >
                    <Switch
                      checkedChildren="Active"
                      unCheckedChildren="Inactive"
                      className={Style.toggle}
                      checked={activeList[item[columnItem.value]]}
                      disabled={toggleid?.includes(item.id)}
                      onChange={(checked, event) => {
                        event?.stopPropagation();
                        handleToggle(
                          item[columnItem.value],
                          item,
                          activeList[item[columnItem.value]]
                        );
                      }}
                    />
                  </div>
                )}
              </div>
            </td>
          );
        }
        if (columnItem?.isPriority) {
          const value = item[columnItem.value] ? item[columnItem.value] : null;
          console.log(value);
          return (
            <td
              className={`${
                index == 0
                  ? Style.firstTdBorder
                  : column.length - 1 == index
                  ? Style.lastBorder
                  : Style.childBorder
              } px-0`}
              onClick={(e) => e.stopPropagation()}
            >
              <Select
                value={value}
                onChange={(value) => handlePriority(value, item)}
                onMouseDown={(e) => e.stopPropagation()}
                options={priorityWithIcon}
                style={{ width: "90%" }}
              />
            </td>
          );
        }
       
        if (columnItem?.processedStatusCount) {
          const countMap = item?.processedStatusCount || {};
          const mainValue = countMap[columnItem.value];
          if (mainValue)
            return (
              <td
                className={`${
                  index == 0
                    ? Style.firstTdBorder
                    : column.length - 1 == index
                    ? Style.lastBorder
                    : Style.childBorder
                } px-4`}
              >
                {mainValue > 0 ? `${mainValue}` : "0"}
              </td>
            );
          const fallbackKeys = [
            columnItem?.value1,
            columnItem?.value2,
            columnItem?.value3,
            columnItem?.value4,
          ];

          const total = fallbackKeys.reduce((sum, key) => {
            return sum + (countMap[key] || 0);
          }, 0);
          return (
            <td
              className={`${
                index == 0
                  ? Style.firstTdBorder
                  : column.length - 1 == index
                  ? Style.lastBorder
                  : Style.childBorder
              } px-4`}
            >
              {total > 0 ? `${total}` : "0"}
            </td>
          );
        }
        if (columnItem?.clumpseTinTwoFields) {
          return (
            <td
              className={`${
                index == 0
                  ? Style.firstTdBorder
                  : column.length - 1 == index
                  ? Style.lastBorder
                  : Style.childBorder
              } px-4`}
            >
              <div>
                {reusableEllipses({
                  str: item[columnItem.value1],
                  count: 10,
                }) || "--"}
              </div>
              <div>
                {item[columnItem.value2]
                  ? dayjs(item[columnItem?.value2]).format("MM/DD/YYYY")
                  : "--"}
              </div>
            </td>
          );
        }
        if (columnItem?.name === "Age") {
          return (
            <td
              className={
                index === 0
                  ? `${Style.firstTdBorder} `
                  : column.length - 1 === index
                  ? `${Style.lastBorder} `
                  : `${Style.childBorder} `
              }
            >
              {ageCalculate(item["dob"])}
            </td>
          );
        }
        if (columnItem?.showProviderDetails) {
          return (
            <td
              className={
                index === 0
                  ? `${Style.firstTdBorder} `
                  : column.length - 1 === index
                  ? `${Style.lastBorder} `
                  : `${Style.childBorder} `
              }
            >
              <span>{`${
                item[columnItem?.value?.key]?.[columnItem?.value?.accessName]
                  ?.firstName || "--"
              } ${
                item[columnItem?.value?.key]?.[columnItem?.value?.accessName]
                  ?.lastName || "--"
              }`}</span>
            </td>
          );
        }
        if (columnItem?.isUpload || columnItem?.isTrigger || columnItem?.isDownload) {
          return (
            <td
              className={`${
                index === 0
                  ? `${Style.firstTdBorder} `
                  : column.length - 1 === index
                  ? `${Style.lastBorder} `
                  : `${Style.childBorder} `
              }`}
            >
              <section className="d-flex">
                <div
                  className="d-flex align-items-center rounded mx-2 px-4"
                  style={{ border: "1px solid #263e50" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpload(item);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faArrowUpFromBracket}
                    className={`${Style.arrow}`}
                  />
                </div>
                {columnItem?.isTrigger && (
                  <RegularButton
                    name="Trigger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTrigger(item);
                    }}
                    type={"outline"}
                  />
                )}
                {columnItem?.isDownload && (
                  <RegularButton
                    name="Download"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleisDownload(item);
                    }}
                    type={"outline"}
                  />
                )}
              </section>
            </td>
          );
        }
        if (columnItem?.viewProject || columnItem?.viewTaxId) {
          const role = getStorage("userRole");
          return (
            <td
              className={
                index === 0
                  ? `${Style.firstTdBorder} `
                  : column.length - 1 === index
                  ? `${Style.lastBorder} `
                  : `${Style.childBorder} `
              }
            >
              <RegularButton
                name={columnItem?.viewProject ? "View Details" : "View Tax Id"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(
                    item,
                    columnItem?.viewProject ? true : false
                  );
                }}
                bg="#263E50"
                color="#fff"
                outlined={true}
                id={createIdGen(`${role} project viewDetailsButton`)}
              />
            </td>
          );
        }
        if (
          tinSubTab &&
          (columnItem?.qualityCalculation || columnItem?.qualityUsernameDTO)
        ) {
          const resObj =
            tinSubTab?.Tin === "Quality" && tinSubTab?.subTab === "Coder 1"
              ? "coder1Accuracy"
              : "coder2Accuracy";
          const userNameDTO =
            resObj === "coder1Accuracy"
              ? "coder1Allocation"
              : "coder2Allocation";
          const accuracyValue = item?.coderAccuracy
            ? item.coderAccuracy[resObj]
            : null;
          return (
            <td
              className={
                index === 0
                  ? `${Style.firstTdBorder} `
                  : column.length - 1 === index
                  ? `${Style.lastBorder} `
                  : `${Style.childBorder} `
              }
            >
              {columnItem?.qualityUsernameDTO &&
                reusableEllipses({
                  str: item[userNameDTO]?.allocatedTo,
                  count: 10,
                })}
              {columnItem?.qualityCalculation &&
                (accuracyValue
                  ? reusableEllipses({
                      str: accuracyValue[columnItem?.value],
                      count: 10,
                    })
                  : "--")}
            </td>
          );
        }
        if (columnItem?.showComments) {
          const role = getStorage("userRole");
          let reason = null;

          if (role === "OWNER" || role == "QA_LEAD") {
            const allocation = item?.qaAllocation ?? item?.coder2Allocation;
            reason = allocation?.reAssign?.reassignedReason;
          } else if (role === "QA") {
            const allocation = item?.qaAllocation;
            const reviewReason = allocation?.reAssign?.reviewReason;
            const reassignedReason = allocation?.reAssign?.reassignedReason;
            const processedStatus = allocation?.processedStatus;
            if (reviewReason) {
              reason = reviewReason;
            } else if (
              reassignedReason &&
              ["QA_QUERIED", "QA_RE_ASSIGNED", "QA_COMPLETED"].includes(
                processedStatus
              )
            ) {
              reason = null;
            } else {
              reason = reassignedReason;
            }
            // if (allocation?.reAssign?.reviewReason) {
            //   reason = allocation?.reAssign?.reviewReason;
            // } else if (
            //   allocation?.reAssign?.reassignedReason &&
            //   (allocation?.processedStatus === "QA_QUERIED" ||
            //     allocation?.processedStatus === "QA_RE_ASSIGNED" ||
            //     allocation?.processedStatus === "QA_COMPLETED")
            // ) {
            //   reason = null;
            // } else {
            //   reason = allocation?.reAssign?.reassignedReason;
            // }
          } else if (role === "CODER_1") {
            const allocation = item?.coder2Allocation;
            reason = allocation?.reAssign?.reassignedReason;
          } else if (role === "CODER_2") {
            const allocation = item?.qaAllocation ?? item?.coder2Allocation;
            const reviewReason = allocation?.reAssign?.reviewReason;
            const reassignedReason = allocation?.reAssign?.reassignedReason;
            const processedStatus = allocation?.processedStatus;
            if (reviewReason) {
              reason = reviewReason;
            } else if (
              reassignedReason &&
              [
                "CODER_2_QUERIED",
                "CODER_2_RE_ASSIGNED",
                "CODER_2_COMPLETED",
              ].includes(processedStatus)
            ) {
              reason = null;
            } else {
              reason = reassignedReason;
            }
          }

          return (
            <td
              className={
                index === 0
                  ? `${Style.firstTdBorder} `
                  : column.length - 1 === index
                  ? `${Style.lastBorder} `
                  : `${Style.childBorder} `
              }
            >
              {/* {item?.qaAllocation?.reAssign?.reviewStatus===="APPROVED"} */}
              {/* {item?.processedStatus?.split("_")?.includes("QUERIED") ? ( */}
              {reason ? (
                <div
                  id={
                    id
                      ? createIdGen(`message ${id} ${colIndex}`)
                      : createIdGen(
                          `message${router.pathname.replaceAll(
                            "/",
                            " "
                          )} ${colIndex}`
                        )
                  }
                  data-testid={
                    id
                      ? createIdGen(`message ${id} ${colIndex}`)
                      : createIdGen(
                          `message${router.pathname.replaceAll(
                            "/",
                            " "
                          )} ${colIndex}`
                        )
                  }
                >
                  <FontAwesomeIcon
                    icon={faMessage}
                    className={`d-flex align-items-center ${Style.message}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction(item, "message");
                    }}
                  />
                </div>
              ) : (
                "--"
              )}
            </td>
          );
        }
        if (columnItem?.customValueDTO || columnItem?.customValueDTO2) {
          const statusList =
            columnItem?.customValueDTO2 &&
            item?.qaAllocation?.reAssign?.reviewStatus
              ? columnItem?.customValueDTO2
              : columnItem?.customValueDTO;
          // item?.qaAllocation?.processedStatus === "QA_QUERIED"
          //   ? "queryRaisedByQaUserNameDto"
          //   : "queryRaisedByCoder2UserNameDto";
          return (
            <td
              className={
                index === 0
                  ? `${Style.firstTdBorder} `
                  : column.length - 1 === index
                  ? `${Style.lastBorder} `
                  : `${Style.childBorder} `
              }
            >
              <div>{`${item[statusList]?.nameDetail?.firstName || "--"} ${
                item[statusList]?.nameDetail?.lastName || "--"
              }`}</div>
            </td>
          );
        }
        if (columnItem?.queriedCustomStatus) {
          return (
            <td
              className={
                index === 0
                  ? `${Style.firstTdBorder} `
                  : column.length - 1 === index
                  ? `${Style.lastBorder} `
                  : `${Style.childBorder} `
              }
            >
              <div>
                {item?.qaAllocation?.reAssign?.reviewStatus === "APPROVED"
                  ? "QA"
                  : "Coder 1"}
              </div>
            </td>
          );
        }
        if (columnItem?.coderStatus) {
          return (
            <td
              className={
                index === 0
                  ? `${Style.firstTdBorder} `
                  : column.length - 1 === index
                  ? `${Style.lastBorder} `
                  : `${Style.childBorder} `
              }
            >
              {item?.[columnItem?.coderStatus]?.processedStatus
                ? item?.[columnItem?.coderStatus]?.processedStatus.replaceAll(
                    "_",
                    " "
                  )
                : "--"}
            </td>
          );
        }
        if (columnItem?.timeline) {
          return (
            <td
              className={
                index === 0
                  ? `${Style.firstTdBorder} `
                  : column.length - 1 === index
                  ? `${Style.lastBorder} `
                  : `${Style.childBorder} `
              }
            >
              {item?.[columnItem.value]?.toString()
                ? reusableEllipses({
                    str: item?.[columnItem?.value].toString(),
                    count: ellipsesCount,
                  })
                : "---"}
            </td>
          );
        }
        if (columnItem?.roasterComments) {
          return (
            <td
              className={
                index === 0
                  ? `${Style.firstTdBorder} `
                  : column.length - 1 === index
                  ? `${Style.lastBorder} `
                  : `${Style.childBorder} `
              }
            >
              {item?.failedReason ? (
                <div
                  id={
                    id
                      ? createIdGen(`failedMessage ${id} ${colIndex}`)
                      : createIdGen(
                          `failedMessage${router.pathname.replaceAll(
                            "/",
                            " "
                          )} ${colIndex}`
                        )
                  }
                  data-testid={
                    id
                      ? createIdGen(`failedMessage ${id} ${colIndex}`)
                      : createIdGen(
                          `failedMessage${router.pathname.replaceAll(
                            "/",
                            " "
                          )} ${colIndex}`
                        )
                  }
                >
                  <FontAwesomeIcon
                    icon={faMessage}
                    className={`d-flex align-items-center ${Style.message}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction(item, "failedMessage");
                    }}
                  />
                </div>
              ) : (
                "--"
              )}
            </td>
          );
        }
        if (columnItem?.showProviderStatus) {
          return (
            <td
              className={
                index === 0
                  ? `${Style.firstTdBorder} `
                  : column.length - 1 === index
                  ? `${Style.lastBorder} `
                  : `${Style.childBorder} `
              }
            >
              {item?.[columnItem.value]?.toString() ? (
                <section className="d-flex align-items-center">
                  <div
                    style={{
                      background: item?.[columnItem.value]
                        ? "#05C41B"
                        : "#FAA70E",
                      borderRadius: "50%",
                      width: "10px",
                      height: "10px",
                    }}
                    className="d-flex align-items-center justify-content-center mx-2"
                  ></div>
                  {item?.[columnItem.value] ? "Active" : "Inactive"}
                </section>
              ) : (
                "---"
              )}
            </td>
          );
        }
        if (columnItem?.isLength) {
          return (
            <td
              className={
                index === 0
                  ? `${Style.firstTdBorder} `
                  : column.length - 1 === index
                  ? `${Style.lastBorder} `
                  : `${Style.childBorder} `
              }
            >
              {item?.[columnItem.value]?.length ? (
                <>{item?.[columnItem.value]?.length}</>
              ) : (
                "0"
              )}
            </td>
          );
        }
        if (columnItem?.isStatus) {
          return (
            <td 
              className={
                index === 0
                  ? `${Style.firstTdBorder} `
                  : column.length - 1 === index
                  ? `${Style.lastBorder} `
                  : `${Style.childBorder} `
              }
            >
              {item?.[columnItem.value] ? (
                <>
                  {item?.[columnItem.value] == "PROCESSING"
                    ? "AI PROCESSING"
                    : item?.[columnItem.value]}
                </>
              ) : (
                "---"
              )}
            </td>
          );
        }
        if (columnItem?.isShowEducationalErr) {
          return (
            <td
              className={
                index === 0
                  ? `${Style.firstTdBorder} `
                  : column.length - 1 === index
                  ? `${Style.lastBorder} `
                  : `${Style.childBorder} `
              }
            >
              {item?.isEducationalError ? (
                <Tooltip title="Educational Error" placement="topLeft">
                  <WarningOutlined
                    style={{
                      color: "orange",
                      fontWeight: "600",
                      fontSize: "18px",
                    }}
                    className="px-2"
                  />
                </Tooltip>
              ) : (
                ""
              )}
            </td>
          );
        }
        return (
          <td
            className={
              index === 0
                ? `${Style.firstTdBorder} `
                : column.length - 1 === index
                ? `${Style.lastBorder} `
                : `${Style.childBorder} `
            }
          >
            {columnItem.isProgress ? (
              <div className="w-75">
                <Progress
                  percent={item[columnItem.value]}
                  strokeColor="#263E50"
                />
              </div>
            ) : typeof item[columnItem.value] === "boolean" ? (
              <div className="d-flex px-4">
                {item[columnItem.value].toString() ? "True" : "False"}
              </div>
            ) : item[columnItem.value] || item[columnItem.value] === 0 ? (
              columnItem?.isFormateDate ? (
                dayjs(item[columnItem.value]).format("MM/DD/YYYY")
              ) : (
                reusableEllipses({
                  str: item[columnItem.value].toString().replaceAll("_", " "),
                  count: ellipsesCount,
                })
              )
            ) : (
              <div>---</div>
            )}
          </td>
        );
      })}
    </tr>
  );
};

export default CommonTable;
