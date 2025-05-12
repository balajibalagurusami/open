
import React from 'react';

const ViewerContainer: React.FC = () => {
  return (
    <div className="viewer-wrapper">
      <iframe 
        src="https://thatopen.github.io/engine_fragment/examples/FragmentsModels/" 
        className="viewer-iframe" 
        title="3D Model Viewer"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

export default ViewerContainer;
