import { TableContainer, Table, TableHead, TableBody, TableCell, TablePagination, TableRow, TableFooter, Paper, Button } from '@mui/material'
import Empty from '@/components/global/Empty'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

const DataTable = ({ titleList, dataList, align }) => {
  const [tableRows, setTableRows] = useState([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [willShowList, setWillShowList] = useState([])

  // 页码变化或条数变化时重新截取数组
  const sliceDataList = () => {
    setWillShowList(dataList.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
  }

  // 页码变化
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // 每页要显示的条数变化
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  useEffect(() => {
    sliceDataList()
  }, [page])

  useEffect(() => {
    if(page !== 0) {
      setPage(0);
    } else {
      sliceDataList()
    }
  }, [rowsPerPage])

  // 根据数组创建tableRow
  function createRows() {
    const rows = willShowList.map((item, index) => {
      const ceils = titleList.map((ceil, idx) => {
        if (ceil.title.includes('时间')) {
          return (
            <TableCell key={idx} align={align || 'center'}>{dayjs(item[ceil.key]).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
          )
        }
        if (ceil.key != 'operate') {
          return (
            <TableCell key={idx} align={align || 'center'}>{item[ceil.key]}</TableCell>
          )
        } else {
          return (
            <TableCell key={idx} align={align || 'center'}>{ceil.render(dataList[index])}</TableCell>
          )
        }
      })
      return (
        <TableRow key={index}>
          {ceils}
        </TableRow>
      )
    })
    setTableRows(rows)
  }

  useEffect(() => {
    if (dataList.length) {
      sliceDataList()
    } 
  }, [dataList])

  useEffect(() => {
    createRows()
  }, [willShowList])
  return (
    <>
      <TableContainer component={Paper}>
        <Table size='small'>
          <TableHead sx={{ background: "#F7FAFF" }}>
            <TableRow>
              {titleList.map((item, index) => (
                <TableCell align={align || 'center'} key={index} sx={{ fontSize: "14px", fontWeight: 'bold' }}>
                  {item.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {
              dataList.length ? tableRows : <TableRow key='1'><TableCell colSpan={titleList.length}><Empty /></TableCell></TableRow>
            }
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                colSpan={titleList.length}
                count={dataList.length}
                rowsPerPage={rowsPerPage}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  )
}

export default DataTable