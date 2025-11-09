import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="main-header clearfix">
      <h1 className="main-header-title">
        <strong>Gastro-Serra</strong>
        <label htmlFor="check">
          <p>
            <span className="icon-menu"></span>
          </p>
        </label>
      </h1>
      <input
        type="checkbox"
        id="check"
        checked={menuOpen}
        onChange={(e) => setMenuOpen(e.target.checked)}
      />

      <nav className="main-nav">
        <ul>
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              inicio
            </Link>
          </li>
          <li>
            <a href="#sobre" onClick={() => setMenuOpen(false)}>
              sobre
            </a>
          </li>
          <li>
            <a href="#contato" onClick={() => setMenuOpen(false)}>
              contato
            </a>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/admin" onClick={() => setMenuOpen(false)}>
                  admin
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(false);
                    handleSignOut();
                  }}
                >
                  sair
                </a>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                login
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
