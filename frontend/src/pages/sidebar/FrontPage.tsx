import React from 'react';
import BackgroundMusic from '../../assets/BackgroundMusic';
// Updated styles with longer transitions and a subtler footer
const styles = {
  page: {
    position: 'relative',
    fontFamily: '"Arial", sans-serif',
    color: 'white',
    padding: '20px',
    transition: 'all 0.8s ease-in-out', // Increased duration
  },
  header: {
    backgroundColor: 'transparent', // Corrected from '#transparent'
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.8s ease-in-out',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    margin: '0 10px',
    transition: 'color 1s ease-in-out', // Increased duration
  },
  welcomeSection: {
    margin: '20px 0',
    padding: '20px',
    borderRadius: '5px',
    transition: 'transform 1s ease-in-out', // Increased duration
  },
  attractionsSection: {
    margin: '20px 0',
    padding: '20px',
    borderRadius: '5px',
    animation: 'slideIn 1s ease-out, fadeIn 2s ease-out', // Increased fadeIn duration
    transition: 'transform 1s ease-in-out', // Increased duration
  },
  footer: {
    marginTop: '20px',
    padding: '5px 10px', // Reduced padding for smaller size
    borderRadius: '5px',
    transition: 'all 0.8s ease-in-out', // Increased duration
    fontSize: '0.75rem', // Smaller font size
    opacity: '1', // Reduced opacity for less noticeability
  },
  title: {
    margin: '0',
    transition: 'color 0.8s ease-in-out', // Increased duration
  },
  sectionTitle: {
    color: '#4682B4', // Steel blue
    transition: 'color 1s ease-in-out', // Increased duration
  },
  list: {
    listStyleType: 'none',
    paddingLeft: '0',
  },
  listItem: {
    marginBottom: '10px',
    transition: 'transform 1s ease-in-out', // Increased duration
  },
};

const GlobalStyles = () => (
    <style>
      {`
        @keyframes clownColorAnimation {
          0% { color: red; }
          25% { color: yellow; }
          50% { color: green; }
          75% { color: orange; }
          100% { color: red; }
        }
  
        @keyframes pulsate {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
  
        .clown-colors {
          animation: clownColorAnimation 6s infinite, pulsate 2s infinite;
        }
  
        .attractions-enter {
          opacity: 0;
          transform: scale(0.9);
        }
        .attractions-enter-active {
          opacity: 1;
          transform: scale(1);
          transition: opacity 800ms, transform 800ms;
        }
      `}
    </style>
);
  

const FrontPage: React.FC = () => {
  return (
    <div style={styles.page}>
      <GlobalStyles />
      <BackgroundMusic />
      <Header />
      <WelcomeSection />
      <AttractionsSection />
      <Footer />
    </div>
  );
};

const Header: React.FC = () => {
  return (
    <header style={styles.header}>
      <h1 className="clown-colors">Clown Theme Park</h1>
    </header>
  );
};

const WelcomeSection: React.FC = () => {
  return (
    <section id="welcome" style={styles.welcomeSection}>
      <h2 className="clown-colors">Welcome to The Clown Theme Park!</h2>
      <p>Discover the magic, the excitement, and the wonder with us.</p>
    </section>
  );
};

const AttractionsSection: React.FC = () => {
  return (
    <section id="attractions" style={styles.attractionsSection}>
      <h2 className='clown-colors'>Our Top Attractions</h2>
      <ul style={styles.list}>
        <li style={styles.listItem}>The Great Adventure Roller Coaster</li>
        <li style={styles.listItem}>Magic Castle of Dreams</li>
        <li style={styles.listItem}>Enchanted Forest Boat Ride</li>
        <li style={styles.listItem}>Wonder Wheel Ferris Wheel</li>
      </ul>
    </section>
  );
};

const Footer: React.FC = () => {
  return (
    <footer style={styles.footer}>
      <p>© 2024 The Clown Theme Park. All rights reserved.</p>
    </footer>
  );
};

export default FrontPage;
