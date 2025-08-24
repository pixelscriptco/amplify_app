import React from "react";
import error_found from "../../Data/images/haha.png";
import error_404 from "../../Data/images/404-error.png";
function Err({ msg,type="found" }) {
  return (
    <div className="no_data_wrap">
      <div className="no_data_block">
        <img 
          alt="no data" 
          src={(type == 'found') ? error_found : error_404}
        />
      </div>
      <span className="text_amentyies">
        {msg}
      </span>
    </div>
  );
}

export default Err;
