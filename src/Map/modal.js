import Modal from 'react-modal';
import React, { useState } from 'react';

const customStyles = {
  content: {
    top: '35%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    height: '30%',
    width: '20%',
    transform: 'translate(-40%, -10%)',
  },
};

export function PopUp({isModalOpen,setModalOpen}) {
    
    return (
      <>
        <button onClick={()=> setModalOpen(true)}>Modal Open</button>
        <Modal  isOpen={isModalOpen} onRequestClose={() => setModalOpen(false)}
            style={customStyles}>
            <div>여기에 정보 입력합니다</div>
            <div>
              <button>출발</button>
              <button>도착</button>
            </div>
        </Modal>
      </>
    )
}


  