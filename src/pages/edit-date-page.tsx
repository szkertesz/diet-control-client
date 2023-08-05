import { FunctionComponent } from 'react'
import { useParams } from 'react-router-dom'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EditDatePageProps {}

const EditDatePage: FunctionComponent<EditDatePageProps> = () => {
  const { date } = useParams()
  return <h1>Edit date {`(${date})`} page</h1>
}

export default EditDatePage
