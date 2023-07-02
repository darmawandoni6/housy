import React from 'react';

import Mainlayout from '@components/Mainlayout';
import TitlePage from '@components/TitlePage';
import ListProperty from '@views/Owner/ListProperty';

const index = () => {
  return (
    <>
      <TitlePage title="List Property" />
      <ListProperty />
    </>
  );
};

index.getLayout = (page) => {
  return <Mainlayout>{page}</Mainlayout>;
};

export default index;
