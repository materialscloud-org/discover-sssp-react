import React from "react";

import { element_symbols } from "./ptable_symbols";

import "./PTable.css";

class Element extends React.Component {
  constructor(props) {
    super(props);

    this.link = `${this.props.link_base}/${this.props.symbol}`;

    this.disabled = false;
    if (this.props.elem_info == null) {
      this.disabled = true;
    }

    this.state = {};
  }

  render() {
    let e_class = `element element-${this.props.num}`;

    if (this.props.num >= 58 && this.props.num <= 71) {
      e_class += " lanthanide";
    }

    let cutoff_text = null;
    if (this.disabled) {
      // the css class will disable the link
      e_class += " element-disabled";
    } else {
      let wfc_cutoff = this.props.elem_info["cutoff"];
      let rho_cutoff = this.props.elem_info["rho_cutoff"];
      cutoff_text = (
        <div className="elem_num">
          {wfc_cutoff}
          <sub>({rho_cutoff})</sub>
        </div>
      );
    }

    return (
      <a
        className={e_class}
        style={{ background: this.props.color }}
        href={this.link}
      >
        <div className="elem_sym">{this.props.symbol}</div>
        {cutoff_text}
      </a>
    );
  }
}

class PTable extends React.Component {
  constructor(props) {
    super(props);
  }

  makeElements = (start, end) => {
    let items = [];
    for (let i = start; i <= end; i++) {
      let symbol = element_symbols[i];

      // if this returns undefined, the element will be disabled later on
      let elem_info = this.props.sssp_data[symbol];

      let color = "#dddddd"; // color of disabled elements
      if (elem_info) {
        let pp = elem_info["pseudopotential"];
        color = this.props.pseudo_metadata[pp]["background_color"];
      }

      items.push(
        <Element
          key={i}
          num={i}
          symbol={symbol}
          color={color}
          elem_info={elem_info}
          link_base={this.props.link_base}
        />
      );
    }
    return items;
  };

  render() {
    return (
      <div className="ptable_outer">
        <div className="ptable">
          {this.makeElements(1, 57)}
          {this.makeElements(72, 89)}
          {this.makeElements(104, 118)}
          {this.makeElements(58, 71)}
          {this.makeElements(90, 103)}
        </div>
      </div>
    );
  }
}

export default PTable;
