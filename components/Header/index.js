import { useSelector, useDispatch } from 'react-redux';
import styles from './style.module.scss';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import actions from '../../redux/actions';
import { useEffect, useRef, useState } from 'react';

const Header = () => {
  const router = useRouter();
  const inputRef = useRef();
  const [search, setSearch] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cartReducer);
  const { user } = useSelector((state) => state.userReducer);
  const logoutHandler = () => {
    setShowProfileMenu(false);
    dispatch(actions.logoutUser());
    dispatch(actions.emptyCart());
    router.push('/');
  };
  const openMenu = () => {
    setShowProfileMenu(true);
  };
  const searchHandler = (e) => {
    setSearch(e.target.value);
    router.push(`/search?q=${e.target.value}`);
  };
  useEffect(() => {
    // console.log(router.query);
    if (router.pathname === '/' || router.pathname === '/search') {
      inputRef.current.focus();
      setSearch(router.query.q || '');
    }
  }, []);
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <article>
          <div className={styles.openMenuBtn}>
            <p onClick={() => setShowSideBar(!showSideBar)}>|||</p>
          </div>
          {showSideBar && (
            <div className={styles.sideMenu}>
              <section onClick={() => setShowSideBar(false)} />
              <aside>
                <div className={styles.main}>
                  <NextLink href="/">
                    <div className={styles.logo}>
                      <span>NextCart</span>
                    </div>
                  </NextLink>
                  <div
                    className={styles.menuItem}
                    onClick={() => router.push('/cart')}
                  >
                    cart
                    {cartItems.length > 0 && ` (${cartItems.length})`}
                  </div>
                  {user ? (
                    <div className={styles.menuItem} onClick={logoutHandler}>
                      logout
                    </div>
                  ) : (
                    <div
                      className={styles.menuItem}
                      onClick={() => router.push('/login')}
                    >
                      login
                    </div>
                  )}
                </div>
              </aside>
            </div>
          )}
        </article>
        <NextLink href="/">
          <div className={styles.logo}>
            <span>NextCart</span>
          </div>
        </NextLink>
        <div className={styles.flexGrow}>
          <form>
            {(router.pathname === '/' || router.pathname === '/search') && (
              <input
                className={styles.searchBox}
                value={search}
                ref={inputRef}
                onChange={(e) => searchHandler(e)}
                type="text"
                placeholder="Search For Products"
              />
            )}
          </form>
        </div>
        <ul className={styles.navigation}>
          <NextLink href="/cart">
            <li className={styles.cart}>
              Cart
              {cartItems.length > 0 && (
                <div className={styles.badge}>{cartItems.length}</div>
              )}
            </li>
          </NextLink>
          {user ? (
            <div className={styles.profileMenu}>
              <button onClick={openMenu}>{user.name}</button>
              {showProfileMenu && (
                <>
                  <div
                    className={styles.bgBlack}
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <article>
                    <ul className={styles.menu}>
                      <NextLink href="/profile">
                        <li onClick={() => setShowProfileMenu(false)}>
                          Profile
                        </li>
                      </NextLink>

                      <NextLink href="/order-history">
                        <li onClick={() => setShowProfileMenu(false)}>
                          Order History
                        </li>
                      </NextLink>

                      <li onClick={logoutHandler}>Logout</li>
                    </ul>
                  </article>
                </>
              )}
            </div>
          ) : (
            <button onClick={() => router.push('/login')}>Login</button>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Header;
