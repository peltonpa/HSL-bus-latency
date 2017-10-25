import React from "react";
import { Icon, Menu, MenuItem, MenuDivider } from "@blueprintjs/core";
import busData from "../../../loaders/bus_data.json";

export default class BuslineSettings extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: "14",
    };
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
            }}
            text={<span>{bus}{this.state.selected === bus ? <span>&nbsp;&nbsp;<Icon iconName="pt-icon-double-chevron-right" />&nbsp;<Icon iconName="pt-icon-drive-time" /> </span> : ""}</span>}
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
