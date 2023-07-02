import React from 'react';

import Mainlayout from '@components/Mainlayout';
import Login from '@views/Owner/Login';

const index = () => {
  return <Login />;
};

index.getLayout = (page) => {
  return <Mainlayout>{page}</Mainlayout>;
};

export default index;
