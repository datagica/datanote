// start a local datanote api server
import DatanoteApiServer from '@datagica/datanote-api-server'

export default async function getDatanoteApi (settings) {
  
  console.log('starting local datanote api server..')

  const apiServer = new DatanoteApiServer({
    debug: true,
  })

  const quit = async () => {
    await apiServer.stop()
    process.exit(0)
  }
  process.on('exit', quit)
  process.on('SIGINT', quit)

  await apiServer.start()
  
  console.log('local datanote api server is running')
}


