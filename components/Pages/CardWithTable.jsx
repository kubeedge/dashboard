import DataCard from "@/components/Pages/DataCard"
import DataTable from "@/components/Pages/DataTable"
import TransitionsModal from "@/components/global/TransitionModal"


const CardWithTable = ({ title, cardAction, titleList, dataList, modelOptions, modalOpen, modelClose}) => {
  return (
    <>
      <DataCard title={title} action={cardAction}>
        <DataTable titleList={titleList} dataList={dataList} />
      </DataCard>
      <TransitionsModal open={modalOpen} option={modelOptions} handleClose={modelClose} />
    </>
  )
}

export default CardWithTable