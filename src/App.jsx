import './App.css';

import { useState } from "react";
import ReactTimeago from "react-timeago";
import sortBy from "sort-by";
import ContentEditable from 'react-contenteditable';

function App() {
    const [adder, setAdder] = useState(false);
    const [deleter, setDeleter] = useState(false);
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
            setFilter(old => {
                return (data === old) ? '-' + data : data;
            });
        }
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
    const deleteIndex = () => {
        const index = pushid;
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
        setPushid(null);
        setDeleter(false);
    };
    const handleDelete = (item, id) => {
        setPushid(id);
        setDeleter(item);
    };
    const hider = (e) => {
        if (e.target.classList.contains('adder')) {
            setDeleter(false);
            setPushid(null);
            setAdder(false);
            setName("");
            setDescription("");
        }
    };
    return (
        <div className="app">
            <header className="header">
                <div className="headbox">
                    <div className="header-logo">
                        <img src="/logo192.png" className="header-logo-img" alt="" />
                        <h1>To do List</h1>
                    </div>
                    <button className="button" onClick={() => setAdder(true)}><i className="fas fa-fw fa-plus"></i><span>Add Task</span></button>
                </div>
                <div className="head">
                    <div className="current">All tasks (<span>{items.length}</span>)</div>
                    <div className="head-action">
                        <button className={`button filter ${(filter === "name") && "down"} ${(filter === "-name") && "up"}`} onClick={() => filterData("name")}>
                            <i className="far fa-fw fa-filter-list fill"></i>
                            <i className="far fa-fw fa-arrow-down-z-a up"></i>
                            <i className="far fa-fw fa-arrow-down-a-z down"></i>
                            <span>Name</span>
                        </button>
                        <button className={`button filter ${(filter === "time") && "down"} ${(filter === "-time") && "up"}`} onClick={() => filterData("time")}>
                            <i className="far fa-fw fa-clock fill"></i>
                            <i className="far fa-fw fa-arrow-down-short-wide up"></i>
                            <i className="far fa-fw fa-arrow-down-wide-short down"></i>
                            <span>Created</span>
                        </button>
                    </div>
                </div>
            </header>
            <main className="main">
                <div className="cards">
                    {[...items].sort(sortBy(filter)).map((item, id) => {
                        return (
                            <Card
                                item={item}
                                key={id}
                                id={id}
                                setName={setName}
                                delete={handleDelete}
                                setDescription={setDescription}
                                setPushid={setPushid}
                                setAdder={setAdder}
                            />
                        );
                    })}
                </div>
                {adder && <div className="adder" onClick={hider}>
                    <form action="" method="post" onSubmit={handleSubmit} className="additem">
                        <div className="group">
                            {pushid === null && <h2>Add New Task</h2>}
                            {pushid !== null && <h2>Edit Task</h2>}
                        </div>
                        <div className="group">
                            <label htmlFor="title">Task <span>*</span></label>
                            <input
                                type="text"
                                defaultValue={name}
                                onChange={(e) => setName(e.target.value.trim(""))}
                                id="title"
                                autoFocus
                                className="input"
                                required
                            />
                        </div>
                        <div className="group">
                            <label htmlFor="description">Task Description</label>
                            <ContentEditable
                                contentEditable={true}
                                html={description || ""}
                                onChange={(e) => setDescription(e.target.value)}
                                id="description"
                                className="input"
                            />
                        </div>
                        <div className="group row">
                            <button className="button" type="submit">{pushid === null ? 'Add Task' : 'Update Task'}</button>
                            <button className="button cancel" type="reset" onClick={() => {setAdder(false); setPushid(null); setName(""); setDescription("");}}>Cancel</button>
                        </div>
                    </form>
                </div>}
                {deleter && <div className="adder" onClick={hider}>
                    <div className="additem">
                        <div className="group">
                            <h2>Delete task: {pushid + 1}</h2>
                            <h3>{deleter.name}</h3>
                            <div>Once deleted this task can't be undone.</div>
                        </div>
                        <div className="group row">
                            <button className="button cancel" type="button" onClick={deleteIndex}>Delete Task</button>
                            <button className="button" type="reset" onClick={() => {setDeleter(false); setPushid(null);}}>Cancel</button>
                        </div>
                    </div>
                </div>}
            </main>
            <footer className="footer">
                <a href="//github.com/shivamdevs" target="_blank" rel="noreferrer">© Shivam Devs 2022</a>
                <div className="version">Version: 1.1.2</div>
            </footer>
        </div>
    );
}

export default App;

function Card(props) {
    return (
        <div className="card" key={props.id} id={`card-${props.id}`}>
            <div className="card-title">{props.item.name}</div>
            <div className="card-description" dangerouslySetInnerHTML={{__html: props.item.description}}></div>
            <div className="card-footer">
                <div className="card-time">
                    <div className="card-time-ago">Updated: <ReactTimeago date={props.item.update || props.item.time}/></div>
                    <div className="card-time-now">Created: <ReactTimeago date={props.item.time /*new Date(props.item.time).toString().slice(4, 24)*/} /></div>
                </div>
                <div className="card-options">
                    <button className="action" onClick={() => {props.setName(props.item.name); props.setDescription(props.item.description); props.setPushid(props.id); props.setAdder(true)}}><i className="far fa-fw fa-pencil"></i></button>
                    <button className="action cancel" onClick={() => props.delete(props.item, props.id)}><i className="far fa-fw fa-trash"></i></button>
                </div>
            </div>
        </div>
    );
}
