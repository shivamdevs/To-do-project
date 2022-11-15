import { useState } from "react";
import ReactTimeago from "react-timeago";
import sortBy from "sort-by";

function List(props) {
    const [adder, setAdder] = useState(false);
    const [filter, setFilter] = useState("-time");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [pushid, setPushid] = useState(null);
    const [items, setItems] = useState(function() {
        if (window.localStorage) {
            if (window.localStorage.getItem('--to--do') !== null) {
                return JSON.parse(window.localStorage.getItem('--to--do'));
            }
            window.localStorage.setItem('--to--do', JSON.stringify([]));
        }
        return [];
    });
    const filterData = (data) => {
        if (data !== null) {
            if (filter === data) {
                setFilter('-' + data);
            } else {
                setFilter(data);
            }
        }
        setItems(old => {
            return [...old].sort(sortBy(filter));
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (name === "") return e.target[0].focus();

        if (pushid !== null) {
            setItems(oldList => {
                const newList = [...oldList];
                newList[pushid] = {
                    name: name,
                    description: description,
                    time: newList[pushid].time,
                    update: Date.now(),
                };
                if (window.localStorage) {
                    window.localStorage.setItem('--to--do', JSON.stringify(newList));
                }
                return newList;
            });
        } else {
            setItems(oldList => {
                const newList = [
                    {
                        name: name,
                        description: description,
                        time: Date.now(),
                        update: Date.now(),
                    },
                    ...oldList,
                ];
                if (window.localStorage) {
                    window.localStorage.setItem('--to--do', JSON.stringify(newList));
                }
                return newList;
            });
        }
        filterData(null);
        setAdder(false);
        e.target.reset();
        setName("");
        setDescription("");
        setPushid(null);
    };
    const deleteIndex = (index) => {
        if (index > -1) {
            setItems(oldList => {
                const newList = [...oldList];
                newList.splice(index, 1);
                if (window.localStorage) {
                    window.localStorage.setItem('--to--do', JSON.stringify(newList));
                }
                return newList;
            });
        }
    };
    return (
        <>
            <div className="head">
                <div className="current">All tasks (<span>{items.length}</span>)</div>
                <div className="head-action">
                    <button className={`button filter ${(filter === "name") && "down"} ${(filter === "-name") && "up"}`} onClick={() => filterData("name")}>
                        <i className="far fa-filter-list fill"></i>
                        <i className="far fa-arrow-down-z-a down"></i>
                        <i className="far fa-arrow-down-a-z up"></i>
                        <span>Name</span>
                    </button>
                    <button className={`button filter ${(filter === "time") && "down"} ${(filter === "-time") && "up"}`} onClick={() => filterData("time")}>
                        <i className="far fa-clock fill"></i>
                        <i className="far fa-arrow-down-short-wide down"></i>
                        <i className="far fa-arrow-down-wide-short up"></i>
                        <span>Created</span>
                    </button>
                </div>
                <button className="button" onClick={() => setAdder(true)}><i className="fas fa-plus"></i><span>Add Task</span></button>
            </div>
            <div className="cards">
                {items.map((item, id) => <Card item={item} key={id} id={id} setName={setName} deleteIndex={deleteIndex} setDescription={setDescription} setPushid={setPushid} setAdder={setAdder} />)}
            </div>
            {adder && <div className="adder">
                <form action="" method="post" onSubmit={handleSubmit} className="additem">
                    <div className="group">
                        {pushid === null && <h2>Add New Task</h2>}
                        {pushid !== null && <h2>Edit Task</h2>}
                    </div>
                    <div className="group">
                        <label htmlFor="title">Task <span>*</span></label>
                        <input type="text" defaultValue={name} onChange={(e) => setName(e.target.value.trim(""))} id="title" autoFocus className="input" required />
                    </div>
                    <div className="group">
                        <label htmlFor="description">Task Description</label>
                        <textarea name="" defaultValue={description} onChange={(e) => setDescription(e.target.value.trim(""))} id="description" className="input"></textarea>
                    </div>
                    <div className="group row">
                        <button className="button" type="submit">{pushid === null ? 'Add Task' : 'Update Task'}</button>
                        <button className="button cancel" type="reset" onClick={() => {setAdder(false); setPushid(null); setName(""); setDescription("");}}>Cancel</button>
                    </div>
                </form>
            </div>}
        </>
    );
}
export default List;

function Card(props) {
    return (
        <div className="card" key={props.id} id={`card-${props.id}`}>
            <div className="card-title">{props.item.name}</div>
            <div className="card-description">{props.item.description}</div>
            <div className="card-footer">
                <div className="card-time">
                    <div className="card-time-ago">Updated: <ReactTimeago date={props.item.update || props.item.time}/></div>
                    <div className="card-time-now">Created: {new Date(props.item.time).toString().slice(4, 24)}</div>
                </div>
                <div className="card-options">
                    <button className="action" onClick={() => {props.setName(props.item.name); props.setDescription(props.item.description); props.setPushid(props.id); props.setAdder(true)}}><i className="far fa-pencil"></i></button>
                    <button className="action cancel" onClick={() => props.deleteIndex(props.id)}><i className="far fa-trash"></i></button>
                </div>
            </div>
        </div>
    );
}