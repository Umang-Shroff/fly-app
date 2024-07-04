import React from 'react'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './DetectedPopstyle.css'
import CloseIcon from '@mui/icons-material/Close';

const DetectedPopup = (props) => {
  return (
    <div>
      <Popup
          trigger={<button className="button"> {props.qrs} </button>}
          modal
          nested
        >
          {close => (
            <div className="modal">
              <button className="close" onClick={close}>
                <CloseIcon/>
              </button>
              <div className="content">
                DetectedQrs: {props.qrs}
              </div>
              <div className="actions">

              </div>
            </div>
          )}
      </Popup>

    </div>
  )
}

export default DetectedPopup;
