import React from 'react';

const Rank = ({ name, entries }) => {
  return (
    <div>
      <div className='white f3'>
        {`Exo, your current entry count is...`}
      </div>
      <div className='white f1'>
        #28
      </div>
    </div>
  );
}

export default Rank;