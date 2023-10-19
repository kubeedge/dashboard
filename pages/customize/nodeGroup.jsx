import { Button, Box, TextField, Grid, Typography } from '@mui/material'
import DataCard from "@/components/Pages/DataCard";
import { getList, removeItem } from "@/api/nodeGroup";
import { useEffect, useState } from "react";
import DataTable from "@/components/Pages/DataTable";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TransitionsModal from "@/components/global/TransitionModal"
import AddIcon from '@mui/icons-material/Add';
import AddModal from "@/components/Pages/AddModal"
import AlertModal from '@/components/global/AlertModal'
import QueryContainer from '@/components/Pages/QueryContainer';


const NodeGroup = (props) => {
	const [nodeGrouplist, setNodeGroupList] = useState([])
	const [open, setOpen] = useState(false)
	const [deleteName, setDeleteName] = useState('');
	const [addOpen, setAddOpen] = useState(false)
	const [formName, setFormName] = useState('')
	const [alertOpen, setAlertOpen] = useState(false)
	const [alertInfo, setAlertInfo] = useState({
		type: 'info',
		msg: '提示'
	})

	// 抽取列表数据
	const handleListData = (result) => {
		return result.items.map(item => ({
			name: item.metadata.name,
			creationTimestamp: item.metadata.creationTimestamp,
			uid: item.metadata.uid
		}))
	}

	useEffect(() => {
		setNodeGroupList(handleListData(props.data))
	}, [])

	// 新增和删除后重新请求列表
	const refetchDataList = async () => {
		const resp = await fetch(`/api/nodegroupList`)
		const res = await resp.json()
		setNodeGroupList(handleListData(res.data))
	}

	const handleDelete = (record) => {
		setDeleteName(record.name);
		setOpen(true); // 弹出确认删除框
	}

	// 表头信息
	const tableTitleList = [
		{
			title: '名称',
			key: 'name'
		},
		{
			title: '创建时间',
			key: 'creationTimestamp'
		},
		{
			title: '操作',
			key: 'operate',
			render: (record) => <Button variant="text" size="small" color="error" onClick={() => handleDelete(record)}>删除</Button>
		},
	]

	// 删除
	const handleRemoveOne = async () => {
		if (!deleteName) return
		const resp = await fetch(`/api/nodegroupRemove?name=${deleteName}`);
		const res = await resp.json()
		if (res && res.data.status == 'Success') {
			refetchDataList()
			setOpen(false);
			setAlertInfo({
				type: 'success',
				msg: '删除成功'
			})
			setAlertOpen(true)
		}
	}

	const modelOptions = {
		title: "删除",
		desc: "确定删除该项吗",
		icon: InfoOutlinedIcon,
		color: 'rgb(205,173,20)',
		onOk: handleRemoveOne
	}

	const cardActions = [<Button key='add' startIcon={<AddIcon />} type='primary' variant="contained" onClick={() => setAddOpen(true)}>新建</Button>]

	// 新增提交
	const handleOk = async () => {
		const params = {
			apiVersion: 'apps.kubeedge.io/v1alpha1',
			kind: 'NodeGroup',
			metadata: {
				name: formName
			}
		}
		const resp = await fetch(`/api/nodegroupAdd`, {
			method: 'post',
			body: JSON.stringify(params)
		})
		const res = await resp.json()
		if (res.data && res.data.status == 'Success') {
			handleCancel()
			refetchDataList()
			setAlertInfo({
				type: 'success',
				msg: '添加成功'
			})
		} else {
			setAlertInfo({
				type: 'error',
				msg: '添加失败，请重试'
			})
		}
		setAlertOpen(true)
	}

	const handleCancel = () => {
		setAddOpen(false)
		setFormName('')
	}

	return (
		<>
			{/* <QueryContainer>
				<Grid container spacing={2} justifyContent='flex-start' sx={{ px: '20px' }}>
					<Grid>
						<Box sx={{ display: 'flex', alignItems: 'center', pl: '10px' }}>
							<Typography component='h4' sx={{ fontSize: '16px' }}>名称：</Typography>
							<TextField placeholder='请输入名称' size='small' />
						</Box>
					</Grid>
				</Grid>
			</QueryContainer> */}
			<DataCard title={'nodeGroup'} action={cardActions}>
				<DataTable titleList={tableTitleList} dataList={nodeGrouplist} />
			</DataCard>
			<TransitionsModal open={open} option={modelOptions} handleClose={setOpen} />
			<AddModal open={addOpen} handleClose={setAddOpen} onCancel={handleCancel} handleOk={handleOk}>
				<Box>
					<Grid>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
							<Typography as='h5' sx={{
								fontWeight: "500",
								fontSize: "14px",
								width: '60px'
							}}>
								name：
							</Typography>
							<TextField
								placeholder="请输入Name"
								size='small'
								name="name"
								InputProps={{
									style: { borderRadius: 4 },
								}}
								sx={{ width: '90%' }}
								value={formName}
								onChange={(e) => setFormName(e.target.value)} />
						</Box>
					</Grid>
				</Box>
			</AddModal>
			<AlertModal open={alertOpen} type={alertInfo.type} msg={alertInfo.msg} onClose={() => setAlertOpen(false)} />
		</>
	)
}

export async function getServerSideProps() {
	const res = await getList()
	return { props: { data: res.data } }
}

export default NodeGroup