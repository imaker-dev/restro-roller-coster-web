import React, { useEffect } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch } from "react-redux";
import { useQueryParams } from "../../hooks/useQueryParams";
import { fetchTableReport } from "../../redux/slices/tableSlice";

const TableReportPage = () => {
  const dispatch = useDispatch();
  const { tableId } = useQueryParams();

  useEffect(() => {
    dispatch(fetchTableReport(tableId));
  }, [tableId]);

  return (
    <div>
      <PageHeader title={"Table Report"} description={""} showBackButton />
    </div>
  );
};

export default TableReportPage;
