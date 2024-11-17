
import NavBar from '../../components/NavBar'
import Documents from '../../components/Documents';


const Home = () => {
 
  return (
    <section>
      <NavBar search={true} share={false} />

      <Documents />
    </section>
  )
}

export default Home