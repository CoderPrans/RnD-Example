import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";

const style = {
  display: "flex",
  flexDirection: 'column',
  alignItems: "center",
  justifyContent: "space-between",
  border: "solid 1px #ddd",
  fontFamily: 'sans-serif',
};

// layout
// {name: "Layout 1", metadata: [{pos: {x, y, width, height}, color: }, {pos: {x, y, width, height}, color: },... ]}

let mockLayout = {
    name: "Layout 1",
    data: [
        {meta: {x: 10, y: 10, width: 100, height: 100}, id: 22},
        {meta: {x: 300, y: 10, width: 100, height: 100}, id: 12},
        {meta: {x: 600, y: 300, width: 100, height: 100}, id: 9},
    ],
};

function App(props) {
    return (
        <div>
          <LayoutHandler />
        </div>
    );
}

function LayoutHandler(props) {
    const exampleRect = {x: 10, y: 10, width: 100, height: 100};
    const [posns, setPosns] = useState(mockLayout.data);
    const [name, setName] = useState("New Layout");
    const [selected, setSelected] = useState('');
    const [layoutOptions, setLayoutOptions] = useState();

    useEffect(() => {
        let savedLayouts = localStorage.getItem('layouts');
        savedLayouts = JSON.parse(savedLayouts) || [];

        if(savedLayouts && savedLayouts.length) {
            setLayoutOptions(savedLayouts);
            setPosns(savedLayouts[0].data);
            setSelected(savedLayouts[0].name);
        }
        else {
            localStorage.setItem('layouts', JSON.stringify([mockLayout]));
            setLayoutOptions([mockLayout]);
            setPosns(mockLayout.data);
            setSelected(mockLayout.name);
        }

    }, []);

    useEffect(() => {
        // let getSelectedLayout = JSON.parse(localStorage.getItem('layouts'));
        // console.log(getSelectedLayout);
        // let pick = getSelectedLayout.length && getSelectedLayout.filter(l => l.name === selected)[0];
        // console.log(pick && pick.data);
        // setPosns(pick && pick.data);
        console.log(layoutOptions);
        let pick = layoutOptions?.length && layoutOptions.filter(l => l.name === selected)[0];

        setPosns(pick && pick.data);
    }, [selected]);

    useEffect(() => {
        layoutOptions?.length && localStorage.setItem('layouts', JSON.stringify(layoutOptions));
    }, [layoutOptions]);


    function getRandomRect() {
        return {meta: {
            x: parseInt(Math.random() * 1100),
            y: parseInt(Math.random() * 400),
            width: 100,
            height: 100
        }, id: parseInt(Math.random() * 1100) + posns.length};
    }

    // function fetchLayouts() {
    //     let getSelectedLayout = JSON.parse(localStorage.getItem('layouts')) || [];
    //     setLayoutOptions(getSelectedLayout);
    //     return getSelectedLayout;
    // }

    function handleLayoutDelete(name) {
        // let getSelectedLayout = JSON.parse(localStorage.getItem('layouts'));
        // let updatedLayouts = getSelectedLayout.filter(l => l.name !== name);
        // localStorage.setItem('layouts', JSON.stringify(updatedLayouts));
        let updatedLayouts = layoutOptions.filter(l => l.name !== name);
        setLayoutOptions(updatedLayouts);
    }
    
    function handleSave() {
        setLayoutOptions([...layoutOptions, {name: name, data: posns}]);

        // let savedLayouts = JSON.parse(localStorage.getItem('layouts'));
        // localStorage.setItem('layouts', JSON.stringify([...savedLayouts, {name: name, data: posns}]));
    }
    
    function handleSet(set, i) {
        let newPosns = [...posns.slice(0, i), {...posns[i], meta: set}, ...posns.slice(i+1)];
        setPosns([...newPosns]);
    }

    function handleDelete(i) {
        let newPosns = [...posns.slice(0, i), ...posns.slice(i+1)];
        setPosns([...newPosns]);
    }

    return (
        <div>
          <h1>{posns && posns.name}</h1>
          <input type="text" placeholder="layout name" value={name} onChange={(e) => setName(e.target.value)} />
          <button onClick={handleSave}>Save Layout</button>
          <div>
            {layoutOptions && layoutOptions
             .map(l =>
                 <div>
                   <p style={{cursor: 'pointer'}} key={l.name} onClick={() => setSelected(l.name)} value={l.name}>{l.name}</p>
                   <button onClick={() => handleLayoutDelete(l.name)}>Del</button>
                 </div>
             )}
          </div>
          {/* <select value={selected} > */}
          {/*   {JSON.parse(localStorage.getItem('layouts'))?.length */}
          {/*    && JSON.parse(localStorage.getItem('layouts')) */}
          {/*    .map(l => */}
          {/*        <option key={l.name} value={l.name}>{l.name}</option> */}
          {/*    )} */}
          {/* </select> */}
          <button onClick={() => setPosns([...posns, getRandomRect()])}>Add New Rectangle</button>
          <button onClick={() => setPosns([])}>Clear Area</button>
          <div style={{width: '1200px', height: '500px', background: 'lightblue', margin: '20px auto'}}>
            {posns && posns.map((c, i) =>
                <Card
                  key={c.id}
                  state={c.meta}
                  setState={(set) => handleSet(set, i)}
                  index={c.id}
                  handleDelete={() => handleDelete(i)}
                />
            )}
          </div>
        </div>
    );
}


function Card({state, setState, ...props}) {
    const colors = ['red', 'lightgreen', 'orange', 'yellow'];
    
    const [color, setColor] = useState(colors[props.index % colors.length]);

    return (
        <Rnd
          style={{...style, background: color}}
          size={{ width: state.width, height: state.height }}
          position={{ x: state.x, y: state.y }}
          onDragStop={(e, d) => {
              setState({x: d.x, y: d.y});
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
              setState({
                  width: ref.style.width,
                  height: ref.style.height,
                  ...position
              });
          }}
          bounds="parent"
          minWidth="85px"
          minHeight="64px"
        >
          <select value={color} onChange={(e) => setColor(e.target.value)}>
            {colors.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          #{props.index}
          <button onClick={props.handleDelete}>Del</button>
        </Rnd>
    );
};

export default App;
