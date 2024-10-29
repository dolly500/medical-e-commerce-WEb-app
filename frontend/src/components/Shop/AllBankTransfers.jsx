import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getAllBankTransfers,
  deleteBankTransfer,
} from "../../redux/actions/banktransfer"; // Import the bankTransfer actions
import Loader from "../Layout/Loader";

const AllBankTransfers = () => {
  const [rows, setRows] = useState([]);
  const { bankTransfers, isLoading } = useSelector(
    (state) => state.bankTransfer || {} // Accessing bankTransfer state
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBankTransfers());
  }, [dispatch]);

  useEffect(() => {
    if (bankTransfers) {
      const updatedRows = bankTransfers.map((item) => ({
        id: item._id,
        email: item.email, // Assuming 'email' is a field in the bank transfer object
        file: item.file, // Assuming 'file' is a field in the bank transfer object
      }));
      setRows(updatedRows);
    }
  }, [bankTransfers]);

  const handleDelete = async (id) => {
    await dispatch(deleteBankTransfer(id));
    window.location.reload();
  };

  const columns = [
    { field: "id", headerName: "Transfer Id", minWidth: 150, flex: 0.7 },
    { field: "email", headerName: "Email", minWidth: 180, flex: 1.2 },
    { field: "file", headerName: "File", minWidth: 180, flex: 1.2 }, // Displaying file information
    {
      field: "Preview",
      headerName: "",
      flex: 0.5,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => {
        const d = params.row.id;
        return (
          <Link to={`/banktransfer/${d}`}> {/* Adjust the link based on your routing */}
            <Button>
              <AiOutlineEye size={20} />
            </Button>
          </Link>
        );
      },
    },
    {
      field: "Delete",
      headerName: "",
      flex: 0.5,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => {
        return (
          <Button onClick={() => handleDelete(params.row.id)}>
            <AiOutlineDelete size={20} />
          </Button>
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
