function Layout({ children }) {
  return (
    <div>
      <main>
        <a href="./">
          <h2 className="text-3xl text-center my-6">My Pokedox App</h2>
        </a>
        {children}
      </main>
      <footer className="text-center my-2">
        <a href="https://github.com/mohammedazam55">By @Mohammed Azam ❤️</a>
      </footer>
    </div>
  );
}

export default Layout;
