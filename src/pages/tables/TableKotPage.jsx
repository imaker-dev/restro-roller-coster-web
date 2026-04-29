import React, { useEffect } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch } from "react-redux";
import { useQueryParams } from "../../hooks/useQueryParams";
import { fetchTableKot } from "../../redux/slices/tableSlice";

const TableKotPage = () => {
  const dispatch = useDispatch();
  const { tableId } = useQueryParams();

  useEffect(() => {
    dispatch(fetchTableKot(tableId));
  }, [tableId]);

  return (
    <div>
      <PageHeader title={"Table KOT"} description={""} showBackButton />
    </div>
  );
};

export default TableKotPage;
