import React from 'react';

const HomePage = () => {
  // Inline styles
  const styles = {
    container: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
      color: '#fff',
      backgroundColor: '#080708',
      maxWidth: '100vw',
      margin: '0 auto',
      padding: '0',
      boxSizing: 'border-box',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#333',
    },
    logo: {
      fontWeight: 'bold',
      fontSize: '1.5rem',
    },
    nav: {
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'row',
    },
    navItem: {
      padding: '0 1rem',
    },
    navLink: {
      textDecoration: 'none',
      color: '#fff',
    },
    hero: {
      textAlign: 'center',
      padding: '2rem',
      // Add gradient background similar to the design
      backgroundImage: 'linear-gradient(to right, #4b6cb7, #182848)',
    },
    mainContent: {
      display: 'flex',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
      gap: '20px',
      padding: '20px',
    },
    imageCard: {
      width: '300px',
      height: '200px',
      boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
      transition: '0.3s',
      borderRadius: '5px',
      // Placeholder for the background image
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    footer: {
      textAlign: 'center',
      padding: '1rem',
      backgroundColor: '#333',
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>T.Bot</div>
        <nav style={styles.nav}>
          <li style={styles.navItem}><a href="#home" style={styles.navLink}>Home</a></li>
          {/* ... other nav items ... */}
        </nav>
      </header>
      <main>
        <section style={styles.hero}>
          <h1>Best AI Content Platform</h1>
          <p>Your One-Stop Solution for Content Creation, Audio Design, Image Crafting...</p>
          <button>Generate</button>
        </section>
        <section style={styles.mainContent}>
          {/* Replace with actual image paths */}
          <div style={{ ...styles.imageCard, backgroundImage: 'url(/path-to-your-image1.jpg)' }}></div>
          <div style={{ ...styles.imageCard, backgroundImage: 'url(/path-to-your-image2.jpg)' }}></div>
          <div style={{ ...styles.imageCard, backgroundImage: 'url(/path-to-your-image3.jpg)' }}></div>
        </section>
      </main>
      <footer style={styles.footer}>
        {/* Footer content */}
      </footer>
    </div>
  );
};

export default HomePage;
