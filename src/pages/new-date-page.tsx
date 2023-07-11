import { FunctionComponent } from 'react'
import { useParams } from 'react-router-dom'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface NewDatePageProps {}

const NewDatePage: FunctionComponent<NewDatePageProps> = () => {
  const { date } = useParams()
  return <h1>New date {`(${date})`} page</h1>
}

export default NewDatePage
