import React from "react";
import { Icon, Menu, MenuItem, MenuDivider, Spinner } from "@blueprintjs/core";
import busData from "../../../loaders/bus_data.json";
import busIcon from "../theme/bus_stop_2_24x24.png";

export default class BuslineSettings extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: "14",
    };
  }

  renderLoading() {
    return(
      this.props.isLoading ? <span><span className="load-text" >Loading</span><span className="dots">...</span><Spinner className="pt-small spinner-middle" /></span> : ""
    );
  }

  renderText(bus) {
    const imgStyle = {
      display: "inline-block",
      height: "100%",
      verticalAlign: "middle",
    };
    return (
      this.state.selected === bus ? <span>&nbsp;&nbsp;<Icon iconName="pt-icon-double-chevron-right" />&nbsp;&nbsp;&nbsp;<img style={imgStyle} src={busIcon} alt=""/>&nbsp;{this.renderLoading()}</span> : ""
    );
  }

  renderMenuRows() {
    console.log(this.state);
    return Object.keys(busData).map((bus) => {
      return (
        <div>
          <MenuItem
            onClick={() => {
              this.setState({ selected: bus })
              this.props.onclick(bus)
              this.props.loading();
            }}
            text={<span>{bus}{this.renderText(bus)}</span>}
          />
          <MenuDivider />
        </div>
      );
    });
  }

  render() {
    return(
      <div>
        <Menu>
          {this.renderMenuRows()}
        </Menu>
      </div>
    );
  } 
}
