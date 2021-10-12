import { useSelector, useDispatch } from 'react-redux';
import styles from './style.module.scss';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import actions from '../../redux/actions';
import { useState } from 'react';

const Header = () => {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dispatch = useDispatch();
  const { adminInfo } = useSelector((state) => state.adminReducer);
  const logoutHandler = () => {
    setShowProfileMenu(false);
    dispatch(actions.adminLogout());
    router.push('/admin/account/admin-login');
  };
  const openMenu = () => {
    setShowProfileMenu(true);
  };
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <NextLink href="/">
          <div className={styles.logo}>
            <span>NextCart</span>
          </div>
        </NextLink>
        <div className={styles.searchBox}></div>
        <ul className={styles.navigation}>
          {adminInfo ? (
            <div className={styles.profileMenu}>
              <button onClick={openMenu}>{adminInfo.name}</button>
              {showProfileMenu && (
                <>
                  <div
                    className={styles.bgBlack}
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <article>
                    <ul className={styles.menu}>
                      <NextLink href="/admin/dashboard">
                        <li onClick={() => setShowProfileMenu(false)}>
                          Dashboard
                        </li>
                      </NextLink>

                      <NextLink href="/admin/orders">
                        <li onClick={() => setShowProfileMenu(false)}>
                          Orders
                        </li>
                      </NextLink>

                      <NextLink href="/admin/products">
                        <li onClick={() => setShowProfileMenu(false)}>
                          Products
                        </li>
                      </NextLink>

                      <NextLink href="/admin/users">
                        <li onClick={() => setShowProfileMenu(false)}>Users</li>
                      </NextLink>

                      <li onClick={logoutHandler}>Logout</li>
                    </ul>
                  </article>
                </>
              )}
            </div>
          ) : (
            <button onClick={() => router.push('/admin/account/admin-login')}>
              Login
            </button>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Header;
