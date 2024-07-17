import React from 'react';

export type LabelProps = {
  label: string;
};

export const Label = ({ label }: LabelProps) => {
  return (
    <label id="selectExEnv" className="udapp_settingsLabel">
      {label.toUpperCase()}
      {/* <a href="https://chainlist.org/" target="_blank">
        <i className="ml-2 fas fa-plug" aria-hidden="true"></i>
      </a>
      <a href="https://remix-ide.readthedocs.io/en/latest/run.html#environment" target="_blank" rel="noreferrer">
        <i className="udapp_infoDeployAction ml-2 fas fa-info-circle"></i>
      </a> */}
    </label>
  );
};
