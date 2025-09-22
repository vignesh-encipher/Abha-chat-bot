import { Empty } from "antd/lib";
import Style from "./table.module.css";
import ReusablePagination from "@/components/pagination";
import { reusableEllipses, tableSkeleton } from "@/utils/reusable";

const CommonTable = ({
  data,
  column,
  totalLength,
  pageNumber,
  setPageNumber,
  setPaginationFirst,
  loader,
  pagination = true,
  totalPages,
  initialPage,
  tableHeight,
  pageSize,
  ellipsesCount,
}) => {
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
    <tr >
      <td
        colSpan={columnsArr?.length}
        className={`${Style.emptyFirstTdBorder} py-2 px-4`}
      >
        <Empty />
      </td>
    </tr>
  );

  return (
    <div>
      <div
        className={`${
          tableHeight ? Style.pageContainer1 : Style.pageContainer
        }`}
      >
        <div className={Style.tableWrapper}>
          <table className={Style.nopaginationContainer}>
            <thead className={Style.classThead}>
              <tr>
                {column?.map((item, index) => (
                  <th className={`text-start ${Style.tableHeader}`}>{item.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`${Style.tableBody}`}>
              {loader
                ? loaderComponent()
                : data?.length > 0
                ? data?.map((item, index) => (
                    <tr>
                      {column?.map((columnItem, index) => (
                        <td
                          className={
                            index === 0
                              ? `${Style.firstTdBorder} `
                              : column.length - 1 === index
                              ? `${Style.lastBorder} `
                              : `${Style.childBorder} `
                          }
                        >
                          {reusableEllipses({
                            str: item[columnItem.value].toString(),
                            count: ellipsesCount,
                          })}
                        </td>
                      ))}
                    </tr>
                  ))
                : emptyComponent()}
            </tbody>
          </table>
        </div>

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

export default CommonTable;
