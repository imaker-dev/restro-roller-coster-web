import React, { useEffect } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch } from "react-redux";
import { fetchTableHistory } from "../../redux/slices/tableSlice";
import { useQueryParams } from "../../hooks/useQueryParams";

const TableHistoryPage = () => {
  const dispatch = useDispatch();
  const { tableId } = useQueryParams();

  useEffect(() => {
    dispatch(fetchTableHistory(tableId));
  }, [tableId]);

  return (
    <div>
      <PageHeader title={"Table History"} description={""} showBackButton />
    </div>
  );
};

export default TableHistoryPage;
