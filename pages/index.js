import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>LJGram</title>
        <meta name="description" content="Social Media Styled website created by Lewis Jelfs" />
        <link rel="icon" href="/favicon.ico" />
        
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to LJGram
        </h1>
        <h2 className='text-center'>
          A Social Media styled website created by Lewis Jelfs
        </h2>
        <h3 className='text-center'>
          Please Register a user and enjoy all the features it has to offer
        </h3>
      </main>
    </div>
  )
}
