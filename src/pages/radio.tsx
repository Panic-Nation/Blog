import Layout from '@theme/Layout';
import RadioPlayer from '../components/RadioPlayer/RadioPlayer';
import BrowserOnly from '@docusaurus/BrowserOnly';


export default function RadioPage() {
  return (
    <Layout title="Radio" description="Listen to Fallout.FM from Panic Nation">
      <main style={{padding: '2rem 0'}}> 
        <div className="container">
          <header style={{textAlign: 'center', marginBottom: '1rem'}}>
            <h1 style={{margin: 0}}>Toxic FM</h1>
            <p style={{opacity: .85}}>Stream Fallout.FM .</p>
          </header>

          <BrowserOnly>
            {() => (
              <div style={{maxWidth: 720, margin: '0 auto'}}>
                <RadioPlayer />
              </div>
            )}
          </BrowserOnly>
        </div>
      </main>
    </Layout>
  );
}