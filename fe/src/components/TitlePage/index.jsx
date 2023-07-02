import React from 'react';

import styles from './styles.module.scss';

const TitlePage = ({ title }) => {
  return (
    <div className={styles.TitlePage}>
      <h1>{title}</h1>
    </div>
  );
};

export default TitlePage;
