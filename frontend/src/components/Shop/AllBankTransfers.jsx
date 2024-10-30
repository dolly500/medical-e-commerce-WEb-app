import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDownload } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getAllBankTransfers } from "../../redux/actions/banktransfer";
import Loader from "../Layout/Loader";

const AllBankTransfers = () => {
  const [rows, setRows] = useState([]);
  const { bankTransfers, isLoading } = useSelector(
    (state) => state.bankTransfer || {}
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBankTransfers());
  }, [dispatch]);

  useEffect(() => {
    if (bankTransfers) {
      const updatedRows = bankTransfers.map((item) => ({
        id: item._id,
        email: item.email,
        file: item.file,
      }));
      setRows(updatedRows);
    }
  }, [bankTransfers]);

  const columns = [
    { field: "id", headerName: "Transfer Id", minWidth: 150, flex: 0.7 },
    { field: "email", headerName: "Email", minWidth: 180, flex: 1.2 },
    {
      field: "file",
      headerName: "File",
      minWidth: 180,
      flex: 1.2,
      renderCell: (params) => {
        const image = params.row.file;
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={image}
              alt="Bank Transfer"
              style={{ width: 50, height: 50, marginRight: 10 }}
            />
            <a href={image} download>
              <AiOutlineDownload size={20} />
            </a>
          </div>
        );
      },
    },
  ];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </>
  );
};

export default AllBankTransfers;
